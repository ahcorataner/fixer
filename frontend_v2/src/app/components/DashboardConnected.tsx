import { Card } from "./ui/card";
import { TrendingUp, Clock, Activity, Calendar, AlertCircle } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { api } from "../lib/api";

const statusColorMap: Record<string, string> = {
  operational: "bg-emerald-500",
  maintenance: "bg-amber-500",
  unavailable: "bg-red-500",
};

const statusLabelMap: Record<string, string> = {
  operational: "Operacional",
  maintenance: "Em Manutenção",
  unavailable: "Indisponível",
};

export function DashboardConnected() {
  const { data: kpis, loading: kpisLoading, error: kpisError } = useApi(() => api.getKPIs());
  const { data: assetsByStatus, loading: assetsLoading } = useApi(() => api.getAssetsByStatus());
  const { data: recentMaintenances, loading: maintenancesLoading } = useApi(() => api.getRecentMaintenances());

  if (kpisError) {
    return (
      <div className="p-6">
        <Card className="p-6 bg-red-900/20 border-red-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <div>
              <h3 className="text-white font-medium">Erro ao carregar dados</h3>
              <p className="text-sm text-slate-400">
                Verifique se o servidor backend está rodando: pnpm run server
              </p>
              <p className="text-xs text-red-400 mt-1">{kpisError.message}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="mb-4 text-white">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* MTBF Card */}
        <Card className="p-4 bg-slate-900 border-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-400 mb-1">MTBF</p>
              <p className="font-bold text-white text-lg">
                {kpisLoading ? '...' : `${Math.round(kpis?.mtbf_hours || 0)}h`}
              </p>
            </div>
            <div className="p-2 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-xs text-slate-400">Tempo Médio entre Falhas</span>
          </div>
        </Card>

        {/* MTTR Card */}
        <Card className="p-4 bg-slate-900 border-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-400 mb-1">MTTR</p>
              <p className="font-bold text-white text-lg">
                {kpisLoading ? '...' : `${kpis?.mttr_hours?.toFixed(1) || 0}h`}
              </p>
            </div>
            <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-xs text-slate-400">Tempo Médio de Reparo</span>
          </div>
        </Card>

        {/* Disponibilidade Card */}
        <Card className="p-4 bg-slate-900 border-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-400 mb-1">Disponibilidade</p>
              <p className="font-bold text-white text-lg">
                {kpisLoading ? '...' : `${kpis?.availability_percent?.toFixed(1) || 0}%`}
              </p>
            </div>
            <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-xs text-slate-400">Taxa de Disponibilidade</span>
          </div>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="p-4 bg-slate-900 border-slate-800">
          <h3 className="mb-3 text-white text-sm">Ativos por Status</h3>
          {assetsLoading ? (
            <p className="text-xs text-slate-400">Carregando...</p>
          ) : (
            <div className="space-y-2">
              {assetsByStatus?.map((item: any) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 ${statusColorMap[item.status]} rounded-full`}></div>
                    <span className="text-xs text-slate-300">{statusLabelMap[item.status]}</span>
                  </div>
                  <span className="font-medium text-white text-sm">{item.total}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-4 bg-slate-900 border-slate-800">
          <h3 className="mb-3 text-white text-sm">Manutenções Recentes</h3>
          {maintenancesLoading ? (
            <p className="text-xs text-slate-400">Carregando...</p>
          ) : (
            <div className="space-y-2">
              {recentMaintenances?.slice(0, 3).map((item: any, index: number) => (
                <div key={item.id} className={index < 2 ? "pb-2 border-b border-slate-800" : ""}>
                  <p className="text-xs text-white mb-1">{item.asset_name}</p>
                  <p className="text-xs text-slate-500">
                    {item.maintenance_type === 'preventiva' ? 'Preventiva' : 'Corretiva'} -{' '}
                    {new Date(item.start_time).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
              {(!recentMaintenances || recentMaintenances.length === 0) && (
                <p className="text-xs text-slate-500">Nenhuma manutenção recente</p>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Gráfico de Gantt - Timeline */}
      <Card className="p-4 bg-slate-900 border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <h3 className="text-white text-sm">Cronograma de Manutenções</h3>
        </div>

        <div className="space-y-3">
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-emerald-500 rounded"></div>
              <span className="text-slate-400">Concluída</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-amber-500 rounded"></div>
              <span className="text-slate-400">Andamento</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-cyan-500 rounded"></div>
              <span className="text-slate-400">Programada</span>
            </div>
          </div>

          <div className="flex border-b border-slate-800 pb-1">
            <div className="w-40"></div>
            <div className="flex-1 grid grid-cols-7 text-center text-xs text-slate-500">
              <div>15/04</div>
              <div>16/04</div>
              <div>17/04</div>
              <div className="text-cyan-400 font-medium">18/04</div>
              <div>19/04</div>
              <div>20/04</div>
              <div>21/04</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-40 pr-3">
                <p className="text-xs text-white truncate">Compressor AR-01</p>
              </div>
              <div className="flex-1 relative h-7 bg-slate-800/50 rounded">
                <div
                  className="absolute h-full bg-emerald-500 rounded flex items-center px-2"
                  style={{ left: '0%', width: '28%' }}
                >
                  <span className="text-xs text-white">Preventiva</span>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-40 pr-3">
                <p className="text-xs text-white truncate">Bomba HID-03</p>
              </div>
              <div className="flex-1 relative h-7 bg-slate-800/50 rounded">
                <div
                  className="absolute h-full bg-amber-500 rounded flex items-center px-2 animate-pulse"
                  style={{ left: '14%', width: '42%' }}
                >
                  <span className="text-xs text-white">Corretiva</span>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-40 pr-3">
                <p className="text-xs text-white truncate">Motor EL-12</p>
              </div>
              <div className="flex-1 relative h-7 bg-slate-800/50 rounded">
                <div
                  className="absolute h-full bg-cyan-500 rounded flex items-center px-2"
                  style={{ left: '57%', width: '28%' }}
                >
                  <span className="text-xs text-white">Preventiva</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
