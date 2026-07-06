import { useAuth } from "../hooks/useAuth";
import { getCurrentUser } from "../lib/ordersStore";
import { GestorDashboard } from "./GestorDashboard";
import { TecnicoDashboard } from "./TecnicoDashboard";

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

function isTecnico(email?: string | null, role?: string | null) {
  const normalizedEmail = normalizeText(email);
  const normalizedRole = normalizeText(role);

  return (
    normalizedRole.includes("tecnico") ||
    normalizedRole.includes("técnico") ||
    normalizedEmail.includes("tecnico") ||
    normalizedEmail.includes("técnico")
  );
}

function LoadingDashboard() {
  return (
    <div className="flex h-full items-center justify-center p-8 text-slate-400">
      Carregando painel...
    </div>
  );
}

export function Dashboard() {
  const { profile, loading } = useAuth();
  const fallbackUser = getCurrentUser();

  if (loading) {
    return <LoadingDashboard />;
  }

  const authEmail = getAuthEmail(profile);
  const authRole = getAuthRole(profile);

  const fallbackRole = fallbackUser?.role || "";
  const fallbackEmail = fallbackUser?.email || "";

  const shouldShowTecnicoDashboard =
    isTecnico(authEmail, authRole) || isTecnico(fallbackEmail, fallbackRole);

  if (shouldShowTecnicoDashboard) {
    return <TecnicoDashboard />;
  }

  return <GestorDashboard />;
}