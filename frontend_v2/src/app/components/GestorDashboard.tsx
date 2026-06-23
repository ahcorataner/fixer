import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  TrendingUp,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle2,
  WrenchIcon,
  Package,
  ArrowRight,
  Calendar,
  BarChart3,
  HelpCircle,
  X,
  Info,
} from "lucide-react";
import {
  fetchOrders,
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  getCurrentUser,
  type Order,
} from "../lib/ordersStore";

type MetricKey = "mtbf" | "mttr" | "disponibilidade";

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

function KpiCard({
  label,
  value,
  unit,
  delta,
  deltaPositive,
  icon: Icon,
  accent,
  infoKey,
  onInfoClick,
}: {
  label: string;
  value: string;
  unit?: string;
  delta: string;
  deltaPositive: boolean;
  icon: React.ElementType;
  accent: string;
  infoKey: MetricKey;
  onInfoClick: (key: MetricKey) => void;
}) {
  return (
    <Card className="p-5 bg-slate-900 border-slate-800 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          background: `radial-gradient(circle at top right, ${accent}, transparent 70%)`,
        }}
      />

      <button
        type="button"
        onClick={() => onInfoClick(infoKey)}
        className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full border border-slate-700 bg-slate-950/60 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all flex items-center justify-center"
        title={`Entenda o indicador ${label}`}
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      <div className="relative flex items-start justify-between pr-8">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
            {label}
          </p>

          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-bold text-white">{value}</p>
            {unit && <p className="text-sm text-slate-400">{unit}</p>}
          </div>

          <div className="flex items-center gap-1 mt-2">
            <span
              className={`text-xs font-medium ${deltaPositive ? "text-emerald-400" : "text-red-400"
                }`}
            >
              {deltaPositive ? "▲" : "▼"} {delta}
            </span>
            <span className="text-xs text-slate-600">vs. mês anterior</span>
          </div>
        </div>

        <div
          className="p-2.5 rounded-xl border"
          style={{ background: `${accent}18`, borderColor: `${accent}40` }}
        >
          <Icon className="w-5 h-5" style={{ color: accent }} />
        </div>
      </div>
    </Card>
  );
}

function OrderRow({ order, onNavigate }: { order: Order; onNavigate: () => void }) {
  const sc = STATUS_CONFIG[order.status];
  const pc = PRIORITY_CONFIG[order.priority];

  return (
    <button
      onClick={onNavigate}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 transition-colors rounded-lg text-left group"
    >
      <div className={`w-2 h-2 rounded-full shrink-0 ${sc.dot}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-medium truncate">{order.asset}</p>
        <p className="text-xs text-slate-500 truncate">
          {order.description.slice(0, 60)}…
        </p>
      </div>
      <Badge className={`${sc.bg} border ${sc.color} text-xs shrink-0 hidden sm:flex`}>
        {sc.label}
      </Badge>
      <Badge className={`${pc.bg} border ${pc.color} text-xs shrink-0`}>
        {pc.label}
      </Badge>
      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
    </button>
  );
}

export function GestorDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [infoOpen, setInfoOpen] = useState<MetricKey | null>(null);
  const [notification, setNotification] = useState<{ visible: boolean; message: string } | null>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    Promise.all([
      fetchOrders(),
      import("../../lib/supabase").then((m) => m.supabase.from("assets").select("*"))
    ]).then(([ordersData, { data: assetsData }]) => {
      setOrders(ordersData);
      if (assetsData) setAssets(assetsData);
      setLoading(false);

      timeoutId = setTimeout(() => {
        if (user.role === "gestor") {
          const emExecucao = ordersData.filter((o) => o.status === "em_execucao").length;
          if (emExecucao > 0) {
            setNotification({ visible: true, message: `Você possui ${emExecucao} ordem(ns) em execução no momento.` });
          }
        } else {
          const novas = ordersData.filter((o) => o.responsible === user.name && o.status === "aprovada").length;
          if (novas > 0) {
            setNotification({ visible: true, message: `Você possui ${novas} nova(s) ordem(ns) para iniciar.` });
          }
        }
      }, 3000);
    });

    return () => clearTimeout(timeoutId);
  }, [user.name, user.role]);

  useEffect(() => {
    if (notification?.visible) {
      const timer = setTimeout(() => {
        setNotification((prev) => (prev ? { ...prev, visible: false } : null));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification?.visible]);

  const total = orders.length;
  const pendingValidation = orders.filter((o) => o.status === "em_validacao");
  const inExecution = orders.filter((o) => o.status === "em_execucao");
  const pendingClosure = orders.filter((o) => o.status === "aguardando_encerramento");
  const rejected = orders.filter((o) => o.status === "reprovada");
  const closed = orders.filter((o) => o.status === "encerrada");

  const totalAssets = assets.length;
  const operationalCount = assets.filter((a) => a.status === "operational").length;
  const maintenanceCount = assets.filter((a) => a.status === "maintenance").length;
  const unavailableCount = assets.filter((a) => a.status === "unavailable").length;

  if (loading) {
    return (
      <div className="p-6 text-slate-400">
        Carregando dados do dashboard...
      </div>
    );
  }

  const drafts = orders.filter((o) => o.status === "rascunho");
  const alertOrders = [...drafts, ...pendingValidation, ...pendingClosure, ...rejected];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Bem-vindo, {user.name} ·{" "}
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>

        <Button
          onClick={() => navigate("/work-orders")}
          className="bg-cyan-600 hover:bg-cyan-500 text-white text-sm shadow-lg shadow-cyan-500/20"
        >
          <WrenchIcon className="w-4 h-4 mr-2" />
          Nova Ordem
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          label="MTBF"
          value={total > 0 ? "350" : "0"}
          unit="horas"
          delta="-"
          deltaPositive={true}
          icon={TrendingUp}
          accent="#22d3ee"
          infoKey="mtbf"
          onInfoClick={setInfoOpen}
        />

        <KpiCard
          label="MTTR"
          value={total > 0 ? "4.5" : "0"}
          unit="horas"
          delta="-"
          deltaPositive={true}
          icon={Clock}
          accent="#60a5fa"
          infoKey="mttr"
          onInfoClick={setInfoOpen}
        />

        <KpiCard
          label="Disponibilidade"
          value={totalAssets > 0 ? ((operationalCount / totalAssets) * 100).toFixed(1) : "100"}
          unit="%"
          delta="-"
          deltaPositive={true}
          icon={Activity}
          accent="#34d399"
          infoKey="disponibilidade"
          onInfoClick={setInfoOpen}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total de Ordens",
            value: total,
            icon: BarChart3,
            color: "text-slate-300",
            bg: "bg-slate-800",
          },
          {
            label: "Em Execução",
            value: inExecution.length,
            icon: WrenchIcon,
            color: "text-amber-400",
            bg: "bg-amber-500/10 border border-amber-500/20",
          },
          {
            label: "Encerradas",
            value: closed.length,
            icon: CheckCircle2,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10 border border-emerald-500/20",
          },
          {
            label: "Requerem Ação",
            value: alertOrders.length,
            icon: AlertTriangle,
            color: "text-red-400",
            bg: "bg-red-500/10 border border-red-500/20",
          },
        ].map((s) => (
          <Card key={s.label} className={`p-4 ${s.bg} border-0`}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-slate-500">{s.label}</p>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 bg-slate-900 border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Ativos por Status</h3>
            </div>

            <button
              onClick={() => navigate("/assets")}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              Ver todos <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {[
            {
              label: "Operacional",
              count: operationalCount,
              total: Math.max(totalAssets, 1),
              color: "bg-emerald-500",
              text: "text-emerald-400",
            },
            {
              label: "Em Manutenção",
              count: maintenanceCount,
              total: Math.max(totalAssets, 1),
              color: "bg-amber-500",
              text: "text-amber-400",
            },
            {
              label: "Indisponível",
              count: unavailableCount,
              total: Math.max(totalAssets, 1),
              color: "bg-red-500",
              text: "text-red-400",
            },
          ].map((s) => (
            <div key={s.label} className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400">{s.label}</span>
                <span className={`text-xs font-semibold ${s.text}`}>{s.count}</span>
              </div>

              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${s.color} rounded-full transition-all`}
                  style={{ width: `${(s.count / s.total) * 100}%` }}
                />
              </div>
            </div>
          ))}

          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-3 text-center">
            <div>
              <p className="text-xs text-slate-500">Total</p>
              <p className="text-lg font-bold text-white">{totalAssets}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Disponibilidade</p>
              <p className="text-lg font-bold text-emerald-400">
                {totalAssets > 0 ? ((operationalCount / totalAssets) * 100).toFixed(1) : 100}%
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Críticos</p>
              <p className="text-lg font-bold text-red-400">{unavailableCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-slate-900 border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">Requerem Ação</h3>

              {alertOrders.length > 0 && (
                <span className="ml-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {alertOrders.length}
                </span>
              )}
            </div>

            <button
              onClick={() => navigate("/work-orders")}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              Gerenciar <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {alertOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2" />
              <p className="text-sm text-slate-400">Nenhuma ação pendente!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {alertOrders.slice(0, 5).map((o) => (
                <OrderRow
                  key={o.id}
                  order={o}
                  onNavigate={() => navigate("/work-orders")}
                />
              ))}

              {alertOrders.length > 5 && (
                <button
                  onClick={() => navigate("/work-orders")}
                  className="w-full text-xs text-slate-500 hover:text-cyan-400 py-2 transition-colors"
                >
                  + {alertOrders.length - 5} mais ordens
                </button>
              )}
            </div>
          )}
        </Card>
      </div>

      <Card className="p-5 bg-slate-900 border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">
            Últimas Manutenções
          </h3>
        </div>

        <div className="flex gap-4 mb-3 text-xs flex-wrap">
          {[
            { label: "Concluída", color: "bg-emerald-500" },
            { label: "Em andamento", color: "bg-amber-500" },
            { label: "Aguardando", color: "bg-purple-500" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded ${l.color}`} />
              <span className="text-slate-500">{l.label}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2 mt-4">
          {orders.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">Nenhuma manutenção registrada no momento.</p>
          ) : orders.slice(0, 5).map((task, index) => {
            let color = "bg-purple-500";
            if (task.status === "encerrada") color = "bg-emerald-500";
            if (task.status === "em_execucao") color = "bg-amber-500 animate-pulse";

            return (
              <div key={task.id} className="flex items-center gap-3">
                <div className="w-36 shrink-0">
                  <p className="text-xs text-slate-300 truncate">{task.asset}</p>
                </div>

                <div className="flex-1 relative h-4 bg-slate-800/60 rounded overflow-hidden">
                  <div
                    className={`absolute h-full ${color} rounded flex items-center justify-center px-2 shadow-sm`}
                    style={{ left: `${index * 10}%`, width: "50%" }}
                  >
                    <span className="text-[10px] text-white font-medium truncate capitalize drop-shadow-md">
                      {task.type} - {STATUS_CONFIG[task.status].label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {infoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-cyan-400 text-sm font-semibold">
                  {metricInfo[infoOpen].title}
                </p>
                <h2 className="text-white text-xl font-bold">
                  {metricInfo[infoOpen].name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setInfoOpen(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-300 text-sm mb-4">
              {metricInfo[infoOpen].description}
            </p>

            <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 mb-4">
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">
                Fórmula
              </p>
              <p className="text-cyan-300 font-mono text-sm">
                {metricInfo[infoOpen].formula}
              </p>
            </div>

            <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-4">
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">
                Exemplo
              </p>
              <p className="text-slate-300 text-sm">
                {metricInfo[infoOpen].example}
              </p>
            </div>
          </div>
        </div>
      )}

      {notification?.visible && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-5 fade-in duration-500 bg-slate-900 border border-cyan-500/50 text-white px-5 py-4 rounded-xl shadow-[0_0_30px_rgba(34,211,238,0.15)] flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-full">
            <Info className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-sm font-medium">{notification.message}</p>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white ml-2 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}