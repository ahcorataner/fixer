import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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
  Plus,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Send,
  AlertTriangle,
  RotateCcw,
  FlagOff,
  Lock,
  FileText,
  Calendar,
  User,
  Wrench,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import {
  fetchOrders,
  addOrder,
  updateOrder,
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  TYPE_CONFIG,
  type Order,
  type OrderStatus,
  type Priority,
  type MaintenanceType,
} from "../lib/ordersStore";

const STATUS_TABS: { key: string; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "rascunho", label: "Rascunho" },
  { key: "em_validacao", label: "Em Validação" },
  { key: "aprovada", label: "Aprovadas" },
  { key: "reprovada", label: "Reprovadas" },
  { key: "em_execucao", label: "Em Execução" },
  { key: "aguardando_encerramento", label: "Ag. Encerramento" },
  { key: "encerrada", label: "Encerradas" },
  { key: "cancelada", label: "Canceladas" },
];


interface NewOrderForm {
  asset: string;
  type: MaintenanceType | "";
  priority: Priority | "";
  description: string;
  responsible: string;
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const sc = STATUS_CONFIG[status];
  return (
    <Badge className={`${sc.bg} border ${sc.color} text-xs`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${sc.dot}`} />
      {sc.label}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const pc = PRIORITY_CONFIG[priority];
  return (
    <Badge className={`${pc.bg} border ${pc.color} text-xs`}>{pc.label}</Badge>
  );
}

function OrderCard({
  order,
  onAction,
}: {
  order: Order;
  onAction: (order: Order, action: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const gestorActions: Record<OrderStatus, { label: string; action: string; icon: React.ElementType; cls: string }[]> = {
    rascunho: [
      { label: "Enviar para Validação", action: "send_validation", icon: Send, cls: "bg-blue-600 hover:bg-blue-500 text-white" },
      { label: "Cancelar Ordem", action: "cancel", icon: FlagOff, cls: "bg-slate-700 hover:bg-red-600/80 text-slate-300 hover:text-white border border-slate-600" },
    ],
    em_validacao: [
      { label: "Aprovar", action: "approve", icon: CheckCircle, cls: "bg-green-600 hover:bg-green-500 text-white" },
      { label: "Reprovar", action: "reject", icon: XCircle, cls: "bg-red-600 hover:bg-red-500 text-white" },
    ],
    reprovada: [
      { label: "Corrigir e Reenviar", action: "reopen", icon: RotateCcw, cls: "bg-blue-600 hover:bg-blue-500 text-white" },
      { label: "Cancelar", action: "cancel", icon: FlagOff, cls: "bg-slate-700 hover:bg-red-600/80 text-slate-300 hover:text-white border border-slate-600" },
    ],
    aprovada: [
      { label: "Cancelar", action: "cancel", icon: FlagOff, cls: "bg-slate-700 hover:bg-red-600/80 text-slate-300 hover:text-white border border-slate-600" },
    ],
    em_execucao: [],
    aguardando_encerramento: [
      { label: "Encerrar Ordem", action: "close", icon: Lock, cls: "bg-emerald-600 hover:bg-emerald-500 text-white" },
    ],
    encerrada: [],
    cancelada: [],
  };

  const actions = gestorActions[order.status] || [];

  return (
    <Card className="bg-slate-900 border-slate-800 overflow-hidden transition-shadow hover:border-slate-700">
      {/* Header row */}
      <div className="flex items-center gap-3 px-5 py-4">
        <div className={`w-1 self-stretch rounded-full ${STATUS_CONFIG[order.status].dot}`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <span className="text-xs text-slate-600 font-mono mr-2">#{order.id.toString().padStart(4, "0")}</span>
              <span className="text-sm font-semibold text-white">{order.asset}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <PriorityBadge priority={order.priority} />
              <StatusBadge status={order.status} />
            </div>
          </div>
          <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Wrench className="w-3 h-3" />
              {TYPE_CONFIG[order.type].label}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {order.responsible}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {order.createdAt}
            </span>
          </div>
        </div>

        <button
          onClick={() => setExpanded((x) => !x)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-slate-800 px-5 py-4 space-y-4">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Descrição</p>
            <p className="text-sm text-slate-300">{order.description}</p>
          </div>

          {order.rejectionReason && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-red-400 font-semibold mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Motivo da Reprovação
              </p>
              <p className="text-xs text-red-300">{order.rejectionReason}</p>
            </div>
          )}

          {order.executionNotes && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-xs text-amber-400 font-semibold mb-1 flex items-center gap-1">
                <FileText className="w-3 h-3" /> Registro de Execução
              </p>
              <p className="text-xs text-amber-300">{order.executionNotes}</p>
            </div>
          )}

          {order.closureNotes && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-xs text-emerald-400 font-semibold mb-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Notas de Encerramento
              </p>
              <p className="text-xs text-emerald-300">{order.closureNotes}</p>
            </div>
          )}

          {/* State flow visual */}
          <div className="flex items-center gap-1 flex-wrap">
            {(
              [
                "rascunho",
                "em_validacao",
                "aprovada",
                "em_execucao",
                "aguardando_encerramento",
                "encerrada",
              ] as OrderStatus[]
            ).map((s, i, arr) => {
              const sc = STATUS_CONFIG[s];
              const current = order.status === s;
              const passed =
                sc.step < STATUS_CONFIG[order.status].step &&
                order.status !== "reprovada" &&
                order.status !== "cancelada";
              return (
                <div key={s} className="flex items-center gap-1">
                  <div
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${current
                      ? `${sc.bg} border ${sc.color} ring-1 ring-offset-1 ring-offset-slate-900`
                      : passed
                        ? "bg-slate-800 text-emerald-400/60 border border-emerald-500/20"
                        : "bg-slate-800/50 text-slate-600 border border-slate-800"
                      }`}
                  >
                    {sc.label}
                  </div>
                  {i < arr.length - 1 && (
                    <span className="text-slate-700 text-[10px]">→</span>
                  )}
                </div>
              );
            })}
            {(order.status === "reprovada" || order.status === "cancelada") && (
              <div className="flex items-center gap-1">
                <span className="text-slate-700 text-[10px]">|</span>
                <div
                  className={`px-2 py-0.5 rounded text-[10px] font-medium ${STATUS_CONFIG[order.status].bg} border ${STATUS_CONFIG[order.status].color}`}
                >
                  {STATUS_CONFIG[order.status].label}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          {actions.length > 0 && (
            <div className="flex gap-2 pt-1 flex-wrap">
              {actions.map((a) => (
                <Button
                  key={a.action}
                  size="sm"
                  className={`text-xs ${a.cls}`}
                  onClick={() => onAction(order, a.action)}
                >
                  <a.icon className="w-3.5 h-3.5 mr-1.5" />
                  {a.label}
                </Button>
              ))}
            </div>
          )}

          {order.status === "em_execucao" && (
            <p className="text-xs text-slate-600 italic">
              Técnico em execução — aguarde a conclusão para encerrar.
            </p>
          )}
          {(order.status === "encerrada" || order.status === "cancelada") && (
            <p className="text-xs text-slate-600 italic">
              Ordem finalizada. Nenhuma ação disponível.
            </p>
          )}
        </div>
      )}
    </Card>
  );
}

export function GestorOrdens() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [showNewOrder, setShowNewOrder] = useState(false);

  // Action dialog states
  const [actionDialog, setActionDialog] = useState<{
    order: Order | null;
    action: string;
  }>({ order: null, action: "" });
  const [rejectReason, setRejectReason] = useState("");
  const [closureNotes, setClosureNotes] = useState("");
  const [closureAssetStatus, setClosureAssetStatus] = useState<string>("");

  const [dbAssets, setDbAssets] = useState<any[]>([]);
  const [dbTechnicians, setDbTechnicians] = useState<any[]>([]);

  // New order form
  const [newForm, setNewForm] = useState<NewOrderForm>({
    asset: "",
    type: "",
    priority: "",
    description: "",
    responsible: "",
  });

  const loadOrders = async () => {
    setLoading(true);
    const [ordersData, assetsRes, techsRes] = await Promise.all([
      fetchOrders(),
      supabase.from("assets").select("name, status"),
      supabase.from("profiles").select("name").eq("role", "tecnico")
    ]);
    setOrders(ordersData);
    if (assetsRes.data) setDbAssets(assetsRes.data);
    if (techsRes.data) setDbTechnicians(techsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const refreshOrders = () => loadOrders();

  const filtered = orders.filter((o) => {
    const matchTab = activeTab === "all" || o.status === activeTab;
    const matchSearch =
      !search ||
      o.asset.toLowerCase().includes(search.toLowerCase()) ||
      o.description.toLowerCase().includes(search.toLowerCase()) ||
      o.responsible.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const handleAction = async (order: Order, action: string) => {
    if (action === "approve") {
      await updateOrder(order.id, { status: "aprovada" });
      refreshOrders();
    } else if (action === "send_validation") {
      await updateOrder(order.id, { status: "em_validacao" });
      refreshOrders();
    } else if (action === "reopen") {
      await updateOrder(order.id, { status: "rascunho", rejectionReason: undefined });
      refreshOrders();
    } else if (action === "reject" || action === "cancel" || action === "close") {
      setActionDialog({ order, action });
      setClosureAssetStatus(""); // Reseta o status para não vir preenchido
    }
  };

  const confirmAction = async () => {
    const { order, action } = actionDialog;
    if (!order) return;

    if (action === "reject") {
      await updateOrder(order.id, { status: "reprovada", rejectionReason: rejectReason || "Reprovada pelo gestor." });
    } else if (action === "cancel") {
      await updateOrder(order.id, { status: "cancelada" });
    } else if (action === "close") {
      await updateOrder(order.id, { status: "encerrada", closureNotes: closureNotes || "Encerrada pelo gestor." });
      if (closureAssetStatus) {
        await supabase.from("assets").update({ status: closureAssetStatus }).eq("name", order.asset);
      }
    }

    setActionDialog({ order: null, action: "" });
    setRejectReason("");
    setClosureNotes("");
    refreshOrders();
  };

  const handleNewOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.asset || !newForm.type || !newForm.priority || !newForm.description || !newForm.responsible) return;

    await addOrder({
      asset: newForm.asset,
      type: newForm.type as MaintenanceType,
      priority: newForm.priority as Priority,
      description: newForm.description,
      responsible: newForm.responsible,
      status: "rascunho",
    });

    setNewForm({ asset: "", type: "", priority: "", description: "", responsible: "" });
    setShowNewOrder(false);
    refreshOrders();
  };

  const countByStatus = (s: string) =>
    s === "all" ? orders.length : orders.filter((o) => o.status === s).length;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold text-white">Ordens de Manutenção</h1>
          <p className="text-sm text-slate-500 mt-0.5">Gerencie e acompanhe todas as ordens</p>
        </div>
        <Button
          onClick={() => setShowNewOrder(true)}
          className="bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Ordem
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Buscar por ativo, descrição ou responsável..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-600 focus:border-cyan-500"
        />
      </div>

      {/* Status tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {STATUS_TABS.map((tab) => {
          const count = countByStatus(tab.key);
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${active
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent"
                }`}
            >
              <Filter className="w-3 h-3" />
              {tab.label}
              {count > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${active ? "bg-cyan-500/30 text-cyan-300" : "bg-slate-700 text-slate-400"
                    }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Orders list */}
      {loading ? (
        <Card className="p-12 bg-slate-900 border-slate-800 text-center text-slate-400">
          Carregando ordens de manutenção...
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-12 bg-slate-900 border-slate-800 text-center">
          <FileText className="w-10 h-10 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500">Nenhuma ordem encontrada</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <OrderCard key={o.id} order={o} onAction={handleAction} />
          ))}
        </div>
      )}

      {/* Action confirmation dialog */}
      <Dialog
        open={!!actionDialog.order}
        onOpenChange={() => setActionDialog({ order: null, action: "" })}
      >
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">
              {actionDialog.action === "reject" && "Reprovar Ordem"}
              {actionDialog.action === "cancel" && "Cancelar Ordem"}
              {actionDialog.action === "close" && "Encerrar Ordem"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {actionDialog.order && (
              <div className="p-3 bg-slate-800 rounded-lg">
                <p className="text-xs text-slate-500">Ordem</p>
                <p className="text-sm text-white font-medium">
                  #{actionDialog.order.id.toString().padStart(4, "0")} · {actionDialog.order.asset}
                </p>
              </div>
            )}

            {actionDialog.action === "reject" && (
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">Motivo da Reprovação *</Label>
                <Textarea
                  placeholder="Descreva o motivo da reprovação..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 resize-none"
                  rows={3}
                />
              </div>
            )}

            {actionDialog.action === "close" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">Atualizar Status do Ativo</Label>
                  <Select
                    value={closureAssetStatus}
                    onValueChange={setClosureAssetStatus}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Mantenha o status atual ou escolha um novo" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="operational" className="text-white">Operacional</SelectItem>
                      <SelectItem value="unavailable" className="text-white">Indisponível</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">Notas de Encerramento</Label>
                  <Textarea
                    placeholder="Observações do encerramento (opcional)..."
                    value={closureNotes}
                    onChange={(e) => setClosureNotes(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 resize-none"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {actionDialog.action === "cancel" && (
              <p className="text-sm text-slate-400">
                Tem certeza que deseja cancelar esta ordem? Esta ação não pode ser desfeita.
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setActionDialog({ order: null, action: "" })}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              Voltar
            </Button>
            <Button
              onClick={confirmAction}
              className={
                actionDialog.action === "close"
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                  : actionDialog.action === "reject"
                    ? "bg-red-600 hover:bg-red-500 text-white"
                    : "bg-red-700 hover:bg-red-600 text-white"
              }
            >
              {actionDialog.action === "reject" && "Confirmar Reprovação"}
              {actionDialog.action === "cancel" && "Confirmar Cancelamento"}
              {actionDialog.action === "close" && "Encerrar Ordem"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New order dialog */}
      <Dialog open={showNewOrder} onOpenChange={setShowNewOrder}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Nova Ordem de Manutenção</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleNewOrder} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">Ativo *</Label>
              <Select
                value={newForm.asset}
                onValueChange={(v) => setNewForm((f) => ({ ...f, asset: v }))}
                required
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Selecione o ativo" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {dbAssets.length === 0 ? (
                    <SelectItem value="none" disabled className="text-slate-400">Nenhum ativo cadastrado</SelectItem>
                  ) : dbAssets.map((a) => (
                    <SelectItem key={a.name} value={a.name} textValue={a.name} className="text-white hover:bg-slate-700">
                      <div className="flex items-center gap-2">
                        <span>{a.name}</span>
                        <div
                          className={`w-2 h-2 rounded-full shrink-0 ${a.status === "operational"
                              ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                              : a.status === "unavailable"
                                ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                                : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                            }`}
                          title={
                            a.status === "operational"
                              ? "Operacional"
                              : a.status === "unavailable"
                                ? "Indisponível"
                                : "Em Manutenção"
                          }
                        />
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">Tipo *</Label>
                <Select
                  value={newForm.type}
                  onValueChange={(v) => setNewForm((f) => ({ ...f, type: v as MaintenanceType }))}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="preventiva" className="text-white">Preventiva</SelectItem>
                    <SelectItem value="corretiva" className="text-white">Corretiva</SelectItem>
                    <SelectItem value="preditiva" className="text-white">Preditiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">Prioridade *</Label>
                <Select
                  value={newForm.priority}
                  onValueChange={(v) => setNewForm((f) => ({ ...f, priority: v as Priority }))}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="baixa" className="text-white">Baixa</SelectItem>
                    <SelectItem value="media" className="text-white">Média</SelectItem>
                    <SelectItem value="alta" className="text-white">Alta</SelectItem>
                    <SelectItem value="critica" className="text-white">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">Responsável Técnico *</Label>
              <Select
                value={newForm.responsible}
                onValueChange={(v) => setNewForm((f) => ({ ...f, responsible: v }))}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Selecione o técnico" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {dbTechnicians.length === 0 ? (
                    <SelectItem value="none" disabled className="text-slate-400">Nenhum técnico cadastrado</SelectItem>
                  ) : dbTechnicians.map((t) => (
                    <SelectItem key={t.name} value={t.name} className="text-white hover:bg-slate-700">
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">Descrição *</Label>
              <Textarea
                placeholder="Descreva o serviço a ser realizado..."
                value={newForm.description}
                onChange={(e) => setNewForm((f) => ({ ...f, description: e.target.value }))}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 resize-none"
                rows={3}
                required
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewOrder(false)}
                className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white">
                Criar Rascunho
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
