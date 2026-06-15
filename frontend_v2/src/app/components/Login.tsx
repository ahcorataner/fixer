import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Lock, User } from "lucide-react";

const DEMO_ACCOUNTS = [
  {
    email: "gestor@fixer.com",
    password: "gestor123",
    name: "Carlos Mendes",
    role: "gestor" as const,
  },
  {
    email: "tecnico@fixer.com",
    password: "tecnico123",
    name: "João Silva",
    role: "tecnico" as const,
  },
];

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("gestor@fixer.com");
  const [password, setPassword] = useState("gestor123");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const account = DEMO_ACCOUNTS.find(
      (a) => a.email === email.trim() && a.password === password
    );

    if (!account) {
      setError("E-mail ou senha inválidos.");
      return;
    }

    localStorage.setItem("fixer_authenticated", "true");
    localStorage.setItem("fixer_role", account.role);
    localStorage.setItem("fixer_user", account.name);

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl min-h-[650px] bg-white rounded-[2rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="relative hidden lg:flex items-center justify-center bg-white p-12">
          <div className="absolute left-0 top-0 h-full w-full overflow-hidden">
            <div className="absolute -left-40 top-10 h-[700px] w-[700px] rounded-full border border-cyan-200/70" />
            <div className="absolute -left-52 top-24 h-[700px] w-[700px] rounded-full border border-blue-200/70" />
            <div className="absolute -left-64 top-38 h-[700px] w-[700px] rounded-full border border-cyan-300/60" />
          </div>

          <div className="relative text-center">
            <img
              src="/fixer.png"
              alt="Logo Fixador"
              className="mx-auto max-w-[420px] object-contain drop-shadow-2xl"
            />
            <h1 className="mt-8 text-3xl font-bold text-slate-800 tracking-widest">
              GESTÃO DE MANUTENÇÃO
            </h1>
            <p className="mt-2 text-slate-500">
              Sistema Integrado de Gestão de Ativos e Manutenção
            </p>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-800 flex items-center justify-center p-8 lg:p-14">
          <div className="absolute right-0 bottom-0 opacity-10 text-[260px] font-black text-white leading-none">
            FIX
          </div>

          <div className="relative w-full max-w-md">
            <div className="lg:hidden text-center mb-8">
              <img
                src="/fixer.png"
                alt="Logo Fixador"
                className="mx-auto max-w-[180px] object-contain"
              />
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8 space-y-5"
            >
              <div className="text-center mb-2">
                <h2 className="text-xl font-bold text-slate-800">
                  Acesso ao Sistema
                </h2>
                <p className="text-sm text-slate-500">
                  Informe suas credenciais para acessar a aplicação
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">
                  E-mail
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-50 border-slate-300 text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-slate-50 border-slate-300 text-slate-800"
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-lg py-2">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white shadow-lg"
              >
                Login
              </Button>

              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="block mx-auto text-xs text-blue-700 hover:text-blue-900"
              >
                Esqueceu sua senha?
              </button>
            </form>

            <div className="text-center mt-6 text-sm text-white/80">
              Não tem uma conta?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-bold text-cyan-200 hover:text-white"
              >
                Registrar-se
              </button>
            </div>

            <p className="text-center mt-6 text-xs text-white/50">
              © 2026 FIXADOR. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}