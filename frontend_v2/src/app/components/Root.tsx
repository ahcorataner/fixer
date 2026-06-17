import { Outlet, NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  History,
  LogOut,
  ShieldCheck,
  HardHat,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../../lib/supabase";

const gestorNav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/assets", label: "Ativos", icon: Package, end: false },
  { to: "/work-orders", label: "Ordens de Manutenção", icon: ClipboardList, end: false },
  { to: "/history", label: "Histórico", icon: History, end: false },
];

const tecnicoNav = [
  { to: "/", label: "Painel", icon: LayoutDashboard, end: true },
  { to: "/work-orders", label: "Minhas Ordens", icon: ClipboardList, end: false },
  { to: "/history", label: "Histórico", icon: History, end: false },
];

export function Root() {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const isGestor = profile?.role === "gestor";
  const navItems = isGestor ? gestorNav : tecnicoNav;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">

        {/* LOGO */}
        <div className="px-4 py-6 border-b border-slate-800 flex flex-col items-center">

          <div className="relative flex items-center justify-center">
            <div className="absolute w-44 h-44 bg-cyan-400/20 blur-3xl rounded-full" />

            <img
              src="/fixer.png"
              alt="FIXADOR"
              className="relative h-32 object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.25)]"
            />
          </div>

          <h2 className="mt-3 text-sm font-semibold text-white tracking-[0.25em] uppercase text-center">
            Sistema de Gestão
            <br />
            de Manutenção
          </h2>

          <p className="mt-2 text-[11px] text-slate-500 text-center px-3 leading-relaxed">
            Sistema Integrado de Gestão de Ativos e Manutenção
          </p>
        </div>

        {/* USUÁRIO */}
        <div className="px-4 py-3 mx-3 mt-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${isGestor
                ? "bg-cyan-500/20 border border-cyan-500/30"
                : "bg-amber-500/20 border border-amber-500/30"
                }`}
            >
              {isGestor ? (
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              ) : (
                <HardHat className="w-4 h-4 text-amber-400" />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {profile?.name || "Usuário"}
              </p>

              <p
                className={`text-xs ${isGestor
                  ? "text-cyan-400"
                  : "text-amber-400"
                  }`}
              >
                {isGestor ? "Gestor" : "Técnico"}
              </p>
            </div>
          </div>
        </div>

        {/* MENU */}
        <div className="px-6 pt-5 pb-2">
          <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
            Menu
          </span>
        </div>

        {/* NAVEGAÇÃO */}
        <nav className="flex-1 px-3 pb-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm group ${isActive
                  ? isGestor
                    ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/25"
                    : "bg-amber-500/15 text-amber-400 border border-amber-500/25"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="w-4 h-4 shrink-0" />

                  <span className="font-medium flex-1">
                    {item.label}
                  </span>

                  {isActive && (
                    <ChevronRight className="w-3 h-3 opacity-60" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* SAIR */}
        <div className="px-3 py-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="
              flex items-center gap-3
              w-full
              px-3 py-2.5
              rounded-lg
              text-slate-400
              hover:bg-red-500/10
              hover:text-red-400
              border border-transparent
              hover:border-red-500/20
              transition-all
              text-sm
              font-medium
            "
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 overflow-auto bg-slate-950">
        <Outlet />
      </main>
    </div>
  );
}