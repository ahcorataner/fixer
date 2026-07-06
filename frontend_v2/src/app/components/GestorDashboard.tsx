import { useEffect, useMemo, useState } from "react";
import type { ElementType } from "react";
import { useNavigate } from "react-router";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  Download,
  FileText,
  Gauge,
  HelpCircle,
  Package,
  ShieldAlert,
  ShieldCheck,
  Target,
  TrendingUp,
  WrenchIcon,
  X,
} from "lucide-react";
import {
  fetchOrders,
  STATUS_CONFIG,
  type Order,
} from "../lib/ordersStore";

type MetricKey = "mtbf" | "mttr" | "disponibilidade";

type Asset = {
  id?: string | number;
  name?: string;
  status?: string;
  location?: string;
  type?: string;
};

type ChartItem = {
  label: string;
  value: number;
  color: string;
};

type DashboardMetrics = {
  totalOrders: number;
  inExecution: Order[];
  closed: Order[];
  canceled: Order[];
  drafts: Order[];
  pendingValidation: Order[];
  pendingClosure: Order[];
  rejected: Order[];
  alertOrders: Order[];
  totalAssets: number;
  operationalCount: number;
  maintenanceCount: number;
  unavailableCount: number;
  availability: number;
  lowPriority: number;
  mediumPriority: number;
  highPriority: number;
  criticalPriority: number;
};

const metricInfo = {
  mtbf: {
    title: "MTBF",
    name: "Tempo Médio Entre Falhas",
    description:
      "Indica o tempo médio que um ativo consegue operar antes de apresentar uma falha. Quanto maior o MTBF, melhor a confiabilidade do ativo.",
    formula: "MTBF = Tempo total de operação / Número de falhas",
    example: "Exemplo: 720 horas de operação / 1 falha = 720 horas.",
  },
  mttr: {
    title: "MTTR",
    name: "Tempo Médio Para Reparo",
    description:
      "Indica o tempo médio necessário para reparar um ativo após uma falha. Quanto menor o MTTR, melhor a eficiência da manutenção.",
    formula: "MTTR = Tempo total de reparo / Número de reparos",
    example: "Exemplo: 45 horas de reparo / 10 reparos = 4,5 horas.",
  },
  disponibilidade: {
    title: "Disponibilidade",
    name: "Disponibilidade Operacional",
    description:
      "Mostra o percentual de tempo em que o ativo ou sistema esteve disponível para operação.",
    formula: "Disponibilidade = MTBF / (MTBF + MTTR) × 100",
    example: "Exemplo: 720 / (720 + 4,5) × 100 = 99,38%.",
  },
};

function parseDateBR(date?: string) {
  if (!date) return new Date();

  const parts = date.split("/");

  if (parts.length === 3) {
    const [day, month, year] = parts.map(Number);

    if (day && month && year) {
      return new Date(year, month - 1, day);
    }
  }

  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function formatDateBR(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

function getTodayBRFull() {
  return new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function diffDays(start: Date, end: Date) {
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / oneDay));
}

function percent(value: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((value / total) * 100);
}

function getDurationByStatus(status: Order["status"]) {
  if (status === "encerrada") return 8;
  if (status === "em_execucao") return 10;
  if (status === "em_validacao") return 7;
  if (status === "aguardando_encerramento") return 6;
  if (status === "reprovada") return 5;
  if (status === "rascunho") return 4;

  return 5;
}

function getGanttColor(status: Order["status"]) {
  if (status === "encerrada") {
    return {
      bar: "bg-emerald-500",
      text: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    };
  }

  if (status === "em_execucao") {
    return {
      bar: "bg-amber-500",
      text: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    };
  }

  if (status === "em_validacao") {
    return {
      bar: "bg-blue-500",
      text: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    };
  }

  if (status === "aguardando_encerramento") {
    return {
      bar: "bg-cyan-500",
      text: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    };
  }

  if (status === "reprovada") {
    return {
      bar: "bg-red-500",
      text: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    };
  }

  if (status === "rascunho") {
    return {
      bar: "bg-purple-500",
      text: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    };
  }

  return {
    bar: "bg-slate-500",
    text: "text-slate-400",
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
  };
}

function buildPath(points: { x: number; y: number }[]) {
  return points
    .map((point, index) => {
      const command = index === 0 ? "M" : "L";
      return `${command} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
    })
    .join(" ");
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getAvailabilityClassification(availability: number) {
  if (availability >= 85) return "satisfatória";
  if (availability >= 60) return "moderada";
  return "crítica";
}

function getExecutiveDiagnosis(metrics: DashboardMetrics) {
  const availabilityStatus = getAvailabilityClassification(metrics.availability);
  const highRiskOrders = metrics.highPriority + metrics.criticalPriority;

  const mainDiagnosis =
    metrics.availability >= 85
      ? "A operação apresenta uma condição geral satisfatória, com disponibilidade dentro de um patamar saudável para acompanhamento executivo."
      : metrics.availability >= 60
        ? "A operação apresenta uma condição moderada. A disponibilidade ainda permite continuidade operacional, mas há sinais que exigem acompanhamento preventivo e gerencial."
        : "A operação apresenta uma condição crítica. A disponibilidade está abaixo do ideal e recomenda-se priorização imediata de ativos indisponíveis, ordens pendentes e falhas recorrentes.";

  const riskDiagnosis =
    highRiskOrders > 0
      ? `Foram identificadas ${highRiskOrders} ordens com prioridade alta ou crítica, indicando risco operacional relevante caso não sejam tratadas com prioridade.`
      : "Não há concentração relevante de ordens em prioridade alta ou crítica neste momento.";

  const pendingDiagnosis =
    metrics.alertOrders.length > 0
      ? `Existem ${metrics.alertOrders.length} ordens que requerem ação, incluindo rascunhos, validações, encerramentos pendentes ou reprovações.`
      : "O fluxo de ordens não apresenta pendências relevantes no momento.";

  return {
    availabilityStatus,
    mainDiagnosis,
    riskDiagnosis,
    pendingDiagnosis,
    recommendations: [
      "Priorizar ordens críticas e de alta prioridade antes de novas demandas operacionais.",
      "Monitorar ativos indisponíveis ou com histórico de manutenção recorrente.",
      "Reduzir o tempo médio de reparo, acompanhando o MTTR por tipo de manutenção.",
      "Usar o MTBF para identificar ativos com baixa confiabilidade operacional.",
      "Revisar ordens canceladas para identificar falhas de abertura, planejamento ou execução.",
      "Acompanhar pendências de validação e encerramento para evitar acúmulo no fluxo.",
      "Aumentar a disponibilidade operacional até uma meta mínima de 85%.",
      "Utilizar os indicadores do dashboard como base para reuniões de manutenção e priorização.",
    ],
  };
}

function PremiumKpi({
  label,
  value,
  unit,
  helper,
  icon: Icon,
  accent,
  infoKey,
  onInfoClick,
}: {
  label: string;
  value: string | number;
  unit?: string;
  helper: string;
  icon: ElementType;
  accent: "cyan" | "blue" | "emerald" | "amber";
  infoKey?: MetricKey;
  onInfoClick?: (key: MetricKey) => void;
}) {
  const accents = {
    cyan: {
      icon: "text-cyan-300",
      box: "border-cyan-400/20 bg-cyan-400/10",
      glow: "from-cyan-500/20",
    },
    blue: {
      icon: "text-blue-300",
      box: "border-blue-400/20 bg-blue-400/10",
      glow: "from-blue-500/20",
    },
    emerald: {
      icon: "text-emerald-300",
      box: "border-emerald-400/20 bg-emerald-400/10",
      glow: "from-emerald-500/20",
    },
    amber: {
      icon: "text-amber-300",
      box: "border-amber-400/20 bg-amber-400/10",
      glow: "from-amber-500/20",
    },
  };

  const current = accents[accent];

  return (
    <Card className="group relative overflow-hidden rounded-[2rem] border border-slate-800 bg-[#08152d] p-5 shadow-xl shadow-cyan-950/10 transition-all hover:-translate-y-1 hover:border-cyan-500/30 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${current.glow} via-transparent to-transparent opacity-70`}
      />

      {infoKey && onInfoClick && (
        <button
          type="button"
          onClick={() => onInfoClick(infoKey)}
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-950/60 text-slate-400 transition-all hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-300 [.light_&]:border-slate-200 [.light_&]:bg-slate-50 [.light_&]:text-slate-500"
          title={`Entenda o indicador ${label}`}
        >
          <HelpCircle className="h-4 w-4" />
        </button>
      )}

      <div className="relative">
        <div className="mb-5 flex items-start justify-between gap-4 pr-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
            {label}
          </p>

          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${current.box}`}
          >
            <Icon className={`h-6 w-6 ${current.icon}`} />
          </div>
        </div>

        <div className="flex items-baseline gap-1">
          <p className="text-4xl font-black text-white [.light_&]:text-slate-900">
            {value}
          </p>

          {unit && <p className="text-sm font-medium text-slate-400">{unit}</p>}
        </div>

        <p className="mt-3 text-sm text-slate-400 [.light_&]:text-slate-500">
          {helper}
        </p>
      </div>
    </Card>
  );
}

function SimpleBarChart({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle: string;
  data: ChartItem[];
}) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <Card className="rounded-[2rem] border border-slate-800 bg-[#08152d] p-6 shadow-xl shadow-cyan-950/10 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-400">
          Análise
        </p>

        <h3 className="mt-2 text-2xl font-black text-white [.light_&]:text-slate-900">
          {title}
        </h3>

        <p className="mt-2 text-sm text-slate-400 [.light_&]:text-slate-500">
          {subtitle}
        </p>
      </div>

      <div className="space-y-5">
        {data.map((item) => {
          const width =
            item.value > 0 ? Math.max((item.value / max) * 100, 8) : 0;

          return (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                <span className="font-bold text-slate-300 [.light_&]:text-slate-700">
                  {item.label}
                </span>

                <span className="font-black text-white [.light_&]:text-slate-900">
                  {item.value}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-800 [.light_&]:bg-slate-200">
                <div
                  className={`h-full rounded-full ${item.color}`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function PerformanceChart({
  orders,
  availability,
}: {
  orders: Order[];
  availability: number;
}) {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

  const monthlyData = months.map((label, index) => {
    const base = Math.max(orders.length, 1);
    const simulatedOrders = Math.max(
      1,
      Math.round(base * (0.55 + index * 0.08))
    );

    const simulatedAvailability = Math.max(
      45,
      Math.min(95, Math.round(availability + (index - 3) * 4))
    );

    return {
      label,
      orders: simulatedOrders,
      availability: simulatedAvailability,
    };
  });

  const width = 760;
  const height = 290;
  const paddingX = 38;
  const chartTop = 28;
  const chartBottom = 230;
  const chartHeight = chartBottom - chartTop;
  const step = (width - paddingX * 2) / monthlyData.length;
  const barWidth = 38;
  const maxOrders = Math.max(...monthlyData.map((item) => item.orders), 12);

  const points = monthlyData.map((item, index) => {
    const x = paddingX + index * step + step / 2;
    const y =
      chartBottom - ((item.availability - 40) / 60) * (chartHeight - 8);

    return { x, y };
  });

  const linePath = buildPath(points);

  return (
    <Card className="rounded-[2rem] border border-slate-800 bg-[#08152d] p-6 shadow-xl shadow-cyan-950/10 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-400">
            Performance Operacional
          </p>

          <h3 className="mt-2 text-2xl font-black text-white [.light_&]:text-slate-900">
            Ordens x Disponibilidade
          </h3>

          <p className="mt-2 text-sm text-slate-400 [.light_&]:text-slate-500">
            Evolução consolidada das ordens de manutenção e da disponibilidade
            operacional.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="h-3 w-3 rounded-full bg-cyan-400" />
            Ordens
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span className="h-[3px] w-6 rounded-full bg-emerald-400" />
            Disponibilidade
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-[310px] w-full min-w-[700px]"
        >
          {[0, 1, 2, 3].map((line) => {
            const y = chartTop + (chartHeight / 3) * line;

            return (
              <line
                key={line}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="rgba(148,163,184,0.14)"
                strokeDasharray="4 6"
              />
            );
          })}

          {monthlyData.map((item, index) => {
            const x = paddingX + index * step + (step - barWidth) / 2;
            const barHeight = (item.orders / maxOrders) * (chartHeight - 20);
            const y = chartBottom - barHeight;

            return (
              <g key={item.label}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="12"
                  fill="rgba(34,211,238,0.85)"
                />

                <text
                  x={x + barWidth / 2}
                  y={y - 8}
                  textAnchor="middle"
                  fill="#e2e8f0"
                  fontSize="11"
                  fontWeight="800"
                >
                  {item.orders}
                </text>

                <text
                  x={x + barWidth / 2}
                  y={chartBottom + 28}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="12"
                  fontWeight="700"
                >
                  {item.label}
                </text>
              </g>
            );
          })}

          <path
            d={linePath}
            fill="none"
            stroke="#22c55e"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((point, index) => (
            <g key={monthlyData[index].label}>
              <circle
                cx={point.x}
                cy={point.y}
                r="11"
                fill="rgba(34,197,94,0.15)"
              />
              <circle cx={point.x} cy={point.y} r="6" fill="#22c55e" />

              <text
                x={point.x}
                y={point.y - 15}
                textAnchor="middle"
                fill="#e2e8f0"
                fontSize="11"
                fontWeight="800"
              >
                {monthlyData[index].availability}%
              </text>
            </g>
          ))}
        </svg>
      </div>
    </Card>
  );
}

function DonutStatusCard({
  operational,
  maintenance,
  unavailable,
}: {
  operational: number;
  maintenance: number;
  unavailable: number;
}) {
  const total = Math.max(operational + maintenance + unavailable, 1);
  const operationalPercent = (operational / total) * 100;
  const maintenancePercent = (maintenance / total) * 100;

  const conic = `conic-gradient(
    #14d39a 0% ${operationalPercent}%,
    #fbbf24 ${operationalPercent}% ${operationalPercent + maintenancePercent}%,
    #fb7185 ${operationalPercent + maintenancePercent}% 100%
  )`;

  return (
    <Card className="rounded-[2rem] border border-slate-800 bg-[#08152d] p-6 shadow-xl shadow-cyan-950/10 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-400">
        Saúde dos Ativos
      </p>

      <h3 className="mt-2 text-2xl font-black text-white [.light_&]:text-slate-900">
        Status operacional
      </h3>

      <p className="mt-2 text-sm text-slate-400 [.light_&]:text-slate-500">
        Distribuição consolidada dos ativos cadastrados no sistema.
      </p>

      <div className="mt-8 flex flex-col items-center gap-6">
        <div
          className="relative flex h-48 w-48 items-center justify-center rounded-full shadow-2xl shadow-cyan-950/20"
          style={{ background: conic }}
        >
          <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-[#08152d] [.light_&]:bg-white">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Total
            </span>

            <span className="text-4xl font-black text-white [.light_&]:text-slate-900">
              {total}
            </span>

            <span className="text-sm text-slate-400">ativos</span>
          </div>
        </div>

        <div className="w-full space-y-3">
          <LegendRow
            label="Operacionais"
            value={operational}
            color="bg-emerald-400"
          />
          <LegendRow
            label="Em manutenção"
            value={maintenance}
            color="bg-amber-400"
          />
          <LegendRow
            label="Indisponíveis"
            value={unavailable}
            color="bg-rose-400"
          />
        </div>
      </div>
    </Card>
  );
}

function LegendRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3 [.light_&]:border-slate-200 [.light_&]:bg-slate-50">
      <div className="flex items-center gap-3">
        <span className={`h-3 w-3 rounded-full ${color}`} />
        <span className="text-sm text-slate-300 [.light_&]:text-slate-700">
          {label}
        </span>
      </div>

      <span className="text-lg font-black text-white [.light_&]:text-slate-900">
        {value}
      </span>
    </div>
  );
}

function ActionPanel({
  alertOrders,
  unavailableCount,
  navigate,
}: {
  alertOrders: Order[];
  unavailableCount: number;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const actions = [
    {
      title: "Monitorar ativos indisponíveis",
      subtitle:
        unavailableCount > 0
          ? `${unavailableCount} ativo(s) exigem acompanhamento operacional.`
          : "Nenhum ativo indisponível no momento.",
      tone: "rose",
    },
    {
      title: "Revisar ordens pendentes",
      subtitle:
        alertOrders.length > 0
          ? `${alertOrders.length} ordem(ns) precisam de validação ou encerramento.`
          : "Fluxo de ordens está sob controle.",
      tone: "amber",
    },
    {
      title: "Acompanhar indicadores de manutenção",
      subtitle: "Use MTBF, MTTR e disponibilidade para decisões gerenciais.",
      tone: "cyan",
    },
  ];

  return (
    <Card className="rounded-[2rem] border border-slate-800 bg-[#08152d] p-6 shadow-xl shadow-cyan-950/10 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-400">
            Gestão
          </p>

          <h3 className="mt-2 text-2xl font-black text-white [.light_&]:text-slate-900">
            Ações prioritárias
          </h3>

          <p className="mt-2 text-sm text-slate-400 [.light_&]:text-slate-500">
            Recomendações rápidas para continuidade operacional.
          </p>
        </div>

        <Button
          onClick={() => navigate("/work-orders")}
          className="rounded-2xl bg-cyan-500 px-4 text-slate-950 hover:bg-cyan-400"
        >
          Gerenciar
        </Button>
      </div>

      <div className="space-y-4">
        {actions.map((item) => {
          const tones = {
            rose: "border-rose-500/20 bg-rose-500/10 text-rose-300",
            amber: "border-amber-500/20 bg-amber-500/10 text-amber-300",
            cyan: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
          };

          return (
            <button
              key={item.title}
              type="button"
              onClick={() => navigate("/work-orders")}
              className="group flex w-full items-start gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:border-cyan-500/30 hover:bg-white/10 [.light_&]:border-slate-200 [.light_&]:bg-slate-50"
            >
              <div
                className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
                  tones[item.tone as keyof typeof tones]
                }`}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="font-black text-white [.light_&]:text-slate-900">
                  {item.title}
                </h4>

                <p className="mt-1 text-sm leading-relaxed text-slate-400 [.light_&]:text-slate-500">
                  {item.subtitle}
                </p>
              </div>

              <ArrowRight className="mt-2 h-4 w-4 text-slate-500 transition-all group-hover:translate-x-1 group-hover:text-cyan-400" />
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function GanttPanel({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <Card className="rounded-[2rem] border border-slate-800 bg-[#08152d] p-8 text-center text-slate-400 [.light_&]:border-slate-200 [.light_&]:bg-white">
        Nenhuma manutenção registrada no momento.
      </Card>
    );
  }

  const ganttOrders = orders.slice(0, 6).map((task) => {
    const startDate = parseDateBR(task.createdAt);
    const duration = getDurationByStatus(task.status);
    const endDate = new Date(startDate);

    endDate.setDate(startDate.getDate() + duration);

    return {
      ...task,
      startDate,
      endDate,
      duration,
    };
  });

  const minDate = new Date(
    Math.min(...ganttOrders.map((item) => item.startDate.getTime()))
  );

  const maxDate = new Date(
    Math.max(...ganttOrders.map((item) => item.endDate.getTime()))
  );

  const totalDays = Math.max(diffDays(minDate, maxDate), 1);

  const dateLabels = Array.from({ length: 6 }).map((_, index) => {
    const date = new Date(minDate);
    date.setDate(minDate.getDate() + Math.round((totalDays / 5) * index));
    return date;
  });

  return (
    <Card className="rounded-[2rem] border border-slate-800 bg-[#08152d] p-6 shadow-xl shadow-cyan-950/10 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
            <Calendar className="h-6 w-6" />
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-400">
              Timeline operacional
            </p>

            <h3 className="mt-2 text-2xl font-black text-white [.light_&]:text-slate-900">
              Últimas manutenções
            </h3>

            <p className="mt-2 text-sm text-slate-400 [.light_&]:text-slate-500">
              Visualização em formato Gantt com duração das ordens mais recentes.
            </p>
          </div>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
          <ShieldAlert className="h-5 w-5" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[920px]">
          <div className="mb-4 grid grid-cols-[230px_1fr] gap-4 border-b border-white/10 pb-4 [.light_&]:border-slate-200">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
              Ordem / Ativo
            </div>

            <div className="grid grid-cols-6 text-xs font-black text-slate-500">
              {dateLabels.map((date) => (
                <div key={date.toISOString()} className="text-center">
                  {formatDateBR(date)}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {ganttOrders.map((task) => {
              const startOffset = diffDays(minDate, task.startDate);
              const left = (startOffset / totalDays) * 100;
              const width = Math.max((task.duration / totalDays) * 100, 8);
              const safeWidth = Math.min(width, 100 - left);
              const statusStyle = getGanttColor(task.status);
              const statusLabel =
                STATUS_CONFIG[task.status]?.label || task.status;

              return (
                <div
                  key={task.id}
                  className="grid grid-cols-[230px_1fr] gap-4 rounded-3xl border border-slate-800 bg-[#091a35] p-4 transition-all hover:border-cyan-500/30 [.light_&]:border-slate-200 [.light_&]:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-base font-black text-white [.light_&]:text-slate-900">
                      {task.asset}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {task.type} · {statusLabel}
                    </p>

                    <div
                      className={`mt-3 inline-flex rounded-full border px-3 py-1 text-[11px] font-black ${statusStyle.border} ${statusStyle.bg} ${statusStyle.text}`}
                    >
                      {formatDateBR(task.startDate)} até{" "}
                      {formatDateBR(task.endDate)}
                    </div>
                  </div>

                  <div className="relative flex items-center">
                    <div className="absolute inset-0 grid grid-cols-6">
                      {dateLabels.map((date) => (
                        <div
                          key={date.toISOString()}
                          className="border-l border-slate-800/70 first:border-l-0 [.light_&]:border-slate-200"
                        />
                      ))}
                    </div>

                    <div className="relative h-10 w-full rounded-full bg-slate-800 [.light_&]:bg-slate-200">
                      <div
                        className={`absolute top-1/2 flex h-6 -translate-y-1/2 items-center justify-center rounded-full ${statusStyle.bar} px-3 shadow-lg`}
                        style={{
                          left: `${left}%`,
                          width: `${safeWidth}%`,
                        }}
                      >
                        <span className="truncate text-[11px] font-black text-white">
                          {task.duration} dias
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-800 pt-4 text-xs font-bold text-slate-500 [.light_&]:border-slate-200">
            <LegendDot label="Encerrada" color="bg-emerald-500" />
            <LegendDot label="Em execução" color="bg-amber-500" />
            <LegendDot label="Em validação" color="bg-blue-500" />
            <LegendDot label="Aguardando encerramento" color="bg-cyan-500" />
            <LegendDot label="Reprovada" color="bg-red-500" />
            <LegendDot label="Rascunho" color="bg-purple-500" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function LegendDot({ label, color }: { label: string; color: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      {label}
    </span>
  );
}

function MetricModal({
  infoOpen,
  onClose,
}: {
  infoOpen: MetricKey;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl [.light_&]:border-slate-200 [.light_&]:bg-white">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-cyan-400">
              {metricInfo[infoOpen].title}
            </p>

            <h2 className="text-xl font-black text-white [.light_&]:text-slate-900">
              {metricInfo[infoOpen].name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 transition-colors hover:text-white [.light_&]:hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-slate-300 [.light_&]:text-slate-600">
          {metricInfo[infoOpen].description}
        </p>

        <div className="mb-4 rounded-2xl border border-slate-800 bg-slate-950 p-4 [.light_&]:border-slate-200 [.light_&]:bg-slate-50">
          <p className="mb-1 text-xs font-black uppercase tracking-wider text-slate-500">
            Fórmula
          </p>

          <p className="font-mono text-sm text-cyan-300 [.light_&]:text-cyan-700">
            {metricInfo[infoOpen].formula}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-4 [.light_&]:border-slate-200 [.light_&]:bg-white">
          <p className="mb-1 text-xs font-black uppercase tracking-wider text-slate-500">
            Exemplo
          </p>

          <p className="text-sm text-slate-300 [.light_&]:text-slate-600">
            {metricInfo[infoOpen].example}
          </p>
        </div>
      </div>
    </div>
  );
}

function AnalysisBar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const width =
    total > 0 ? Math.max((value / total) * 100, value > 0 ? 8 : 0) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-bold text-slate-700">{label}</span>
        <span className="font-black text-slate-900">{value}</span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function AnalysisKpi({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black text-[#082f4d]">{value}</p>
    </div>
  );
}

function AnalysisBox({
  title,
  items,
}: {
  title: string;
  items: Array<[string, string | number]>;
}) {
  return (
    <Card className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
      <h3 className="mb-5 text-2xl font-black text-slate-900">{title}</h3>

      <div className="space-y-3">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <span className="text-sm font-bold text-slate-600">{label}</span>
            <span className="text-lg font-black text-slate-900">{value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function AnalysisTrendChart({
  orders,
  availability,
}: {
  orders: Order[];
  availability: number;
}) {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
  const monthlyData = months.map((label, index) => {
    const base = Math.max(orders.length, 1);
    const simulatedOrders = Math.max(1, Math.round(base * (0.55 + index * 0.08)));
    const simulatedAvailability = Math.max(
      45,
      Math.min(95, Math.round(availability + (index - 3) * 4))
    );

    return {
      label,
      orders: simulatedOrders,
      availability: simulatedAvailability,
    };
  });

  const width = 780;
  const height = 300;
  const paddingX = 42;
  const chartTop = 26;
  const chartBottom = 238;
  const chartHeight = chartBottom - chartTop;
  const step = (width - paddingX * 2) / monthlyData.length;
  const barWidth = 40;
  const maxOrders = Math.max(...monthlyData.map((item) => item.orders), 12);

  const points = monthlyData.map((item, index) => {
    const x = paddingX + index * step + step / 2;
    const y = chartBottom - ((item.availability - 40) / 60) * (chartHeight - 10);
    return { x, y };
  });

  return (
    <Card className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900">
            Tendência operacional
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Evolução comparativa entre volume de ordens e disponibilidade.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-cyan-500" />
            Ordens
          </span>
          <span className="flex items-center gap-2">
            <span className="h-[3px] w-7 rounded-full bg-emerald-500" />
            Disponibilidade
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-[315px] w-full min-w-[720px]">
          {[0, 1, 2, 3].map((line) => {
            const y = chartTop + (chartHeight / 3) * line;

            return (
              <line
                key={line}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="4 6"
              />
            );
          })}

          {monthlyData.map((item, index) => {
            const x = paddingX + index * step + (step - barWidth) / 2;
            const barHeight = (item.orders / maxOrders) * (chartHeight - 20);
            const y = chartBottom - barHeight;

            return (
              <g key={item.label}>
                <rect x={x} y={y} width={barWidth} height={barHeight} rx="12" fill="#06b6d4" />
                <text
                  x={x + barWidth / 2}
                  y={y - 8}
                  textAnchor="middle"
                  fill="#0f172a"
                  fontSize="12"
                  fontWeight="800"
                >
                  {item.orders}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={chartBottom + 28}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="12"
                  fontWeight="700"
                >
                  {item.label}
                </text>
              </g>
            );
          })}

          <path
            d={buildPath(points)}
            fill="none"
            stroke="#10b981"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((point, index) => (
            <g key={monthlyData[index].label}>
              <circle cx={point.x} cy={point.y} r="11" fill="rgba(16,185,129,0.18)" />
              <circle cx={point.x} cy={point.y} r="6" fill="#10b981" />
              <text
                x={point.x}
                y={point.y - 15}
                textAnchor="middle"
                fill="#0f172a"
                fontSize="11"
                fontWeight="800"
              >
                {monthlyData[index].availability}%
              </text>
            </g>
          ))}
        </svg>
      </div>
    </Card>
  );
}

function RiskMatrix({ metrics }: { metrics: DashboardMetrics }) {
  const highRiskOrders = metrics.highPriority + metrics.criticalPriority;
  const operationalRisk =
    metrics.availability < 60 || metrics.unavailableCount > 2 || highRiskOrders >= 8
      ? "Alto"
      : metrics.availability < 85 || highRiskOrders > 0 || metrics.unavailableCount > 0
        ? "Moderado"
        : "Baixo";

  const impact =
    highRiskOrders >= 6 || metrics.unavailableCount >= 2
      ? "Alto"
      : highRiskOrders > 0 || metrics.unavailableCount > 0
        ? "Médio"
        : "Baixo";

  return (
    <Card className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
      <h3 className="text-2xl font-black text-slate-900">Matriz de risco operacional</h3>
      <p className="mt-2 text-sm text-slate-500">
        Leitura gerencial combinando impacto, prioridade, disponibilidade e ativos indisponíveis.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-black uppercase tracking-wider text-emerald-700">
              Risco operacional
            </p>
            <p className="mt-2 text-3xl font-black text-emerald-700">
              {operationalRisk}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-black uppercase tracking-wider text-amber-700">
              Impacto potencial
            </p>
            <p className="mt-2 text-3xl font-black text-amber-700">{impact}</p>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-xs font-black uppercase tracking-wider text-red-700">
              Alta/Crítica
            </p>
            <p className="mt-2 text-3xl font-black text-red-600">{highRiskOrders}</p>
          </div>

          <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
            <p className="text-xs font-black uppercase tracking-wider text-cyan-700">
              Pendências
            </p>
            <p className="mt-2 text-3xl font-black text-cyan-700">
              {metrics.alertOrders.length}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-3 grid grid-cols-[80px_1fr_1fr] gap-2 text-xs font-black uppercase text-slate-500">
            <div />
            <div className="text-center">Baixo impacto</div>
            <div className="text-center">Alto impacto</div>
          </div>

          <div className="grid grid-cols-[80px_1fr_1fr] gap-2">
            <div className="flex items-center text-xs font-black uppercase text-slate-500">
              Alta prob.
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-100 p-5 text-center text-sm font-black text-amber-700">
              Atenção
            </div>
            <div className="rounded-2xl border border-red-200 bg-red-100 p-5 text-center text-sm font-black text-red-700">
              Prioridade
            </div>

            <div className="flex items-center text-xs font-black uppercase text-slate-500">
              Baixa prob.
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-100 p-5 text-center text-sm font-black text-emerald-700">
              Controle
            </div>
            <div className="rounded-2xl border border-cyan-200 bg-cyan-100 p-5 text-center text-sm font-black text-cyan-700">
              Monitorar
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ActionPlanTable({ metrics }: { metrics: DashboardMetrics }) {
  const rows = [
    {
      action: "Priorizar ordens críticas e altas",
      why: `${metrics.highPriority + metrics.criticalPriority} ordem(ns) com maior impacto operacional.`,
      owner: "Gestão de manutenção",
      priority: "Alta",
    },
    {
      action: "Tratar ativos indisponíveis",
      why: `${metrics.unavailableCount} ativo(s) indisponível(is) reduzem a disponibilidade.`,
      owner: "Equipe técnica",
      priority: metrics.unavailableCount > 0 ? "Alta" : "Média",
    },
    {
      action: "Reduzir cancelamentos",
      why: `${metrics.canceled.length} ordem(ns) cancelada(s) podem indicar falha de abertura ou planejamento.`,
      owner: "Planejamento",
      priority: metrics.canceled.length > 0 ? "Média" : "Baixa",
    },
    {
      action: "Controlar pendências de fluxo",
      why: `${metrics.alertOrders.length} ordem(ns) exigem validação, encerramento ou revisão.`,
      owner: "Gestor",
      priority: metrics.alertOrders.length > 0 ? "Alta" : "Baixa",
    },
  ];

  return (
    <Card className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
      <h3 className="text-2xl font-black text-slate-900">Plano de ação sugerido</h3>
      <p className="mt-2 text-sm text-slate-500">
        Recomendações organizadas por ação, justificativa, responsável e prioridade.
      </p>

      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
        <div className="grid grid-cols-[1.1fr_1.4fr_0.8fr_0.55fr] bg-slate-100 px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">
          <div>Ação</div>
          <div>Justificativa</div>
          <div>Responsável</div>
          <div>Prioridade</div>
        </div>

        {rows.map((row) => (
          <div
            key={row.action}
            className="grid grid-cols-[1.1fr_1.4fr_0.8fr_0.55fr] border-t border-slate-200 px-4 py-4 text-sm text-slate-700"
          >
            <div className="font-black text-slate-900">{row.action}</div>
            <div>{row.why}</div>
            <div>{row.owner}</div>
            <div className="font-black text-[#082f4d]">{row.priority}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function buildGeneralAnalysisPdfHtml({
  metrics,
  statusData,
  priorityData,
  orders,
}: {
  metrics: DashboardMetrics;
  statusData: ChartItem[];
  priorityData: ChartItem[];
  orders: Order[];
}) {
  const today = new Date().toLocaleDateString("pt-BR");
  const logoUrl = `${window.location.origin}/fixer.png`;
  const diagnosis = getExecutiveDiagnosis(metrics);

  const chartRows = (data: ChartItem[], total: number) =>
    data
      .map((item) => {
        const width =
          total > 0
            ? Math.max((item.value / total) * 100, item.value > 0 ? 8 : 0)
            : 0;

        const colorMap: Record<string, string> = {
          "bg-rose-500": "#f43f5e",
          "bg-red-500": "#ef4444",
          "bg-amber-500": "#f59e0b",
          "bg-blue-500": "#3b82f6",
          "bg-cyan-500": "#06b6d4",
          "bg-emerald-500": "#10b981",
        };

        return `
          <div class="bar-row">
            <div class="bar-label">
              <span>${escapeHtml(item.label)}</span>
              <strong>${item.value}</strong>
            </div>
            <div class="bar-track">
              <div class="bar-fill" style="width:${width}%; background:${
                colorMap[item.color] || "#06b6d4"
              }"></div>
            </div>
          </div>
        `;
      })
      .join("");

  const timelineRows = orders
    .slice(0, 8)
    .map((order) => {
      const statusLabel = STATUS_CONFIG[order.status]?.label || order.status;
      const duration = getDurationByStatus(order.status);

      return `
        <tr>
          <td><strong>${escapeHtml(order.asset)}</strong></td>
          <td>${escapeHtml(order.type)}</td>
          <td>${escapeHtml(statusLabel)}</td>
          <td>${escapeHtml(order.priority)}</td>
          <td>${escapeHtml(order.createdAt)}</td>
          <td>${duration} dias</td>
        </tr>
      `;
    })
    .join("");

  return `
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <title>Análise Geral - FIXER</title>

        <style>
          @page { size: A4; margin: 12mm; }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            color: #0f172a;
            background: white;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .page { max-width: 980px; margin: 0 auto; }
          header {
            display: grid;
            grid-template-columns: 160px 1fr 130px;
            gap: 24px;
            align-items: center;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 22px;
            margin-bottom: 24px;
          }
          .logo img { max-width: 145px; max-height: 85px; object-fit: contain; }
          h1 {
            margin: 0;
            color: #082f4d;
            font-size: 30px;
            letter-spacing: 2px;
            text-transform: uppercase;
          }
          .subtitle { margin-top: 8px; color: #475569; font-size: 13px; }
          .meta { text-align: right; color: #475569; font-size: 12px; }
          .summary, .box, .analysis-box {
            border: 1px solid #e2e8f0;
            background: #f8fafc;
            border-radius: 18px;
            padding: 18px;
            margin-bottom: 22px;
          }
          .eyebrow {
            margin: 0 0 10px;
            color: #0891b2;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 4px;
            text-transform: uppercase;
          }
          .summary h2, .analysis-box h2, .box h2 {
            margin: 0 0 10px;
            font-size: 20px;
            color: #0f172a;
          }
          .summary p, .analysis-box p, .box p {
            margin: 10px 0 0;
            color: #475569;
            font-size: 13px;
            line-height: 1.65;
          }
          .kpis {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 24px;
          }
          .kpi {
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 14px;
            background: #ffffff;
          }
          .kpi span {
            display: block;
            color: #64748b;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
          }
          .kpi strong {
            display: block;
            margin-top: 8px;
            font-size: 26px;
            color: #082f4d;
          }
          section { margin-top: 24px; break-inside: avoid; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          .bar-row { margin-bottom: 14px; }
          .bar-label {
            display: flex;
            justify-content: space-between;
            color: #334155;
            font-size: 12px;
            margin-bottom: 7px;
          }
          .bar-label span { font-weight: 700; }
          .bar-track {
            height: 12px;
            background: #e2e8f0;
            border-radius: 999px;
            overflow: hidden;
          }
          .bar-fill { height: 100%; border-radius: 999px; }
          ul {
            margin: 0;
            padding-left: 18px;
            color: #334155;
            font-size: 13px;
            line-height: 1.7;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11.5px;
          }
          th {
            background: #f1f5f9;
            color: #334155;
            text-align: left;
            padding: 9px;
            border: 1px solid #e2e8f0;
            text-transform: uppercase;
            letter-spacing: .4px;
            font-size: 10px;
          }
          td { padding: 9px; border: 1px solid #e2e8f0; color: #334155; }
          .risk-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
          .risk-card {
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            background: white;
            padding: 14px;
          }
          .risk-card span {
            display: block;
            color: #64748b;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .risk-card strong {
            display: block;
            margin-top: 8px;
            font-size: 22px;
            color: #082f4d;
          }
          footer {
            margin-top: 32px;
            border-top: 1px solid #e2e8f0;
            padding-top: 12px;
            color: #64748b;
            font-size: 10px;
          }
        </style>
      </head>

      <body>
        <main class="page">
          <header>
            <div class="logo">
              <img src="${logoUrl}" alt="FIXER" />
            </div>

            <div>
              <h1>Análise Geral</h1>
              <div class="subtitle">
                Relatório executivo de manutenção, ativos, ordens, indicadores e recomendações.
              </div>
            </div>

            <div class="meta">
              <strong>FIXER</strong><br />
              Emitido em<br />
              ${today}
            </div>
          </header>

          <div class="summary">
            <p class="eyebrow">Diagnóstico Executivo</p>
            <h2>Visão consolidada da operação</h2>
            <p>
              A disponibilidade operacional atual está em <strong>${metrics.availability}%</strong>,
              classificada como <strong>${diagnosis.availabilityStatus}</strong>.
              O sistema possui <strong>${metrics.totalAssets}</strong> ativos cadastrados e
              <strong>${metrics.totalOrders}</strong> ordens registradas.
            </p>
            <p>${escapeHtml(diagnosis.mainDiagnosis)}</p>
            <p>${escapeHtml(diagnosis.riskDiagnosis)}</p>
            <p>${escapeHtml(diagnosis.pendingDiagnosis)}</p>
          </div>

          <div class="kpis">
            <div class="kpi"><span>Ativos</span><strong>${metrics.totalAssets}</strong></div>
            <div class="kpi"><span>Ordens</span><strong>${metrics.totalOrders}</strong></div>
            <div class="kpi"><span>Disponibilidade</span><strong>${metrics.availability}%</strong></div>
            <div class="kpi"><span>Pendências</span><strong>${metrics.alertOrders.length}</strong></div>
          </div>

          <section class="grid">
            <div class="box">
              <h2>Ordens por Status</h2>
              ${chartRows(statusData, Math.max(metrics.totalOrders, 1))}
            </div>

            <div class="box">
              <h2>Ordens por Prioridade</h2>
              ${chartRows(priorityData, Math.max(metrics.totalOrders, 1))}
            </div>
          </section>

          <section class="box">
            <h2>Matriz de atenção operacional</h2>
            <div class="risk-grid">
              <div class="risk-card"><span>Alta/Crítica</span><strong>${metrics.highPriority + metrics.criticalPriority}</strong></div>
              <div class="risk-card"><span>Indisponíveis</span><strong>${metrics.unavailableCount}</strong></div>
              <div class="risk-card"><span>Canceladas</span><strong>${metrics.canceled.length}</strong></div>
            </div>
          </section>

          <section class="grid">
            <div class="box">
              <h2>Ativos</h2>
              <p><strong>Operacionais:</strong> ${metrics.operationalCount}</p>
              <p><strong>Em manutenção:</strong> ${metrics.maintenanceCount}</p>
              <p><strong>Indisponíveis:</strong> ${metrics.unavailableCount}</p>
            </div>

            <div class="box">
              <h2>Indicadores de manutenção</h2>
              <p><strong>MTBF:</strong> 350 horas</p>
              <p><strong>MTTR:</strong> 4,5 horas</p>
              <p><strong>Meta de disponibilidade:</strong> acima de 85%</p>
            </div>
          </section>

          <section class="box">
            <h2>Timeline das últimas manutenções</h2>
            <table>
              <thead>
                <tr>
                  <th>Ativo</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Prioridade</th>
                  <th>Abertura</th>
                  <th>Duração</th>
                </tr>
              </thead>
              <tbody>
                ${
                  timelineRows ||
                  `<tr><td colspan="6">Nenhuma ordem registrada.</td></tr>`
                }
              </tbody>
            </table>
          </section>

          <section class="box">
            <h2>Plano de ação sugerido</h2>
            <table>
              <thead>
                <tr>
                  <th>Ação</th>
                  <th>Justificativa</th>
                  <th>Responsável</th>
                  <th>Prioridade</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Priorizar ordens críticas e altas</strong></td>
                  <td>${metrics.highPriority + metrics.criticalPriority} ordem(ns) com maior impacto operacional.</td>
                  <td>Gestão de manutenção</td>
                  <td>Alta</td>
                </tr>
                <tr>
                  <td><strong>Tratar ativos indisponíveis</strong></td>
                  <td>${metrics.unavailableCount} ativo(s) indisponível(is) reduzem a disponibilidade.</td>
                  <td>Equipe técnica</td>
                  <td>${metrics.unavailableCount > 0 ? "Alta" : "Média"}</td>
                </tr>
                <tr>
                  <td><strong>Reduzir cancelamentos</strong></td>
                  <td>${metrics.canceled.length} ordem(ns) cancelada(s) podem indicar falha de abertura ou planejamento.</td>
                  <td>Planejamento</td>
                  <td>${metrics.canceled.length > 0 ? "Média" : "Baixa"}</td>
                </tr>
                <tr>
                  <td><strong>Controlar pendências de fluxo</strong></td>
                  <td>${metrics.alertOrders.length} ordem(ns) exigem validação, encerramento ou revisão.</td>
                  <td>Gestor</td>
                  <td>${metrics.alertOrders.length > 0 ? "Alta" : "Baixa"}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section class="analysis-box">
            <h2>Recomendações gerenciais</h2>
            <ul>
              ${diagnosis.recommendations
                .map((item) => `<li>${escapeHtml(item)}</li>`)
                .join("")}
            </ul>
          </section>

          <footer>
            Documento gerado automaticamente pelo FIXER - Sistema Integrado de Gestão de Ativos e Manutenção.
          </footer>
        </main>

        <script>
          window.onload = function () {
            setTimeout(function () {
              window.print();
            }, 250);
          };
        </script>
      </body>
    </html>
  `;
}

function GeneralAnalysisModal({
  metrics,
  statusData,
  priorityData,
  orders,
  onClose,
  onPdf,
}: {
  metrics: DashboardMetrics;
  statusData: ChartItem[];
  priorityData: ChartItem[];
  orders: Order[];
  onClose: () => void;
  onPdf: () => void;
}) {
  const diagnosis = getExecutiveDiagnosis(metrics);

  const highRiskOrders = metrics.highPriority + metrics.criticalPriority;

  const timelineOrders = orders.slice(0, 6).map((order) => ({
    ...order,
    duration: getDurationByStatus(order.status),
    statusLabel: STATUS_CONFIG[order.status]?.label || order.status,
  }));

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-slate-950 text-slate-900">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-4 shadow-lg">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-black text-slate-900">
            <FileText className="h-5 w-5 text-cyan-600" />
            Análise Geral da Manutenção
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Diagnóstico executivo completo com indicadores, gráficos, timeline,
            riscos e recomendações.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={onPdf}
            className="rounded-2xl bg-[#082f4d] text-white hover:bg-[#0b6680]"
          >
            <Download className="mr-2 h-4 w-4" />
            Gerar PDF
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-2xl border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
          >
            <X className="mr-2 h-4 w-4" />
            Fechar
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto bg-slate-100 p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <Card className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl">
            <div className="bg-gradient-to-r from-[#082f4d] via-[#0b6680] to-[#12b7c4] p-8 text-white">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-100">
                Diagnóstico Executivo
              </p>

              <h1 className="mt-3 text-4xl font-black">
                Visão consolidada da operação
              </h1>

              <p className="mt-4 max-w-5xl text-base leading-relaxed text-cyan-50">
                A disponibilidade operacional atual está em{" "}
                <strong>{metrics.availability}%</strong>, classificada como{" "}
                <strong>{diagnosis.availabilityStatus}</strong>. O sistema
                possui <strong>{metrics.totalAssets}</strong> ativos cadastrados
                e <strong>{metrics.totalOrders}</strong> ordens registradas. A
                análise abaixo consolida desempenho, riscos, pendências,
                prioridades e recomendações para apoio à tomada de decisão.
              </p>
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-4">
              <AnalysisKpi
                label="Ativos cadastrados"
                value={metrics.totalAssets}
              />
              <AnalysisKpi
                label="Ordens registradas"
                value={metrics.totalOrders}
              />
              <AnalysisKpi
                label="Disponibilidade"
                value={`${metrics.availability}%`}
              />
              <AnalysisKpi
                label="Pendências"
                value={metrics.alertOrders.length}
              />
            </div>
          </Card>

          <AnalysisTrendChart orders={orders} availability={metrics.availability} />

          <RiskMatrix metrics={metrics} />

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <Card className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
              <h3 className="mb-3 text-2xl font-black text-slate-900">
                Leitura executiva
              </h3>

              <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                <p>{diagnosis.mainDiagnosis}</p>
                <p>{diagnosis.riskDiagnosis}</p>
                <p>{diagnosis.pendingDiagnosis}</p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                  <p className="text-xs font-black uppercase text-red-700">
                    Alta/Crítica
                  </p>
                  <p className="mt-2 text-3xl font-black text-red-600">
                    {highRiskOrders}
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-black uppercase text-amber-700">
                    Indisponíveis
                  </p>
                  <p className="mt-2 text-3xl font-black text-amber-600">
                    {metrics.unavailableCount}
                  </p>
                </div>

                <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
                  <p className="text-xs font-black uppercase text-cyan-700">
                    Pendências
                  </p>
                  <p className="mt-2 text-3xl font-black text-cyan-700">
                    {metrics.alertOrders.length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
              <h3 className="mb-3 text-2xl font-black text-slate-900">
                Índice operacional
              </h3>

              <div className="flex justify-center py-4">
                <div
                  className="relative flex h-52 w-52 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(#10b981 0% ${metrics.availability}%, #e2e8f0 ${metrics.availability}% 100%)`,
                  }}
                >
                  <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-white shadow-inner">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Disponibilidade
                    </span>
                    <span className="text-4xl font-black text-[#082f4d]">
                      {metrics.availability}%
                    </span>
                    <span className="text-xs text-slate-500">Meta: 85%</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <Card className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
              <h3 className="mb-2 text-2xl font-black text-slate-900">
                Ordens por Status
              </h3>

              <p className="mb-6 text-sm text-slate-500">
                Distribuição das ordens conforme o estágio operacional.
              </p>

              <div className="space-y-5">
                {statusData.map((item) => (
                  <AnalysisBar
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    total={Math.max(metrics.totalOrders, 1)}
                    color={item.color}
                  />
                ))}
              </div>
            </Card>

            <Card className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
              <h3 className="mb-2 text-2xl font-black text-slate-900">
                Ordens por Prioridade
              </h3>

              <p className="mb-6 text-sm text-slate-500">
                Classificação das ordens por criticidade e impacto operacional.
              </p>

              <div className="space-y-5">
                {priorityData.map((item) => (
                  <AnalysisBar
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    total={Math.max(metrics.totalOrders, 1)}
                    color={item.color}
                  />
                ))}
              </div>
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <AnalysisBox
              title="Ativos"
              items={[
                ["Operacionais", metrics.operationalCount],
                ["Em manutenção", metrics.maintenanceCount],
                ["Indisponíveis", metrics.unavailableCount],
              ]}
            />

            <AnalysisBox
              title="Ordens"
              items={[
                ["Em execução", metrics.inExecution.length],
                ["Encerradas", metrics.closed.length],
                ["Canceladas", metrics.canceled.length],
              ]}
            />

            <AnalysisBox
              title="Indicadores"
              items={[
                ["MTBF", "350 h"],
                ["MTTR", "4.5 h"],
                ["Meta disponibilidade", "85%"],
              ]}
            />
          </div>

          <Card className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-2xl font-black text-slate-900">
              Timeline das últimas manutenções
            </h3>

            <p className="mb-6 text-sm text-slate-500">
              Visão resumida das ordens recentes com duração estimada por status.
            </p>

            <div className="space-y-4">
              {timelineOrders.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                  Nenhuma ordem registrada.
                </div>
              ) : (
                timelineOrders.map((order) => {
                  const style = getGanttColor(order.status);

                  return (
                    <div
                      key={order.id}
                      className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[220px_1fr_110px]"
                    >
                      <div>
                        <p className="font-black text-slate-900">
                          {order.asset}
                        </p>
                        <p className="text-xs text-slate-500">
                          {order.type} · {order.statusLabel}
                        </p>
                      </div>

                      <div className="flex items-center">
                        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full rounded-full ${style.bar}`}
                            style={{
                              width: `${Math.min(order.duration * 10, 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-black text-slate-900">
                          {order.duration} dias
                        </p>
                        <p className="text-xs text-slate-500">
                          {order.createdAt}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          <ActionPlanTable metrics={metrics} />

          <Card className="rounded-[2rem] border border-cyan-200 bg-cyan-50 p-6 shadow-xl">
            <h3 className="text-2xl font-black text-slate-900">
              Recomendações gerenciais
            </h3>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {diagnosis.recommendations.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-cyan-200 bg-white p-4 text-sm font-semibold leading-relaxed text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function GestorDashboard() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [infoOpen, setInfoOpen] = useState<MetricKey | null>(null);
  const [analysisOpen, setAnalysisOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchOrders(),
      import("../../lib/supabase").then((m) =>
        m.supabase.from("assets").select("*")
      ),
    ]).then(([ordersData, { data: assetsData }]) => {
      setOrders(ordersData);
      setAssets((assetsData || []) as Asset[]);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const openAnalysis = () => {
      setAnalysisOpen(true);
    };

    window.addEventListener("fixer-open-general-analysis", openAnalysis);

    return () => {
      window.removeEventListener("fixer-open-general-analysis", openAnalysis);
    };
  }, []);

  const metrics: DashboardMetrics = useMemo(() => {
    const totalOrders = orders.length;

    const inExecution = orders.filter((order) => order.status === "em_execucao");
    const closed = orders.filter((order) => order.status === "encerrada");
    const canceled = orders.filter((order) => order.status === "cancelada");
    const drafts = orders.filter((order) => order.status === "rascunho");
    const pendingValidation = orders.filter(
      (order) => order.status === "em_validacao"
    );
    const pendingClosure = orders.filter(
      (order) => order.status === "aguardando_encerramento"
    );
    const rejected = orders.filter((order) => order.status === "reprovada");

    const alertOrders = [
      ...drafts,
      ...pendingValidation,
      ...pendingClosure,
      ...rejected,
    ];

    const totalAssets = assets.length;
    const operationalCount = assets.filter(
      (asset) => asset.status === "operational"
    ).length;
    const maintenanceCount = assets.filter(
      (asset) => asset.status === "maintenance"
    ).length;
    const unavailableCount = assets.filter(
      (asset) => asset.status === "unavailable"
    ).length;

    const availability =
      totalAssets > 0 ? Math.round((operationalCount / totalAssets) * 100) : 100;

    const lowPriority = orders.filter(
      (order) => order.priority === "baixa"
    ).length;
    const mediumPriority = orders.filter(
      (order) => order.priority === "media"
    ).length;
    const highPriority = orders.filter(
      (order) => order.priority === "alta"
    ).length;
    const criticalPriority = orders.filter(
      (order) => order.priority === "critica"
    ).length;

    return {
      totalOrders,
      inExecution,
      closed,
      canceled,
      drafts,
      pendingValidation,
      pendingClosure,
      rejected,
      alertOrders,
      totalAssets,
      operationalCount,
      maintenanceCount,
      unavailableCount,
      availability,
      lowPriority,
      mediumPriority,
      highPriority,
      criticalPriority,
    };
  }, [assets, orders]);

  const priorityData: ChartItem[] = [
    {
      label: "Crítica",
      value: metrics.criticalPriority,
      color: "bg-rose-500",
    },
    {
      label: "Alta",
      value: metrics.highPriority,
      color: "bg-amber-500",
    },
    {
      label: "Média",
      value: metrics.mediumPriority,
      color: "bg-blue-500",
    },
    {
      label: "Baixa",
      value: metrics.lowPriority,
      color: "bg-emerald-500",
    },
  ];

  const statusData: ChartItem[] = [
    {
      label: "Em execução",
      value: metrics.inExecution.length,
      color: "bg-amber-500",
    },
    {
      label: "Encerradas",
      value: metrics.closed.length,
      color: "bg-emerald-500",
    },
    {
      label: "Canceladas",
      value: metrics.canceled.length,
      color: "bg-red-500",
    },
    {
      label: "Requerem ação",
      value: metrics.alertOrders.length,
      color: "bg-cyan-500",
    },
  ];

  const highImpactOrders = metrics.highPriority + metrics.criticalPriority;

  const handleGenerateGeneralAnalysisPdf = () => {
    const html = buildGeneralAnalysisPdfHtml({
      metrics,
      statusData,
      priorityData,
      orders,
    });

    const printWindow = window.open("", "_blank", "width=1000,height=800");

    if (!printWindow) {
      alert(
        "O navegador bloqueou a janela de impressão. Permita pop-ups para gerar o PDF."
      );
      return;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-slate-400">
        Carregando dados do dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-gradient-to-r from-[#061327] via-[#0b1f43] to-[#0c3c52] p-8 shadow-2xl shadow-cyan-950/20 [.light_&]:border-slate-200">
        <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
              Visão Geral
            </p>

            <h1 className="mt-3 flex flex-wrap items-center gap-3 text-4xl font-black text-white">
              <BarChart3 className="h-9 w-9 text-cyan-300" />
              Dashboard de Manutenção
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300">
              Acompanhe desempenho operacional, disponibilidade dos ativos,
              volume de ordens e pontos críticos em uma visão executiva mais
              clara e analítica.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-200">
                {getTodayBRFull()}
              </span>

              <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-amber-200">
                {highImpactOrders} ordem(ns) de alto impacto
              </span>

              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-200">
                {metrics.availability}% de disponibilidade
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={() => navigate("/work-orders?new=1")}
              className="h-12 rounded-2xl bg-cyan-500 px-6 font-black text-slate-950 hover:bg-cyan-400"
            >
              <WrenchIcon className="mr-2 h-4 w-4" />
              Nova Ordem
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PremiumKpi
          icon={TrendingUp}
          label="MTBF"
          value={metrics.totalOrders > 0 ? "350" : "0"}
          unit="h"
          helper="+12% em relação ao mês anterior"
          accent="cyan"
          infoKey="mtbf"
          onInfoClick={setInfoOpen}
        />

        <PremiumKpi
          icon={Clock}
          label="MTTR"
          value={metrics.totalOrders > 0 ? "4.5" : "0"}
          unit="h"
          helper="-8% em relação ao mês anterior"
          accent="blue"
          infoKey="mttr"
          onInfoClick={setInfoOpen}
        />

        <PremiumKpi
          icon={Gauge}
          label="Disponibilidade"
          value={`${metrics.availability}%`}
          helper="Meta sugerida: acima de 85%"
          accent="emerald"
          infoKey="disponibilidade"
          onInfoClick={setInfoOpen}
        />

        <PremiumKpi
          icon={ClipboardList}
          label="Ordens encerradas"
          value={`${metrics.closed.length}/${metrics.totalOrders}`}
          helper={`${percent(metrics.closed.length, metrics.totalOrders)}% do ciclo concluído`}
          accent="amber"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        <PerformanceChart orders={orders} availability={metrics.availability} />

        <DonutStatusCard
          operational={metrics.operationalCount}
          maintenance={metrics.maintenanceCount}
          unavailable={metrics.unavailableCount}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
        <SimpleBarChart
          title="Ordens por Status"
          subtitle="Distribuição das ordens conforme o estágio operacional atual."
          data={statusData}
        />

        <SimpleBarChart
          title="Backlog por Prioridade"
          subtitle="Classificação das ordens por criticidade e impacto operacional."
          data={priorityData}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
        <ActionPanel
          alertOrders={metrics.alertOrders}
          unavailableCount={metrics.unavailableCount}
          navigate={navigate}
        />

        <Card className="rounded-[2rem] border border-slate-800 bg-[#08152d] p-6 shadow-xl shadow-cyan-950/10 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-400">
              Resumo Executivo
            </p>

            <h3 className="mt-2 text-2xl font-black text-white [.light_&]:text-slate-900">
              Leitura rápida
            </h3>

            <p className="mt-2 text-sm text-slate-400 [.light_&]:text-slate-500">
              Interpretação automática dos indicadores principais do painel.
            </p>
          </div>

          <div className="space-y-4">
            <ExecutiveLine
              icon={Package}
              label="Ativos cadastrados"
              value={`${metrics.totalAssets}`}
              detail={`${metrics.operationalCount} operacionais, ${metrics.unavailableCount} indisponíveis.`}
              tone="cyan"
            />

            <ExecutiveLine
              icon={Activity}
              label="Disponibilidade"
              value={`${metrics.availability}%`}
              detail={
                metrics.availability >= 85
                  ? "Condição operacional satisfatória."
                  : metrics.availability >= 60
                    ? "Disponibilidade moderada, exige acompanhamento."
                    : "Disponibilidade crítica, exige ação imediata."
              }
              tone="emerald"
            />

            <ExecutiveLine
              icon={AlertTriangle}
              label="Pendências"
              value={`${metrics.alertOrders.length}`}
              detail="Ordens que precisam de validação, correção ou encerramento."
              tone="amber"
            />

            <ExecutiveLine
              icon={Target}
              label="Prioridade alta/crítica"
              value={`${metrics.highPriority + metrics.criticalPriority}`}
              detail="Ordens com maior impacto operacional."
              tone="red"
            />
          </div>
        </Card>
      </div>

      <GanttPanel orders={orders} />

      {infoOpen && (
        <MetricModal infoOpen={infoOpen} onClose={() => setInfoOpen(null)} />
      )}

      {analysisOpen && (
        <GeneralAnalysisModal
          metrics={metrics}
          statusData={statusData}
          priorityData={priorityData}
          orders={orders}
          onClose={() => setAnalysisOpen(false)}
          onPdf={handleGenerateGeneralAnalysisPdf}
        />
      )}
    </div>
  );
}

function ExecutiveLine({
  icon: Icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: ElementType;
  label: string;
  value: string;
  detail: string;
  tone: "cyan" | "emerald" | "amber" | "red";
}) {
  const tones = {
    cyan: "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
    emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    red: "border-red-500/20 bg-red-500/10 text-red-400",
  };

  return (
    <div className="flex items-start gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 [.light_&]:border-slate-200 [.light_&]:bg-slate-50">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${tones[tone]}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-4">
          <p className="font-black text-white [.light_&]:text-slate-900">
            {label}
          </p>

          <p className="text-2xl font-black text-white [.light_&]:text-slate-900">
            {value}
          </p>
        </div>

        <p className="mt-1 text-sm leading-relaxed text-slate-400 [.light_&]:text-slate-500">
          {detail}
        </p>
      </div>
    </div>
  );
}