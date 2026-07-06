import { useState, useEffect } from "react";
import type { ElementType } from "react";
import { useSearchParams } from "react-router";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
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
  ClipboardList,
  Clock,
  CheckCircle2,
  X,
  Sparkles,
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
    <Badge
      className={`${sc.bg} border ${sc.color} rounded-full px-3 py-1 text-xs font-bold`}
    >
      <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${sc.dot}`} />
      {sc.label}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const pc = PRIORITY_CONFIG[priority];

  return (
    <Badge
      className={`${pc.bg} border ${pc.color} rounded-full px-3 py-1 text-xs font-bold`}
    >
      {pc.label}
    </Badge>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: ElementType;
  tone: "cyan" | "amber" | "emerald" | "red";
}) {
  const tones = {
    cyan: {
      bg: "bg-cyan-500/10",
      text: "text-cyan-400",
      border: "border-cyan-500/20",
    },
    amber: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/20",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
    },
    red: {
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/20",
    },
  };

  const current = tones[tone];

  return (
    <Card className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/10 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {label}
          </p>

          <p className={`mt-2 text-3xl font-black ${current.text}`}>
            {value}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${current.border} ${current.bg}`}
        >
          <Icon className={`h-5 w-5 ${current.text}`} />
        </div>
      </div>
    </Card>
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

  const gestorActions: Record<
    OrderStatus,
    { label: string; action: string; icon: ElementType; cls: string }[]
  > = {
    rascunho: [
      {
        label: "Enviar para Validação",
        action: "send_validation",
        icon: Send,
        cls: "bg-blue-600 hover:bg-blue-500 text-white",
      },
      {
        label: "Cancelar Ordem",
        action: "cancel",
        icon: FlagOff,
        cls: "bg-slate-800 hover:bg-red-600/80 text-slate-300 hover:text-white border border-slate-700",
      },
    ],
    em_validacao: [
      {
        label: "Aprovar",
        action: "approve",
        icon: CheckCircle,
        cls: "bg-emerald-600 hover:bg-emerald-500 text-white",
      },
      {
        label: "Reprovar",
        action: "reject",
        icon: XCircle,
        cls: "bg-red-600 hover:bg-red-500 text-white",
      },
    ],
    reprovada: [
      {
        label: "Corrigir e Reenviar",
        action: "reopen",
        icon: RotateCcw,
        cls: "bg-blue-600 hover:bg-blue-500 text-white",
      },
      {
        label: "Cancelar",
        action: "cancel",
        icon: FlagOff,
        cls: "bg-slate-800 hover:bg-red-600/80 text-slate-300 hover:text-white border border-slate-700",
      },
    ],
    aprovada: [
      {
        label: "Cancelar",
        action: "cancel",
        icon: FlagOff,
        cls: "bg-slate-800 hover:bg-red-600/80 text-slate-300 hover:text-white border border-slate-700",
      },
    ],
    em_execucao: [],
    aguardando_encerramento: [
      {
        label: "Encerrar Ordem",
        action: "close",
        icon: Lock,
        cls: "bg-emerald-600 hover:bg-emerald-500 text-white",
      },
    ],
    encerrada: [],
    cancelada: [],
  };

  const actions = gestorActions[order.status] || [];
  const statusConfig = STATUS_CONFIG[order.status];
  const typeLabel = TYPE_CONFIG[order.type]?.label || order.type;

  return (
    <Card className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 hover:border-cyan-500/30 hover:shadow-cyan-950/20 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
      <div className="flex items-center gap-4 px-5 py-5">
        <div
          className={`h-16 w-1.5 shrink-0 rounded-full ${statusConfig.dot}`}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-500">
                  #{order.id.toString().padStart(4, "0")}
                </span>

                <h3 className="truncate text-base font-black text-white [.light_&]:text-slate-900">
                  {order.asset}
                </h3>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Wrench className="h-3.5 w-3.5 text-cyan-400" />
                  {typeLabel}
                </span>

                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-cyan-400" />
                  {order.responsible}
                </span>

                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                  {order.createdAt}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <PriorityBadge priority={order.priority} />
              <StatusBadge status={order.status} />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-slate-500 transition-all hover:bg-slate-800 hover:text-cyan-400 [.light_&]:hover:bg-slate-100"
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-slate-800 bg-slate-950/40 px-5 py-5 [.light_&]:border-slate-200 [.light_&]:bg-slate-50">
          <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 [.light_&]:border-slate-200 [.light_&]:bg-white">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Descrição
                </p>

                <p className="text-sm leading-relaxed text-slate-300 [.light_&]:text-slate-600">
                  {order.description}
                </p>
              </div>

              {order.rejectionReason && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                  <p className="mb-1 flex items-center gap-2 text-xs font-bold text-red-400">
                    <AlertTriangle className="h-4 w-4" />
                    Motivo da Reprovação
                  </p>

                  <p className="text-sm text-red-300">
                    {order.rejectionReason}
                  </p>
                </div>
              )}

              {order.executionNotes && (
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                  <p className="mb-1 flex items-center gap-2 text-xs font-bold text-amber-400">
                    <FileText className="h-4 w-4" />
                    Registro de Execução
                  </p>

                  <p className="text-sm text-amber-300">
                    {order.executionNotes}
                  </p>
                </div>
              )}

              {order.closureNotes && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <p className="mb-1 flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <CheckCircle className="h-4 w-4" />
                    Notas de Encerramento
                  </p>

                  <p className="text-sm text-emerald-300">
                    {order.closureNotes}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 [.light_&]:border-slate-200 [.light_&]:bg-white">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Fluxo da Ordem
                </p>

                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      "rascunho",
                      "em_validacao",
                      "aprovada",
                      "em_execucao",
                      "aguardando_encerramento",
                      "encerrada",
                    ] as OrderStatus[]
                  ).map((status, index, array) => {
                    const sc = STATUS_CONFIG[status];
                    const current = order.status === status;
                    const passed =
                      sc.step < STATUS_CONFIG[order.status].step &&
                      order.status !== "reprovada" &&
                      order.status !== "cancelada";

                    return (
                      <div key={status} className="flex items-center gap-1">
                        <div
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-bold transition-all ${
                            current
                              ? `${sc.bg} ${sc.color} border-current`
                              : passed
                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                : "border-slate-700 bg-slate-800/60 text-slate-500 [.light_&]:border-slate-200 [.light_&]:bg-slate-100"
                          }`}
                        >
                          {sc.label}
                        </div>

                        {index < array.length - 1 && (
                          <span className="text-[10px] text-slate-600">→</span>
                        )}
                      </div>
                    );
                  })}

                  {(order.status === "reprovada" ||
                    order.status === "cancelada") && (
                    <div
                      className={`mt-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${STATUS_CONFIG[order.status].bg} ${STATUS_CONFIG[order.status].color}`}
                    >
                      {STATUS_CONFIG[order.status].label}
                    </div>
                  )}
                </div>
              </div>

              {actions.length > 0 ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 [.light_&]:border-slate-200 [.light_&]:bg-white">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Ações disponíveis
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {actions.map((action) => (
                      <Button
                        key={action.action}
                        size="sm"
                        className={`rounded-xl text-xs font-bold ${action.cls}`}
                        onClick={() => onAction(order, action.action)}
                      >
                        <action.icon className="mr-1.5 h-3.5 w-3.5" />
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs italic text-slate-500 [.light_&]:border-slate-200 [.light_&]:bg-white">
                  {order.status === "em_execucao" &&
                    "Técnico em execução — aguarde a conclusão para encerrar."}
                  {(order.status === "encerrada" ||
                    order.status === "cancelada") &&
                    "Ordem finalizada. Nenhuma ação disponível."}
                  {order.status !== "em_execucao" &&
                    order.status !== "encerrada" &&
                    order.status !== "cancelada" &&
                    "Nenhuma ação disponível neste momento."}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export function GestorOrdens() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [showNewOrder, setShowNewOrder] = useState(false);

  const [actionDialog, setActionDialog] = useState<{
    order: Order | null;
    action: string;
  }>({ order: null, action: "" });

  const [rejectReason, setRejectReason] = useState("");
  const [closureNotes, setClosureNotes] = useState("");
  const [closureAssetStatus, setClosureAssetStatus] = useState<string>("");

  const [dbAssets, setDbAssets] = useState<any[]>([]);
  const [dbTechnicians, setDbTechnicians] = useState<any[]>([]);

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
      supabase.from("profiles").select("name").eq("role", "tecnico"),
    ]);

    setOrders(ordersData);

    if (assetsRes.data) setDbAssets(assetsRes.data);
    if (techsRes.data) setDbTechnicians(techsRes.data);

    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setShowNewOrder(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const refreshOrders = () => loadOrders();

  const countByStatus = (status: string) =>
    status === "all"
      ? orders.length
      : orders.filter((order) => order.status === status).length;

  const totalOrders = orders.length;
  const inExecution = orders.filter(
    (order) => order.status === "em_execucao"
  ).length;
  const closedOrders = orders.filter(
    (order) => order.status === "encerrada"
  ).length;
  const pendingOrders = orders.filter((order) =>
    ["rascunho", "em_validacao", "aguardando_encerramento", "reprovada"].includes(
      order.status
    )
  ).length;

  const filtered = orders.filter((order) => {
    const normalizedSearch = search.toLowerCase().trim();

    const matchTab = activeTab === "all" || order.status === activeTab;

    const matchSearch =
      !normalizedSearch ||
      order.asset.toLowerCase().includes(normalizedSearch) ||
      order.description.toLowerCase().includes(normalizedSearch) ||
      order.responsible.toLowerCase().includes(normalizedSearch) ||
      order.createdAt.toLowerCase().includes(normalizedSearch);

    return matchTab && matchSearch;
  });

  const handleAction = async (order: Order, action: string) => {
    if (action === "approve") {
      await updateOrder(order.id, { status: "aprovada" });
      refreshOrders();
      return;
    }

    if (action === "send_validation") {
      await updateOrder(order.id, { status: "em_validacao" });
      refreshOrders();
      return;
    }

    if (action === "reopen") {
      await updateOrder(order.id, {
        status: "rascunho",
        rejectionReason: undefined,
      });
      refreshOrders();
      return;
    }

    if (action === "reject" || action === "cancel" || action === "close") {
      setActionDialog({ order, action });
      setClosureAssetStatus("");
    }
  };

  const confirmAction = async () => {
    const { order, action } = actionDialog;

    if (!order) return;

    if (action === "reject") {
      await updateOrder(order.id, {
        status: "reprovada",
        rejectionReason: rejectReason || "Reprovada pelo gestor.",
      });
    }

    if (action === "cancel") {
      await updateOrder(order.id, { status: "cancelada" });
    }

    if (action === "close") {
      await updateOrder(order.id, {
        status: "encerrada",
        closureNotes: closureNotes || "Encerrada pelo gestor.",
      });

      if (closureAssetStatus) {
        await supabase
          .from("assets")
          .update({ status: closureAssetStatus })
          .eq("name", order.asset);
      }
    }

    setActionDialog({ order: null, action: "" });
    setRejectReason("");
    setClosureNotes("");
    setClosureAssetStatus("");
    refreshOrders();
  };

  const handleNewOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !newForm.asset ||
      !newForm.type ||
      !newForm.priority ||
      !newForm.description ||
      !newForm.responsible
    ) {
      return;
    }

    await addOrder({
      asset: newForm.asset,
      type: newForm.type as MaintenanceType,
      priority: newForm.priority as Priority,
      description: newForm.description,
      responsible: newForm.responsible,
      status: "rascunho",
    });

    setNewForm({
      asset: "",
      type: "",
      priority: "",
      description: "",
      responsible: "",
    });

    setShowNewOrder(false);
    refreshOrders();
  };

  return (
    <div className="space-y-6 p-8">
      {/* CABEÇALHO DA PÁGINA */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Sparkles className="h-3.5 w-3.5" />
            Gestão operacional
          </div>

          <h1 className="text-3xl font-black text-white [.light_&]:text-slate-900">
            Ordens de Manutenção
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Gerencie, filtre e acompanhe o ciclo das ordens de manutenção.
          </p>
        </div>

        <Button
          onClick={() => setShowNewOrder(true)}
          className="rounded-2xl bg-[#082f4d] px-5 py-6 text-white shadow-lg shadow-cyan-950/20 hover:bg-[#0b6680]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Ordem
        </Button>
      </div>

      {/* RESUMO */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total de Ordens"
          value={totalOrders}
          icon={ClipboardList}
          tone="cyan"
        />

        <SummaryCard
          label="Em Execução"
          value={inExecution}
          icon={Clock}
          tone="amber"
        />

        <SummaryCard
          label="Encerradas"
          value={closedOrders}
          icon={CheckCircle2}
          tone="emerald"
        />

        <SummaryCard
          label="Requerem Ação"
          value={pendingOrders}
          icon={AlertTriangle}
          tone="red"
        />
      </div>

      {/* BUSCA E FILTROS */}
      <Card className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/10 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

          <Input
            placeholder="Buscar por ativo, descrição, responsável ou data..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-12 rounded-2xl border-slate-700 bg-slate-950 pl-11 pr-11 text-white placeholder:text-slate-600 focus:border-cyan-500 [.light_&]:border-slate-200 [.light_&]:bg-slate-50 [.light_&]:text-slate-900"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full text-slate-500 transition-colors hover:text-cyan-400"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => {
            const count = countByStatus(tab.key);
            const active = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-bold transition-all ${
                  active
                    ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-400 shadow-lg shadow-cyan-950/20"
                    : "border-slate-800 text-slate-500 hover:border-slate-700 hover:bg-slate-800/70 hover:text-slate-300 [.light_&]:border-slate-200 [.light_&]:hover:bg-slate-100"
                }`}
              >
                <Filter className="h-3.5 w-3.5" />
                {tab.label}

                {count > 0 && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                      active
                        ? "bg-cyan-500/25 text-cyan-300"
                        : "bg-slate-800 text-slate-400 [.light_&]:bg-slate-100"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* LISTA */}
      {loading ? (
        <Card className="rounded-3xl border border-slate-800 bg-slate-900 p-12 text-center text-slate-400 [.light_&]:border-slate-200 [.light_&]:bg-white">
          Carregando ordens de manutenção...
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="rounded-3xl border border-slate-800 bg-slate-900 p-12 text-center [.light_&]:border-slate-200 [.light_&]:bg-white">
          <FileText className="mx-auto mb-3 h-10 w-10 text-slate-700" />
          <p className="font-bold text-slate-400">Nenhuma ordem encontrada</p>
          <p className="mt-1 text-sm text-slate-500">
            Ajuste os filtros ou crie uma nova ordem de manutenção.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} onAction={handleAction} />
          ))}
        </div>
      )}

      {/* DIALOG DE AÇÃO */}
      <Dialog
        open={!!actionDialog.order}
        onOpenChange={() => setActionDialog({ order: null, action: "" })}
      >
        <DialogContent className="max-w-md rounded-3xl border-slate-700 bg-slate-900 text-white [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:text-slate-900">
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action === "reject" && "Reprovar Ordem"}
              {actionDialog.action === "cancel" && "Cancelar Ordem"}
              {actionDialog.action === "close" && "Encerrar Ordem"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {actionDialog.order && (
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 [.light_&]:border-slate-200 [.light_&]:bg-slate-50">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Ordem
                </p>

                <p className="mt-1 text-sm font-bold text-white [.light_&]:text-slate-900">
                  #{actionDialog.order.id.toString().padStart(4, "0")} ·{" "}
                  {actionDialog.order.asset}
                </p>
              </div>
            )}

            {actionDialog.action === "reject" && (
              <div className="space-y-2">
                <Label className="text-sm text-slate-300 [.light_&]:text-slate-700">
                  Motivo da Reprovação *
                </Label>

                <Textarea
                  placeholder="Descreva o motivo da reprovação..."
                  value={rejectReason}
                  onChange={(event) => setRejectReason(event.target.value)}
                  className="resize-none rounded-2xl border-slate-700 bg-slate-950 text-white placeholder:text-slate-600 [.light_&]:border-slate-200 [.light_&]:bg-slate-50 [.light_&]:text-slate-900"
                  rows={3}
                />
              </div>
            )}

            {actionDialog.action === "close" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm text-slate-300 [.light_&]:text-slate-700">
                    Atualizar Status do Ativo
                  </Label>

                  <Select
                    value={closureAssetStatus}
                    onValueChange={setClosureAssetStatus}
                  >
                    <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950 text-white [.light_&]:border-slate-200 [.light_&]:bg-slate-50 [.light_&]:text-slate-900">
                      <SelectValue placeholder="Mantenha o status atual ou escolha um novo" />
                    </SelectTrigger>

                    <SelectContent className="border-slate-700 bg-slate-900">
                      <SelectItem value="operational" className="text-white">
                        Operacional
                      </SelectItem>
                      <SelectItem value="unavailable" className="text-white">
                        Indisponível
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-slate-300 [.light_&]:text-slate-700">
                    Notas de Encerramento
                  </Label>

                  <Textarea
                    placeholder="Observações do encerramento..."
                    value={closureNotes}
                    onChange={(event) => setClosureNotes(event.target.value)}
                    className="resize-none rounded-2xl border-slate-700 bg-slate-950 text-white placeholder:text-slate-600 [.light_&]:border-slate-200 [.light_&]:bg-slate-50 [.light_&]:text-slate-900"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {actionDialog.action === "cancel" && (
              <p className="text-sm text-slate-400 [.light_&]:text-slate-600">
                Tem certeza que deseja cancelar esta ordem? Esta ação não pode
                ser desfeita.
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setActionDialog({ order: null, action: "" })}
              className="rounded-2xl border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:text-slate-700"
            >
              Voltar
            </Button>

            <Button
              onClick={confirmAction}
              className={`rounded-2xl text-white ${
                actionDialog.action === "close"
                  ? "bg-emerald-600 hover:bg-emerald-500"
                  : actionDialog.action === "reject"
                    ? "bg-red-600 hover:bg-red-500"
                    : "bg-red-700 hover:bg-red-600"
              }`}
            >
              {actionDialog.action === "reject" && "Confirmar Reprovação"}
              {actionDialog.action === "cancel" && "Confirmar Cancelamento"}
              {actionDialog.action === "close" && "Encerrar Ordem"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG NOVA ORDEM */}
      <Dialog open={showNewOrder} onOpenChange={setShowNewOrder}>
        <DialogContent className="max-w-xl rounded-3xl border-slate-700 bg-slate-900 text-white [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:text-slate-900">
          <DialogHeader>
            <DialogTitle>Nova Ordem de Manutenção</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleNewOrder} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-sm text-slate-300 [.light_&]:text-slate-700">
                Ativo *
              </Label>

              <Select
                value={newForm.asset}
                onValueChange={(value) =>
                  setNewForm((form) => ({ ...form, asset: value }))
                }
              >
                <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950 text-white [.light_&]:border-slate-200 [.light_&]:bg-slate-50 [.light_&]:text-slate-900">
                  <SelectValue placeholder="Selecione o ativo" />
                </SelectTrigger>

                <SelectContent className="border-slate-700 bg-slate-900">
                  {dbAssets.length === 0 ? (
                    <SelectItem
                      value="none"
                      disabled
                      className="text-slate-400"
                    >
                      Nenhum ativo cadastrado
                    </SelectItem>
                  ) : (
                    dbAssets.map((asset) => (
                      <SelectItem
                        key={asset.name}
                        value={asset.name}
                        textValue={asset.name}
                        className="text-white hover:bg-slate-700"
                      >
                        <div className="flex items-center gap-2">
                          <span>{asset.name}</span>
                          <span
                            className={`h-2 w-2 shrink-0 rounded-full ${
                              asset.status === "operational"
                                ? "bg-emerald-500"
                                : asset.status === "unavailable"
                                  ? "bg-red-500"
                                  : "bg-amber-500"
                            }`}
                          />
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm text-slate-300 [.light_&]:text-slate-700">
                  Tipo *
                </Label>

                <Select
                  value={newForm.type}
                  onValueChange={(value) =>
                    setNewForm((form) => ({
                      ...form,
                      type: value as MaintenanceType,
                    }))
                  }
                >
                  <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950 text-white [.light_&]:border-slate-200 [.light_&]:bg-slate-50 [.light_&]:text-slate-900">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>

                  <SelectContent className="border-slate-700 bg-slate-900">
                    <SelectItem value="preventiva" className="text-white">
                      Preventiva
                    </SelectItem>
                    <SelectItem value="corretiva" className="text-white">
                      Corretiva
                    </SelectItem>
                    <SelectItem value="preditiva" className="text-white">
                      Preditiva
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-slate-300 [.light_&]:text-slate-700">
                  Prioridade *
                </Label>

                <Select
                  value={newForm.priority}
                  onValueChange={(value) =>
                    setNewForm((form) => ({
                      ...form,
                      priority: value as Priority,
                    }))
                  }
                >
                  <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950 text-white [.light_&]:border-slate-200 [.light_&]:bg-slate-50 [.light_&]:text-slate-900">
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>

                  <SelectContent className="border-slate-700 bg-slate-900">
                    <SelectItem value="baixa" className="text-white">
                      Baixa
                    </SelectItem>
                    <SelectItem value="media" className="text-white">
                      Média
                    </SelectItem>
                    <SelectItem value="alta" className="text-white">
                      Alta
                    </SelectItem>
                    <SelectItem value="critica" className="text-white">
                      Crítica
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-slate-300 [.light_&]:text-slate-700">
                Responsável Técnico *
              </Label>

              <Select
                value={newForm.responsible}
                onValueChange={(value) =>
                  setNewForm((form) => ({ ...form, responsible: value }))
                }
              >
                <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950 text-white [.light_&]:border-slate-200 [.light_&]:bg-slate-50 [.light_&]:text-slate-900">
                  <SelectValue placeholder="Selecione o técnico" />
                </SelectTrigger>

                <SelectContent className="border-slate-700 bg-slate-900">
                  {dbTechnicians.length === 0 ? (
                    <SelectItem
                      value="none"
                      disabled
                      className="text-slate-400"
                    >
                      Nenhum técnico cadastrado
                    </SelectItem>
                  ) : (
                    dbTechnicians.map((technician) => (
                      <SelectItem
                        key={technician.name}
                        value={technician.name}
                        className="text-white hover:bg-slate-700"
                      >
                        {technician.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-slate-300 [.light_&]:text-slate-700">
                Descrição *
              </Label>

              <Textarea
                placeholder="Descreva o serviço a ser realizado..."
                value={newForm.description}
                onChange={(event) =>
                  setNewForm((form) => ({
                    ...form,
                    description: event.target.value,
                  }))
                }
                className="resize-none rounded-2xl border-slate-700 bg-slate-950 text-white placeholder:text-slate-600 [.light_&]:border-slate-200 [.light_&]:bg-slate-50 [.light_&]:text-slate-900"
                rows={3}
                required
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewOrder(false)}
                className="rounded-2xl border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:text-slate-700"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                className="rounded-2xl bg-cyan-600 text-white hover:bg-cyan-500"
              >
                Criar Rascunho
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
