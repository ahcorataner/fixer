import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { StateFlowDiagram } from "./StateFlowDiagram";
import { CheckCircle, XCircle, Play, Pause, Flag } from "lucide-react";

const statusConfig = {
  criada: { label: "Criada", color: "bg-slate-700 text-white", icon: null },
  em_validacao: { label: "Em Validação", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: null },
  aprovada: { label: "Aprovada", color: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle },
  reprovada: { label: "Reprovada", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: XCircle },
  em_execucao: { label: "Em Execução", color: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: Play },
  aguardando_teste: { label: "Aguardando Testes", color: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: Pause },
  encerrada: { label: "Encerrada", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: Flag },
  cancelada: { label: "Cancelada", color: "bg-slate-500/20 text-slate-400 border-slate-500/30", icon: XCircle },
};

interface WorkOrderFlowProps {
  orderId: number;
  currentStatus: string;
  onStatusChange?: (newStatus: string) => void;
}

export function WorkOrderFlow({ orderId, currentStatus, onStatusChange }: WorkOrderFlowProps) {
  const [status, setStatus] = useState(currentStatus);

  const nextActions: Record<string, { action: string; nextStatus: string; color: string }[]> = {
    criada: [
      { action: "Enviar para Validação", nextStatus: "em_validacao", color: "bg-blue-600 hover:bg-blue-700" },
      { action: "Cancelar", nextStatus: "cancelada", color: "bg-red-600 hover:bg-red-700" },
    ],
    em_validacao: [
      { action: "Aprovar", nextStatus: "aprovada", color: "bg-green-600 hover:bg-green-700" },
      { action: "Reprovar", nextStatus: "reprovada", color: "bg-red-600 hover:bg-red-700" },
      { action: "Cancelar", nextStatus: "cancelada", color: "bg-slate-600 hover:bg-slate-700" },
    ],
    reprovada: [
      { action: "Corrigir e Recriar", nextStatus: "criada", color: "bg-blue-600 hover:bg-blue-700" },
      { action: "Cancelar", nextStatus: "cancelada", color: "bg-red-600 hover:bg-red-700" },
    ],
    aprovada: [
      { action: "Iniciar Execução", nextStatus: "em_execucao", color: "bg-amber-600 hover:bg-amber-700" },
      { action: "Cancelar", nextStatus: "cancelada", color: "bg-red-600 hover:bg-red-700" },
    ],
    em_execucao: [
      { action: "Concluir e Testar", nextStatus: "aguardando_teste", color: "bg-purple-600 hover:bg-purple-700" },
      { action: "Cancelar", nextStatus: "cancelada", color: "bg-red-600 hover:bg-red-700" },
    ],
    aguardando_teste: [
      { action: "Aprovar e Encerrar", nextStatus: "encerrada", color: "bg-emerald-600 hover:bg-emerald-700" },
      { action: "Retomar Execução", nextStatus: "em_execucao", color: "bg-amber-600 hover:bg-amber-700" },
      { action: "Cancelar", nextStatus: "cancelada", color: "bg-red-600 hover:bg-red-700" },
    ],
    encerrada: [],
    cancelada: [],
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    onStatusChange?.(newStatus);
  };

  const StatusIcon = statusConfig[status as keyof typeof statusConfig]?.icon;

  return (
    <div className="space-y-6">
      {/* Status Atual */}
      <Card className="p-6 bg-slate-900 border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm text-slate-400 mb-2">Status Atual da Ordem #{orderId}</h3>
            <div className="flex items-center gap-3">
              {StatusIcon && <StatusIcon className="w-6 h-6 text-cyan-400" />}
              <Badge
                className={`${statusConfig[status as keyof typeof statusConfig]?.color} border px-4 py-2 text-base`}
              >
                {statusConfig[status as keyof typeof statusConfig]?.label}
              </Badge>
            </div>
          </div>

          {/* Ações Disponíveis */}
          <div className="flex gap-2">
            {nextActions[status]?.map((action) => (
              <Button
                key={action.nextStatus}
                onClick={() => handleStatusChange(action.nextStatus)}
                className={`${action.color} text-white`}
                size="sm"
              >
                {action.action}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Diagrama de Estado */}
      <StateFlowDiagram currentStatus={status} />

      {/* Mensagem de Estado Final */}
      {(status === "encerrada" || status === "cancelada") && (
        <Card className="p-4 bg-slate-900 border-slate-800">
          <p className="text-center text-slate-400 text-sm">
            {status === "encerrada"
              ? "✅ Esta ordem foi encerrada com sucesso. Nenhuma ação adicional disponível."
              : "❌ Esta ordem foi cancelada. Nenhuma ação adicional disponível."}
          </p>
        </Card>
      )}
    </div>
  );
}
