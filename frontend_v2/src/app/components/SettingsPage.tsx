import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, ElementType } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "../hooks/useAuth";
import {
  Bell,
  Briefcase,
  Camera,
  CheckCircle2,
  ImagePlus,
  LockKeyhole,
  Mail,
  RotateCcw,
  Save,
  ShieldCheck,
  User,
  Wrench,
} from "lucide-react";

type ProfileData = {
  name: string;
  email: string;
  role: string;
  area: string;
  avatar: string;
};

const gestorDefaultProfile: ProfileData = {
  name: "Renata Rocha",
  email: "gestor@fixer.com",
  role: "Gestor",
  area: "Indústria / Gestor",
  avatar: "/profile.jpeg",
};

const tecnicoDefaultProfile: ProfileData = {
  name: "Técnico FIXER",
  email: "tecnico@fixer.com",
  role: "Técnico",
  area: "Equipe Técnica",
  avatar: "",
};

function normalizeText(value?: string | null) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getAuthField(authProfile: unknown, field: string) {
  const data = authProfile as Record<string, unknown> | null | undefined;
  const value = data?.[field];

  return typeof value === "string" ? value : "";
}

function getAuthEmail(authProfile: unknown) {
  const directEmail = getAuthField(authProfile, "email");

  if (directEmail) return directEmail;

  const data = authProfile as Record<string, unknown> | null | undefined;
  const user = data?.user as Record<string, unknown> | undefined;
  const userEmail = user?.email;

  return typeof userEmail === "string" ? userEmail : "";
}

function getAuthRole(authProfile: unknown) {
  const role = getAuthField(authProfile, "role");

  if (role) return role;

  const data = authProfile as Record<string, unknown> | null | undefined;
  const userMetadata = data?.user_metadata as Record<string, unknown> | undefined;
  const metadataRole = userMetadata?.role;

  return typeof metadataRole === "string" ? metadataRole : "";
}

function isTecnicoProfile(email?: string | null, role?: string | null) {
  const normalizedEmail = normalizeText(email);
  const normalizedRole = normalizeText(role);

  return (
    normalizedRole.includes("tecnico") ||
    normalizedEmail.includes("tecnico")
  );
}

function getDefaultProfile(email?: string | null, role?: string | null) {
  if (isTecnicoProfile(email, role)) {
    return {
      ...tecnicoDefaultProfile,
      email: email || tecnicoDefaultProfile.email,
    };
  }

  return {
    ...gestorDefaultProfile,
    email: email || gestorDefaultProfile.email,
  };
}

function getProfileStorageKey(email?: string | null, role?: string | null) {
  const fallback = isTecnicoProfile(email, role) ? "tecnico" : "gestor";

  const identifier = normalizeText(email || role || fallback)
    .replace(/[^a-z0-9@._-]/g, "")
    .replaceAll("@", "_")
    .replaceAll(".", "_");

  return `fixer_profile_${identifier || fallback}`;
}

function readProfile(email?: string | null, role?: string | null): ProfileData {
  const defaultProfile = getDefaultProfile(email, role);
  const key = getProfileStorageKey(email, role);

  try {
    const stored = localStorage.getItem(key);

    if (stored) {
      const parsed = JSON.parse(stored);

      return {
        ...defaultProfile,
        ...parsed,
        email: parsed.email || email || defaultProfile.email,
      };
    }

    /*
      Migração suave:
      se for gestor e já existir o perfil antigo salvo em "fixer_profile",
      usa ele apenas para o gestor. Para técnico, não usa a chave antiga,
      porque era ela que misturava os perfis.
    */
    if (!isTecnicoProfile(email, role)) {
      const legacyStored = localStorage.getItem("fixer_profile");

      if (legacyStored) {
        const parsed = JSON.parse(legacyStored);

        const migratedProfile = {
          ...defaultProfile,
          ...parsed,
          email: parsed.email || email || defaultProfile.email,
        };

        localStorage.setItem(key, JSON.stringify(migratedProfile));

        return migratedProfile;
      }
    }

    return defaultProfile;
  } catch {
    return defaultProfile;
  }
}

function AvatarBox({
  profile,
  initials,
}: {
  profile: ProfileData;
  initials: string;
}) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [profile.avatar]);

  return (
    <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[2rem] border-4 border-white bg-slate-100 shadow-xl ring-4 ring-cyan-500/20">
      {profile.avatar && !imageError ? (
        <img
          src={profile.avatar}
          alt={profile.name || "Usuário Fixer"}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-3xl font-black text-cyan-500">{initials}</span>
      )}
    </div>
  );
}

function SideCard({
  icon: Icon,
  title,
  subtitle,
  description,
  buttonLabel,
  tone,
}: {
  icon: ElementType;
  title: string;
  subtitle: string;
  description: string;
  buttonLabel?: string;
  tone: "cyan" | "emerald" | "amber" | "blue";
}) {
  const tones = {
    cyan: "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
    emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    blue: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  };

  return (
    <Card className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/10 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
      <div className="mb-4 flex items-start gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${tones[tone]}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h3 className="font-black text-white [.light_&]:text-slate-900">
            {title}
          </h3>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-slate-500">
        {description}
      </p>

      {buttonLabel && (
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-2xl border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:text-slate-700 [.light_&]:hover:bg-slate-100"
        >
          {buttonLabel}
        </Button>
      )}
    </Card>
  );
}

export function SettingsPage() {
  const { profile: authProfile } = useAuth();

  const authEmail = getAuthEmail(authProfile);
  const authRole = getAuthRole(authProfile);

  const profileKey = useMemo(() => {
    return getProfileStorageKey(authEmail, authRole);
  }, [authEmail, authRole]);

  const defaultProfile = useMemo(() => {
    return getDefaultProfile(authEmail, authRole);
  }, [authEmail, authRole]);

  const [profile, setProfile] = useState<ProfileData>(() =>
    readProfile(authEmail, authRole)
  );

  const [saved, setSaved] = useState(false);

  const initials = useMemo(() => {
    const parts = profile.name.trim().split(" ").filter(Boolean);

    if (parts.length === 0) return "FX";

    const first = parts[0]?.[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] || "" : "";

    return `${first}${last}`.toUpperCase();
  }, [profile.name]);

  useEffect(() => {
    setProfile(readProfile(authEmail, authRole));
    setSaved(false);
  }, [authEmail, authRole]);

  const updateField = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));

    setSaved(false);
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateField("avatar", reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    updateField("avatar", "");
  };

  const handleReset = () => {
    setProfile(defaultProfile);
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(profileKey, JSON.stringify(profile));

    /*
      Evita que telas antigas ainda lendo "fixer_profile" confundam técnico e gestor.
      Depois que Root e SettingsPage usam chave por usuário, esta chave antiga não é mais necessária.
    */
    localStorage.removeItem("fixer_profile");

    window.dispatchEvent(new Event("fixer-profile-updated"));

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-400">
            Preferências
          </p>

          <h1 className="text-3xl font-extrabold text-white [.light_&]:text-slate-900">
            Configurações
          </h1>

          <p className="mt-2 max-w-3xl text-sm text-slate-500">
            Gerencie dados do perfil, foto, identificação do usuário,
            preferências e segurança do sistema.
          </p>
        </div>

        <Button
          onClick={handleSave}
          className="rounded-2xl bg-[#082f4d] px-6 py-6 text-white shadow-lg shadow-cyan-950/20 hover:bg-[#0b6680]"
        >
          <Save className="mr-2 h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      {saved && (
        <div className="flex items-center gap-3 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm font-bold text-emerald-400">
          <CheckCircle2 className="h-5 w-5" />
          Dados atualizados com sucesso para este usuário.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <Card className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-lg shadow-black/10 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
          <div className="h-24 bg-gradient-to-r from-[#082f4d] via-[#0b6680] to-[#12b7c4]" />

          <div className="-mt-12 p-6">
            <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-5 md:flex-row md:items-end">
                <div className="relative">
                  <AvatarBox profile={profile} initials={initials} />

                  <label className="absolute -bottom-2 -right-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl bg-cyan-500 text-white shadow-lg transition-all hover:bg-cyan-600">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="min-w-0 pb-2">
                  <h2 className="truncate text-2xl font-black text-white [.light_&]:text-slate-900">
                    {profile.name || "Usuário Fixer"}
                  </h2>

                  <p className="mt-1 truncate text-sm text-slate-500">
                    {profile.email || "E-mail não informado"}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-black text-cyan-400">
                      {profile.role || "Perfil"}
                    </span>

                    <span className="inline-flex rounded-full border border-slate-700 bg-slate-950/50 px-3 py-1 text-xs font-bold text-slate-300 [.light_&]:border-slate-200 [.light_&]:bg-slate-50 [.light_&]:text-slate-600">
                      {profile.area || "Área não informada"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-cyan-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-cyan-500">
                  <ImagePlus className="h-4 w-4" />
                  Trocar foto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemoveAvatar}
                  className="rounded-2xl border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:text-slate-700 [.light_&]:hover:bg-slate-100"
                >
                  Remover
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-5 [.light_&]:border-slate-200 [.light_&]:bg-slate-50">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                  <User className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-black text-white [.light_&]:text-slate-900">
                    Perfil do Usuário
                  </h3>
                  <p className="text-sm text-slate-500">
                    Informações exibidas na sidebar, topbar e área do usuário.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-300 [.light_&]:text-slate-700">
                    Nome exibido
                  </Label>

                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <Input
                      value={profile.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="Ex.: Renata Rocha"
                      className="h-12 rounded-2xl border-slate-700 bg-slate-950 pl-11 text-white placeholder:text-slate-600 focus:border-cyan-500 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-300 [.light_&]:text-slate-700">
                    E-mail
                  </Label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <Input
                      value={profile.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="gestor@fixer.com"
                      className="h-12 rounded-2xl border-slate-700 bg-slate-950 pl-11 text-white placeholder:text-slate-600 focus:border-cyan-500 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-300 [.light_&]:text-slate-700">
                    Cargo / Perfil
                  </Label>

                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <Input
                      value={profile.role}
                      onChange={(e) => updateField("role", e.target.value)}
                      placeholder="Gestor"
                      className="h-12 rounded-2xl border-slate-700 bg-slate-950 pl-11 text-white placeholder:text-slate-600 focus:border-cyan-500 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-300 [.light_&]:text-slate-700">
                    Área / Identificação
                  </Label>

                  <div className="relative">
                    <Wrench className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <Input
                      value={profile.area}
                      onChange={(e) => updateField("area", e.target.value)}
                      placeholder="Gestor FIXER"
                      className="h-12 rounded-2xl border-slate-700 bg-slate-950 pl-11 text-white placeholder:text-slate-600 focus:border-cyan-500 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="rounded-2xl border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:text-slate-700 [.light_&]:hover:bg-slate-100"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Restaurar padrão
                </Button>

                <Button
                  onClick={handleSave}
                  className="rounded-2xl bg-[#082f4d] px-6 text-white hover:bg-[#0b6680]"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Perfil
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <SideCard
            icon={Bell}
            title="Notificações"
            subtitle="Alertas operacionais"
            description="Configure alertas sobre ordens de manutenção, ativos críticos, validações pendentes e encerramentos."
            buttonLabel="Gerenciar"
            tone="amber"
          />

          <SideCard
            icon={LockKeyhole}
            title="Segurança"
            subtitle="Acesso e permissões"
            description="Gerencie alteração de senha, autenticação e controle de permissões dos usuários do sistema."
            buttonLabel="Ver opções"
            tone="emerald"
          />

          <Card className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/10 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-black text-white [.light_&]:text-slate-900">
                  FIXER
                </h3>
                <p className="text-xs text-slate-500">
                  Gestão de ativos e manutenção
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-400 [.light_&]:text-slate-600">
              <p className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-cyan-400" />
                Controle de ordens de manutenção
              </p>

              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Indicadores operacionais
              </p>

              <p className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-400" />
                Sistema integrado ao Supabase
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}