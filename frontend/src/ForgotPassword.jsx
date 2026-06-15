import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function ForgotPassword({ onNavigateToLogin }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Função do Supabase para enviar o e-mail de redefinição de senha
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin, // Redireciona de volta para o seu app
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message || "Erro ao enviar instruções. Verifique o e-mail.");
    } else {
      setSuccess("Instruções enviadas com sucesso! Verifique sua caixa de entrada.");
      setEmail("");
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
        <h1 className="text-3xl font-black tracking-widest text-white">FIXER</h1>
        <p className="text-gray-400 text-sm mt-1">Recuperação de Senha</p>
      </div>

      {/* 🗂️ CARD PRINCIPAL CENTRALIZADO */}
      <div className="w-full max-w-md bg-[#111827]/60 border border-gray-800/80 rounded-2xl p-8 shadow-2xl backdrop-blur-sm flex flex-col justify-center min-h-[380px]">
        
        <div className="my-auto space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Esqueceu sua senha?</h2>
            <p className="text-gray-400 text-xs mt-2 leading-relaxed">
              Digite seu e-mail e enviaremos instruções para redefinir sua senha.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg text-center font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg text-center font-medium">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo E-mail */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">E-mail</label>
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

            {/* Botão Enviar Instruções */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0099c4] hover:bg-[#00aedc] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.99] text-sm tracking-wide disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Enviar Instruções"}
            </button>
          </form>

          {/* Botão Voltar para Login */}
          <div className="text-center pt-2 select-none">
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

      </div>

      {/* 📅 RODAPÉ COPYRIGHT */}
      <p className="text-[10px] text-gray-600 tracking-wide mt-8 select-none">
        © 2026 FIXER. Todos os direitos reservados.
      </p>

      {/* Botão flutuante ? */}
      <button className="fixed bottom-4 right-4 w-7 h-7 bg-gray-800 border border-gray-700 text-gray-400 rounded-full flex items-center justify-center text-xs font-semibold hover:text-white hover:border-gray-600 transition-colors">
        ?
      </button>
    </div>
  );
}