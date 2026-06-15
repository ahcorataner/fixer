import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Calendar, User, Wrench, Search, FileText } from "lucide-react";
import { getOrders, STATUS_CONFIG, TYPE_CONFIG, getCurrentUser } from "../lib/ordersStore";

export function MaintenanceHistory() {
  const user = getCurrentUser();
  const [search, setSearch] = useState("");

  const allOrders = getOrders();
  const closedOrders = allOrders.filter(
    (o) =>
      (o.status === "encerrada" || o.status === "cancelada") &&
      (user.role === "gestor" || o.responsible.toLowerCase() === user.name.toLowerCase())
  );

  const filtered = closedOrders.filter(
    (o) =>
      !search ||
      o.asset.toLowerCase().includes(search.toLowerCase()) ||
      o.responsible.toLowerCase().includes(search.toLowerCase()) ||
      TYPE_CONFIG[o.type].label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-white">Histórico de Manutenção</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {user.role === "gestor"
            ? "Todas as ordens encerradas e canceladas"
            : `Suas ordens encerradas — ${user.name}`}
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Buscar por ativo, tipo ou responsável..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-600 focus:border-cyan-500"
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="p-12 bg-slate-900 border-slate-800 text-center">
          <FileText className="w-10 h-10 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Nenhum registro encontrado</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const sc = STATUS_CONFIG[order.status];
            const tc = TYPE_CONFIG[order.type];

            return (
              <Card key={order.id} className="p-5 bg-slate-900 border-slate-800 hover:border-slate-700 transition-all">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-600 font-mono">
                        #{order.id.toString().padStart(4, "0")}
                      </span>
                      <h3 className="text-sm font-semibold text-white">{order.asset}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {order.updatedAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {order.responsible}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-slate-800 border border-slate-700 text-slate-300 text-xs">
                      <Wrench className="w-3 h-3 mr-1" />
                      {tc.label}
                    </Badge>
                    <Badge className={`${sc.bg} border ${sc.color} text-xs`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${sc.dot}`} />
                      {sc.label}
                    </Badge>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Descrição</p>
                  <p className="text-sm text-slate-300">{order.description}</p>

                  {order.executionNotes && (
                    <div className="mt-2">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Registro de Execução</p>
                      <p className="text-xs text-slate-400 whitespace-pre-line">{order.executionNotes}</p>
                    </div>
                  )}

                  {order.closureNotes && (
                    <div className="mt-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                      <p className="text-xs text-emerald-400">{order.closureNotes}</p>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
