import { useEffect, useMemo, useState } from "react";
import type { ElementType } from "react";
import { useNavigate } from "react-router";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useAuth } from "../hooks/useAuth";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  HardHat,
  History,
  RefreshCw,
  ShieldCheck,
  Timer,
  Wrench,
} from "lucide-react";
import {
  fetchOrders,
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  TYPE_CONFIG,
  getCurrentUser,
  isCurrentTechnicianResponsible,
  type Order,
  type OrderStatus,
} from "../lib/ordersStore";

type ProfileData = {
  name: string;
  email: string;
  role: string;
  area: string;
  avatar: string;
};

const tecnicoDefaultProfile: ProfileData = {
  name: "Técnico FIXER",
  email: "tecnico@fixer.com",
  role: "Técnico",
  area: "Equipe Técnica",
  avatar: "",
};

function normalizeText(value?: string | null) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getAuthField(authProfile: unknown, field: string) {
  const data = authProfile as Record<string, unknown> | null | undefined;
  const value = data?.[field];

  return typeof value === "string" ? value : "";
}

function getAuthEmail(authProfile: unknown) {
  const directEmail = getAuthField(authProfile, "email");

  if (directEmail) return directEmail;

  const data = authProfile as Record<string, unknown> | null | undefined;
  const user = data?.user as Record<string, unknown> | undefined;
  const userEmail = user?.email;

  return typeof userEmail === "string" ? userEmail : "";
}

function getAuthRole(authProfile: unknown) {
  const role = getAuthField(authProfile, "role");

  if (role) return role;

  const data = authProfile as Record<string, unknown> | null | undefined;
  const userMetadata = data?.user_metadata as Record<string, unknown> | undefined;
  const metadataRole = userMetadata?.role;

  return typeof metadataRole === "string" ? metadataRole : "";
}

function getProfileStorageKey(email?: string | null, role?: string | null) {
  const identifier = normalizeText(email || role || "tecnico")
    .replace(/[^a-z0-9@._-]/g, "")
    .replaceAll("@", "_")
    .replaceAll(".", "_");

  return `fixer_profile_${identifier || "tecnico"}`;
}

function readSavedProfile(
  email?: string | null,
  role?: string | null
): ProfileData {
  const key = getProfileStorageKey(email, role);

  try {
    const stored = localStorage.getItem(key);

    if (stored) {
      const parsed = JSON.parse(stored);

      return {
        ...tecnicoDefaultProfile,
        ...parsed,
        email: parsed.email || email || tecnicoDefaultProfile.email,
      };
    }

    return {
      ...tecnicoDefaultProfile,
      email: email || tecnicoDefaultProfile.email,
    };
  } catch {
    return {
      ...tecnicoDefaultProfile,
      email: email || tecnicoDefaultProfile.email,
    };
  }
}

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

function percent(value: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((value / total) * 100);
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

function MetricCard({
  title,
  value,
  helper,
  icon: Icon,
  tone,
  onClick,
}: {
  title: string;
  value: string | number;
  helper: string;
  icon: ElementType;
  tone: "cyan" | "amber" | "emerald" | "purple";
  onClick?: () => void;
}) {
  const tones = {
    cyan: {
      icon: "text-cyan-300 border-cyan-400/20 bg-cyan-400/10",
      glow: "from-cyan-500/15",
    },
    amber: {
      icon: "text-amber-300 border-amber-400/20 bg-amber-400/10",
      glow: "from-amber-500/15",
    },
    emerald: {
      icon: "text-emerald-300 border-emerald-400/20 bg-emerald-400/10",
      glow: "from-emerald-500/15",
    },
    purple: {
      icon: "text-purple-300 border-purple-400/20 bg-purple-400/10",
      glow: "from-purple-500/15",
    },
  };

  const current = tones[tone];

  const card = (
    <Card className="relative h-full overflow-hidden rounded-[2rem] border border-slate-800 bg-[#08152d] p-5 shadow-xl shadow-cyan-950/10 transition-all hover:-translate-y-1 hover:border-cyan-500/30 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${current.glow} via-transparent to-transparent`}
      />

      <div className="relative">
        <div className="mb-5 flex items-start justify-between gap-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            {title}
          </p>

          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${current.icon}`}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>

        <p className="text-4xl font-black text-white [.light_&]:text-slate-900">
          {value}
        </p>

        <p className="mt-3 text-sm leading-relaxed text-slate-400 [.light_&]:text-slate-500">
          {helper}
        </p>
      </div>
    </Card>
  );

  if (!onClick) return card;

  return (
    <button type="button" onClick={onClick} className="h-full w-full text-left">
      {card}
    </button>
  );
}

function getOrderSituation(order: Order) {
  if (order.status === "aprovada") {
    return {
      label: "Aguardando início da execução",
      title: "Aguardando ação do técnico",
      description:
        "Esta ordem está aprovada e pronta para iniciar. Acesse Minhas Ordens para começar a execução.",
      tone: "border-amber-500/20 bg-amber-500/10 text-amber-300",
      button: "Iniciar em Minhas Ordens",
    };
  }

  if (order.status === "em_execucao") {
    return {
      label: "Aguardando conclusão",
      title: "Aguardando conclusão pelo técnico",
      description:
        "Esta ordem já foi iniciada. Registre as atividades realizadas e finalize a execução quando o serviço estiver concluído.",
      tone: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
      button: "Concluir ou registrar execução",
    };
  }

  if (order.status === "aguardando_encerramento") {
    return {
      label: "Aguardando encerramento",
      title: "Aguardando encerramento pelo gestor",
      description:
        "A execução já foi concluída pelo técnico. Agora a ordem precisa de encerramento formal pelo gestor.",
      tone: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
      button: "Acompanhar em Minhas Ordens",
    };
  }

  return {
    label: "Acompanhamento",
    title: "Acompanhar situação da ordem",
    description:
      "Acesse Minhas Ordens para consultar os detalhes e verificar as ações disponíveis.",
    tone: "border-slate-500/20 bg-slate-500/10 text-slate-300",
    button: "Abrir Minhas Ordens",
  };
}

function NextOrderCard({
  order,
  onOpenOrders,
}: {
  order?: Order;
  onOpenOrders: () => void;
}) {
  if (!order) {
    return (
      <button
        type="button"
        onClick={onOpenOrders}
        className="h-full w-full text-left"
      >
        <Card className="relative h-full overflow-hidden rounded-[2rem] border border-slate-800 bg-[#08152d] p-6 shadow-xl shadow-cyan-950/10 transition-all hover:-translate-y-1 hover:border-cyan-500/30 [.light_&]:border-slate-200 [.light_&]:bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10" />

          <div className="relative">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
              <ShieldCheck className="h-7 w-7" />
            </div>

            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-400">
              Próxima ação
            </p>

            <h2 className="mt-3 text-2xl font-black text-white [.light_&]:text-slate-900">
              Nenhuma ação pendente
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-slate-400 [.light_&]:text-slate-500">
              No momento, não existe ordem aprovada aguardando início nem ordem em
              execução aguardando conclusão para este técnico.
            </p>

            <div className="mt-6 inline-flex items-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-black text-slate-950">
              Ver minhas ordens
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </div>
        </Card>
      </button>
    );
  }

  const typeLabel =
    TYPE_CONFIG[order.type as keyof typeof TYPE_CONFIG]?.label || order.type;

  const situation = getOrderSituation(order);

  return (
    <button
      type="button"
      onClick={onOpenOrders}
      className="h-full w-full text-left"
    >
      <Card className="relative h-full overflow-hidden rounded-[2rem] border border-slate-800 bg-[#08152d] p-6 shadow-xl shadow-cyan-950/10 transition-all hover:-translate-y-1 hover:border-cyan-500/30 [.light_&]:border-slate-200 [.light_&]:bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-cyan-500/10" />

        <div className="relative">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-400">
                {situation.label}
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

            <div className={`mt-5 rounded-2xl border p-4 ${situation.tone}`}>
              <p className="text-xs font-black uppercase tracking-[0.18em]">
                Situação da ordem
              </p>

              <p className="mt-2 text-lg font-black text-white [.light_&]:text-slate-900">
                {situation.title}
              </p>

              <p className="mt-2 text-sm leading-relaxed text-slate-300 [.light_&]:text-slate-600">
                {situation.description}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3 text-xs font-bold text-slate-400 [.light_&]:text-slate-500">
              <span className="flex items-center gap-1.5">
                <Wrench className="h-3.5 w-3.5" />
                {typeLabel}
              </span>

              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Aberta em {order.createdAt}
              </span>
            </div>
          </div>

          <div className="mt-6 inline-flex items-center rounded-2xl bg-amber-500 px-5 py-3 text-sm font-black text-slate-950">
            {situation.button}
            <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        </div>
      </Card>
    </button>
  );
}

function SimpleOrderRow({
  order,
  onOpenOrders,
}: {
  order: Order;
  onOpenOrders: () => void;
}) {
  const typeLabel =
    TYPE_CONFIG[order.type as keyof typeof TYPE_CONFIG]?.label || order.type;

  const situation = getOrderSituation(order);

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

        {(order.status === "em_execucao" ||
          order.status === "aprovada" ||
          order.status === "aguardando_encerramento") && (
          <p className="mt-2 text-xs font-black uppercase tracking-[0.12em] text-cyan-300">
            {situation.title}
          </p>
        )}
      </div>

      <ArrowRight className="mt-2 h-4 w-4 text-slate-500 transition-all group-hover:translate-x-1 group-hover:text-cyan-300" />
    </button>
  );
}

function EmptyPanel({ onOpenOrders }: { onOpenOrders: () => void }) {
  return (
    <Card className="rounded-[2rem] border border-slate-800 bg-[#08152d] p-10 text-center shadow-xl shadow-cyan-950/10 [.light_&]:border-slate-200 [.light_&]:bg-white">
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
        <ClipboardList className="h-10 w-10" />
      </div>

      <h3 className="text-2xl font-black text-white [.light_&]:text-slate-900">
        Nenhuma ordem para exibir
      </h3>

      <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-400 [.light_&]:text-slate-500">
        As ordens atribuídas ao técnico aparecerão aqui como resumo operacional.
        Para consultar todas as abas, acesse a tela de Minhas Ordens.
      </p>

      <Button
        type="button"
        onClick={onOpenOrders}
        className="mt-6 rounded-2xl bg-cyan-500 px-5 font-black text-slate-950 hover:bg-cyan-400"
      >
        Ir para minhas ordens
      </Button>
    </Card>
  );
}

export function TecnicoDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const { profile: authProfile } = useAuth();

  const authEmail = getAuthEmail(authProfile);
  const authRole = getAuthRole(authProfile);

  const [savedProfile, setSavedProfile] = useState<ProfileData>(() =>
    readSavedProfile(authEmail, authRole)
  );

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSavedProfile(readSavedProfile(authEmail, authRole));
  }, [authEmail, authRole]);

  useEffect(() => {
    const updateProfile = () => {
      setSavedProfile(readSavedProfile(authEmail, authRole));
    };

    window.addEventListener("storage", updateProfile);
    window.addEventListener("fixer-profile-updated", updateProfile);

    return () => {
      window.removeEventListener("storage", updateProfile);
      window.removeEventListener("fixer-profile-updated", updateProfile);
    };
  }, [authEmail, authRole]);

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

  const myOrders = useMemo(() => {
    return orders.filter((order) =>
      isCurrentTechnicianResponsible(order.responsible, user.name)
    );
  }, [orders, user.name]);

  const pendingOrders = useMemo(() => {
    return myOrders.filter((order) => order.status === "aprovada");
  }, [myOrders]);

  const runningOrders = useMemo(() => {
    return myOrders.filter((order) => order.status === "em_execucao");
  }, [myOrders]);

  const waitingClosureOrders = useMemo(() => {
    return myOrders.filter(
      (order) => order.status === "aguardando_encerramento"
    );
  }, [myOrders]);

  const historyOrders = useMemo(() => {
    return myOrders.filter(
      (order) =>
        order.status === "encerrada" ||
        order.status === "cancelada" ||
        order.status === "reprovada"
    );
  }, [myOrders]);

  const doneOrders = useMemo(() => {
    return myOrders.filter((order) => order.status === "encerrada");
  }, [myOrders]);

  const highImpact = useMemo(() => {
    return myOrders.filter(
      (order) => order.priority === "alta" || order.priority === "critica"
    );
  }, [myOrders]);

  const nextOrder = useMemo(() => {
    const running = [...runningOrders].sort(
      (a, b) => getPriorityWeight(b.priority) - getPriorityWeight(a.priority)
    )[0];

    if (running) return running;

    const pending = [...pendingOrders].sort(
      (a, b) => getPriorityWeight(b.priority) - getPriorityWeight(a.priority)
    )[0];

    if (pending) return pending;

    const waitingClosure = [...waitingClosureOrders].sort(
      (a, b) => getPriorityWeight(b.priority) - getPriorityWeight(a.priority)
    )[0];

    return waitingClosure;
  }, [runningOrders, pendingOrders, waitingClosureOrders]);

  const recentOrders = useMemo(() => {
    const statusPriority = (order: Order) => {
      if (order.status === "em_execucao") return 5;
      if (order.status === "aprovada") return 4;
      if (order.status === "aguardando_encerramento") return 3;
      return 1;
    };

    return [...myOrders]
      .sort((a, b) => {
        const statusDiff = statusPriority(b) - statusPriority(a);

        if (statusDiff !== 0) return statusDiff;

        return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
      })
      .slice(0, 5);
  }, [myOrders]);

  const openMyOrders = () => {
    navigate("/work-orders");
  };

  const openExecutionPanel = () => {
    navigate("/work-orders?tab=executing&focus=1");
  };

  const openPendingPanel = () => {
    navigate("/work-orders?tab=pending&focus=1");
  };

  const openHistoryPanel = () => {
    navigate("/work-orders?tab=history&focus=1");
  };

  const openNextOrderPanel = () => {
    if (nextOrder?.status === "aprovada") {
      openPendingPanel();
      return;
    }

    if (
      nextOrder?.status === "em_execucao" ||
      nextOrder?.status === "aguardando_encerramento"
    ) {
      openExecutionPanel();
      return;
    }

    openMyOrders();
  };

  const handleRefreshAndOpenExecution = async () => {
    await loadOrders();
    openExecutionPanel();
  };

  const completion = percent(doneOrders.length, myOrders.length);
  const displayName = savedProfile.name || user.name;

  return (
    <div className="space-y-6 p-6">
      <Card className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-gradient-to-r from-[#061327] via-[#0b1f43] to-[#0c3c52] p-8 shadow-2xl shadow-cyan-950/20 [.light_&]:border-slate-200">
        <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
              Visão Operacional
            </p>

            <h1 className="mt-3 flex flex-wrap items-center gap-3 text-4xl font-black text-white">
              <HardHat className="h-9 w-9 text-amber-300" />
              Painel de Manutenção
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300">
              {displayName}, acompanhe suas ordens atribuídas, serviços em
              execução, tarefas aguardando encerramento e histórico recente em
              uma visão operacional mais direta.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-200">
                {getTodayBR()}
              </span>

              <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-amber-200">
                {highImpact.length} ordem(ns) de alto impacto
              </span>

              {runningOrders.length > 0 && (
                <button
                  type="button"
                  onClick={openExecutionPanel}
                  className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-200 transition-all hover:border-cyan-300/50 hover:bg-cyan-400/20"
                >
                  {runningOrders.length} aguardando conclusão
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={handleRefreshAndOpenExecution}
              className="h-12 rounded-2xl border border-white/10 bg-white/10 px-5 font-black text-white hover:bg-white/15"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>

            <Button
              type="button"
              onClick={runningOrders.length > 0 ? openExecutionPanel : openMyOrders}
              className="h-12 rounded-2xl bg-cyan-500 px-6 font-black text-slate-950 hover:bg-cyan-400"
            >
              {runningOrders.length > 0 ? "Abrir execução" : "Ver minhas ordens"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Pendentes"
          value={pendingOrders.length}
          helper="Ordens aprovadas para iniciar execução."
          icon={AlertCircle}
          tone="amber"
          onClick={openPendingPanel}
        />

        <MetricCard
          title="Em execução"
          value={runningOrders.length}
          helper="Ordens aguardando registro ou conclusão pelo técnico."
          icon={Timer}
          tone="cyan"
          onClick={openExecutionPanel}
        />

        <MetricCard
          title="Concluídas"
          value={doneOrders.length}
          helper={`${completion}% das ordens atribuídas encerradas.`}
          icon={CheckCircle2}
          tone="emerald"
          onClick={openHistoryPanel}
        />

        <MetricCard
          title="Histórico"
          value={historyOrders.length}
          helper="Ordens encerradas, canceladas ou reprovadas."
          icon={History}
          tone="purple"
          onClick={openHistoryPanel}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <NextOrderCard order={nextOrder} onOpenOrders={openNextOrderPanel} />

        <Card className="rounded-[2rem] border border-slate-800 bg-[#08152d] p-6 shadow-xl shadow-cyan-950/10 [.light_&]:border-slate-200 [.light_&]:bg-white">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-400">
                Rotina do dia
              </p>

              <h2 className="mt-2 text-2xl font-black text-white [.light_&]:text-slate-900">
                Resumo operacional
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-slate-400 [.light_&]:text-slate-500">
                Acompanhe rapidamente o que precisa de ação no turno atual.
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
              <Clock className="h-6 w-6" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <button
              type="button"
              onClick={openPendingPanel}
              className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5 text-left transition-all hover:border-amber-400/40 hover:bg-amber-500/15"
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">
                A iniciar
              </p>

              <p className="mt-3 text-4xl font-black text-white [.light_&]:text-slate-900">
                {pendingOrders.length}
              </p>

              <p className="mt-2 text-sm text-slate-400 [.light_&]:text-slate-600">
                Ordens aprovadas.
              </p>
            </button>

            <button
              type="button"
              onClick={openExecutionPanel}
              className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-5 text-left transition-all hover:border-cyan-400/40 hover:bg-cyan-500/15"
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                A concluir
              </p>

              <p className="mt-3 text-4xl font-black text-white [.light_&]:text-slate-900">
                {runningOrders.length}
              </p>

              <p className="mt-2 text-sm text-slate-400 [.light_&]:text-slate-600">
                Em execução pelo técnico.
              </p>
            </button>

            <button
              type="button"
              onClick={openExecutionPanel}
              className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-5 text-left transition-all hover:border-purple-400/40 hover:bg-purple-500/15"
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-300">
                Validação
              </p>

              <p className="mt-3 text-4xl font-black text-white [.light_&]:text-slate-900">
                {waitingClosureOrders.length}
              </p>

              <p className="mt-2 text-sm text-slate-400 [.light_&]:text-slate-600">
                Aguardando gestor.
              </p>
            </button>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/40 p-5 [.light_&]:border-slate-200 [.light_&]:bg-slate-50">
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="text-sm font-black text-white [.light_&]:text-slate-900">
                Progresso pessoal
              </p>

              <p className="text-sm font-black text-emerald-300 [.light_&]:text-emerald-700">
                {completion}%
              </p>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-800 [.light_&]:bg-slate-200">
              <div
                className="h-full rounded-full bg-emerald-400"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      <Card className="rounded-[2rem] border border-slate-800 bg-[#08152d] p-6 shadow-xl shadow-cyan-950/10 [.light_&]:border-slate-200 [.light_&]:bg-white">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-400">
              Ordens recentes
            </p>

            <h2 className="mt-2 text-2xl font-black text-white [.light_&]:text-slate-900">
              Atividades atribuídas
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-slate-400 [.light_&]:text-slate-500">
              Lista rápida das ordens mais relevantes para o técnico. Para
              executar ações, acesse “Minhas Ordens”.
            </p>
          </div>

          <Button
            type="button"
            onClick={runningOrders.length > 0 ? openExecutionPanel : openMyOrders}
            className="rounded-2xl bg-cyan-500 px-5 font-black text-slate-950 hover:bg-cyan-400"
          >
            {runningOrders.length > 0 ? "Abrir execução" : "Abrir Minhas Ordens"}
          </Button>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-10 text-center text-slate-400 [.light_&]:border-slate-200 [.light_&]:bg-slate-50">
            <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin text-cyan-400" />
            Carregando ordens...
          </div>
        ) : recentOrders.length === 0 ? (
          <EmptyPanel onOpenOrders={openMyOrders} />
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <SimpleOrderRow
                key={order.id}
                order={order}
                onOpenOrders={
                  order.status === "em_execucao" ||
                  order.status === "aguardando_encerramento"
                    ? openExecutionPanel
                    : order.status === "aprovada"
                      ? openPendingPanel
                      : openMyOrders
                }
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}