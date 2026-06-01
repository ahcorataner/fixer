import { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import { supabase } from './supabaseClient';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('Admin');
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('login');

  useEffect(() => {
    // Monitora a sessão ativa do Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        setUserName(session.user.email.split('@')[0]);
      }
      setLoading(false);
    });

    // Escuta mudanças de login/logout em tempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        setUserName(session.user.email.split('@')[0]);
      } else {
        setUserName('Admin');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090e1a] flex items-center justify-center">
        <div className="text-cyan-500 font-semibold tracking-wider animate-pulse text-sm">
          CARREGANDO SISTEMA...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (currentScreen === 'register') {
      return <Register onNavigateToLogin={() => setCurrentScreen('login')} />;
    }
    return (
      <Login 
        onLoginSuccess={() => setIsAuthenticated(true)} 
        onNavigateToRegister={() => setCurrentScreen('register')} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-gray-100 flex font-sans antialiased selection:bg-cyan-500 selection:text-white">
      
      {/* 📁 MENU LATERAL (SIDEBAR) */}
      <aside className="w-64 bg-[#0c1220] border-r border-gray-800/40 flex flex-col justify-between p-4 hidden md:flex selection:bg-transparent">
        <div className="space-y-6">
          
          {/* Logo FIXER com Chave Inglesa */}
          <div className="flex items-center space-x-3 px-2.5 py-2 text-[#00d2ff]">
            <svg className="w-6 h-6 rotate-90" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xl font-black tracking-widest text-white">FIXER</span>
          </div>
          
          {/* Navegação Otimizada */}
          <nav className="space-y-1.5">
            
            {/* Link: Dashboard (Ativo) */}
            <a href="#" className="flex items-center space-x-3.5 bg-[#0e2238] border border-cyan-500/20 text-[#00d2ff] px-4 py-3 rounded-xl font-bold text-sm transition-all">
              {/* Ícone Grid de 4 Quadrados */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Dashboard</span>
            </a>

            {/* Link: Ativos */}
            <a href="#" className="flex items-center space-x-3.5 text-gray-400 hover:bg-[#111827]/40 hover:text-white px-4 py-3 rounded-xl font-semibold text-sm transition-all">
              {/* Ícone Caixa/Cubo */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>Ativos</span>
            </a>

            {/* Link: Ordens de Manutenção */}
            <a href="#" className="flex items-center space-x-3.5 text-gray-400 hover:bg-[#111827]/40 hover:text-white px-4 py-3 rounded-xl font-semibold text-sm transition-all leading-snug">
              {/* Ícone Prancheta/Ficha */}
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span>Ordens de Manutenção</span>
            </a>

            {/* Link: Histórico */}
            <a href="#" className="flex items-center space-x-3.5 text-gray-400 hover:bg-[#111827]/40 hover:text-white px-4 py-3 rounded-xl font-semibold text-sm transition-all">
              {/* Ícone Relógio com Seta */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Histórico</span>
            </a>

          </nav>
        </div>

        {/* Bloco do Usuário & Sair (Rodapé da Sidebar) */}
        <div className="border-t border-gray-800/40 pt-4 flex items-center justify-between px-1.5 selection:bg-transparent">
          {/* Avatar + Nome Alinhados */}
          <div className="flex items-center space-x-3 min-w-0">
            {/* Ícone Redondo com Letra */}
            <div className="w-9 h-9 rounded-xl bg-[#112240] border border-cyan-500/20 flex items-center justify-center font-bold text-cyan-400 text-sm shrink-0 capitalize">
              {userName.charAt(0)}
            </div>
            {/* Nome do Usuário Centralizado Verticalmente */}
            <span className="font-bold text-white text-sm truncate capitalize">
              {userName}
            </span>
          </div>

          {/* Ícone de Sair na Direita */}
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all shrink-0"
            title="Sair do sistema"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </aside>

      {/* 🖥️ CONTEÚDO PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#070b14] overflow-y-auto">
        
        {/* BARRA SUPERIOR */}
        <header className="h-16 flex items-center justify-between px-6 md:px-8 border-b border-gray-900">
          <h1 className="text-lg font-bold text-white tracking-wide">Dashboard</h1>
          <div className="text-xs font-semibold text-gray-500 tracking-wider uppercase">
            Quinta-feira, 28 de Maio
          </div>
        </header>

        {/* ÁREA DE CARDS E GRÁFICOS */}
        <div className="p-6 md:p-8 space-y-6 max-w-7xl w-full">
          
          {/* ⚡ 1. ROW DE METRICAS (MTBF, MTTR, Disponibilidade) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Card MTBF */}
            <div className="bg-[#0c1220] p-5 rounded-xl border border-gray-800/40 flex justify-between items-start shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase block">MTBF</span>
                <h3 className="text-2xl font-black text-white">720h</h3>
                <span className="text-[11px] font-bold text-emerald-500 block pt-3">+12%</span>
              </div>
              <div className="p-2 bg-cyan-500/5 border border-cyan-500/10 text-cyan-400 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
            </div>

            {/* Card MTTR */}
            <div className="bg-[#0c1220] p-5 rounded-xl border border-gray-800/40 flex justify-between items-start shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase block">MTTR</span>
                <h3 className="text-2xl font-black text-white">4.5h</h3>
                <span className="text-[11px] font-bold text-cyan-500 block pt-3">-8%</span>
              </div>
              <div className="p-2 bg-blue-500/5 border border-blue-500/10 text-blue-400 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>

            {/* Card Disponibilidade */}
            <div className="bg-[#0c1220] p-5 rounded-xl border border-gray-800/40 flex justify-between items-start shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase block">Disponibilidade</span>
                <h3 className="text-2xl font-black text-white">98.4%</h3>
                <span className="text-[11px] font-bold text-emerald-500 block pt-3">+2.1%</span>
              </div>
              <div className="p-2 bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>

          </div>

          {/* ⚡ 2. ROW DO MEIO (Ativos por Status e Manutenções Recentes) */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            
            {/* Bloco: Ativos por Status (Peso 3/5) */}
            <div className="bg-[#0c1220] p-5 rounded-xl border border-gray-800/40 lg:col-span-3 space-y-4">
              <h4 className="text-xs font-bold text-white tracking-wide uppercase">Ativos por Status</h4>
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-gray-300 font-medium">Operacional</span>
                  </div>
                  <span className="text-white font-black">42</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="text-gray-300 font-medium">Em Manutenção</span>
                  </div>
                  <span className="text-white font-black">8</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="text-gray-300 font-medium">Indisponível</span>
                  </div>
                  <span className="text-white font-black">3</span>
                </div>
              </div>
            </div>

            {/* Bloco: Manutenções Recentes (Peso 2/5) */}
            <div className="bg-[#0c1220] p-5 rounded-xl border border-gray-800/40 lg:col-span-2 space-y-4">
              <h4 className="text-xs font-bold text-white tracking-wide uppercase">Manutenções Recentes</h4>
              <div className="divide-y divide-gray-800/60">
                <div className="py-2.5 first:pt-0">
                  <p className="text-xs font-bold text-white">Compressor AR-01</p>
                  <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Preventiva - 15/04</p>
                </div>
                <div className="py-2.5">
                  <p className="text-xs font-bold text-white">Bomba HID-03</p>
                  <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Corretiva - 14/04</p>
                </div>
                <div className="py-2.5 last:pb-0">
                  <p className="text-xs font-bold text-white">Motor EL-12</p>
                  <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Preventiva - 13/04</p>
                </div>
              </div>
            </div>

          </div>

          {/* ⚡ 3. ROW INFERIOR (Cronograma de Manutenções / Linha do Tempo Corrigido) */}
          <div className="bg-[#0c1220] p-6 rounded-xl border border-gray-800/40 space-y-6">
            
            {/* Cabeçalho do Cronograma com Ícone SVG Real */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800/40 pb-4">
              <h4 className="text-sm font-bold text-white tracking-wide uppercase flex items-center space-x-2.5">
                {/* Ícone de Calendário Real em SVG */}
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Cronograma de Manutenções</span>
              </h4>
              
              {/* Legendas de Status */}
              <div className="flex flex-wrap gap-4 text-[10px] font-bold tracking-wider uppercase">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-gray-400">Concluída</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="text-gray-400">Andamento</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                  <span className="text-gray-400">Programada</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <span className="text-gray-400">Atrasada</span>
                </div>
              </div>
            </div>

            {/* Tabela Gantt com Formato de Pílulas Isoladas e Posições Alinhadas */}
            <div className="overflow-x-auto">
              <div className="min-w-[700px] space-y-3">
                
                {/* Cabeçalho de Datas */}
                <div className="grid grid-cols-8 text-center text-[10px] font-bold text-gray-500 tracking-wider uppercase pb-2 border-b border-gray-800/20">
                  <div className="text-left pl-2">Ativo</div>
                  <div>15/04</div>
                  <div>16/04</div>
                  <div>17/04</div>
                  <div className="text-cyan-400 font-extrabold bg-cyan-500/5 rounded py-0.5">18/04</div>
                  <div>19/04</div>
                  <div>20/04</div>
                  <div>21/04</div>
                </div>

                {/* Linha 1: Compressor AR-01 (Ocupa 15, 16 e 17) */}
                <div className="grid grid-cols-8 items-center h-10 border-b border-gray-800/20 last:border-0 py-1">
                  <div className="text-xs font-bold text-white pl-2">Compressor AR-01</div>
                  <div className="col-span-3 px-1">
                    <div className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold text-[10px] py-1 rounded-full text-center tracking-wide uppercase">
                      Preventiva
                    </div>
                  </div>
                  <div className="col-span-4"></div>
                </div>

                {/* Linha 2: Bomba HID-03 (Começa no dia 16 e vai até o dia 19) */}
                <div className="grid grid-cols-8 items-center h-10 border-b border-gray-800/20 last:border-0 py-1">
                  <div className="text-xs font-bold text-white pl-2">Bomba HID-03</div>
                  <div></div> {/* Pula dia 15 */}
                  <div className="col-span-4 px-1">
                    <div className="bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold text-[10px] py-1 rounded-full text-center tracking-wide uppercase">
                      Corretiva
                    </div>
                  </div>
                  <div className="col-span-2"></div>
                </div>

                {/* Linha 3: Motor EL-12 (Ocupa os dias 19, 20 e 21) */}
                <div className="grid grid-cols-8 items-center h-10 border-b border-gray-800/20 last:border-0 py-1">
                  <div className="text-xs font-bold text-white pl-2">Motor EL-12</div>
                  <div className="col-span-4"></div> {/* Pula 15, 16, 17 e 18 */}
                  <div className="col-span-3 px-1">
                    <div className="bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold text-[10px] py-1 rounded-full text-center tracking-wide uppercase">
                      Preventiva
                    </div>
                  </div>
                </div>

                {/* Linha 4: Prensa PR-08 (Ocupa os dias 16, 17 e 18) */}
                <div className="grid grid-cols-8 items-center h-10 border-b border-gray-800/20 last:border-0 py-1">
                  <div className="text-xs font-bold text-white pl-2">Prensa PR-08</div>
                  <div></div> {/* Pula dia 15 */}
                  <div className="col-span-3 px-1">
                    <div className="bg-red-500/15 text-red-400 border border-red-500/30 font-bold text-[10px] py-1 rounded-full text-center tracking-wide uppercase">
                      Urgente
                    </div>
                  </div>
                  <div className="col-span-3"></div>
                </div>

                {/* Linha 5: Gerador GE-02 (Ocupa dias 15 e 16) */}
                <div className="grid grid-cols-8 items-center h-10 border-b border-gray-800/20 last:border-0 py-1">
                  <div className="text-xs font-bold text-white pl-2">Gerador GE-02</div>
                  <div className="col-span-2 px-1">
                    <div className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold text-[10px] py-1 rounded-full text-center tracking-wide uppercase">
                      Teste
                    </div>
                  </div>
                  <div className="col-span-5"></div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Botão Flutuante Ajuda */}
      <button className="fixed bottom-4 right-4 w-7 h-7 bg-[#0c1220] border border-gray-800 text-gray-500 rounded-full flex items-center justify-center text-xs font-semibold hover:text-white transition-colors">
        ?
      </button>

    </div>
  );
}