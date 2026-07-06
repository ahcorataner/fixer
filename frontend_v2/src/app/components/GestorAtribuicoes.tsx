import { useEffect, useMemo, useState } from "react";
import type { ElementType } from "react";
import { useNavigate } from "react-router";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock,
  RefreshCw,
  ShieldAlert,
  UserCheck,
  Users,
  Wrench,
  XCircle,
} from "lucide-react";
import {
  fetchOrders,
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  TYPE_CONFIG,
  type Order,
  type OrderStatus,
} from "../lib/ordersStore";

function getOrderNumber(order: Order) {
  return `#${order.id.toString().padStart(4, "0")}`;
}

function getTodayBR() {
  return new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getPriorityWeight(priority: Order["priority"]) {
  if (priority === "critica") return 4;
  if (priority === "alta") return 3;
  if (priority === "media") return 2;
  return 1;
}

function isActiveOrder(order: Order) {
  return order.status !== "encerrada" && order.status !== "cancelada";
}

function getActionInfo(order: Order) {
  const responsible = order.responsible || "responsável não definido";

  if (order.status === "aprovada") {
    return {
      label: "Atribuída ao técnico",
      person: responsible,
      detail: `Esta ordem foi aprovada e está atribuída a ${responsible}, aguardando início da execução.`,
      tone: "text-amber-300 border-amber-500/20 bg-amber-500/10",
    };
  }

  if (order.status === "em_execucao") {
    return {
      label: "Aguardando conclusão do técnico",
      person: responsible,
      detail: `Esta ordem está atribuída a ${responsible} e ainda não foi enviada para encerramento do gestor.`,
      tone: "text-cyan-300 border-cyan-500/20 bg-cyan-500/10",
    };
  }

  if (order.status === "aguardando_encerramento") {
    return {
      label: "Aguardando ação do gestor",
      person: "Gestor",
      detail:
        "A execução foi concluída pelo técnico e agora precisa de encerramento formal pelo gestor.",
      tone: "text-emerald-300 border-emerald-500/20 bg-emerald-500/10",
    };
  }

  if (order.status === "em_validacao") {
    return {
      label: "Aguardando validação do gestor",
      person: "Gestor",
      detail: "A ordem precisa ser validada antes de avançar no fluxo.",
      tone: "text-blue-300 border-blue-500/20 bg-blue-500/10",
    };
  }

  if (order.status === "reprovada") {
    return {
      label: "Aguardando revisão",
      person: responsible,
      detail:
        "A ordem foi reprovada e pode exigir correção, reabertura ou nova análise.",
      tone: "text-rose-300 border-rose-500/20 bg-rose-500/10",
    };
  }

  if (order.status === "encerrada") {
    return {
      label: "Ordem concluída",
      person: responsible,
      detail: `A ordem foi encerrada. Responsável técnico registrado: ${responsible}.`,
      tone: "text-emerald-300 border-emerald-500/20 bg-emerald-500/10",
    };
  }

  if (order.status === "cancelada") {
    return {
      label: "Ordem cancelada",
      person: "Gestor",
      detail: "A ordem foi cancelada e não exige execução técnica.",
      tone: "text-slate-300 border-slate-500/20 bg-slate-500/10",
    };
  }

  return {
    label: "Acompanhamento necessário",
    person: responsible,
    detail: `Acompanhar evolução da ordem com ${responsible}.`,
    tone: "text-cyan-300 border-cyan-500/20 bg-cyan-500/10",
  };
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIG[status] || {
    bg: "bg-slate-500/10",
    color: "text-slate-300 border-slate-500/20",
    dot: "bg-slate-400",
    label: status,
  };

  return (
    <Badge
      className={`${config.bg} ${config.color} border px-2.5 py-1 text-[11px] font-black`}
    >
      <span
        className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${config.dot}`}
      />
      {config.label}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: Order["priority"] }) {
  const config = PRIORITY_CONFIG[priority] || {
    bg: "bg-slate-500/10",
    color: "text-slate-300 border-slate-500/20",
    label: priority,
  };

  return (
    <Badge
      className={`${config.bg} ${config.color} border px-2.5 py-1 text-[11px] font-black`}
    >
      {config.label}
    </Badge>
  );
}

function CompactMetricCard({
  title,
  value,
  helper,
  icon: Icon,
  tone,
}: {
  title: string;
  value: string | number;
  helper: string;
  icon: ElementType;
  tone: "cyan" | "amber" | "emerald" | "rose";
}) {
  const tones = {
    cyan: {
      icon: "text-cyan-300 border-cyan-400/20 bg-cyan-400/10",
      glow: "from-cyan-500/15",
      number: "text-cyan-300",
      line: "bg-cyan-400",
    },
    amber: {
      icon: "text-amber-300 border-amber-400/20 bg-amber-400/10",
      glow: "from-amber-500/15",
      number: "text-amber-300",
      line: "bg-amber-400",
    },
    emerald: {
      icon: "text-emerald-300 border-emerald-400/20 bg-emerald-400/10",
      glow: "from-emerald-500/15",
      number: "text-emerald-300",
      line: "bg-emerald-400",
    },
    rose: {
      icon: "text-rose-300 border-rose-400/20 bg-rose-400/10",
      glow: "from-rose-500/15",
      number: "text-rose-300",
      line: "bg-rose-400",
    },
  };

  const current = tones[tone];

  return (
    <Card className="relative overflow-hidden rounded-[1.5rem] border border-slate-800 bg-[#08152d] p-4 shadow-lg shadow-cyan-950/10 transition-all hover:-translate-y-0.5 hover:border-cyan-500/30 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${current.glow} via-transparent to-transparent`}
      />
      <div className={`absolute left-0 top-0 h-full w-1 ${current.line}`} />

      <div className="relative flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
            {title}
          </p>

          <p className={`mt-2 text-3xl font-black ${current.number}`}>
            {value}
          </p>

          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400 [.light_&]:text-slate-500">
            {helper}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${current.icon}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

function DecisionCard({
  order,
  onOpenOrders,
}: {
  order?: Order;
  onOpenOrders: () => void;
}) {
  if (!order) {
    return (
      <Card className="relative h-full overflow-hidden rounded-[2rem] border border-slate-800 bg-[#08152d] p-6 shadow-xl shadow-cyan-950/10 [.light_&]:border-slate-200 [.light_&]:bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10" />

        <div className="relative">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-400">
            Próxima decisão
          </p>

          <h2 className="mt-3 text-2xl font-black text-white [.light_&]:text-slate-900">
            Nenhuma decisão pendente
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-slate-400 [.light_&]:text-slate-500">
            No momento não há ordens ativas aguardando validação, encerramento,
            revisão ou acompanhamento prioritário pelo gestor.
          </p>

          <Button
            type="button"
            onClick={onOpenOrders}
            className="mt-6 rounded-2xl bg-cyan-500 px-5 font-black text-slate-950 hover:bg-cyan-400"
          >
            Ver ordens
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    );
  }

  const typeLabel =
    TYPE_CONFIG[order.type as keyof typeof TYPE_CONFIG]?.label || order.type;

  const actionInfo = getActionInfo(order);

  return (
    <Card className="relative h-full overflow-hidden rounded-[2rem] border border-slate-800 bg-[#08152d] p-6 shadow-xl shadow-cyan-950/10 [.light_&]:border-slate-200 [.light_&]:bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-cyan-500/10" />

      <div className="relative">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-400">
              Próxima decisão recomendada
            </p>

            <h2 className="mt-3 text-2xl font-black text-white [.light_&]:text-slate-900">
              {order.asset}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <PriorityBadge priority={order.priority} />
            <StatusBadge status={order.status} />
          </div>
        </div>

        <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5">
          <p className="font-mono text-xs font-black text-amber-300">
            {getOrderNumber(order)}
          </p>

          <p className="mt-3 text-sm leading-relaxed text-slate-200 [.light_&]:text-slate-700">
            {order.description}
          </p>

          <div className={`mt-5 rounded-2xl border p-4 ${actionInfo.tone}`}>
            <p className="text-xs font-black uppercase tracking-[0.18em]">
              {actionInfo.label}
            </p>

            <p className="mt-2 text-lg font-black text-white [.light_&]:text-slate-900">
              {actionInfo.person}
            </p>

            <p className="mt-2 text-sm leading-relaxed text-slate-300 [.light_&]:text-slate-600">
              {actionInfo.detail}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 text-xs font-bold text-slate-400 [.light_&]:text-slate-500">
            <span className="flex items-center gap-1.5">
              <Wrench className="h-3.5 w-3.5" />
              {typeLabel}
            </span>

            <span className="flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5" />
              Responsável: {order.responsible || "Sem responsável"}
            </span>

            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Aberta em {order.createdAt}
            </span>
          </div>
        </div>

        <Button
          type="button"
          onClick={onOpenOrders}
          className="mt-6 rounded-2xl bg-amber-500 px-5 font-black text-slate-950 hover:bg-amber-400"
        >
          Abrir ordens
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

function TechnicianDistribution({ orders }: { orders: Order[] }) {
  const grouped = useMemo(() => {
    const map = new Map<string, Order[]>();

    orders.forEach((order) => {
      const responsible = order.responsible || "Sem responsável";
      const current = map.get(responsible) || [];
      current.push(order);
      map.set(responsible, current);
    });

    return Array.from(map.entries())
      .map(([name, items]) => ({
        name,
        total: items.length,
        active: items.filter(isActiveOrder).length,
        executing: items.filter((order) => order.status === "em_execucao")
          .length,
        pendingClosure: items.filter(
          (order) => order.status === "aguardando_encerramento"
        ).length,
        highImpact: items.filter(
          (order) =>
            isActiveOrder(order) &&
            (order.priority === "alta" || order.priority === "critica")
        ).length,
      }))
      .sort((a, b) => b.active - a.active || b.total - a.total);
  }, [orders]);

  return (
    <Card className="h-full rounded-[2rem] border border-slate-800 bg-[#08152d] p-6 shadow-xl shadow-cyan-950/10 [.light_&]:border-slate-200 [.light_&]:bg-white">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-400">
            Equipe técnica
          </p>

          <h2 className="mt-2 text-2xl font-black text-white [.light_&]:text-slate-900">
            Ordens por responsável
          </h2>

          <p className="mt-2 text-sm text-slate-400 [.light_&]:text-slate-500">
            Distribuição das atribuições por técnico ou responsável informado.
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
          <Users className="h-6 w-6" />
        </div>
      </div>

      {grouped.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-8 text-center text-sm text-slate-400 [.light_&]:border-slate-200 [.light_&]:bg-slate-50">
          Nenhuma ordem atribuída ainda.
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map((item) => (
            <div
              key={item.name}
              className="rounded-3xl border border-slate-800 bg-slate-950/40 p-4 [.light_&]:border-slate-200 [.light_&]:bg-slate-50"
            >
              <div className="mb-3 flex items-center justify-between gap-4">
                <div>
                  <p className="font-black text-white [.light_&]:text-slate-900">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.active} ativa(s) · {item.total} total(is)
                  </p>
                </div>

                <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-black text-cyan-300">
                  {item.active}
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-3">
                  <p className="text-xs font-black uppercase text-cyan-300">
                    Em execução
                  </p>
                  <p className="mt-1 text-2xl font-black text-white [.light_&]:text-slate-900">
                    {item.executing}
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                  <p className="text-xs font-black uppercase text-emerald-300">
                    A encerrar
                  </p>
                  <p className="mt-1 text-2xl font-black text-white [.light_&]:text-slate-900">
                    {item.pendingClosure}
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3">
                  <p className="text-xs font-black uppercase text-amber-300">
                    Alto impacto
                  </p>
                  <p className="mt-1 text-2xl font-black text-white [.light_&]:text-slate-900">
                    {item.highImpact}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function AssignmentRow({
  order,
  onOpenOrders,
}: {
  order: Order;
  onOpenOrders: () => void;
}) {
  const typeLabel =
    TYPE_CONFIG[order.type as keyof typeof TYPE_CONFIG]?.label || order.type;

  const actionInfo = getActionInfo(order);

  return (
    <button
      type="button"
      onClick={onOpenOrders}
      className="group flex w-full items-start gap-4 rounded-3xl border border-slate-800 bg-slate-950/40 p-4 text-left transition-all hover:border-cyan-500/30 hover:bg-cyan-500/10 [.light_&]:border-slate-200 [.light_&]:bg-slate-50"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
        <ClipboardList className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-black text-slate-500">
            {getOrderNumber(order)}
          </span>

          <PriorityBadge priority={order.priority} />
          <StatusBadge status={order.status} />
        </div>

        <p className="truncate text-base font-black text-white [.light_&]:text-slate-900">
          {order.asset}
        </p>

        <p className="mt-1 line-clamp-2 text-sm text-slate-400 [.light_&]:text-slate-500">
          {typeLabel} · {order.description}
        </p>

        <p className="mt-2 text-xs font-bold text-slate-500">
          {actionInfo.label}: {actionInfo.person}
        </p>
      </div>

      <ArrowRight className="mt-2 h-4 w-4 text-slate-500 transition-all group-hover:translate-x-1 group-hover:text-cyan-300" />
    </button>
  );
}

function ActiveAssignmentsCard({
  loading,
  recentAssignments,
  onOpenOrders,
}: {
  loading: boolean;
  recentAssignments: Order[];
  onOpenOrders: () => void;
}) {
  return (
    <Card className="h-full rounded-[2rem] border border-slate-800 bg-[#08152d] p-6 shadow-xl shadow-cyan-950/10 [.light_&]:border-slate-200 [.light_&]:bg-white">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-400">
            Atribuições recentes
          </p>

          <h2 className="mt-2 text-2xl font-black text-white [.light_&]:text-slate-900">
            Ordens ativas que exigem atenção
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-400 [.light_&]:text-slate-500">
            Lista rápida das ordens mais relevantes para validação,
            encerramento, revisão ou acompanhamento.
          </p>
        </div>

        <Button
          type="button"
          onClick={onOpenOrders}
          className="rounded-2xl bg-cyan-500 px-5 font-black text-slate-950 hover:bg-cyan-400"
        >
          Abrir Ordens
        </Button>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-10 text-center text-slate-400 [.light_&]:border-slate-200 [.light_&]:bg-slate-50">
          <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin text-cyan-400" />
          Carregando atribuições...
        </div>
      ) : recentAssignments.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-10 text-center [.light_&]:border-slate-200 [.light_&]:bg-slate-50">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
            <ClipboardCheck className="h-8 w-8" />
          </div>

          <h3 className="text-xl font-black text-white [.light_&]:text-slate-900">
            Nenhuma atribuição ativa
          </h3>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-400 [.light_&]:text-slate-500">
            As ordens ativas que exigirem atenção do gestor aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentAssignments.map((order) => (
            <AssignmentRow
              key={order.id}
              order={order}
              onOpenOrders={onOpenOrders}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

export function GestorAtribuicoes() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);

    try {
      const data = await fetchOrders();
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const activeOrders = useMemo(() => {
    return orders.filter(isActiveOrder);
  }, [orders]);

  const validationOrders = useMemo(() => {
    return activeOrders.filter((order) => order.status === "em_validacao");
  }, [activeOrders]);

  const closureOrders = useMemo(() => {
    return activeOrders.filter(
      (order) => order.status === "aguardando_encerramento"
    );
  }, [activeOrders]);

  const rejectedOrders = useMemo(() => {
    return activeOrders.filter((order) => order.status === "reprovada");
  }, [activeOrders]);

  const approvedOrders = useMemo(() => {
    return activeOrders.filter((order) => order.status === "aprovada");
  }, [activeOrders]);

  const executingOrders = useMemo(() => {
    return activeOrders.filter((order) => order.status === "em_execucao");
  }, [activeOrders]);

  const highImpactOrders = useMemo(() => {
    return activeOrders.filter(
      (order) => order.priority === "alta" || order.priority === "critica"
    );
  }, [activeOrders]);

  const managerAssignments = useMemo(() => {
    return [
      ...validationOrders,
      ...closureOrders,
      ...rejectedOrders,
      ...approvedOrders,
      ...executingOrders,
      ...highImpactOrders,
    ].filter(
      (order, index, array) =>
        array.findIndex((item) => item.id === order.id) === index
    );
  }, [
    validationOrders,
    closureOrders,
    rejectedOrders,
    approvedOrders,
    executingOrders,
    highImpactOrders,
  ]);

  const statusPriority = (order: Order) => {
    if (order.status === "aguardando_encerramento") return 6;
    if (order.status === "em_validacao") return 5;
    if (order.status === "aprovada") return 4;
    if (order.status === "em_execucao") return 3;
    if (order.status === "reprovada") return 2;
    return 1;
  };

  const decisionOrder = useMemo(() => {
    return [...managerAssignments].sort((a, b) => {
      const statusDiff = statusPriority(b) - statusPriority(a);

      if (statusDiff !== 0) return statusDiff;

      return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
    })[0];
  }, [managerAssignments]);

  const recentAssignments = useMemo(() => {
    return [...managerAssignments]
      .sort((a, b) => {
        const statusDiff = statusPriority(b) - statusPriority(a);

        if (statusDiff !== 0) return statusDiff;

        return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
      })
      .slice(0, 8);
  }, [managerAssignments]);

  const openOrders = () => {
    navigate("/work-orders");
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-gradient-to-r from-[#061327] via-[#0b1f43] to-[#0c3c52] p-8 shadow-2xl shadow-cyan-950/20 [.light_&]:border-slate-200">
        <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
              Visão Gerencial
            </p>

            <h1 className="mt-3 flex flex-wrap items-center gap-3 text-4xl font-black text-white">
              <UserCheck className="h-9 w-9 text-cyan-300" />
              Painel de Atribuições
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300">
              Acompanhe ordens ativas que exigem decisão do gestor, validações,
              encerramentos, revisões e distribuição das demandas entre a equipe.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-200">
                {getTodayBR()}
              </span>

              <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-amber-200">
                {highImpactOrders.length} ordem(ns) ativa(s) de alto impacto
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={loadOrders}
              className="h-12 rounded-2xl border border-white/10 bg-white/10 px-5 font-black text-white hover:bg-white/15"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>

            <Button
              type="button"
              onClick={openOrders}
              className="h-12 rounded-2xl bg-cyan-500 px-6 font-black text-slate-950 hover:bg-cyan-400"
            >
              Abrir ordens
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <CompactMetricCard
            title="A validar"
            value={validationOrders.length}
            helper="Aguardando decisão gerencial."
            icon={ClipboardCheck}
            tone="cyan"
          />

          <CompactMetricCard
            title="A encerrar"
            value={closureOrders.length}
            helper="Execuções finalizadas aguardando encerramento."
            icon={CheckCircle2}
            tone="emerald"
          />

          <CompactMetricCard
            title="A priorizar"
            value={highImpactOrders.length}
            helper="Ordens altas ou críticas em acompanhamento."
            icon={ShieldAlert}
            tone="amber"
          />

          <CompactMetricCard
            title="A revisar"
            value={rejectedOrders.length}
            helper="Ordens reprovadas ou que exigem nova análise."
            icon={XCircle}
            tone="rose"
          />
        </div>

        <DecisionCard order={decisionOrder} onOpenOrders={openOrders} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <TechnicianDistribution orders={orders} />

        <ActiveAssignmentsCard
          loading={loading}
          recentAssignments={recentAssignments}
          onOpenOrders={openOrders}
        />
      </div>
    </div>
  );
}