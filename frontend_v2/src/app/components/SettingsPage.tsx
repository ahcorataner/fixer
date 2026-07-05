import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Bell, Shield, User, Wrench } from "lucide-react";

export function SettingsPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Configurações
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Gerencie preferências do sistema, perfil e segurança.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 p-6 bg-white border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
              <User className="w-5 h-5 text-cyan-600" />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">Perfil do Usuário</h2>
              <p className="text-sm text-slate-500">
                Informações básicas da conta.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-slate-600">Nome</Label>
              <Input
                defaultValue="Gestor Teste"
                className="bg-slate-50 border-slate-300 text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-600">E-mail</Label>
              <Input
                defaultValue="gestor@fixer.com"
                className="bg-slate-50 border-slate-300 text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-600">Cargo</Label>
              <Input
                defaultValue="Gestor"
                className="bg-slate-50 border-slate-300 text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-600">Área</Label>
              <Input
                defaultValue="Manutenção"
                className="bg-slate-50 border-slate-300 text-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button className="bg-[#082f4d] hover:bg-[#0b6680] text-white">
              Salvar Alterações
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-5 bg-white border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-cyan-600" />
              <h3 className="font-bold text-slate-900">Notificações</h3>
            </div>

            <p className="text-sm text-slate-500 mb-4">
              Configure alertas de ordens, ativos críticos e manutenções.
            </p>

            <Button variant="outline" className="w-full border-slate-300">
              Gerenciar
            </Button>
          </Card>

          <Card className="p-5 bg-white border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900">Segurança</h3>
            </div>

            <p className="text-sm text-slate-500 mb-4">
              Alteração de senha e controle de acesso.
            </p>

            <Button variant="outline" className="w-full border-slate-300">
              Ver opções
            </Button>
          </Card>

          <Card className="p-5 bg-white border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Wrench className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-slate-900">Sistema</h3>
            </div>

            <p className="text-sm text-slate-500 mb-4">
              Preferências gerais do Fixer.
            </p>

            <Button variant="outline" className="w-full border-slate-300">
              Configurar
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}