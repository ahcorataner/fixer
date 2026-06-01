import { useState } from "react";
import { supabase } from "./supabaseClient"; // Importando o cliente que criamos

export default function Login({ onLoginSuccess, onNavigateToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // O Supabase cuida da autenticação e criptografia de ponta a ponta
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    setLoading(false);

    if (authError) {
      setError("E-mail ou senha incorretos. Tente novamente.");
    } else if (data.user) {
      onLoginSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-[#070b19] flex flex-col items-center justify-center p-4 selection:bg-cyan-500 selection:text-white">
      
      {/* 🔧 LOGO & CABEÇALHO */}
      <div className="flex flex-col items-center mb-8 text-center select-none">
        <div className="w-16 h-16 bg-[#112240] border border-cyan-500/30 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/10 mb-4">
          <svg className="w-8 h-8 text-cyan-400 rotate-90" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-black tracking-widest text-white">FIXER</h1>
        <p className="text-gray-400 text-sm mt-1">Sistema de Gestão de Manutenção</p>
      </div>

      {/* 🗂️ CARD PRINCIPAL DE LOGIN */}
      <div className="w-full max-w-md bg-[#111827]/60 border border-gray-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Campo Usuário (E-mail) */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Usuário</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1f293d]/50 border border-gray-700/60 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
                required
              />
            </div>
          </div>

          {/* Campo Senha */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Senha</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1f293d]/50 border border-gray-700/60 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
                required
              />
            </div>
          </div>

          {/* Botão Entrar com efeito Glow e estado de Loading */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0099c4] hover:bg-[#00aedc] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.99] text-sm tracking-wide disabled:opacity-50"
          >
            {loading ? "Carregando..." : "Entrar"}
          </button>

          {/* Link Esqueceu sua senha */}
          <div className="text-center pt-2 select-none">
            <a href="#" className="text-xs font-bold text-[#00aedc] hover:underline tracking-wide">
              Esqueceu sua senha?
            </a>
          </div>
        </form>
      </div>

      {/* 🔗 BLOCO REGISTRAR-SE (Com a função que conecta ao App.jsx) */}
      <div className="w-full max-w-md bg-[#111827]/40 border border-gray-800/80 rounded-xl py-4 px-8 mt-4 text-center text-xs select-none">
        <span className="text-gray-400">Não tem uma conta? </span>
        <button 
          onClick={onNavigateToRegister} 
          className="font-bold text-[#00aedc] hover:underline bg-transparent border-0 cursor-pointer p-0 transition-all"
        >
          Registrar-se
        </button>
      </div>

      {/* 📅 RODAPÉ COPYRIGHT */}
      <p className="text-[10px] text-gray-600 tracking-wide mt-8 select-none">
        © 2026 FIXER. Todos os direitos reservados.
      </p>

      {/* Botão flutuante */}
      <button className="fixed bottom-4 right-4 w-7 h-7 bg-gray-800 border border-gray-700 text-gray-400 rounded-full flex items-center justify-center text-xs font-semibold hover:text-white hover:border-gray-600 transition-colors">
        ?
      </button>
    </div>
  );
}