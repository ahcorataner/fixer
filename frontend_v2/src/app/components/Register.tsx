import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  User,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  BriefcaseBusiness,
  Sparkles,
  Wrench,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

type UserRole = "gestor" | "tecnico";

export function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("gestor@fixer.com");
  const [role, setRole] = useState<UserRole>("gestor");
  const [password, setPassword] = useState("123456");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("As senhas não conferem.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: username || email,
      password,
      options: {
        data: {
          name,
          role,
          email,
        },
      },
    });

    setLoading(false);

    if (error) {
      setErrorMessage("Não foi possível criar a conta. Verifique os dados.");
      return;
    }

    navigate("/login");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] px-6 py-6 text-white">
      {/* FUNDO */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-10 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-blue-700/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[340px] w-[340px] rounded-full bg-teal-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/40 backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">
          {/* LADO ESQUERDO */}
          <section className="relative hidden min-h-[640px] overflow-hidden bg-white px-10 py-8 text-slate-900 lg:flex lg:flex-col lg:justify-between">
            <div className="absolute -left-24 -top-24 h-[440px] w-[440px] rounded-full border border-cyan-300/50" />
            <div className="absolute -left-8 top-20 h-[390px] w-[390px] rounded-full border border-blue-200" />
            <div className="absolute -bottom-32 right-0 h-[340px] w-[340px] rounded-full border border-cyan-300/60" />

            <div className="relative z-10">
              <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-xs font-bold text-cyan-700">
                <Sparkles className="h-4 w-4" />
                Nova conta FIXER
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-8 flex h-36 w-80 items-center justify-center">
                  <img
                    src="/fixer.png"
                    alt="Fixer"
                    className="max-h-full max-w-full object-contain drop-shadow-2xl"
                  />
                </div>

                <h1 className="max-w-lg text-3xl font-black uppercase tracking-[0.18em] text-[#071a2c]">
                  Gestão e Confiabilidade de Ativos
                </h1>

                <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-500">
                  Cadastre usuários gestores ou técnicos para acessar o sistema
                  integrado de manutenção, ativos, histórico e indicadores.
                </p>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-3">
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4 shadow-sm">
                <User className="mb-2 h-5 w-5 text-cyan-600" />
                <p className="text-xs font-extrabold text-slate-800">
                  Usuários
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Acesso por perfil
                </p>
              </div>

              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4 shadow-sm">
                <Wrench className="mb-2 h-5 w-5 text-blue-700" />
                <p className="text-xs font-extrabold text-slate-800">
                  Ordens
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Gestão operacional
                </p>
              </div>

              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4 shadow-sm">
                <CheckCircle2 className="mb-2 h-5 w-5 text-emerald-600" />
                <p className="text-xs font-extrabold text-slate-800">
                  Controle
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Dados seguros
                </p>
              </div>
            </div>
          </section>

          {/* LADO DIREITO */}
          <section className="relative flex min-h-[640px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#10245f] via-[#134a87] to-[#08798a] px-6 py-8">
            <div className="absolute bottom-[-60px] right-[-20px] select-none text-[12rem] font-black leading-none text-white/5">
              FIX
            </div>

            <div className="relative z-10 w-full max-w-xl">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-50 backdrop-blur-md">
                  Cadastro
                </div>
              </div>

              <div className="rounded-[1.8rem] border border-white/20 bg-white/95 p-6 text-slate-900 shadow-2xl shadow-blue-950/30 backdrop-blur-xl">
                <div className="mb-5 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#082f4d] to-[#12b7c4] text-white shadow-lg shadow-cyan-900/30">
                    <ShieldCheck className="h-6 w-6" />
                  </div>

                  <h2 className="text-xl font-black text-slate-900">
                    Criar Nova Conta
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Preencha os dados para cadastrar um novo usuário.
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Nome completo
                      </label>

                      <div className="relative">
                        <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          type="text"
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          placeholder="Digite seu nome"
                          className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Tipo de usuário
                      </label>

                      <div className="relative">
                        <BriefcaseBusiness className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <select
                          value={role}
                          onChange={(event) =>
                            setRole(event.target.value as UserRole)
                          }
                          className="h-11 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-bold text-slate-800 outline-none transition-all focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                        >
                          <option value="gestor">Gestor</option>
                          <option value="tecnico">Técnico</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        E-mail
                      </label>

                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="seu@email.com"
                          className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Usuário de acesso
                      </label>

                      <div className="relative">
                        <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          type="email"
                          value={username}
                          onChange={(event) => setUsername(event.target.value)}
                          placeholder="usuario@fixer.com"
                          className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Senha
                      </label>

                      <div className="relative">
                        <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          placeholder="Digite sua senha"
                          className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-11 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                          required
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword((current) => !current)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Confirmar senha
                      </label>

                      <div className="relative">
                        <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(event) =>
                            setConfirmPassword(event.target.value)
                          }
                          placeholder="Confirme sua senha"
                          className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-11 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                          required
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword((current) => !current)
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#082f4d] via-[#0b6680] to-[#12b7c4] px-5 text-sm font-black text-white shadow-xl shadow-cyan-950/20 transition-all hover:scale-[1.01] hover:shadow-cyan-900/30 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      <>
                        Criar conta
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-5 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm font-bold text-cyan-700 transition-colors hover:text-cyan-900"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para Login
                  </Link>
                </div>
              </div>

              <p className="mt-5 text-center text-xs text-cyan-50/80">
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