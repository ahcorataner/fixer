import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  History,
  LogOut,
  ShieldCheck,
  HardHat,
  Sun,
  Moon,
  BarChart3,
  Settings,
  Bell,
  Search,
  Plus,
  Wrench,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../../lib/supabase";

const gestorNav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/assets", label: "Ativos", icon: Package, end: false },
  { to: "/work-orders", label: "Ordens de Manutenção", icon: ClipboardList, end: false },
  { to: "/history", label: "Histórico", icon: History, end: false },
  { to: "/reports", label: "Relatórios", icon: BarChart3, end: false },
  { to: "/settings", label: "Configurações", icon: Settings, end: false },
];

const tecnicoNav = [
  { to: "/", label: "Painel", icon: LayoutDashboard, end: true },
  { to: "/work-orders", label: "Minhas Ordens", icon: ClipboardList, end: false },
  { to: "/history", label: "Histórico", icon: History, end: false },
  { to: "/reports", label: "Relatórios", icon: BarChart3, end: false },
  { to: "/settings", label: "Configurações", icon: Settings, end: false },
];

const pageTitles: Record<string, string> = {
  "/": "Painel Executivo",
  "/assets": "Gestão de Ativos",
  "/work-orders": "Ordens de Manutenção",
  "/history": "Histórico Geral",
  "/reports": "Relatórios",
  "/settings": "Configurações",
};

export function Root() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("fixer_theme") as "dark" | "light") || "dark";
  });

  const isLight = theme === "light";
  const isGestor = profile?.role === "gestor";
  const navItems = isGestor ? gestorNav : tecnicoNav;

  const pageTitle = pageTitles[location.pathname] || "Painel Executivo";

  useEffect(() => {
    localStorage.setItem("fixer_theme", theme);
    document.documentElement.classList.toggle("light", isLight);
  }, [theme, isLight]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div
      className={`flex h-screen overflow-hidden transition-colors ${
        isLight ? "bg-slate-100 text-slate-900" : "bg-[#050b1c] text-white"
      }`}
    >
      {/* SIDEBAR */}
      <aside
        className={`w-72 border-r flex flex-col shrink-0 transition-colors ${
          isLight
            ? "bg-white border-slate-200"
            : "bg-[#08233a] border-cyan-950/60"
        }`}
      >
        {/* LOGO */}
        <div
          className={`px-6 py-7 border-b ${
            isLight ? "border-slate-200" : "border-cyan-950/60"
          }`}
        >
          <div className="flex items-center gap-3">
            <img
              src="/fixer.png"
              alt="FIXER"
              className="h-14 w-14 object-contain"
            />

            <div>
              <h1
                className={`text-xl font-extrabold tracking-wide ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                FIXER
              </h1>

              <p className="text-xs font-medium text-cyan-400">
                Gestão de Manutenção
              </p>
            </div>
          </div>
        </div>

        {/* MENU */}
        <div className="px-6 pt-6 pb-2">
          <span
            className={`text-xs font-bold uppercase tracking-[0.18em] ${
              isLight ? "text-slate-400" : "text-slate-400"
            }`}
          >
            Principal
          </span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-6 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? isLight
                      ? "bg-cyan-50 text-cyan-700 border-l-4 border-cyan-500"
                      : "bg-cyan-500/15 text-white border-l-4 border-cyan-400"
                    : isLight
                      ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-l-4 border-transparent"
                      : "text-slate-300 hover:bg-white/5 hover:text-white border-l-4 border-transparent"
                }`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* USUÁRIO / SAIR */}
        <div
          className={`px-5 py-4 border-t ${
            isLight ? "border-slate-200" : "border-cyan-950/60"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`h-11 w-11 rounded-full flex items-center justify-center ${
                isGestor
                  ? "bg-cyan-500/15 text-cyan-400"
                  : "bg-amber-500/15 text-amber-400"
              }`}
            >
              {isGestor ? (
                <ShieldCheck className="w-5 h-5" />
              ) : (
                <HardHat className="w-5 h-5" />
              )}
            </div>

            <div className="min-w-0">
              <p
                className={`text-sm font-bold truncate ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                {profile?.name || "Usuário"}
              </p>

              <p className="text-xs text-slate-400">
                {isGestor ? "Gestor" : "Técnico"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isLight
                ? "text-slate-600 hover:bg-red-50 hover:text-red-600"
                : "text-slate-300 hover:bg-red-500/10 hover:text-red-400"
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* TOPBAR */}
        <header
          className={`px-8 py-6 border-b transition-colors ${
            isLight
              ? "bg-slate-100 border-slate-200"
              : "bg-[#050b1c] border-cyan-950/40"
          }`}
        >
          <div className="rounded-3xl bg-gradient-to-r from-[#082f4d] via-[#0b6680] to-[#12b7c4] px-8 py-7 shadow-xl shadow-cyan-950/20">
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-100/80 mb-2">
                  {pageTitle}
                </p>

                <h2 className="text-2xl font-extrabold text-white">
                  Boa tarde, {profile?.name || "Usuário"} 👋
                </h2>

                <p className="text-sm text-cyan-50/90 mt-1">
                  Resumo das atividades de manutenção de hoje,{" "}
                  {new Date().toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  .
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/work-orders")}
                  className="hidden lg:flex items-center gap-2 bg-[#061d33] text-white px-5 py-3 rounded-2xl font-bold hover:bg-[#092b4a] transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Nova Ordem
                </button>

                <div className="hidden xl:flex items-center gap-2 w-80 bg-white/15 border border-white/20 rounded-2xl px-4 py-3 text-white/90">
                  <Search className="w-5 h-5 text-cyan-50/80" />
                  <input
                    className="bg-transparent outline-none placeholder:text-cyan-50/70 text-sm w-full"
                    placeholder="Buscar ativos, ordens, históricos..."
                  />
                </div>

                {/* BOTÃO TEMA CLARO / ESCURO */}
                <button
                  type="button"
                  onClick={() => setTheme(isLight ? "dark" : "light")}
                  title={isLight ? "Ativar tema escuro" : "Ativar tema claro"}
                  className="h-12 w-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                >
                  {isLight ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                </button>

                {/* SINO */}
                <button className="relative h-12 w-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                  <Bell className="w-5 h-5" />

                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-cyan-300 text-[#08233a] text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                </button>

                {/* PERFIL TOPO */}
                <div className="hidden lg:flex items-center gap-3 bg-white/15 border border-white/20 rounded-2xl px-4 py-2.5">
                  <div className="h-9 w-9 rounded-full bg-[#061d33] flex items-center justify-center text-white">
                    <Wrench className="w-4 h-4" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white leading-none">
                      {profile?.name || "Usuário"}
                    </p>

                    <p className="text-xs text-cyan-50/80 mt-1">
                      {isGestor ? "Gestor" : "Técnico"} FIXER
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* CONTEÚDO */}
        <section
          className={`flex-1 overflow-auto transition-colors ${
            isLight ? "bg-slate-100" : "bg-[#050b1c]"
          }`}
        >
          <Outlet />
        </section>
      </main>
    </div>
  );
}