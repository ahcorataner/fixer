import { useState, useEffect } from 'react';
import Login from './Login';
import { supabase } from './supabaseClient';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('Administrador');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica a sessão atual do Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        setUserName(session.user.email.split('@')[0]);
      }
      setLoading(false);
    });

    // Escuta mudanças de autenticação em tempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        setUserName(session.user.email.split('@')[0]);
      } else {
        setUserName('Administrador');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b19] flex items-center justify-center">
        <div className="text-cyan-500 font-semibold tracking-wider animate-pulse text-sm">
          CARREGANDO SISTEMA...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#070b19] text-gray-100 flex selection:bg-cyan-500 selection:text-white">
      
      {/* 📁 MENU LATERAL (SIDEBAR) */}
      <aside className="w-64 bg-[#111827]/60 border-r border-gray-800/80 flex flex-col justify-between p-4 hidden md:flex backdrop-blur-sm">
        <div className="space-y-6">
          <div className="flex items-center space-x-2 px-2 py-2">
            <span className="text-2xl font-black tracking-widest text-white">FIXER</span>
            <span className="bg-cyan-500/10 text-cyan-400 text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide">v1.0</span>
          </div>
          
          <nav className="space-y-1">
            <a href="#" className="flex items-center space-x-3 bg-[#0099c4] text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20 text-sm">
              <span>📊 Dashboard</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-gray-400 hover:bg-[#1f293d]/50 hover:text-white px-4 py-2.5 rounded-xl font-semibold transition-all text-sm">
              <span>🔧 Ordens de Serviço</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-gray-400 hover:bg-[#1f293d]/50 hover:text-white px-4 py-2.5 rounded-xl font-semibold transition-all text-sm">
              <span>👥 Clientes</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-gray-400 hover:bg-[#1f293d]/50 hover:text-white px-4 py-2.5 rounded-xl font-semibold transition-all text-sm">
              <span>⚙️ Configurações</span>
            </a>
          </nav>
        </div>

        {/* Usuário Logado & Sair */}
        <div className="border-t border-gray-800/80 pt-4 flex items-center justify-between px-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#1f293d] border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400 text-sm capitalize">
              {userName.charAt(0)}
            </div>
            <div className="text-xs">
              <p className="font-bold text-white truncate w-28 capitalize">{userName}</p>
              <p className="text-gray-500 font-medium mt-0.5">Online no Supabase</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
            title="Sair do sistema"
          >
            {/* Ícone de Logout em SVG */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </aside>

      {/* 🖥️ CONTEÚDO PRINCIPAL (MAIN CONTENT) */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* 🔝 BARRA SUPERIOR (HEADER) */}
        <header className="h-16 bg-[#111827]/40 border-b border-gray-800/60 flex items-center justify-between px-6 md:px-8 backdrop-blur-sm">
          <h1 className="text-lg font-bold tracking-wide text-white">Visão Geral</h1>
          <div className="flex items-center space-x-4">
            <span className="text-xs font-semibold text-gray-500 hidden sm:inline tracking-wider uppercase">Sexta-feira, 29 de Maio</span>
            <button 
              onClick={handleLogout}
              className="md:hidden px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold transition-all"
            >
              Sair
            </button>
          </div>
        </header>

        {/* 📊 CONTEÚDO DO DASHBOARD */}
        <div className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* Card de Boas-vindas Premium */}
          <div className="relative bg-gradient-to-r from-[#0099c4] to-[#112240] p-6 rounded-2xl shadow-xl shadow-cyan-500/5 overflow-hidden border border-cyan-500/20">
            <div className="relative z-10">
              <h2 className="text-2xl font-black text-white capitalize">Olá, {userName}! 👋</h2>
              <p className="text-cyan-100/80 text-sm mt-1 max-w-xl font-medium">
                O ecossistema **Fixer** está totalmente operacional na nuvem do Supabase. Todos os microsserviços e tabelas PostgreSQL estão sincronizados.
              </p>
            </div>
          </div>

          {/* ⚡ GRID DE CARDS DE MÉTRICAS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1 - Ordens Abertas */}
            <div className="bg-[#111827]/60 p-5 rounded-2xl border border-gray-800/80 flex flex-col justify-between shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between text-gray-400 font-semibold tracking-wide text-xs">
                <span>ORDENS ABERTAS</span>
                <span className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg text-sm">🛠️</span>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-black text-white tracking-tight">12</h3>
                <p className="text-[11px] font-bold text-amber-400 mt-1.5 flex items-center space-x-1">
                  <span>⚠️ 4 aguardando peças</span>
                </p>
              </div>
            </div>

            {/* Card 2 - Concluídas */}
            <div className="bg-[#111827]/60 p-5 rounded-2xl border border-gray-800/80 flex flex-col justify-between shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between text-gray-400 font-semibold tracking-wide text-xs">
                <span>CONCLUÍDAS (MÊS)</span>
                <span className="p-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg text-sm">✅</span>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-black text-white tracking-tight">48</h3>
                <p className="text-[11px] font-bold text-cyan-400 mt-1.5">↑ 12% em relação a abril</p>
              </div>
            </div>

            {/* Card 3 - Clientes */}
            <div className="bg-[#111827]/60 p-5 rounded-2xl border border-gray-800/80 flex flex-col justify-between shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between text-gray-400 font-semibold tracking-wide text-xs">
                <span>CLIENTES ATIVOS</span>
                <span className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-sm">👥</span>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-black text-white tracking-tight">87</h3>
                <p className="text-[11px] font-medium text-gray-500 mt-1.5">Fidelizados no sistema</p>
              </div>
            </div>

            {/* Card 4 - Receita */}
            <div className="bg-[#111827]/60 p-5 rounded-2xl border border-gray-800/80 flex flex-col justify-between shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between text-gray-400 font-semibold tracking-wide text-xs">
                <span>RECEITA BRUTA</span>
                <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm">💰</span>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-black text-white tracking-tight">R$ 8.450</h3>
                <p className="text-[11px] font-bold text-emerald-400 mt-1.5">Faturamento deste mês</p>
              </div>
            </div>

          </div>

          {/* 📑 TABELA / PRÓXIMOS PASSOS */}
          <div className="bg-[#111827]/60 rounded-2xl border border-gray-800/80 p-6 shadow-lg backdrop-blur-sm">
            <h3 className="text-base font-bold text-white tracking-wide mb-4">Evolução do Ecossistema Fixer</h3>
            <ul className="space-y-3.5 text-sm font-semibold text-gray-400">
              <li className="flex items-center space-x-3">
                <span className="text-cyan-400 bg-cyan-500/10 w-5 h-5 rounded-lg flex items-center justify-center text-xs">✓</span>
                <span>Configuração do Banco de Dados PostgreSQL Relacional na Nuvem</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-cyan-400 bg-cyan-500/10 w-5 h-5 rounded-lg flex items-center justify-center text-xs">✓</span>
                <span>Autenticação nativa com criptografia GoTrue (Supabase Auth)</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-cyan-400 bg-cyan-500/10 w-5 h-5 rounded-lg flex items-center justify-center text-xs">✓</span>
                <span>Interface de Login e Dashboard unificados com Tailwind v4</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-500">
                <span className="text-amber-400 bg-amber-500/10 w-5 h-5 rounded-lg flex items-center justify-center text-xs">⏳</span>
                <span>Próxima etapa: Consumir os dados da tabela de Ordens de Serviço direto via Supabase Client</span>
              </li>
            </ul>
          </div>

        </div>
      </main>

    </div>
  );
}