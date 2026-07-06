import { useEffect, useMemo, useState } from "react";
import type { ElementType, FormEvent } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  History,
  LogOut,
  ChevronRight,
  Sun,
  Moon,
  Bell,
  Search,
  Wrench,
  BarChart3,
  Settings,
  UserCheck,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../../lib/supabase";

type Theme = "light" | "dark";

type ProfileData = {
  name: string;
  email: string;
  role: string;
  area: string;
  avatar: string;
};

type NavItemType = {
  to: string;
  label: string;
  icon: ElementType;
  end?: boolean;
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

const gestorNav: NavItemType[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/assets", label: "Ativos", icon: Package },
  { to: "/work-orders", label: "Ordens", icon: ClipboardList },
  { to: "/assignments", label: "Atribuições", icon: UserCheck },
  { to: "/history", label: "Histórico", icon: History },
  { to: "/reports", label: "Relatórios", icon: BarChart3 },
  { to: "/settings", label: "Configurações", icon: Settings },
];

const tecnicoNav: NavItemType[] = [
  { to: "/", label: "Painel", icon: LayoutDashboard, end: true },
  { to: "/work-orders", label: "Minhas Ordens", icon: ClipboardList },
  { to: "/history", label: "Histórico", icon: History },
  { to: "/settings", label: "Configurações", icon: Settings },
];

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/assets": "Ativos",
  "/assets/new": "Novo Ativo",
  "/work-orders": "Ordens de Manutenção",
  "/assignments": "Atribuições",
  "/history": "Histórico",
  "/reports": "Relatórios",
  "/settings": "Configurações",
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
    normalizedRole.includes("técnico") ||
    normalizedEmail.includes("tecnico") ||
    normalizedEmail.includes("técnico")
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
        email: email || parsed.email || defaultProfile.email,
      };
    }

    /*
      Migração suave:
      se for gestor e já existir o perfil antigo salvo em "fixer_profile",
      usamos ele só para o gestor. Para técnico, NÃO usamos essa chave antiga,
      porque era justamente ela que misturava os perfis.
    */
    if (!isTecnicoProfile(email, role)) {
      const legacyStored = localStorage.getItem("fixer_profile");

      if (legacyStored) {
        const parsed = JSON.parse(legacyStored);

        const legacyProfile = {
          ...defaultProfile,
          ...parsed,
          email: email || parsed.email || defaultProfile.email,
        };

        localStorage.setItem(key, JSON.stringify(legacyProfile));

        return legacyProfile;
      }
    }

    return defaultProfile;
  } catch {
    return defaultProfile;
  }
}

function ProfileAvatar({
  avatar,
  name,
  size = "md",
}: {
  avatar: string;
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [avatar]);

  const sizeClass =
    size === "lg" ? "h-16 w-16" : size === "sm" ? "h-10 w-10" : "h-12 w-12";

  if (!avatar || imageError) {
    return (
      <div
        className={`${sizeClass} flex shrink-0 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300 ring-2 ring-cyan-400/30`}
      >
        <Wrench className="h-5 w-5" />
      </div>
    );
  }

  return (
    <img
      src={avatar}
      alt={name}
      onError={() => setImageError(true)}
      className={`${sizeClass} shrink-0 rounded-2xl object-cover ring-2 ring-cyan-400/30`}
    />
  );
}

function NavItem({ to, label, icon: Icon, end }: NavItemType) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          "group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition-all",
          isActive
            ? "bg-cyan-500/15 text-cyan-300 shadow-lg shadow-cyan-950/20 [.light_&]:bg-cyan-50 [.light_&]:text-cyan-700"
            : "text-slate-400 hover:bg-slate-800/70 hover:text-white [.light_&]:text-slate-600 [.light_&]:hover:bg-slate-100 [.light_&]:hover:text-slate-900",
        ].join(" ")
      }
    >
      <span className="flex items-center gap-3">
        <Icon className="h-5 w-5" />
        {label}
      </span>

      <ChevronRight className="h-4 w-4 opacity-0 transition-all group-hover:opacity-100" />
    </NavLink>
  );
}

export function Root() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();

  const authEmail = getAuthEmail(profile);
  const authRole = getAuthRole(profile);

  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("fixer_theme");
    return stored === "light" ? "light" : "dark";
  });

  const [searchValue, setSearchValue] = useState("");

  const [profileData, setProfileData] = useState<ProfileData>(() =>
    readProfile(authEmail, authRole)
  );

  const isLight = theme === "light";

  const normalizedRole = useMemo(() => {
    return normalizeText(authRole || profileData.role || "gestor");
  }, [authRole, profileData.role]);

  const isGestor = !normalizedRole.includes("tecnico");

  const navItems = isGestor ? gestorNav : tecnicoNav;

  const currentPageTitle = pageTitles[location.pathname] || "Painel Executivo";

  useEffect(() => {
    localStorage.setItem("fixer_theme", theme);
    document.documentElement.classList.toggle("light", isLight);
  }, [theme, isLight]);

  useEffect(() => {
    setProfileData(readProfile(authEmail, authRole));
  }, [authEmail, authRole]);

  useEffect(() => {
    const updateProfile = () => {
      setProfileData(readProfile(authEmail, authRole));
    };

    window.addEventListener("storage", updateProfile);
    window.addEventListener("fixer-profile-updated", updateProfile);

    return () => {
      window.removeEventListener("storage", updateProfile);
      window.removeEventListener("fixer-profile-updated", updateProfile);
    };
  }, [authEmail, authRole]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleOpenGeneralAnalysis = () => {
    if (location.pathname !== "/") {
      navigate("/");

      setTimeout(() => {
        window.dispatchEvent(new Event("fixer-open-general-analysis"));
      }, 180);

      return;
    }

    window.dispatchEvent(new Event("fixer-open-general-analysis"));
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const term = searchValue.trim().toLowerCase();

    if (!term) return;

    if (
      term.includes("ordem") ||
      term.includes("ordens") ||
      term.includes("manutenção") ||
      term.includes("manutencao") ||
      term.includes("os")
    ) {
      navigate("/work-orders");
      return;
    }

    if (
      term.includes("atribuição") ||
      term.includes("atribuicao") ||
      term.includes("atribuições") ||
      term.includes("atribuicoes")
    ) {
      navigate(isGestor ? "/assignments" : "/work-orders");
      return;
    }

    if (
      term.includes("ativo") ||
      term.includes("ativos") ||
      term.includes("equipamento") ||
      term.includes("máquina") ||
      term.includes("maquina")
    ) {
      if (isGestor) {
        navigate(`/assets?q=${encodeURIComponent(searchValue.trim())}`);
      } else {
        navigate("/work-orders");
      }

      return;
    }

    if (term.includes("histórico") || term.includes("historico")) {
      navigate("/history");
      return;
    }

    if (
      term.includes("relatório") ||
      term.includes("relatorio") ||
      term.includes("relatórios") ||
      term.includes("relatorios") ||
      term.includes("indicador") ||
      term.includes("indicadores")
    ) {
      navigate(isGestor ? "/reports" : "/work-orders");
      return;
    }

    if (
      term.includes("config") ||
      term.includes("perfil") ||
      term.includes("usuário") ||
      term.includes("usuario") ||
      term.includes("gestor") ||
      term.includes("tecnico") ||
      term.includes("técnico") ||
      term.includes("renata") ||
      term.includes("dados")
    ) {
      navigate("/settings");
      return;
    }

    navigate(
      isGestor
        ? `/assets?q=${encodeURIComponent(searchValue.trim())}`
        : "/work-orders"
    );
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-950 text-white [.light_&]:bg-slate-100 [.light_&]:text-slate-900">
      <div className="flex h-screen overflow-hidden">
        {/* SIDEBAR FIXA */}
        <aside className="hidden h-screen w-72 shrink-0 border-r border-slate-800 bg-[#071a2c] p-5 lg:flex lg:flex-col [.light_&]:border-slate-200 [.light_&]:bg-white">
          {/* LOGO */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mb-8 flex items-center gap-3 rounded-3xl text-left"
          >
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-lg ring-1 ring-cyan-400/30">
              <img
                src="/fixer.png"
                alt="Fixer"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <p className="text-lg font-extrabold tracking-tight text-white [.light_&]:text-slate-900">
                Fixer
              </p>
              <p className="text-xs font-medium text-slate-500">
                Gestão de Manutenção
              </p>
            </div>
          </button>

          <div className="mb-4 px-3">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
              Principal
            </p>
          </div>

          {/* MENU */}
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </nav>

          {/* PERFIL FIXO EMBAIXO DA SIDEBAR */}
          <div className="mt-auto space-y-4 pt-6">
            <button
              type="button"
              onClick={() => navigate("/settings")}
              className="flex w-full items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900/70 p-4 text-left transition-all hover:border-cyan-500/40 hover:bg-slate-800 [.light_&]:border-slate-200 [.light_&]:bg-slate-50 [.light_&]:hover:bg-cyan-50"
            >
              <ProfileAvatar
                avatar={profileData.avatar}
                name={profileData.name}
                size="md"
              />

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white [.light_&]:text-slate-900">
                  {profileData.name}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {profileData.role}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-800 px-4 py-3 text-sm font-bold text-slate-400 transition-all hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300 [.light_&]:border-slate-200"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </aside>

        {/* ÁREA PRINCIPAL */}
        <main className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
          {/* TOPBAR FIXA */}
          <header className="shrink-0 border-b border-slate-800 bg-slate-950 p-6 [.light_&]:border-slate-200 [.light_&]:bg-slate-50">
            <div className="rounded-3xl bg-gradient-to-r from-[#082f4d] via-[#0b6680] to-[#12b7c4] p-7 shadow-xl shadow-cyan-950/20">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-cyan-100">
                    {isGestor ? "Painel Executivo" : "Painel do Técnico"}
                  </p>

                  <h1 className="text-2xl font-extrabold text-white">
                    Boa tarde, {profileData.name} 👋
                  </h1>

                  <p className="mt-2 text-sm text-cyan-50">
                    {currentPageTitle} ·{" "}
                    {isGestor
                      ? "Resumo das atividades de manutenção."
                      : "Acompanhamento das suas ordens de manutenção."}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {isGestor ? (
                    <button
                      type="button"
                      onClick={handleOpenGeneralAnalysis}
                      className="flex h-12 items-center gap-2 rounded-2xl bg-[#06223b] px-5 text-sm font-bold text-white shadow-lg shadow-cyan-950/20 transition-all hover:bg-[#031a2e]"
                    >
                      <BarChart3 className="h-4 w-4" />
                      Análise Geral
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate("/work-orders")}
                      className="flex h-12 items-center gap-2 rounded-2xl bg-[#06223b] px-5 text-sm font-bold text-white shadow-lg shadow-cyan-950/20 transition-all hover:bg-[#031a2e]"
                    >
                      <ClipboardList className="h-4 w-4" />
                      Minhas Ordens
                    </button>
                  )}

                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-50/80" />

                    <input
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder={
                        isGestor
                          ? "Buscar: ativos, ordens, atribuições..."
                          : "Buscar: minhas ordens, histórico..."
                      }
                      className="h-12 w-80 rounded-2xl border border-white/20 bg-white/15 pl-11 pr-4 text-sm text-white placeholder:text-cyan-50/70 outline-none transition-all focus:border-white/40 focus:bg-white/20"
                    />
                  </form>

                  <button
                    type="button"
                    onClick={() => setTheme(isLight ? "dark" : "light")}
                    title={isLight ? "Ativar tema escuro" : "Ativar tema claro"}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white transition-all hover:bg-white/20"
                  >
                    {isLight ? (
                      <Moon className="h-5 w-5" />
                    ) : (
                      <Sun className="h-5 w-5" />
                    )}
                  </button>

                  <button
                    type="button"
                    title="Notificações"
                    className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white transition-all hover:bg-white/20"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-200 text-xs font-bold text-[#08233a]">
                      3
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/settings")}
                    className="flex h-14 items-center gap-3 rounded-2xl border border-white/20 bg-white/15 px-3 pr-5 text-left text-white transition-all hover:bg-white/20"
                  >
                    <ProfileAvatar
                      avatar={profileData.avatar}
                      name={profileData.name}
                      size="sm"
                    />

                    <div className="hidden md:block">
                      <p className="text-sm font-extrabold">
                        {profileData.name}
                      </p>
                      <p className="text-xs text-cyan-50">
                        {profileData.area}
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* SÓ ESSA PARTE ROLA */}
          <section className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-slate-950 [.light_&]:bg-slate-100">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
}