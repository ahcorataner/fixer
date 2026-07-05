import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  BarChart3,
  Download,
  FileText,
  Package,
  ClipboardList,
  TrendingUp,
} from "lucide-react";

export function Reports() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Relatórios
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Acompanhe indicadores, ativos, ordens e desempenho da manutenção.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            title: "Total de Ativos",
            value: "4",
            icon: Package,
            color: "text-cyan-500",
            bg: "bg-cyan-50",
          },
          {
            title: "Ordens Geradas",
            value: "10",
            icon: ClipboardList,
            color: "text-blue-500",
            bg: "bg-blue-50",
          },
          {
            title: "Disponibilidade",
            value: "75%",
            icon: TrendingUp,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
          },
          {
            title: "Relatórios",
            value: "3",
            icon: FileText,
            color: "text-amber-500",
            bg: "bg-amber-50",
          },
        ].map((item) => (
          <Card
            key={item.title}
            className="p-6 bg-white border-slate-200 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {item.title}
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-4">
                  {item.value}
                </p>
              </div>

              <div className={`p-3 rounded-xl ${item.bg}`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-white border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">
              Painel Analítico
            </p>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Relatórios disponíveis
            </h2>
          </div>

          <Button className="bg-[#082f4d] hover:bg-[#0b6680] text-white gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Relatório de Ativos",
              desc: "Resumo dos ativos cadastrados, status e disponibilidade.",
            },
            {
              title: "Relatório de Ordens",
              desc: "Acompanhamento das ordens por status, prioridade e técnico.",
            },
            {
              title: "Relatório Executivo",
              desc: "Visão geral com KPIs de manutenção e indicadores estratégicos.",
            },
          ].map((report) => (
            <div
              key={report.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5 hover:bg-cyan-50 hover:border-cyan-200 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5 text-cyan-600" />
              </div>

              <h3 className="font-bold text-slate-900">{report.title}</h3>
              <p className="text-sm text-slate-500 mt-2">{report.desc}</p>

              <Button
                variant="outline"
                className="mt-4 w-full border-slate-300 text-slate-700 hover:bg-white"
              >
                Visualizar
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}