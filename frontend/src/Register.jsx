import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Register({ onNavigateToLogin }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!userType) {
      setError("Por favor, selecione o tipo de usuário.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    // Registrando no Supabase Auth salvando os dados extras em metadados
    const { data, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
          username: username,
          user_type: userType,
        },
      },
    });

    setLoading(false);

    if (authError) {
      setError(authError.message || "Erro ao criar conta. Tente novamente.");
    } else if (data?.user) {
      setSuccess("Conta criada com sucesso!");
      // Limpa os campos após o cadastro
      setFullName("");
      setEmail("");
      setUsername("");
      setUserType("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-[#070b19] flex flex-col items-center justify-center p-4 selection:bg-cyan-500 selection:text-white">
      
      {/* 🔧 LOGO & CABEÇALHO */}
      <div className="flex flex-col items-center mb-6 text-center select-none">
        <div className="w-16 h-16 bg-[#112240] border border-cyan-500/30 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/10 mb-4">
          <svg className="w-8 h-8 text-cyan-400 rotate-90" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-black tracking-widest text-white select-none">FIXER</h1>
        <p className="text-gray-400 text-sm mt-1 select-none">Criar Nova Conta</p>
      </div>

      {/* 🗂️ CARD DE REGISTRO */}
      <div className="w-full max-w-lg bg-[#111827]/60 border border-gray-800/80 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg text-center font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg text-center font-medium">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* 1. Nome Completo */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Nome Completo</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Digite seu nome completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#1f293d]/30 border border-gray-700/50 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
                required
              />
            </div>
          </div>

          {/* 2. E-mail */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5">E-mail</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1f293d]/30 border border-gray-700/50 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
                required
              />
            </div>
          </div>

          {/* 3. Usuário */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Usuário</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#1f293d]/30 border border-gray-700/50 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
                required
              />
            </div>
          </div>

          {/* 4. Tipo de Usuário (Dropdown Customizado Premium) */}
          <div className="relative select-none">
            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Tipo de Usuário</label>
            
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="relative w-full bg-[#1f293d]/30 border border-gray-700/50 rounded-xl pl-10 pr-10 py-2.5 text-sm cursor-pointer flex items-center transition-all border-gray-700/50 focus-within:border-cyan-500"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              
              <span className={userType ? "text-white font-medium" : "text-gray-500"}>
                {userType ? userType : "Selecione o tipo de usuário"}
              </span>

              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>

            {isDropdownOpen && (
              <div className="absolute z-50 w-full mt-1.5 bg-[#0f1626] border border-gray-800 rounded-xl p-1.5 shadow-2xl space-y-1">
                <div
                  onClick={() => {
                    setUserType("Gestor");
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm font-semibold rounded-lg cursor-pointer transition-all ${
                    userType === "Gestor" 
                      ? "bg-[#e2e8f0] text-[#0f172a]" 
                      : "text-gray-300 hover:bg-[#1f293d]/50"
                  }`}
                >
                  Gestor
                </div>

                <div
                  onClick={() => {
                    setUserType("Técnico");
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm font-semibold rounded-lg cursor-pointer transition-all ${
                    userType === "Técnico" 
                      ? "bg-[#e2e8f0] text-[#0f172a]" 
                      : "text-gray-300 hover:bg-[#1f293d]/50"
                  }`}
                >
                  Técnico
                </div>
              </div>
            )}
          </div>

          {/* 5. Senha */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Senha</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1f293d]/30 border border-gray-700/50 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
                required
              />
            </div>
          </div>

          {/* 6. Confirmar Senha */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Confirmar Senha</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type="password"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#1f293d]/30 border border-gray-700/50 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
                required
              />
            </div>
          </div>

          {/* Botão Criar Conta */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0099c4] hover:bg-[#00aedc] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.99] text-sm tracking-wide disabled:opacity-50 mt-4"
          >
            {loading ? "Criando..." : "Criar Conta"}
          </button>
        </form>

        {/* Link Voltar para Login */}
        <div className="text-center pt-5 border-t border-gray-800/50 mt-5 select-none">
          <button 
            onClick={onNavigateToLogin} 
            className="text-xs font-bold text-gray-400 hover:text-white flex items-center justify-center space-x-2 mx-auto bg-transparent border-0 cursor-pointer p-0 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Voltar para Login</span>
          </button>
        </div>

      </div>

      {/* 📅 RODAPÉ */}
      <p className="text-[10px] text-gray-600 tracking-wide mt-6 select-none">
        © 2026 FIXER. Todos os direitos reservados.
      </p>
    </div>
  );
}