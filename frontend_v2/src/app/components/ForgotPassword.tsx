import { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Wrench, Mail, ArrowLeft, CheckCircle } from "lucide-react";

export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
                <Wrench className="w-10 h-10 text-cyan-400" />
              </div>
            </div>
            <h1 className="font-bold text-3xl text-white tracking-wider mb-2">FIXER</h1>
          </div>

          <Card className="p-8 bg-slate-900 border-slate-800 shadow-2xl">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                  <CheckCircle className="w-12 h-12 text-emerald-400" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white">E-mail Enviado!</h2>
              <p className="text-slate-300">
                Enviamos instruções para recuperação de senha para <span className="text-cyan-400">{email}</span>
              </p>
              <p className="text-sm text-slate-400">
                Verifique sua caixa de entrada e spam. O link expira em 24 horas.
              </p>
              <Button
                onClick={() => navigate("/login")}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-500/20 mt-6"
              >
                Voltar para Login
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
              <Wrench className="w-10 h-10 text-cyan-400" />
            </div>
          </div>
          <h1 className="font-bold text-3xl text-white tracking-wider mb-2">FIXER</h1>
          <p className="text-slate-400">Recuperação de Senha</p>
        </div>

        <Card className="p-8 bg-slate-900 border-slate-800 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-2">Esqueceu sua senha?</h2>
            <p className="text-sm text-slate-400">
              Digite seu e-mail e enviaremos instruções para redefinir sua senha.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-500/20"
            >
              Enviar Instruções
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/login")}
              className="text-sm text-slate-400 hover:text-white gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para Login
            </Button>
          </div>
        </Card>

        <div className="mt-6 text-center text-xs text-slate-600">
          © 2026 FIXER. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
}
