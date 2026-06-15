import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface StateFlowDiagramProps {
  currentStatus?: string;
}

const statusConfig = {
  criada: { label: "Criar ordem", color: "bg-slate-700 text-white" },
  em_validacao: { label: "Em Validação", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  aprovada: { label: "Aprovada", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  reprovada: { label: "Reprovada", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  em_execucao: { label: "Em Execução", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  aguardando_teste: { label: "Aguardando Testes", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  encerrada: { label: "Encerrada", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  cancelada: { label: "Cancelada", color: "bg-slate-500/20 text-slate-400 border-slate-500/30" },
};

export function StateFlowDiagram({ currentStatus }: StateFlowDiagramProps) {
  const isActive = (status: string) => currentStatus === status;

  return (
    <Card className="p-6 bg-slate-900 border-slate-800">
      <h3 className="text-white mb-6 text-center">Diagrama de Estado - Ordem de Manutenção</h3>

      <div className="space-y-6">
        {/* Linha 1: Criar → Em Validação → Validar? */}
        <div className="flex items-center justify-center gap-4">
          <Badge
            className={`${statusConfig.criada.color} px-4 py-2 ${
              isActive("criada") ? "ring-2 ring-cyan-400 scale-110" : ""
            } transition-all`}
          >
            1. Criar ordem
          </Badge>
          <div className="text-slate-500">→</div>
          <Badge
            className={`${statusConfig.em_validacao.color} border px-4 py-2 ${
              isActive("em_validacao") ? "ring-2 ring-cyan-400 scale-110" : ""
            } transition-all`}
          >
            2. Em Validação
          </Badge>
          <div className="text-slate-500">→</div>
          <div className="text-sm text-slate-400 border border-slate-700 rounded px-3 py-2">
            Validar?
          </div>
        </div>

        {/* Linha 2: Ramificações Sim/Não */}
        <div className="flex items-start justify-center gap-12">
          {/* Ramificação SIM */}
          <div className="flex flex-col items-center gap-4">
            <div className="text-sm text-emerald-400">↓ Sim</div>
            <Badge
              className={`${statusConfig.aprovada.color} border px-4 py-2 ${
                isActive("aprovada") ? "ring-2 ring-cyan-400 scale-110" : ""
              } transition-all`}
            >
              3. Aprovada
            </Badge>
            <div className="text-slate-500">↓</div>
            <Badge
              className={`${statusConfig.em_execucao.color} border px-4 py-2 ${
                isActive("em_execucao") ? "ring-2 ring-cyan-400 scale-110" : ""
              } transition-all`}
            >
              5. Em Execução
            </Badge>
            <div className="text-slate-500">↓</div>
            <Badge
              className={`${statusConfig.aguardando_teste.color} border px-4 py-2 ${
                isActive("aguardando_teste") ? "ring-2 ring-cyan-400 scale-110" : ""
              } transition-all`}
            >
              6. Aguardando Testes
            </Badge>
            <div className="text-slate-500">↓</div>
            <Badge
              className={`${statusConfig.encerrada.color} border px-4 py-2 ${
                isActive("encerrada") ? "ring-2 ring-cyan-400 scale-110" : ""
              } transition-all`}
            >
              7. Encerrada
            </Badge>
          </div>

          {/* Ramificação NÃO */}
          <div className="flex flex-col items-center gap-4">
            <div className="text-sm text-red-400">↓ Não</div>
            <Badge
              className={`${statusConfig.reprovada.color} border px-4 py-2 ${
                isActive("reprovada") ? "ring-2 ring-cyan-400 scale-110" : ""
              } transition-all`}
            >
              4. Reprovada
            </Badge>
            <div className="text-xs text-slate-500 text-center max-w-[120px]">
              (volta para corrigir erro)
            </div>
          </div>
        </div>

        {/* Linha 3: Cancelar (disponível em qualquer estado) */}
        <div className="border-t border-slate-800 pt-6 mt-6">
          <div className="flex items-center justify-center gap-4">
            <div className="text-xs text-slate-500">Cancelar ordem (qualquer estado)</div>
            <div className="text-slate-500">→</div>
            <Badge
              className={`${statusConfig.cancelada.color} border px-4 py-2 ${
                isActive("cancelada") ? "ring-2 ring-cyan-400 scale-110" : ""
              } transition-all`}
            >
              8. Cancelada
            </Badge>
          </div>
        </div>

        {/* Legenda */}
        {currentStatus && (
          <div className="border-t border-slate-800 pt-4 text-center">
            <p className="text-xs text-slate-400">
              Estado atual: <span className="text-cyan-400 font-medium">{statusConfig[currentStatus as keyof typeof statusConfig]?.label}</span>
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
