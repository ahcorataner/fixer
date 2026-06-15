import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import {
  Play,
  CheckCircle,
  ClipboardList,
  History,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Calendar,
  Wrench,
  Clock,
  HardHat,
  RefreshCw,
} from "lucide-react";
import {
  getOrders,
  updateOrder,
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  TYPE_CONFIG,
  getCurrentUser,
  type Order,
  type OrderStatus,
} from "../lib/ordersStore";

const TABS = [
  { key: "pending", label: "Pendentes", icon: AlertCircle },
  { key: "executing", label: "Em Execução", icon: Wrench },
  { key: "history", label: "Histórico", icon: History },
];

function StatusBadge({ status }: { status: OrderStatus }) {
  const sc = STATUS_CONFIG[status];
  return (
    <Badge className={`${sc.bg} border ${sc.color} text-xs`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${sc.dot}`} />
      {sc.label}
    </Badge>
  );
}

function OrderCard({
  order,
  onStartExecution,
  onRegisterMaintenance,
  onConcludeExecution,
}: {
  order: Order;
  onStartExecution?: (order: Order) => void;
  onRegisterMaintenance?: (order: Order) => void;
  onConcludeExecution?: (order: Order) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const pc = PRIORITY_CONFIG[order.priority];

  return (
    <Card className="bg-slate-900 border-slate-800 overflow-hidden hover:border-slate-700 transition-all">
      <div className="flex items-center gap-3 px-5 py-4">
        <div className={`w-1 self-stretch rounded-full ${STATUS_CONFIG[order.status].dot}`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <span className="text-xs text-slate-600 font-mono mr-2">
                #{order.id.toString().padStart(4, "0")}
              </span>
              <span className="text-sm font-semibold text-white">{order.asset}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={`${pc.bg} border ${pc.color} text-xs`}>{pc.label}</Badge>
              <StatusBadge status={order.status} />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Wrench className="w-3 h-3" />
              {TYPE_CONFIG[order.type].label}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {order.createdAt}
            </span>
            {order.updatedAt !== order.createdAt && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Atualizado {order.updatedAt}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => setExpanded((x) => !x)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-slate-800 px-5 py-4 space-y-4">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Descrição do Serviço</p>
            <p className="text-sm text-slate-300">{order.description}</p>
          </div>

          {order.executionNotes && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-xs text-amber-400 font-semibold mb-1 flex items-center gap-1">
                <FileText className="w-3 h-3" /> Registro de Execução
              </p>
              <p className="text-xs text-amber-300 whitespace-pre-line">{order.executionNotes}</p>
            </div>
          )}

          {order.rejectionReason && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-red-400 font-semibold mb-1">Motivo da Reprovação</p>
              <p className="text-xs text-red-300">{order.rejectionReason}</p>
            </div>
          )}

          {order.closureNotes && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-xs text-emerald-400 font-semibold mb-1">Encerramento</p>
              <p className="text-xs text-emerald-300">{order.closureNotes}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 flex-wrap pt-1">
            {order.status === "aprovada" && onStartExecution && (
              <Button
                size="sm"
                className="bg-amber-600 hover:bg-amber-500 text-white text-xs"
                onClick={() => onStartExecution(order)}
              >
                <Play className="w-3.5 h-3.5 mr-1.5" />
                Iniciar Execução
              </Button>
            )}
            {order.status === "em_execucao" && (
              <>
                {onRegisterMaintenance && (
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs"
                    onClick={() => onRegisterMaintenance(order)}
                  >
                    <FileText className="w-3.5 h-3.5 mr-1.5" />
                    Registrar Manutenção
                  </Button>
                )}
                {onConcludeExecution && (
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs"
                    onClick={() => onConcludeExecution(order)}
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                    Concluir Execução
                  </Button>
                )}
              </>
            )}
            {order.status === "aguardando_encerramento" && (
              <p className="text-xs text-slate-500 italic py-1">
                Execução concluída. Aguardando encerramento formal pelo gestor.
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

export function TecnicoOrdens() {
  const user = getCurrentUser();
  const [orders, setOrders] = useState(() => getOrders());
  const [activeTab, setActiveTab] = useState("pending");

  // Registrar manutenção dialog
  const [maintenanceDialog, setMaintenanceDialog] = useState<Order | null>(null);
  const [maintenanceForm, setMaintenanceForm] = useState({
    tipoIntervencao: "",
    descricao: "",
    notas: "",
  });

  // Concluir execução dialog
  const [concludeDialog, setConcludeDialog] = useState<Order | null>(null);
  const [concludeNotes, setConcludeNotes] = useState("");

  const refreshOrders = () => setOrders(getOrders());

  // Filter to orders assigned to this technician
  const myOrders = orders.filter(
    (o) => o.responsible.toLowerCase() === user.name.toLowerCase()
  );

  const tabOrders = {
    pending: myOrders.filter((o) => o.status === "aprovada"),
    executing: myOrders.filter((o) => o.status === "em_execucao" || o.status === "aguardando_encerramento"),
    history: myOrders.filter((o) => o.status === "encerrada" || o.status === "cancelada" || o.status === "reprovada"),
  };

  const currentOrders = tabOrders[activeTab as keyof typeof tabOrders] || [];

  const handleStartExecution = (order: Order) => {
    updateOrder(order.id, { status: "em_execucao" });
    refreshOrders();
    setActiveTab("executing");
  };

  const handleRegisterMaintenance = (order: Order) => {
    setMaintenanceDialog(order);
    setMaintenanceForm({ tipoIntervencao: "", descricao: "", notas: "" });
  };

  const handleConcludeExecution = (order: Order) => {
    setConcludeDialog(order);
    setConcludeNotes("");
  };

  const confirmRegisterMaintenance = () => {
    if (!maintenanceDialog) return;
    const newNote = `[${new Date().toLocaleString("pt-BR")}] ${maintenanceForm.tipoIntervencao}: ${maintenanceForm.descricao}${maintenanceForm.notas ? ` — ${maintenanceForm.notas}` : ""}`;
    const existing = maintenanceDialog.executionNotes ? maintenanceDialog.executionNotes + "\n" : "";
    updateOrder(maintenanceDialog.id, { executionNotes: existing + newNote });
    setMaintenanceDialog(null);
    refreshOrders();
  };

  const confirmConclude = () => {
    if (!concludeDialog) return;
    const existing = concludeDialog.executionNotes ? concludeDialog.executionNotes + "\n" : "";
    const finalNote = concludeNotes
      ? existing + `[Conclusão] ${concludeNotes}`
      : existing.trim() || "Execução concluída pelo técnico.";
    updateOrder(concludeDialog.id, {
      status: "aguardando_encerramento",
      executionNotes: finalNote,
    });
    setConcludeDialog(null);
    refreshOrders();
  };

  const allMy = myOrders.length;
  const inExec = myOrders.filter((o) => o.status === "em_execucao").length;
  const done = myOrders.filter((o) => o.status === "encerrada").length;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white flex items-center gap-2">
            <HardHat className="w-5 h-5 text-amber-400" />
            Minhas Ordens
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {user.name} · Técnico de Manutenção
          </p>
        </div>
        <button
          onClick={refreshOrders}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors p-2 rounded-lg hover:bg-slate-800"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Atualizar
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Minhas Ordens", value: allMy, color: "text-slate-300", bg: "bg-slate-800" },
          { label: "Em Execução", value: inExec, color: "text-amber-400", bg: "bg-amber-500/10 border border-amber-500/20" },
          { label: "Concluídas", value: done, color: "text-emerald-400", bg: "bg-emerald-500/10 border border-emerald-500/20" },
        ].map((s) => (
          <Card key={s.label} className={`p-4 ${s.bg} border-0`}>
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5">
        {TABS.map((tab) => {
          const count = tabOrders[tab.key as keyof typeof tabOrders]?.length ?? 0;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {count > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    active ? "bg-amber-500/30 text-amber-300" : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Orders */}
      {currentOrders.length === 0 ? (
        <Card className="p-12 bg-slate-900 border-slate-800 text-center">
          <ClipboardList className="w-10 h-10 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">
            {activeTab === "pending"
              ? "Nenhuma ordem aguardando execução"
              : activeTab === "executing"
              ? "Nenhuma ordem em execução"
              : "Nenhuma ordem no histórico"}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {currentOrders.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              onStartExecution={handleStartExecution}
              onRegisterMaintenance={handleRegisterMaintenance}
              onConcludeExecution={handleConcludeExecution}
            />
          ))}
        </div>
      )}

      {/* Registrar Manutenção dialog */}
      <Dialog open={!!maintenanceDialog} onOpenChange={() => setMaintenanceDialog(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              Registrar Manutenção
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {maintenanceDialog && (
              <div className="p-3 bg-slate-800 rounded-lg">
                <p className="text-xs text-slate-500">Ordem / Ativo</p>
                <p className="text-sm text-white font-medium">
                  #{maintenanceDialog.id.toString().padStart(4, "0")} · {maintenanceDialog.asset}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">Tipo de Intervenção *</Label>
              <Select
                value={maintenanceForm.tipoIntervencao}
                onValueChange={(v) =>
                  setMaintenanceForm((f) => ({ ...f, tipoIntervencao: v }))
                }
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="Substituição de peça" className="text-white">Substituição de peça</SelectItem>
                  <SelectItem value="Lubrificação" className="text-white">Lubrificação</SelectItem>
                  <SelectItem value="Ajuste/Calibração" className="text-white">Ajuste / Calibração</SelectItem>
                  <SelectItem value="Inspeção" className="text-white">Inspeção</SelectItem>
                  <SelectItem value="Limpeza" className="text-white">Limpeza</SelectItem>
                  <SelectItem value="Reparo elétrico" className="text-white">Reparo elétrico</SelectItem>
                  <SelectItem value="Reparo mecânico" className="text-white">Reparo mecânico</SelectItem>
                  <SelectItem value="Teste funcional" className="text-white">Teste funcional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">Descrição da Atividade *</Label>
              <Textarea
                placeholder="Descreva detalhadamente o que foi realizado..."
                value={maintenanceForm.descricao}
                onChange={(e) =>
                  setMaintenanceForm((f) => ({ ...f, descricao: e.target.value }))
                }
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 resize-none"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">Observações</Label>
              <Textarea
                placeholder="Observações adicionais, peças utilizadas, medições..."
                value={maintenanceForm.notas}
                onChange={(e) =>
                  setMaintenanceForm((f) => ({ ...f, notas: e.target.value }))
                }
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 resize-none"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setMaintenanceDialog(null)}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmRegisterMaintenance}
              disabled={!maintenanceForm.tipoIntervencao || !maintenanceForm.descricao}
              className="bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50"
            >
              Registrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Concluir Execução dialog */}
      <Dialog open={!!concludeDialog} onOpenChange={() => setConcludeDialog(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-purple-400" />
              Concluir Execução
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {concludeDialog && (
              <div className="p-3 bg-slate-800 rounded-lg">
                <p className="text-xs text-slate-500">Ordem / Ativo</p>
                <p className="text-sm text-white font-medium">
                  #{concludeDialog.id.toString().padStart(4, "0")} · {concludeDialog.asset}
                </p>
              </div>
            )}

            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <p className="text-xs text-purple-400 mb-1">
                Ao concluir, a ordem passará para <strong>Aguardando Encerramento</strong>.
              </p>
              <p className="text-xs text-slate-400">
                O gestor será notificado para fazer o encerramento formal.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">Relatório Final de Execução</Label>
              <Textarea
                placeholder="Descreva o resultado final, testes realizados, condição do equipamento..."
                value={concludeNotes}
                onChange={(e) => setConcludeNotes(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 resize-none"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setConcludeDialog(null)}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmConclude}
              className="bg-purple-600 hover:bg-purple-500 text-white"
            >
              Concluir Execução
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
