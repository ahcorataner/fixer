import { useState } from "react";
import { Link } from "react-router";
import {
  Mail,
  Loader2,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
  LockKeyhole,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleResetPassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/login",
    });

    setLoading(false);

    if (error) {
      setErrorMessage(
        "Não foi possível enviar as instruções. Verifique o e-mail informado."
      );
      return;
    }

    setSuccessMessage(
      "Enviamos as instruções de recuperação para o e-mail informado."
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] px-6 py-8 text-white">
      {/* FUNDO DECORATIVO */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-0 top-0 h-[520px] w-[520px] rounded-full bg-blue-700/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[420px] w-[420px] rounded-full bg-teal-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/40 backdrop-blur-xl lg:grid-cols-[1fr_1fr]">
          {/* LADO ESQUERDO */}
          <section className="relative hidden min-h-[680px] overflow-hidden bg-white px-14 py-12 text-slate-900 lg:flex lg:flex-col lg:justify-between">
            <div className="absolute -left-24 -top-24 h-[520px] w-[520px] rounded-full border border-cyan-300/50" />
            <div className="absolute -left-8 top-20 h-[480px] w-[480px] rounded-full border border-blue-200" />
            <div className="absolute -bottom-36 right-0 h-[420px] w-[420px] rounded-full border border-cyan-300/60" />

            <div className="relative z-10">
              <div className="mb-14 inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-sm font-bold text-cyan-700">
                <Sparkles className="h-4 w-4" />
                Recuperação segura de acesso
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-10 flex h-44 w-96 items-center justify-center">
                  <img
                    src="/fixer.png"
                    alt="Fixer"
                    className="max-h-full max-w-full object-contain drop-shadow-2xl"
                  />
                </div>

                <h1 className="max-w-xl text-4xl font-black uppercase tracking-[0.18em] text-[#071a2c]">
                  Segurança e Continuidade Operacional
                </h1>

                <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-500">
                  Recupere o acesso à plataforma FIXER e continue acompanhando
                  ativos, ordens de manutenção, histórico e indicadores.
                </p>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-4">
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5 shadow-sm">
                <KeyRound className="mb-3 h-6 w-6 text-cyan-600" />
                <p className="text-sm font-extrabold text-slate-800">
                  Recuperação
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Redefinição por e-mail
                </p>
              </div>

              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5 shadow-sm">
                <LockKeyhole className="mb-3 h-6 w-6 text-blue-700" />
                <p className="text-sm font-extrabold text-slate-800">
                  Segurança
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Acesso protegido
                </p>
              </div>

              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5 shadow-sm">
                <CheckCircle2 className="mb-3 h-6 w-6 text-emerald-600" />
                <p className="text-sm font-extrabold text-slate-800">
                  Continuidade
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Retorno ao sistema
                </p>
              </div>
            </div>
          </section>

          {/* LADO DIREITO */}
          <section className="relative flex min-h-[680px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#10245f] via-[#134a87] to-[#08798a] px-6 py-12">
            <div className="absolute bottom-[-70px] right-[-20px] select-none text-[15rem] font-black leading-none text-white/5">
              FIX
            </div>

            <div className="absolute right-8 top-8 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-cyan-50 backdrop-blur-md">
              RECUPERAÇÃO
            </div>

            <div className="relative z-10 w-full max-w-md">
              <div className="mb-8 text-center lg:hidden">
                <img
                  src="/fixer.png"
                  alt="Fixer"
                  className="mx-auto mb-5 h-24 object-contain"
                />
                <h1 className="text-2xl font-black uppercase tracking-[0.18em]">
                  Recuperar Senha
                </h1>
              </div>

              <div className="rounded-[2rem] border border-white/20 bg-white/90 p-8 text-slate-900 shadow-2xl shadow-blue-950/30 backdrop-blur-xl">
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#082f4d] to-[#12b7c4] text-white shadow-lg shadow-cyan-900/30">
                    <ShieldCheck className="h-7 w-7" />
                  </div>

                  <h2 className="text-2xl font-black text-slate-900">
                    Esqueceu sua senha?
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Informe seu e-mail e enviaremos as instruções para redefinir
                    sua senha.
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      E-mail
                    </label>

                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="seu@email.com"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                        required
                      />
                    </div>
                  </div>

                  {successMessage && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                      {successMessage}
                    </div>
                  )}

                  {errorMessage && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#082f4d] via-[#0b6680] to-[#12b7c4] px-5 py-4 text-sm font-black text-white shadow-xl shadow-cyan-950/20 transition-all hover:scale-[1.01] hover:shadow-cyan-900/30 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar instruções
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-7 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm font-bold text-cyan-700 transition-colors hover:text-cyan-900"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para Login
                  </Link>
                </div>
              </div>

              <p className="mt-8 text-center text-xs text-cyan-50/80">
                © 2026 FIXER. Sistema Integrado de Gestão de Ativos e
                Manutenção.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}