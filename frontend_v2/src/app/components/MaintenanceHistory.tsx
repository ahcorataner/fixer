import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Calendar,
  CheckCircle2,
  ClipboardList,
  History,
  Search,
  Wrench,
  XCircle,
  FileText,
  Package,
  X,
  AlertTriangle,
} from "lucide-react";
import {
  fetchOrders,
  STATUS_CONFIG,
  TYPE_CONFIG,
  type Order,
} from "../lib/ordersStore";

export function MaintenanceHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      const data = await fetchOrders();
      setOrders(data);
      setLoading(false);
    };

    loadOrders();
  }, []);

  const historyOrders = orders.filter(
    (order) => order.status === "encerrada" || order.status === "cancelada"
  );

  const filteredOrders = historyOrders.filter((order) => {
    const term = search.toLowerCase();

    return (
      order.asset.toLowerCase().includes(term) ||
      order.description.toLowerCase().includes(term) ||
      order.type.toLowerCase().includes(term) ||
      order.status.toLowerCase().includes(term)
    );
  });

  const closedOrders = historyOrders.filter(
    (order) => order.status === "encerrada"
  ).length;

  const canceledOrders = historyOrders.filter(
    (order) => order.status === "cancelada"
  ).length;

  const totalHistory = historyOrders.length;

  return (
    <div className="p-8 space-y-6">
      {/* CABEÇALHO */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-400">
            Histórico Operacional
          </p>

          <h1 className="text-3xl font-extrabold text-white [.light_&]:text-slate-900">
            Histórico de Manutenções
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Consulte ordens encerradas, canceladas e registros anteriores de
            manutenção.
          </p>
        </div>
      </div>

      {/* CARDS RESUMO */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          {
            label: "Total no Histórico",
            value: totalHistory,
            icon: History,
            color: "text-cyan-400",
            bg: "bg-cyan-500/10",
          },
          {
            label: "Encerradas",
            value: closedOrders,
            icon: CheckCircle2,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Canceladas",
            value: canceledOrders,
            icon: XCircle,
            color: "text-red-400",
            bg: "bg-red-500/10",
          },
        ].map((item) => (
          <Card
            key={item.label}
            className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/10 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {item.label}
              </p>

              <div className={`rounded-2xl p-2.5 ${item.bg}`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
            </div>

            <p className={`text-3xl font-extrabold ${item.color}`}>
              {item.value}
            </p>
          </Card>
        ))}
      </div>

      {/* BUSCA */}
      <Card className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/10 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

          <Input
            placeholder="Buscar por ativo, descrição, tipo ou status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 rounded-2xl border-slate-700 bg-slate-950 pl-11 text-white placeholder:text-slate-600 focus:border-cyan-500 [.light_&]:border-slate-200 [.light_&]:bg-slate-50 [.light_&]:text-slate-900"
          />
        </div>
      </Card>

      {/* LISTAGEM */}
      <Card className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-lg shadow-black/10 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
        <div className="border-b border-slate-800 px-6 py-5 [.light_&]:border-slate-200">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-500/10 p-3">
              <ClipboardList className="h-5 w-5 text-cyan-400" />
            </div>

            <div>
              <h2 className="font-bold text-white [.light_&]:text-slate-900">
                Registros de Manutenção
              </h2>

              <p className="text-xs text-slate-500">
                {filteredOrders.length} registro(s) encontrado(s)
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-14 text-center text-sm text-slate-500">
            Carregando histórico...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 rounded-3xl bg-slate-800 p-5 [.light_&]:bg-slate-100">
              <History className="h-10 w-10 text-slate-500" />
            </div>

            <h3 className="text-lg font-bold text-white [.light_&]:text-slate-900">
              Nenhum registro encontrado
            </h3>

            <p className="mt-2 max-w-md text-sm text-slate-500">
              Quando ordens forem encerradas ou canceladas, elas aparecerão
              nesta área.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800 [.light_&]:divide-slate-200">
            {filteredOrders.map((order) => {
              const status = STATUS_CONFIG[order.status];
              const type = TYPE_CONFIG[order.type];

              return (
                <div
                  key={order.id}
                  className="p-6 transition-all hover:bg-slate-800/50 [.light_&]:hover:bg-slate-50"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                        <Package className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-white [.light_&]:text-slate-900">
                            {order.asset}
                          </h3>

                          <Badge
                            className={`border text-xs ${
                              status?.bg || "bg-slate-500/10"
                            } ${status?.color || "text-slate-400"}`}
                          >
                            {status?.label || order.status}
                          </Badge>

                          <Badge
                            className={`border text-xs ${
                              type?.bg || "bg-slate-500/10"
                            } ${type?.color || "text-slate-400"}`}
                          >
                            {type?.label || order.type}
                          </Badge>
                        </div>

                        <p className="text-sm leading-relaxed text-slate-400 [.light_&]:text-slate-600">
                          {order.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                            Criada em: {order.createdAt}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <Wrench className="h-3.5 w-3.5 text-amber-400" />
                            Tipo: {type?.label || order.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-2 lg:items-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setSelectedOrder(order)}
                        className="rounded-2xl border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white [.light_&]:border-slate-200 [.light_&]:text-slate-700 [.light_&]:hover:bg-slate-50"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Ver detalhes
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* MODAL DE DETALHES */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl [.light_&]:border-slate-200 [.light_&]:bg-white">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-400">
                  Detalhes da Ordem
                </p>

                <h2 className="text-2xl font-extrabold text-white [.light_&]:text-slate-900">
                  {selectedOrder.asset}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Registro histórico da manutenção selecionada.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-2xl p-2 text-slate-400 transition-all hover:bg-slate-800 hover:text-white [.light_&]:hover:bg-slate-100 [.light_&]:hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 [.light_&]:border-slate-200 [.light_&]:bg-slate-50">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Ativo
                </p>

                <p className="mt-2 font-bold text-white [.light_&]:text-slate-900">
                  {selectedOrder.asset}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 [.light_&]:border-slate-200 [.light_&]:bg-slate-50">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Status
                </p>

                <p className="mt-2 font-bold text-white [.light_&]:text-slate-900">
                  {STATUS_CONFIG[selectedOrder.status]?.label ||
                    selectedOrder.status}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 [.light_&]:border-slate-200 [.light_&]:bg-slate-50">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Tipo de Manutenção
                </p>

                <p className="mt-2 font-bold text-white [.light_&]:text-slate-900">
                  {TYPE_CONFIG[selectedOrder.type]?.label ||
                    selectedOrder.type}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 [.light_&]:border-slate-200 [.light_&]:bg-slate-50">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Data de Criação
                </p>

                <p className="mt-2 font-bold text-white [.light_&]:text-slate-900">
                  {selectedOrder.createdAt}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/50 p-4 [.light_&]:border-slate-200 [.light_&]:bg-slate-50">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Descrição
              </p>

              <p className="mt-2 text-sm leading-relaxed text-slate-300 [.light_&]:text-slate-600">
                {selectedOrder.description}
              </p>
            </div>

            {selectedOrder.status === "cancelada" && (
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Esta ordem foi cancelada e permanece apenas como registro
                  histórico.
                </span>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-2xl bg-[#082f4d] px-6 text-white hover:bg-[#0b6680]"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
