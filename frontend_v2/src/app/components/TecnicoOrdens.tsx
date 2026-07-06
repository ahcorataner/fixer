import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
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
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Clock,
  FileText,
  HardHat,
  History,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Timer,
  TrendingUp,
  Wrench,
  XCircle,
} from "lucide-react";
import {
  fetchOrders,
  updateOrder,
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  TYPE_CONFIG,
  getCurrentUser,
  isCurrentTechnicianResponsible,
  type Order,
  type OrderStatus,
} from "../lib/ordersStore";
import { supabase } from "../../lib/supabase";

const TABS = [
  { key: "pending", label: "Pendentes", icon: AlertCircle },
  { key: "executing", label: "Em Execução", icon: Wrench },
  { key: "history", label: "Histórico", icon: History },
];

function safeConfig<T extends Record<string, any>>(
  config: T,
  key: string,
  fallback: T[keyof T]
) {
  return config[key as keyof T] || fallback;
}

function getOrderNumber(order: Order) {
  return `#${order.id.toString().padStart(4, "0")}`;
}

function getTodayBR() {
  return new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getCompletionPercent(done: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((done / total) * 100);
}

function getPriorityWeight(priority: Order["priority"]) {
  if (priority === "critica") return 4;
  if (priority === "alta") return 3;
  if (priority === "media") return 2;
  return 1;
}

function getOrderActionInfo(order: Order) {
  if (order.status === "aprovada") {
    return {
      eyebrow: "Aguardando início",
      title: "Ordem aprovada para execução",
      description:
        "Esta ordem já foi aprovada pelo gestor. Clique em Iniciar execução para começar o atendimento.",
      tone: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    };
  }

  if (order.status === "em_execucao") {
    return {
      eyebrow: "Aguardando conclusão pelo técnico",
      title: "Execução em andamento",
      description:
        "Esta ordem já foi iniciada. Registre as atividades realizadas e clique em Concluir execução quando o serviço estiver finalizado.",
      tone: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
    };
  }

  if (order.status === "aguardando_encerramento") {
    return {
      eyebrow: "Aguardando gestor",
      title: "Execução concluída pelo técnico",
      description:
        "A execução foi finalizada e enviada para encerramento formal pelo gestor. Nenhuma ação técnica é necessária neste momento.",
      tone: "border-purple-500/20 bg-purple-500/10 text-purple-300",
    };
  }

  if (order.status === "encerrada") {
    return {
      eyebrow: "Ordem encerrada",
      title: "Ciclo concluído",
      description:
        "A ordem foi encerrada formalmente e permanece disponível apenas para consulta no histórico.",
      tone: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    };
  }

  if (order.status === "reprovada") {
    return {
      eyebrow: "Ordem reprovada",
      title: "Revisão necessária",
      description:
        "Esta ordem foi reprovada. Consulte o motivo informado e aguarde nova orientação do gestor.",
      tone: "border-rose-500/20 bg-rose-500/10 text-rose-300",
    };
  }

  if (order.status === "cancelada") {
    return {
      eyebrow: "Ordem cancelada",
      title: "Execução cancelada",
      description: "Esta ordem foi cancelada e não exige ação técnica.",
      tone: "border-slate-500/20 bg-slate-500/10 text-slate-300",
    };
  }

  return {
    eyebrow: "Acompanhamento",
    title: "Acompanhar ordem",
    description: "Consulte os detalhes da ordem e acompanhe a evolução do fluxo.",
    tone: "border-slate-500/20 bg-slate-500/10 text-slate-300",
  };
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const fallback = {
    bg: "bg-slate-500/10",
    color: "text-slate-300 border-slate-500/20",
    dot: "bg-slate-400",
    label: status,
  };

  const sc = safeConfig(STATUS_CONFIG, status, fallback);

  return (
    <Badge
      className={`${sc.bg} ${sc.color} border px-2.5 py-1 text-[11px] font-black`}
    >
      <span
        className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${sc.dot}`}
      />
      {sc.label}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: Order["priority"] }) {
  const fallback = {
    bg: "bg-slate-500/10",
    color: "text-slate-300 border-slate-500/20",
    label: priority,
  };

  const pc = safeConfig(PRIORITY_CONFIG, priority, fallback);

  return (
    <Badge
      className={`${pc.bg} ${pc.color} border px-2.5 py-1 text-[11px] font-black`}
    >
      {pc.label}
    </Badge>
  );
}

function PremiumMetricCard({
  label,
  value,
  helper,
  icon: Icon,
  tone,
  onClick,
}: {
  label: string;
  value: string | number;
  helper: string;
  icon: React.ElementType;
  tone: "cyan" | "amber" | "emerald" | "rose";
  onClick?: () => void;
}) {
  const tones = {
    cyan: {
      box: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
      glow: "from-cyan-500/20",
    },
    amber: {
      box: "border-amber-400/20 bg-amber-400/10 text-amber-300",
      glow: "from-amber-500/20",
    },
    emerald: {
      box: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
      glow: "from-emerald-500/20",
    },
    rose: {
      box: "border-rose-400/20 bg-rose-400/10 text-rose-300",
      glow: "from-rose-500/20",
    },
  };

  const current = tones[tone];

  const content = (
    <Card className="group relative h-full overflow-hidden rounded-[2rem] border border-slate-800 bg-[#08152d] p-5 shadow-xl shadow-cyan-950/10 transition-all hover:-translate-y-1 hover:border-cyan-500/30 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${current.glow} via-transparent to-transparent opacity-80`}
      />

      <div className="relative">
        <div className="mb-5 flex items-start justify-between gap-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            {label}
          </p>

          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${current.box}`}
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

  if (!onClick) return content;

  return (
    <button type="button" onClick={onClick} className="h-full w-full text-left">
      {content}
    </button>
  );
}

function MiniProgress({
  label,
  value,
  total,
  tone,
}: {
  label: string;
  value: number;
  total: number;
  tone: "cyan" | "amber" | "emerald" | "rose";
}) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;

  const tones = {
    cyan: "bg-cyan-400",
    amber: "bg-amber-400",
    emerald: "bg-emerald-400",
    rose: "bg-rose-400",
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-bold text-slate-300 [.light_&]:text-slate-700">
          {label}
        </span>

        <span className="text-sm font-black text-white [.light_&]:text-slate-900">
          {value}
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-800 [.light_&]:bg-slate-200">
        <div
          className={`h-full rounded-full ${tones[tone]}`}
          style={{ width: `${Math.max(percent, value > 0 ? 8 : 0)}%` }}
        />
      </div>
    </div>
  );
}

function TechnicianInsightCard({
  pending,
  executing,
  waitingClosure,
  done,
  history,
  total,
}: {
  pending: number;
  executing: number;
  waitingClosure: number;
  done: number;
  history: number;
  total: number;
}) {
  const completion = getCompletionPercent(done, total);

  return (
    <Card className="rounded-[2rem] border border-slate-800 bg-[#08152d] p-6 shadow-xl shadow-cyan-950/10 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
          <BarChart3 className="h-6 w-6" />
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-400">
            Produtividade
          </p>

          <h3 className="mt-2 text-2xl font-black text-white [.light_&]:text-slate-900">
            Visão operacional do técnico
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-slate-400 [.light_&]:text-slate-500">
            Acompanhamento das demandas atribuídas, pendências e taxa de
            conclusão do ciclo de manutenção.
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-5 [.light_&]:border-slate-200 [.light_&]:bg-slate-50">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              Conclusão
            </p>

            <p className="mt-2 text-4xl font-black text-white [.light_&]:text-slate-900">
              {completion}%
            </p>
          </div>

          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
            <TrendingUp className="h-9 w-9" />
          </div>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800 [.light_&]:bg-slate-200">
          <div
            className="h-full rounded-full bg-emerald-400"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        <MiniProgress label="Pendentes" value={pending} total={total} tone="amber" />
        <MiniProgress label="Em execução" value={executing} total={total} tone="cyan" />
        <MiniProgress label="Aguardando gestor" value={waitingClosure} total={total} tone="rose" />
        <MiniProgress label="Concluídas" value={done} total={total} tone="emerald" />
        <MiniProgress label="Histórico" value={history} total={total} tone="rose" />
      </div>
    </Card>
  );
}

function RecommendedAction({
  nextOrder,
  pending,
  executing,
  waitingClosure,
  onOpenAction,
}: {
  nextOrder?: Order;
  pending: number;
  executing: number;
  waitingClosure: number;
  onOpenAction: () => void;
}) {
  const actionInfo = nextOrder ? getOrderActionInfo(nextOrder) : null;

  return (
    <button type="button" onClick={onOpenAction} className="h-full w-full text-left">
      <Card className="relative h-full overflow-hidden rounded-[2rem] border border-slate-800 bg-[#08152d] p-6 shadow-xl shadow-cyan-950/10 transition-all hover:-translate-y-1 hover:border-cyan-500/30 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-cyan-500/10" />

        <div className="relative">
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-300">
              <Sparkles className="h-6 w-6" />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-400">
                Próxima ação
              </p>

              <h3 className="mt-2 text-2xl font-black text-white [.light_&]:text-slate-900">
                Recomendação operacional
              </h3>
            </div>
          </div>

          {nextOrder && actionInfo ? (
            <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <PriorityBadge priority={nextOrder.priority} />
                <StatusBadge status={nextOrder.status} />
              </div>

              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">
                {actionInfo.eyebrow}
              </p>

              <h4 className="mt-2 text-xl font-black text-white [.light_&]:text-slate-900">
                {getOrderNumber(nextOrder)} · {nextOrder.asset}
              </h4>

              <p className="mt-3 text-sm leading-relaxed text-slate-300 [.light_&]:text-slate-600">
                {nextOrder.description}
              </p>

              <div className={`mt-5 rounded-2xl border p-4 ${actionInfo.tone}`}>
                <p className="text-xs font-black uppercase tracking-[0.16em]">
                  Situação
                </p>

                <p className="mt-2 text-lg font-black text-white [.light_&]:text-slate-900">
                  {actionInfo.title}
                </p>

                <p className="mt-2 text-sm leading-relaxed text-slate-300 [.light_&]:text-slate-600">
                  {actionInfo.description}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5">
              <p className="text-xl font-black text-white [.light_&]:text-slate-900">
                Nenhuma ação crítica no momento
              </p>

              <p className="mt-3 text-sm leading-relaxed text-slate-300 [.light_&]:text-slate-600">
                {waitingClosure > 0
                  ? "Há ordens aguardando encerramento pelo gestor. Nenhuma ação técnica é necessária agora."
                  : executing > 0
                    ? "Continue registrando a execução das ordens em andamento."
                    : pending > 0
                      ? "Há ordens pendentes, mas nenhuma marcada como crítica ou de alta prioridade."
                      : "Não há ordens pendentes para execução neste momento."}
              </p>
            </div>
          )}

          <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-cyan-300">
            Clique para abrir o painel de ação
          </p>
        </div>
      </Card>
    </button>
  );
}

function EmptyState({
  activeTab,
  onRefresh,
}: {
  activeTab: string;
  onRefresh: () => void;
}) {
  const content = {
    pending: {
      title: "Nenhuma ordem aguardando execução",
      description:
        "Quando o gestor aprovar novas ordens para este técnico, elas aparecerão aqui para início de execução.",
      icon: ClipboardList,
      tone: "text-amber-300 border-amber-500/20 bg-amber-500/10",
    },
    executing: {
      title: "Nenhuma ordem em execução",
      description:
        "As ordens iniciadas pelo técnico serão exibidas nesta área com ações para registrar manutenção e concluir execução.",
      icon: Wrench,
      tone: "text-cyan-300 border-cyan-500/20 bg-cyan-500/10",
    },
    history: {
      title: "Nenhuma ordem no histórico",
      description:
        "Ordens encerradas, canceladas ou reprovadas serão exibidas aqui para consulta posterior.",
      icon: History,
      tone: "text-emerald-300 border-emerald-500/20 bg-emerald-500/10",
    },
  };

  const current = content[activeTab as keyof typeof content] || content.pending;
  const Icon = current.icon;

  return (
    <Card className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-[#08152d] p-12 text-center shadow-xl shadow-cyan-950/10 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-amber-500/5" />

      <div className="relative mx-auto max-w-lg">
        <div
          className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border ${current.tone}`}
        >
          <Icon className="h-10 w-10" />
        </div>

        <h3 className="text-2xl font-black text-white [.light_&]:text-slate-900">
          {current.title}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-slate-400 [.light_&]:text-slate-500">
          {current.description}
        </p>

        <Button
          type="button"
          onClick={onRefresh}
          className="mt-6 rounded-2xl bg-cyan-500 px-5 font-black text-slate-950 hover:bg-cyan-400"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar ordens
        </Button>
      </div>
    </Card>
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

  const fallbackStatus = {
    bg: "bg-slate-500/10",
    color: "text-slate-300 border-slate-500/20",
    dot: "bg-slate-400",
    label: order.status,
  };

  const statusConfig = safeConfig(STATUS_CONFIG, order.status, fallbackStatus);
  const typeLabel =
    TYPE_CONFIG[order.type as keyof typeof TYPE_CONFIG]?.label || order.type;

  const actionInfo = getOrderActionInfo(order);

  return (
    <Card className="group overflow-hidden rounded-[2rem] border border-slate-800 bg-[#08152d] shadow-xl shadow-cyan-950/10 transition-all hover:-translate-y-0.5 hover:border-cyan-500/30 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
      <div className="flex items-stretch">
        <div className={`w-1.5 shrink-0 ${statusConfig.dot}`} />

        <div className="min-w-0 flex-1 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 font-mono text-xs font-black text-slate-400 [.light_&]:border-slate-200 [.light_&]:bg-slate-50">
                  {getOrderNumber(order)}
                </span>

                <PriorityBadge priority={order.priority} />
                <StatusBadge status={order.status} />
              </div>

              <h3 className="truncate text-xl font-black text-white [.light_&]:text-slate-900">
                {order.asset}
              </h3>

              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-400 [.light_&]:text-slate-500">
                {order.description}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Wrench className="h-3.5 w-3.5" />
                  {typeLabel}
                </span>

                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Aberta em {order.createdAt}
                </span>

                {order.updatedAt !== order.createdAt && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Atualizada em {order.updatedAt}
                  </span>
                )}
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {order.status === "aprovada" && onStartExecution && (
                <Button
                  size="sm"
                  onClick={() => onStartExecution(order)}
                  className="rounded-2xl bg-amber-500 px-4 font-black text-slate-950 hover:bg-amber-400"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Iniciar execução
                </Button>
              )}

              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950/50 text-slate-400 transition-all hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300 [.light_&]:border-slate-200 [.light_&]:bg-slate-50"
                title={expanded ? "Recolher detalhes" : "Ver detalhes"}
              >
                {expanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {order.status === "em_execucao" && (
            <div className="mt-5 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                    Aguardando conclusão pelo técnico
                  </p>

                  <h4 className="mt-2 text-xl font-black text-white [.light_&]:text-slate-900">
                    Finalize a execução quando o serviço estiver concluído
                  </h4>

                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300 [.light_&]:text-slate-600">
                    Registre o que foi feito durante a manutenção. Depois clique
                    em <strong>Concluir execução</strong> para enviar a ordem ao
                    gestor para encerramento formal.
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  {onRegisterMaintenance && (
                    <Button
                      type="button"
                      onClick={() => onRegisterMaintenance(order)}
                      className="rounded-2xl bg-cyan-500 px-4 font-black text-slate-950 hover:bg-cyan-400"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Registrar atividade
                    </Button>
                  )}

                  {onConcludeExecution && (
                    <Button
                      type="button"
                      onClick={() => onConcludeExecution(order)}
                      className="rounded-2xl bg-emerald-500 px-4 font-black text-slate-950 hover:bg-emerald-400"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Concluir execução
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {order.status === "aguardando_encerramento" && (
            <div className="mt-5 rounded-3xl border border-purple-500/20 bg-purple-500/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-300">
                Aguardando encerramento pelo gestor
              </p>

              <h4 className="mt-2 text-xl font-black text-white [.light_&]:text-slate-900">
                Execução enviada para validação final
              </h4>

              <p className="mt-2 text-sm leading-relaxed text-slate-300 [.light_&]:text-slate-600">
                A execução técnica foi concluída. Agora o gestor precisa validar
                as informações e encerrar formalmente a ordem.
              </p>
            </div>
          )}

          {(order.status === "aprovada" ||
            order.status === "reprovada" ||
            order.status === "cancelada" ||
            order.status === "encerrada") && (
            <div className={`mt-5 rounded-3xl border p-5 ${actionInfo.tone}`}>
              <p className="text-xs font-black uppercase tracking-[0.18em]">
                {actionInfo.eyebrow}
              </p>

              <h4 className="mt-2 text-xl font-black text-white [.light_&]:text-slate-900">
                {actionInfo.title}
              </h4>

              <p className="mt-2 text-sm leading-relaxed text-slate-300 [.light_&]:text-slate-600">
                {actionInfo.description}
              </p>
            </div>
          )}

          {expanded && (
            <div className="mt-5 space-y-4 border-t border-slate-800 pt-5 [.light_&]:border-slate-200">
              <div className="grid gap-4 xl:grid-cols-3">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-4 [.light_&]:border-slate-200 [.light_&]:bg-slate-50">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                    Serviço
                  </p>

                  <p className="mt-2 text-sm leading-relaxed text-slate-300 [.light_&]:text-slate-600">
                    {order.description}
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-4 [.light_&]:border-slate-200 [.light_&]:bg-slate-50">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                    Responsável
                  </p>

                  <p className="mt-2 text-sm font-bold text-white [.light_&]:text-slate-900">
                    {order.responsible}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Técnico de manutenção
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-4 [.light_&]:border-slate-200 [.light_&]:bg-slate-50">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                    Situação
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <PriorityBadge priority={order.priority} />
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              </div>

              {order.executionNotes && (
                <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                  <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                    <FileText className="h-4 w-4" />
                    Registro de execução
                  </p>

                  <p className="whitespace-pre-line text-sm leading-relaxed text-cyan-100 [.light_&]:text-cyan-800">
                    {order.executionNotes}
                  </p>
                </div>
              )}

              {order.rejectionReason && (
                <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4">
                  <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-red-300">
                    <XCircle className="h-4 w-4" />
                    Motivo da reprovação
                  </p>

                  <p className="text-sm leading-relaxed text-red-100 [.light_&]:text-red-800">
                    {order.rejectionReason}
                  </p>
                </div>
              )}

              {order.closureNotes && (
                <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                    <ShieldCheck className="h-4 w-4" />
                    Encerramento
                  </p>

                  <p className="text-sm leading-relaxed text-emerald-100 [.light_&]:text-emerald-800">
                    {order.closureNotes}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export function TecnicoOrdens() {
  const user = getCurrentUser();
  const actionPanelRef = useRef<HTMLDivElement | null>(null);
  const [searchParams] = useSearchParams();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  const [maintenanceDialog, setMaintenanceDialog] = useState<Order | null>(null);
  const [maintenanceForm, setMaintenanceForm] = useState({
    tipoIntervencao: "",
    descricao: "",
    notas: "",
  });

  const [concludeDialog, setConcludeDialog] = useState<Order | null>(null);
  const [concludeNotes, setConcludeNotes] = useState("");

  const loadOrders = async () => {
    setLoading(true);

    try {
      const data = await fetchOrders();
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  const scrollToActionPanel = () => {
    window.setTimeout(() => {
      actionPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);
  };

  const openExecutingPanel = () => {
    setActiveTab("executing");
    scrollToActionPanel();
  };

  const refreshOrders = async () => {
    await loadOrders();
  };

  const refreshAndOpenExecutingPanel = async () => {
    await loadOrders();
    setActiveTab("executing");
    scrollToActionPanel();
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    const focus = searchParams.get("focus");

    if (tab === "pending" || tab === "executing" || tab === "history") {
      setActiveTab(tab);
    }

    if (focus === "1") {
      window.setTimeout(() => {
        actionPanelRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 350);
    }
  }, [searchParams]);

  const myOrders = useMemo(() => {
    return orders.filter((order) =>
      isCurrentTechnicianResponsible(order.responsible, user.name)
    );
  }, [orders, user.name]);

  const tabOrders = useMemo(() => {
    return {
      pending: myOrders.filter((order) => order.status === "aprovada"),
      executing: myOrders.filter(
        (order) =>
          order.status === "em_execucao" ||
          order.status === "aguardando_encerramento"
      ),
      history: myOrders.filter(
        (order) =>
          order.status === "encerrada" ||
          order.status === "cancelada" ||
          order.status === "reprovada"
      ),
    };
  }, [myOrders]);

  const currentOrders =
    tabOrders[activeTab as keyof typeof tabOrders] || tabOrders.pending;

  const allMy = myOrders.length;
  const pending = tabOrders.pending.length;
  const inExecution = myOrders.filter(
    (order) => order.status === "em_execucao"
  ).length;
  const waitingClosure = myOrders.filter(
    (order) => order.status === "aguardando_encerramento"
  ).length;
  const done = myOrders.filter((order) => order.status === "encerrada").length;
  const history = tabOrders.history.length;
  const highImpact = myOrders.filter(
    (order) => order.priority === "alta" || order.priority === "critica"
  ).length;

  const nextOrder = useMemo(() => {
    const executing = [...tabOrders.executing]
      .filter((order) => order.status === "em_execucao")
      .sort((a, b) => getPriorityWeight(b.priority) - getPriorityWeight(a.priority))
      .at(0);

    if (executing) return executing;

    const pendingOrder = [...tabOrders.pending]
      .sort((a, b) => getPriorityWeight(b.priority) - getPriorityWeight(a.priority))
      .at(0);

    if (pendingOrder) return pendingOrder;

    return [...tabOrders.executing]
      .filter((order) => order.status === "aguardando_encerramento")
      .sort((a, b) => getPriorityWeight(b.priority) - getPriorityWeight(a.priority))
      .at(0);
  }, [tabOrders.executing, tabOrders.pending]);

  const handleStartExecution = async (order: Order) => {
    await updateOrder(order.id, { status: "em_execucao" });
    await supabase
      .from("assets")
      .update({ status: "maintenance" })
      .eq("name", order.asset);

    await refreshOrders();
    setActiveTab("executing");
    scrollToActionPanel();
  };

  const handleRegisterMaintenance = (order: Order) => {
    setMaintenanceDialog(order);
    setMaintenanceForm({ tipoIntervencao: "", descricao: "", notas: "" });
  };

  const handleConcludeExecution = (order: Order) => {
    setConcludeDialog(order);
    setConcludeNotes("");
  };

  const confirmRegisterMaintenance = async () => {
    if (!maintenanceDialog) return;

    const newNote = `[${new Date().toLocaleString("pt-BR")}] ${
      maintenanceForm.tipoIntervencao
    }: ${maintenanceForm.descricao}${
      maintenanceForm.notas ? ` — ${maintenanceForm.notas}` : ""
    }`;

    const existing = maintenanceDialog.executionNotes
      ? `${maintenanceDialog.executionNotes}\n`
      : "";

    await updateOrder(maintenanceDialog.id, {
      executionNotes: existing + newNote,
    });

    setMaintenanceDialog(null);
    await refreshOrders();
    setActiveTab("executing");
    scrollToActionPanel();
  };

  const confirmConclude = async () => {
    if (!concludeDialog) return;

    const existing = concludeDialog.executionNotes
      ? `${concludeDialog.executionNotes}\n`
      : "";

    const finalNote = concludeNotes
      ? `${existing}[Conclusão] ${concludeNotes}`
      : existing.trim() || "Execução concluída pelo técnico.";

    await updateOrder(concludeDialog.id, {
      status: "aguardando_encerramento",
      executionNotes: finalNote,
    });

    setConcludeDialog(null);
    await refreshOrders();
    setActiveTab("executing");
    scrollToActionPanel();
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-gradient-to-r from-[#061327] via-[#0b1f43] to-[#0c3c52] p-8 shadow-2xl shadow-cyan-950/20 [.light_&]:border-slate-200">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
              Painel do Técnico
            </p>

            <h1 className="mt-3 flex flex-wrap items-center gap-3 text-4xl font-black text-white">
              <HardHat className="h-9 w-9 text-amber-300" />
              Minhas Ordens
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300">
              {user.name} · Técnico de Manutenção. Acompanhe suas ordens
              atribuídas, registre intervenções, finalize execuções e mantenha
              o histórico técnico atualizado.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-200">
                Data operacional: {getTodayBR()}
              </span>

              <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-amber-200">
                {highImpact} ordem(ns) de alto impacto
              </span>

              {inExecution > 0 && (
                <button
                  type="button"
                  onClick={openExecutingPanel}
                  className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-200 transition-all hover:border-cyan-300/50 hover:bg-cyan-400/20"
                >
                  {inExecution} aguardando conclusão
                </button>
              )}
            </div>
          </div>

          <Button
            type="button"
            onClick={refreshAndOpenExecutingPanel}
            className="h-12 rounded-2xl bg-cyan-500 px-6 font-black text-slate-950 hover:bg-cyan-400"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PremiumMetricCard
          label="Minhas ordens"
          value={allMy}
          helper="Total de ordens atribuídas ao técnico."
          icon={ClipboardList}
          tone="cyan"
        />

        <PremiumMetricCard
          label="Pendentes"
          value={pending}
          helper="Ordens aprovadas aguardando início."
          icon={AlertCircle}
          tone="amber"
          onClick={() => {
            setActiveTab("pending");
            scrollToActionPanel();
          }}
        />

        <PremiumMetricCard
          label="Em execução"
          value={inExecution}
          helper={`${waitingClosure} aguardando encerramento formal.`}
          icon={Timer}
          tone="rose"
          onClick={openExecutingPanel}
        />

        <PremiumMetricCard
          label="Concluídas"
          value={done}
          helper={`${getCompletionPercent(done, allMy)}% do ciclo atribuído.`}
          icon={CheckCircle}
          tone="emerald"
          onClick={() => {
            setActiveTab("history");
            scrollToActionPanel();
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.9fr]">
        <TechnicianInsightCard
          pending={pending}
          executing={inExecution}
          waitingClosure={waitingClosure}
          done={done}
          history={history}
          total={allMy}
        />

        <RecommendedAction
          nextOrder={nextOrder}
          pending={pending}
          executing={inExecution}
          waitingClosure={waitingClosure}
          onOpenAction={openExecutingPanel}
        />
      </div>

      <div ref={actionPanelRef} className="space-y-4 scroll-mt-8">
        <Card className="rounded-[2rem] border border-slate-800 bg-[#08152d] p-5 shadow-xl shadow-cyan-950/10 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => {
              const count =
                tabOrders[tab.key as keyof typeof tabOrders]?.length ?? 0;
              const active = activeTab === tab.key;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black transition-all ${
                    active
                      ? "border-amber-500/30 bg-amber-500/15 text-amber-300"
                      : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-300 [.light_&]:border-slate-200 [.light_&]:bg-slate-50 [.light_&]:text-slate-600"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}

                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-black ${
                      active
                        ? "bg-amber-500/20 text-amber-200"
                        : "bg-slate-800 text-slate-400 [.light_&]:bg-slate-200 [.light_&]:text-slate-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        {loading ? (
          <Card className="rounded-[2rem] border border-slate-800 bg-[#08152d] p-12 text-center text-slate-400 shadow-xl shadow-cyan-950/10 [.light_&]:border-slate-200 [.light_&]:bg-white">
            <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin text-cyan-400" />
            Carregando ordens de manutenção...
          </Card>
        ) : currentOrders.length === 0 ? (
          <EmptyState activeTab={activeTab} onRefresh={refreshAndOpenExecutingPanel} />
        ) : (
          <div className="space-y-4">
            {currentOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStartExecution={handleStartExecution}
                onRegisterMaintenance={handleRegisterMaintenance}
                onConcludeExecution={handleConcludeExecution}
              />
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={!!maintenanceDialog}
        onOpenChange={() => setMaintenanceDialog(null)}
      >
        <DialogContent className="max-w-2xl rounded-[2rem] border-slate-700 bg-slate-900 text-white shadow-2xl [.light_&]:border-slate-200 [.light_&]:bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-black text-white [.light_&]:text-slate-900">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
                <FileText className="h-5 w-5" />
              </div>
              Registrar atividade técnica
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {maintenanceDialog && (
              <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-4 [.light_&]:border-slate-200 [.light_&]:bg-slate-50">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  Ordem / Ativo
                </p>

                <p className="mt-2 text-base font-black text-white [.light_&]:text-slate-900">
                  {getOrderNumber(maintenanceDialog)} ·{" "}
                  {maintenanceDialog.asset}
                </p>

                <p className="mt-1 text-sm text-slate-400 [.light_&]:text-slate-500">
                  {maintenanceDialog.description}
                </p>
              </div>
            )}

            <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-4">
              <p className="text-sm font-bold text-cyan-100 [.light_&]:text-cyan-800">
                Registre aqui o que já foi feito na manutenção. Isso não conclui
                a ordem automaticamente. Para finalizar o serviço, use o botão
                <strong> Concluir execução</strong>.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-300 [.light_&]:text-slate-700">
                Tipo de Intervenção *
              </Label>

              <Select
                value={maintenanceForm.tipoIntervencao}
                onValueChange={(value) =>
                  setMaintenanceForm((form) => ({
                    ...form,
                    tipoIntervencao: value,
                  }))
                }
              >
                <SelectTrigger className="h-12 rounded-2xl border-slate-700 bg-slate-800 text-white [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:text-slate-900">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>

                <SelectContent className="border-slate-700 bg-slate-800">
                  <SelectItem value="Substituição de peça" className="text-white">
                    Substituição de peça
                  </SelectItem>
                  <SelectItem value="Lubrificação" className="text-white">
                    Lubrificação
                  </SelectItem>
                  <SelectItem value="Ajuste/Calibração" className="text-white">
                    Ajuste / Calibração
                  </SelectItem>
                  <SelectItem value="Inspeção" className="text-white">
                    Inspeção
                  </SelectItem>
                  <SelectItem value="Limpeza" className="text-white">
                    Limpeza
                  </SelectItem>
                  <SelectItem value="Reparo elétrico" className="text-white">
                    Reparo elétrico
                  </SelectItem>
                  <SelectItem value="Reparo mecânico" className="text-white">
                    Reparo mecânico
                  </SelectItem>
                  <SelectItem value="Teste funcional" className="text-white">
                    Teste funcional
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-300 [.light_&]:text-slate-700">
                Descrição da Atividade *
              </Label>

              <Textarea
                placeholder="Descreva detalhadamente o que foi realizado..."
                value={maintenanceForm.descricao}
                onChange={(event) =>
                  setMaintenanceForm((form) => ({
                    ...form,
                    descricao: event.target.value,
                  }))
                }
                className="min-h-[110px] resize-none rounded-2xl border-slate-700 bg-slate-800 text-white placeholder:text-slate-600 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:text-slate-900"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-300 [.light_&]:text-slate-700">
                Observações
              </Label>

              <Textarea
                placeholder="Observações adicionais, peças utilizadas, medições ou testes..."
                value={maintenanceForm.notas}
                onChange={(event) =>
                  setMaintenanceForm((form) => ({
                    ...form,
                    notas: event.target.value,
                  }))
                }
                className="min-h-[90px] resize-none rounded-2xl border-slate-700 bg-slate-800 text-white placeholder:text-slate-600 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:text-slate-900"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setMaintenanceDialog(null)}
              className="rounded-2xl border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:text-slate-700"
            >
              Cancelar
            </Button>

            <Button
              type="button"
              onClick={confirmRegisterMaintenance}
              disabled={
                !maintenanceForm.tipoIntervencao || !maintenanceForm.descricao
              }
              className="rounded-2xl bg-cyan-500 font-black text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
            >
              Registrar atividade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!concludeDialog}
        onOpenChange={() => setConcludeDialog(null)}
      >
        <DialogContent className="max-w-2xl rounded-[2rem] border-slate-700 bg-slate-900 text-white shadow-2xl [.light_&]:border-slate-200 [.light_&]:bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-black text-white [.light_&]:text-slate-900">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                <CheckCircle className="h-5 w-5" />
              </div>
              Concluir execução técnica
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {concludeDialog && (
              <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-4 [.light_&]:border-slate-200 [.light_&]:bg-slate-50">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  Ordem / Ativo
                </p>

                <p className="mt-2 text-base font-black text-white [.light_&]:text-slate-900">
                  {getOrderNumber(concludeDialog)} · {concludeDialog.asset}
                </p>

                <p className="mt-1 text-sm text-slate-400 [.light_&]:text-slate-500">
                  {concludeDialog.description}
                </p>
              </div>
            )}

            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <p className="text-sm font-bold text-emerald-100 [.light_&]:text-emerald-800">
                Ao concluir a execução, esta ordem será enviada para o gestor
                realizar o encerramento formal.
              </p>

              <p className="mt-2 text-sm leading-relaxed text-slate-300 [.light_&]:text-slate-600">
                Depois disso, ela ficará como{" "}
                <strong>Aguardando Encerramento</strong>. O gestor validará as
                informações registradas e finalizará o ciclo da ordem.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-300 [.light_&]:text-slate-700">
                Relatório Final de Execução
              </Label>

              <Textarea
                placeholder="Descreva o resultado final, testes realizados, condição do equipamento e recomendações..."
                value={concludeNotes}
                onChange={(event) => setConcludeNotes(event.target.value)}
                className="min-h-[140px] resize-none rounded-2xl border-slate-700 bg-slate-800 text-white placeholder:text-slate-600 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:text-slate-900"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConcludeDialog(null)}
              className="rounded-2xl border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:text-slate-700"
            >
              Cancelar
            </Button>

            <Button
              type="button"
              onClick={confirmConclude}
              className="rounded-2xl bg-emerald-500 font-black text-slate-950 hover:bg-emerald-400"
            >
              Enviar para encerramento do gestor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}