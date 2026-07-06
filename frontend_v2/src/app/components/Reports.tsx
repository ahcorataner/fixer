import { useEffect, useMemo, useState } from "react";
import type { ElementType } from "react";
import {
  BarChart3,
  ClipboardList,
  Download,
  Eye,
  FileText,
  Package,
  ShieldCheck,
  TrendingUp,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Activity,
  PieChart,
  Target,
  Lightbulb,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { supabase } from "../../lib/supabase";
import {
  fetchOrders,
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  TYPE_CONFIG,
  type Order,
} from "../lib/ordersStore";

type ReportType = "assets" | "orders" | "executive";

type Asset = {
  id?: string | number;
  name: string;
  status: string;
  location?: string;
  type?: string;
  created_at?: string;
};

type ChartItem = {
  label: string;
  value: number;
  color: string;
  textColor?: string;
};

const reportInfo: Record<
  ReportType,
  {
    title: string;
    subtitle: string;
    icon: ElementType;
  }
> = {
  assets: {
    title: "Relatório de Ativos",
    subtitle: "Resumo dos ativos cadastrados, status e disponibilidade.",
    icon: Package,
  },
  orders: {
    title: "Relatório de Ordens",
    subtitle: "Acompanhamento das ordens por status, prioridade e técnico.",
    icon: ClipboardList,
  },
  executive: {
    title: "Relatório Executivo",
    subtitle: "Visão geral com KPIs de manutenção e indicadores estratégicos.",
    icon: BarChart3,
  },
};

function todayBR() {
  return new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function assetStatusLabel(status: string) {
  if (status === "operational") return "Operacional";
  if (status === "maintenance") return "Em manutenção";
  if (status === "unavailable") return "Indisponível";
  return status || "-";
}

function percent(value: number, total: number) {
  if (total <= 0) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}

function getAvailabilityLevel(availability: number) {
  if (availability >= 85) return "boa";
  if (availability >= 60) return "moderada";
  return "crítica";
}

function getAvailabilityText(availability: number) {
  if (availability >= 85) {
    return "A disponibilidade operacional está em nível satisfatório, indicando boa condição geral dos ativos cadastrados.";
  }

  if (availability >= 60) {
    return "A disponibilidade operacional está em nível moderado, exigindo acompanhamento dos ativos em manutenção ou indisponíveis.";
  }

  return "A disponibilidade operacional está em nível crítico, indicando necessidade de ação gerencial imediata sobre ativos indisponíveis e ordens pendentes.";
}

function buildAnalysisText({
  availability,
  totalAssets,
  totalOrders,
  pendingOrders,
  canceledOrders,
  criticalOrders,
  highOrders,
}: {
  availability: number;
  totalAssets: number;
  totalOrders: number;
  pendingOrders: number;
  canceledOrders: number;
  criticalOrders: number;
  highOrders: number;
}) {
  const availabilityLevel = getAvailabilityLevel(availability);

  return {
    availabilityLevel,
    paragraphs: [
      `A disponibilidade operacional atual é de ${availability}%, classificada como ${availabilityLevel}. ${getAvailabilityText(
        availability
      )}`,
      `O sistema possui ${totalAssets} ativos cadastrados e ${totalOrders} ordens de manutenção registradas. Esse volume permite acompanhar a evolução operacional dos ativos e identificar pontos recorrentes de falha, manutenção ou indisponibilidade.`,
      `Existem ${pendingOrders} ordens que requerem atenção, validação, correção ou encerramento. Esse indicador deve ser acompanhado para evitar acúmulo de pendências no fluxo de manutenção.`,
      `Foram identificadas ${canceledOrders} ordens canceladas e ${
        criticalOrders + highOrders
      } ordens com prioridade alta ou crítica. Esses pontos merecem análise gerencial para entender se há falhas de planejamento, priorização ou execução.`,
    ],
    recommendations: [
      "Priorizar ordens críticas e de alta prioridade.",
      "Investigar motivos de cancelamento de ordens.",
      "Monitorar ativos indisponíveis ou em manutenção recorrente.",
      "Acompanhar responsáveis técnicos com maior volume de ordens.",
      "Usar os indicadores para reduzir o tempo de reparo e melhorar a disponibilidade.",
      "Padronizar critérios de abertura, validação e encerramento das ordens.",
    ],
  };
}

function getMetrics(assets: Asset[], orders: Order[]) {
  const totalAssets = assets.length;

  const operationalAssets = assets.filter(
    (asset) => asset.status === "operational"
  ).length;

  const maintenanceAssets = assets.filter(
    (asset) => asset.status === "maintenance"
  ).length;

  const unavailableAssets = assets.filter(
    (asset) => asset.status === "unavailable"
  ).length;

  const totalOrders = orders.length;

  const draftOrders = orders.filter((order) => order.status === "rascunho").length;
  const validationOrders = orders.filter(
    (order) => order.status === "em_validacao"
  ).length;
  const approvedOrders = orders.filter(
    (order) => order.status === "aprovada"
  ).length;
  const executionOrders = orders.filter(
    (order) => order.status === "em_execucao"
  ).length;
  const pendingClosureOrders = orders.filter(
    (order) => order.status === "aguardando_encerramento"
  ).length;
  const closedOrders = orders.filter(
    (order) => order.status === "encerrada"
  ).length;
  const canceledOrders = orders.filter(
    (order) => order.status === "cancelada"
  ).length;
  const rejectedOrders = orders.filter(
    (order) => order.status === "reprovada"
  ).length;

  const pendingOrders =
    draftOrders + validationOrders + pendingClosureOrders + rejectedOrders;

  const lowOrders = orders.filter((order) => order.priority === "baixa").length;
  const mediumOrders = orders.filter((order) => order.priority === "media").length;
  const highOrders = orders.filter((order) => order.priority === "alta").length;
  const criticalOrders = orders.filter(
    (order) => order.priority === "critica"
  ).length;

  const preventiveOrders = orders.filter(
    (order) => order.type === "preventiva"
  ).length;
  const correctiveOrders = orders.filter(
    (order) => order.type === "corretiva"
  ).length;
  const predictiveOrders = orders.filter(
    (order) => order.type === "preditiva"
  ).length;

  const availability =
    totalAssets > 0 ? Math.round((operationalAssets / totalAssets) * 100) : 100;

  const closureRate =
    totalOrders > 0 ? Math.round((closedOrders / totalOrders) * 100) : 0;

  const cancellationRate =
    totalOrders > 0 ? Math.round((canceledOrders / totalOrders) * 100) : 0;

  const criticalityRate =
    totalOrders > 0
      ? Math.round(((criticalOrders + highOrders) / totalOrders) * 100)
      : 0;

  return {
    totalAssets,
    operationalAssets,
    maintenanceAssets,
    unavailableAssets,

    totalOrders,
    draftOrders,
    validationOrders,
    approvedOrders,
    executionOrders,
    pendingClosureOrders,
    closedOrders,
    canceledOrders,
    rejectedOrders,
    pendingOrders,

    lowOrders,
    mediumOrders,
    highOrders,
    criticalOrders,

    preventiveOrders,
    correctiveOrders,
    predictiveOrders,

    availability,
    closureRate,
    cancellationRate,
    criticalityRate,
  };
}

function countOrdersByResponsible(orders: Order[]) {
  const result = new Map<string, number>();

  orders.forEach((order) => {
    const responsible = order.responsible || "Não informado";
    result.set(responsible, (result.get(responsible) || 0) + 1);
  });

  return Array.from(result.entries())
    .map(([label, value]) => ({
      label,
      value,
      color: "bg-cyan-500",
      textColor: "text-cyan-600",
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}

function countOrdersByAsset(orders: Order[]) {
  const result = new Map<string, number>();

  orders.forEach((order) => {
    const asset = order.asset || "Não informado";
    result.set(asset, (result.get(asset) || 0) + 1);
  });

  return Array.from(result.entries())
    .map(([label, value]) => ({
      label,
      value,
      color: "bg-blue-500",
      textColor: "text-blue-600",
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}

function chartHtml(title: string, data: ChartItem[]) {
  const max = Math.max(...data.map((item) => item.value), 1);

  const rows = data
    .map((item) => {
      const width = item.value > 0 ? Math.max((item.value / max) * 100, 8) : 0;

      return `
        <div class="chart-row">
          <div class="chart-label">
            <span>${escapeHtml(item.label)}</span>
            <strong>${item.value}</strong>
          </div>
          <div class="chart-track">
            <div class="chart-bar ${escapeHtml(item.color)}" style="width: ${width}%"></div>
          </div>
        </div>
      `;
    })
    .join("");

  return `
    <section class="chart-section">
      <h2>${escapeHtml(title)}</h2>
      <div class="chart-list">${rows}</div>
    </section>
  `;
}

function buildReportHtml(type: ReportType, assets: Asset[], orders: Order[]) {
  const info = reportInfo[type];
  const date = todayBR();
  const logoUrl = `${window.location.origin}/fixer.png`;
  const metrics = getMetrics(assets, orders);

  const analysis = buildAnalysisText({
    availability: metrics.availability,
    totalAssets: metrics.totalAssets,
    totalOrders: metrics.totalOrders,
    pendingOrders: metrics.pendingOrders,
    canceledOrders: metrics.canceledOrders,
    criticalOrders: metrics.criticalOrders,
    highOrders: metrics.highOrders,
  });

  const assetStatusData: ChartItem[] = [
    {
      label: "Operacionais",
      value: metrics.operationalAssets,
      color: "green-bar",
    },
    {
      label: "Em manutenção",
      value: metrics.maintenanceAssets,
      color: "amber-bar",
    },
    {
      label: "Indisponíveis",
      value: metrics.unavailableAssets,
      color: "red-bar",
    },
  ];

  const orderStatusData: ChartItem[] = [
    { label: "Rascunho", value: metrics.draftOrders, color: "slate-bar" },
    {
      label: "Em validação",
      value: metrics.validationOrders,
      color: "blue-bar",
    },
    { label: "Aprovadas", value: metrics.approvedOrders, color: "cyan-bar" },
    {
      label: "Em execução",
      value: metrics.executionOrders,
      color: "amber-bar",
    },
    {
      label: "Ag. encerramento",
      value: metrics.pendingClosureOrders,
      color: "purple-bar",
    },
    { label: "Encerradas", value: metrics.closedOrders, color: "green-bar" },
    { label: "Canceladas", value: metrics.canceledOrders, color: "red-bar" },
    { label: "Reprovadas", value: metrics.rejectedOrders, color: "rose-bar" },
  ];

  const orderPriorityData: ChartItem[] = [
    { label: "Baixa", value: metrics.lowOrders, color: "green-bar" },
    { label: "Média", value: metrics.mediumOrders, color: "blue-bar" },
    { label: "Alta", value: metrics.highOrders, color: "amber-bar" },
    { label: "Crítica", value: metrics.criticalOrders, color: "red-bar" },
  ];

  const orderTypeData: ChartItem[] = [
    {
      label: "Preventiva",
      value: metrics.preventiveOrders,
      color: "green-bar",
    },
    {
      label: "Corretiva",
      value: metrics.correctiveOrders,
      color: "red-bar",
    },
    {
      label: "Preditiva",
      value: metrics.predictiveOrders,
      color: "blue-bar",
    },
  ];

  const responsibleData = countOrdersByResponsible(orders);
  const assetRankingData = countOrdersByAsset(orders);

  const assetsRows = assets
    .slice(0, 25)
    .map(
      (asset) => `
        <tr>
          <td><strong>${escapeHtml(asset.name)}</strong></td>
          <td>${escapeHtml(assetStatusLabel(asset.status))}</td>
          <td>${escapeHtml(asset.type || "-")}</td>
          <td>${escapeHtml(asset.location || "-")}</td>
        </tr>
      `
    )
    .join("");

  const ordersRows = orders
    .slice(0, 30)
    .map(
      (order) => `
        <tr>
          <td><strong>#${String(order.id).padStart(4, "0")}</strong></td>
          <td>${escapeHtml(order.asset)}</td>
          <td>${escapeHtml(TYPE_CONFIG[order.type]?.label || order.type)}</td>
          <td>${escapeHtml(STATUS_CONFIG[order.status]?.label || order.status)}</td>
          <td>${escapeHtml(PRIORITY_CONFIG[order.priority]?.label || order.priority)}</td>
          <td>${escapeHtml(order.responsible)}</td>
          <td>${escapeHtml(order.createdAt)}</td>
        </tr>
      `
    )
    .join("");

  const analysisSection = `
    <section class="analysis-box">
      <p class="eyebrow">Análise Executiva</p>
      <h2>Diagnóstico operacional da manutenção</h2>
      ${analysis.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}

      <div class="recommendation-box">
        <h3>Recomendações gerenciais</h3>
        <ul>
          ${analysis.recommendations
            .map((item) => `<li>${escapeHtml(item)}</li>`)
            .join("")}
        </ul>
      </div>
    </section>
  `;

  const assetsSection =
    type === "assets" || type === "executive"
      ? `
        <section>
          <h2>Indicadores de Ativos</h2>

          <div class="mini-grid">
            <div class="mini-card green">
              <span>Operacionais</span>
              <strong>${metrics.operationalAssets}</strong>
              <small>${percent(metrics.operationalAssets, metrics.totalAssets)}</small>
            </div>

            <div class="mini-card amber">
              <span>Em manutenção</span>
              <strong>${metrics.maintenanceAssets}</strong>
              <small>${percent(metrics.maintenanceAssets, metrics.totalAssets)}</small>
            </div>

            <div class="mini-card red">
              <span>Indisponíveis</span>
              <strong>${metrics.unavailableAssets}</strong>
              <small>${percent(metrics.unavailableAssets, metrics.totalAssets)}</small>
            </div>
          </div>
        </section>

        ${chartHtml("Gráfico - Ativos por Status", assetStatusData)}

        <section>
          <h2>Lista de Ativos</h2>

          <table>
            <thead>
              <tr>
                <th>Ativo</th>
                <th>Status</th>
                <th>Tipo</th>
                <th>Localização</th>
              </tr>
            </thead>
            <tbody>
              ${
                assetsRows ||
                `<tr><td colspan="4">Nenhum ativo cadastrado.</td></tr>`
              }
            </tbody>
          </table>
        </section>
      `
      : "";

  const ordersSection =
    type === "orders" || type === "executive"
      ? `
        <section>
          <h2>Indicadores de Ordens</h2>

          <div class="mini-grid four">
            <div class="mini-card blue">
              <span>Em execução</span>
              <strong>${metrics.executionOrders}</strong>
              <small>${percent(metrics.executionOrders, metrics.totalOrders)}</small>
            </div>

            <div class="mini-card green">
              <span>Encerradas</span>
              <strong>${metrics.closedOrders}</strong>
              <small>${percent(metrics.closedOrders, metrics.totalOrders)}</small>
            </div>

            <div class="mini-card red">
              <span>Canceladas</span>
              <strong>${metrics.canceledOrders}</strong>
              <small>${percent(metrics.canceledOrders, metrics.totalOrders)}</small>
            </div>

            <div class="mini-card amber">
              <span>Alta/Crítica</span>
              <strong>${metrics.highOrders + metrics.criticalOrders}</strong>
              <small>Prioridade elevada</small>
            </div>
          </div>
        </section>

        ${chartHtml("Gráfico - Ordens por Status", orderStatusData)}
        ${chartHtml("Gráfico - Ordens por Prioridade", orderPriorityData)}
        ${chartHtml("Gráfico - Ordens por Tipo de Manutenção", orderTypeData)}
        ${chartHtml("Ranking - Ativos com Mais Ordens", assetRankingData)}
        ${chartHtml("Ranking - Ordens por Responsável", responsibleData)}

        <section>
          <h2>Lista de Ordens</h2>

          <table>
            <thead>
              <tr>
                <th>Ordem</th>
                <th>Ativo</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Prioridade</th>
                <th>Responsável</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              ${
                ordersRows ||
                `<tr><td colspan="7">Nenhuma ordem cadastrada.</td></tr>`
              }
            </tbody>
          </table>
        </section>
      `
      : "";

  return `
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(info.title)} - FIXER</title>

        <style>
          @page {
            size: A4;
            margin: 12mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            background: #ffffff;
            color: #0f172a;
            font-family: Arial, Helvetica, sans-serif;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .page {
            width: 100%;
            max-width: 980px;
            margin: 0 auto;
            padding: 8px 0 24px;
          }

          header {
            display: grid;
            grid-template-columns: 170px 1fr 150px;
            align-items: center;
            gap: 24px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 22px;
            margin-bottom: 24px;
          }

          .brand-logo img {
            width: 155px;
            max-height: 95px;
            object-fit: contain;
          }

          .brand-title h1 {
            margin: 0;
            color: #082f4d;
            font-size: 30px;
            line-height: 1.08;
            letter-spacing: 2px;
            text-transform: uppercase;
          }

          .brand-title p {
            margin: 8px 0 0;
            color: #475569;
            font-size: 13px;
          }

          .meta {
            text-align: right;
            color: #475569;
            font-size: 12px;
          }

          .meta strong {
            display: block;
            color: #082f4d;
            font-size: 13px;
            margin-bottom: 4px;
          }

          .summary,
          .analysis-box,
          .chart-section,
          .recommendation-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            padding: 18px;
            margin-bottom: 22px;
          }

          .summary .eyebrow,
          .analysis-box .eyebrow {
            margin: 0 0 10px;
            color: #0891b2;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 4px;
            text-transform: uppercase;
          }

          .summary h2,
          .analysis-box h2 {
            margin: 0;
            font-size: 20px;
            color: #0f172a;
          }

          .summary p,
          .analysis-box p {
            margin: 10px 0 0;
            color: #475569;
            font-size: 13px;
            line-height: 1.6;
          }

          .recommendation-box {
            margin-top: 18px;
            margin-bottom: 0;
            background: #ffffff;
          }

          .recommendation-box h3 {
            margin: 0 0 10px;
            font-size: 15px;
            color: #0f172a;
          }

          .recommendation-box ul {
            margin: 0;
            padding-left: 18px;
            color: #334155;
            font-size: 13px;
            line-height: 1.7;
          }

          .kpis {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 26px;
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
            font-size: 27px;
            color: #082f4d;
          }

          .kpi.green strong {
            color: #059669;
          }

          .kpi.red strong {
            color: #dc2626;
          }

          section {
            margin-top: 24px;
            break-inside: avoid;
          }

          section h2 {
            color: #0f172a;
            font-size: 18px;
            margin: 0 0 14px;
          }

          section h3 {
            color: #0f172a;
            font-size: 15px;
            margin: 20px 0 10px;
          }

          .mini-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 16px;
          }

          .mini-grid.four {
            grid-template-columns: repeat(4, 1fr);
          }

          .mini-card {
            border-radius: 16px;
            padding: 14px;
            border: 1px solid #e2e8f0;
          }

          .mini-card span {
            display: block;
            font-size: 12px;
            font-weight: 800;
          }

          .mini-card strong {
            display: block;
            margin-top: 8px;
            font-size: 24px;
          }

          .mini-card small {
            display: block;
            margin-top: 4px;
            font-size: 11px;
            color: #475569;
          }

          .green {
            background: #ecfdf5;
            border-color: #bbf7d0;
            color: #047857;
          }

          .amber {
            background: #fffbeb;
            border-color: #fde68a;
            color: #b45309;
          }

          .red {
            background: #fef2f2;
            border-color: #fecaca;
            color: #dc2626;
          }

          .blue {
            background: #eff6ff;
            border-color: #bfdbfe;
            color: #1d4ed8;
          }

          .chart-list {
            display: grid;
            gap: 12px;
          }

          .chart-row {
            display: grid;
            gap: 7px;
          }

          .chart-label {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            font-size: 12px;
            color: #334155;
          }

          .chart-label span {
            font-weight: 700;
          }

          .chart-label strong {
            color: #0f172a;
          }

          .chart-track {
            height: 12px;
            width: 100%;
            overflow: hidden;
            border-radius: 999px;
            background: #e2e8f0;
          }

          .chart-bar {
            height: 100%;
            border-radius: 999px;
          }

          .green-bar { background: #10b981; }
          .amber-bar { background: #f59e0b; }
          .red-bar { background: #ef4444; }
          .blue-bar { background: #3b82f6; }
          .cyan-bar { background: #06b6d4; }
          .purple-bar { background: #8b5cf6; }
          .rose-bar { background: #f43f5e; }
          .slate-bar { background: #64748b; }

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

          td {
            padding: 9px;
            border: 1px solid #e2e8f0;
            color: #334155;
          }

          footer {
            margin-top: 32px;
            border-top: 1px solid #e2e8f0;
            padding-top: 12px;
            color: #64748b;
            font-size: 10px;
          }

          @media print {
            body {
              zoom: 1;
            }

            .page {
              max-width: none;
              padding: 0;
            }
          }
        </style>
      </head>

      <body>
        <main class="page">
          <header>
            <div class="brand-logo">
              <img src="${logoUrl}" alt="FIXER" />
            </div>

            <div class="brand-title">
              <h1>${escapeHtml(info.title)}</h1>
              <p>Sistema Integrado de Gestão de Ativos e Manutenção</p>
            </div>

            <div class="meta">
              <strong>FIXER</strong>
              <span>Emitido em<br />${date}</span>
            </div>
          </header>

          <section class="summary">
            <p class="eyebrow">Resumo do Relatório</p>
            <h2>${escapeHtml(info.subtitle)}</h2>
            <p>
              Este documento consolida informações operacionais do sistema FIXER,
              incluindo ativos, ordens de manutenção, status, prioridades e indicadores
              de disponibilidade.
            </p>
          </section>

          <section class="kpis">
            <div class="kpi">
              <span>Total de Ativos</span>
              <strong>${metrics.totalAssets}</strong>
            </div>

            <div class="kpi">
              <span>Ordens</span>
              <strong>${metrics.totalOrders}</strong>
            </div>

            <div class="kpi green">
              <span>Disponibilidade</span>
              <strong>${metrics.availability}%</strong>
            </div>

            <div class="kpi red">
              <span>Requerem Atenção</span>
              <strong>${metrics.pendingOrders}</strong>
            </div>
          </section>

          ${analysisSection}
          ${assetsSection}
          ${ordersSection}

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

function MetricCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string | number;
  icon: ElementType;
  tone: "cyan" | "blue" | "emerald" | "amber" | "red";
}) {
  const tones = {
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    red: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  return (
    <Card className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/10 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black text-white [.light_&]:text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${tones[tone]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

function ReportCard({
  type,
  onPreview,
  onPdf,
}: {
  type: ReportType;
  onPreview: (type: ReportType) => void;
  onPdf: (type: ReportType) => void;
}) {
  const info = reportInfo[type];
  const Icon = info.icon;

  return (
    <Card className="group rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/10 transition-all hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-cyan-950/30 [.light_&]:border-slate-200 [.light_&]:bg-slate-50 [.light_&]:shadow-slate-200/70">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="text-lg font-black text-white [.light_&]:text-slate-900">
        {info.title}
      </h3>

      <p className="mt-3 min-h-[48px] text-sm leading-relaxed text-slate-500">
        {info.subtitle}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => onPreview(type)}
          className="rounded-2xl border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800 hover:text-white [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:text-slate-700 [.light_&]:hover:bg-slate-100"
        >
          <Eye className="mr-2 h-4 w-4" />
          Visualizar
        </Button>

        <Button
          type="button"
          onClick={() => onPdf(type)}
          className="rounded-2xl bg-[#082f4d] text-white hover:bg-[#0b6680]"
        >
          <Download className="mr-2 h-4 w-4" />
          PDF
        </Button>
      </div>
    </Card>
  );
}

function StatusLine({
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
  const width = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-400 [.light_&]:text-slate-600">
          {label}
        </span>
        <span className="font-black text-white [.light_&]:text-slate-900">
          {value}{" "}
          <span className="text-slate-500">({percent(value, total)})</span>
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-800 [.light_&]:bg-slate-200">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function SimpleBarChart({
  title,
  data,
}: {
  title: string;
  data: ChartItem[];
}) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-5 flex items-center gap-2 text-xl font-black text-slate-900">
        <BarChart3 className="h-5 w-5 text-cyan-600" />
        {title}
      </h3>

      <div className="space-y-4">
        {data.map((item) => {
          const width =
            item.value > 0 ? Math.max((item.value / max) * 100, 8) : 0;

          return (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                <span className="font-bold text-slate-700">{item.label}</span>
                <span className="font-black text-slate-900">{item.value}</span>
              </div>

              <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${item.color}`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ExecutiveAnalysis({
  metrics,
}: {
  metrics: ReturnType<typeof getMetrics>;
}) {
  const analysis = buildAnalysisText({
    availability: metrics.availability,
    totalAssets: metrics.totalAssets,
    totalOrders: metrics.totalOrders,
    pendingOrders: metrics.pendingOrders,
    canceledOrders: metrics.canceledOrders,
    criticalOrders: metrics.criticalOrders,
    highOrders: metrics.highOrders,
  });

  return (
    <section className="rounded-3xl border border-cyan-200 bg-cyan-50 p-6">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-700">
        Análise Executiva
      </p>

      <h3 className="mt-3 text-2xl font-black text-slate-900">
        Diagnóstico operacional da manutenção
      </h3>

      <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
        {analysis.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-cyan-200 bg-white p-5">
        <h4 className="flex items-center gap-2 font-black text-slate-900">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          Recomendações gerenciais
        </h4>

        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
          {analysis.recommendations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function PreviewReport({
  type,
  assets,
  orders,
}: {
  type: ReportType;
  assets: Asset[];
  orders: Order[];
}) {
  const info = reportInfo[type];
  const metrics = getMetrics(assets, orders);

  const assetStatusData: ChartItem[] = [
    {
      label: "Operacionais",
      value: metrics.operationalAssets,
      color: "bg-emerald-500",
    },
    {
      label: "Em manutenção",
      value: metrics.maintenanceAssets,
      color: "bg-amber-500",
    },
    {
      label: "Indisponíveis",
      value: metrics.unavailableAssets,
      color: "bg-red-500",
    },
  ];

  const orderStatusData: ChartItem[] = [
    { label: "Rascunho", value: metrics.draftOrders, color: "bg-slate-500" },
    {
      label: "Em validação",
      value: metrics.validationOrders,
      color: "bg-blue-500",
    },
    { label: "Aprovadas", value: metrics.approvedOrders, color: "bg-cyan-500" },
    {
      label: "Em execução",
      value: metrics.executionOrders,
      color: "bg-amber-500",
    },
    {
      label: "Ag. encerramento",
      value: metrics.pendingClosureOrders,
      color: "bg-purple-500",
    },
    {
      label: "Encerradas",
      value: metrics.closedOrders,
      color: "bg-emerald-500",
    },
    {
      label: "Canceladas",
      value: metrics.canceledOrders,
      color: "bg-red-500",
    },
    {
      label: "Reprovadas",
      value: metrics.rejectedOrders,
      color: "bg-rose-500",
    },
  ];

  const orderPriorityData: ChartItem[] = [
    { label: "Baixa", value: metrics.lowOrders, color: "bg-emerald-500" },
    { label: "Média", value: metrics.mediumOrders, color: "bg-blue-500" },
    { label: "Alta", value: metrics.highOrders, color: "bg-amber-500" },
    { label: "Crítica", value: metrics.criticalOrders, color: "bg-red-500" },
  ];

  const orderTypeData: ChartItem[] = [
    {
      label: "Preventiva",
      value: metrics.preventiveOrders,
      color: "bg-emerald-500",
    },
    {
      label: "Corretiva",
      value: metrics.correctiveOrders,
      color: "bg-red-500",
    },
    {
      label: "Preditiva",
      value: metrics.predictiveOrders,
      color: "bg-blue-500",
    },
  ];

  const responsibleData = countOrdersByResponsible(orders).map((item) => ({
    ...item,
    color: "bg-cyan-500",
  }));

  const assetRankingData = countOrdersByAsset(orders).map((item) => ({
    ...item,
    color: "bg-blue-500",
  }));

  return (
    <div className="bg-white p-12 text-slate-900">
      <header className="mb-8 grid grid-cols-[220px_1fr_160px] items-center gap-6 border-b border-slate-200 pb-6">
        <div className="flex items-center">
          <img
            src="/fixer.png"
            alt="Fixer"
            className="h-28 w-48 object-contain"
          />
        </div>

        <div>
          <h1 className="text-4xl font-black uppercase tracking-wider text-[#082f4d]">
            {info.title}
          </h1>
          <p className="mt-3 text-base text-slate-500">
            Sistema Integrado de Gestão de Ativos e Manutenção
          </p>
        </div>

        <div className="text-right text-sm">
          <p className="font-black text-[#082f4d]">FIXER</p>
          <p className="text-slate-500">Emitido em {todayBR()}</p>
        </div>
      </header>

      <section className="mb-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-700">
          Resumo do Relatório
        </p>

        <h2 className="mt-3 text-2xl font-black text-slate-900">
          {info.subtitle}
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Este documento consolida informações operacionais do sistema FIXER,
          incluindo ativos, ordens de manutenção, status, prioridades,
          indicadores de disponibilidade, análises e recomendações gerenciais.
        </p>
      </section>

      <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 p-5">
          <p className="text-xs font-bold uppercase text-slate-500">Ativos</p>
          <p className="mt-2 text-4xl font-black text-[#082f4d]">
            {metrics.totalAssets}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 p-5">
          <p className="text-xs font-bold uppercase text-slate-500">Ordens</p>
          <p className="mt-2 text-4xl font-black text-[#082f4d]">
            {metrics.totalOrders}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 p-5">
          <p className="text-xs font-bold uppercase text-slate-500">
            Disponibilidade
          </p>
          <p className="mt-2 text-4xl font-black text-emerald-600">
            {metrics.availability}%
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 p-5">
          <p className="text-xs font-bold uppercase text-slate-500">Atenção</p>
          <p className="mt-2 text-4xl font-black text-red-600">
            {metrics.pendingOrders}
          </p>
        </div>
      </section>

      <div className="mb-8">
        <ExecutiveAnalysis metrics={metrics} />
      </div>

      {(type === "assets" || type === "executive") && (
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <SimpleBarChart title="Ativos por Status" data={assetStatusData} />

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-5 flex items-center gap-2 text-xl font-black text-slate-900">
              <Activity className="h-5 w-5 text-emerald-600" />
              Indicadores de Ativos
            </h3>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-sm font-bold text-emerald-700">
                  Operacionais
                </p>
                <p className="mt-2 text-3xl font-black">
                  {metrics.operationalAssets}
                </p>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <p className="text-sm font-bold text-amber-700">
                  Em manutenção
                </p>
                <p className="mt-2 text-3xl font-black">
                  {metrics.maintenanceAssets}
                </p>
              </div>

              <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                <p className="text-sm font-bold text-red-700">Indisponíveis</p>
                <p className="mt-2 text-3xl font-black">
                  {metrics.unavailableAssets}
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {(type === "orders" || type === "executive") && (
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <SimpleBarChart title="Ordens por Status" data={orderStatusData} />
          <SimpleBarChart
            title="Ordens por Prioridade"
            data={orderPriorityData}
          />
          <SimpleBarChart
            title="Ordens por Tipo de Manutenção"
            data={orderTypeData}
          />
          <SimpleBarChart
            title="Ranking de Ativos com Mais Ordens"
            data={assetRankingData}
          />
          <SimpleBarChart
            title="Ranking de Ordens por Responsável"
            data={responsibleData}
          />

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-5 flex items-center gap-2 text-xl font-black text-slate-900">
              <Target className="h-5 w-5 text-red-600" />
              Indicadores Operacionais
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-sm font-bold text-emerald-700">
                  Taxa de Encerramento
                </p>
                <p className="mt-2 text-3xl font-black">
                  {metrics.closureRate}%
                </p>
              </div>

              <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                <p className="text-sm font-bold text-red-700">
                  Taxa de Cancelamento
                </p>
                <p className="mt-2 text-3xl font-black">
                  {metrics.cancellationRate}%
                </p>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <p className="text-sm font-bold text-amber-700">
                  Alta/Crítica
                </p>
                <p className="mt-2 text-3xl font-black">
                  {metrics.highOrders + metrics.criticalOrders}
                </p>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                <p className="text-sm font-bold text-blue-700">
                  Criticidade
                </p>
                <p className="mt-2 text-3xl font-black">
                  {metrics.criticalityRate}%
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export function Reports() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const [ordersData, assetsRes] = await Promise.all([
        fetchOrders(),
        supabase.from("assets").select("*"),
      ]);

      setOrders(ordersData);
      setAssets((assetsRes.data || []) as Asset[]);
      setLoading(false);
    }

    loadData();
  }, []);

  const metrics = useMemo(() => getMetrics(assets, orders), [assets, orders]);

  const handlePreview = (type: ReportType) => {
    setSelectedReport(type);
  };

  const handleGeneratePdf = (type: ReportType) => {
    const html = buildReportHtml(type, assets, orders);
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

  return (
    <div className="space-y-8 p-8">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-400">
          <BarChart3 className="h-3.5 w-3.5" />
          Painel Analítico
        </div>

        <h1 className="text-3xl font-black text-white [.light_&]:text-slate-900">
          Relatórios
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Acompanhe indicadores, ativos, ordens, gráficos e análises da
          manutenção.
        </p>
      </div>

      {loading ? (
        <Card className="rounded-3xl border border-slate-800 bg-slate-900 p-12 text-center text-slate-400 [.light_&]:border-slate-200 [.light_&]:bg-white">
          Carregando relatórios...
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Total de Ativos"
              value={metrics.totalAssets}
              icon={Package}
              tone="cyan"
            />

            <MetricCard
              label="Ordens Geradas"
              value={metrics.totalOrders}
              icon={ClipboardList}
              tone="blue"
            />

            <MetricCard
              label="Disponibilidade"
              value={`${metrics.availability}%`}
              icon={TrendingUp}
              tone="emerald"
            />

            <MetricCard
              label="Requerem Ação"
              value={metrics.pendingOrders}
              icon={AlertTriangle}
              tone="red"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
            <Card className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/10 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
                    Relatórios disponíveis
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-white [.light_&]:text-slate-900">
                    Visualize ou gere PDFs analíticos
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Relatórios com gráficos, leitura executiva, rankings,
                    indicadores e recomendações.
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={() => handleGeneratePdf("executive")}
                  className="rounded-2xl bg-[#082f4d] px-5 py-6 text-white hover:bg-[#0b6680]"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Executivo
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <ReportCard
                  type="assets"
                  onPreview={handlePreview}
                  onPdf={handleGeneratePdf}
                />

                <ReportCard
                  type="orders"
                  onPreview={handlePreview}
                  onPdf={handleGeneratePdf}
                />

                <ReportCard
                  type="executive"
                  onPreview={handlePreview}
                  onPdf={handleGeneratePdf}
                />
              </div>
            </Card>

            <Card className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/10 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="font-black text-white [.light_&]:text-slate-900">
                    Saúde Operacional
                  </h3>
                  <p className="text-xs text-slate-500">
                    Resumo por categoria
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <StatusLine
                  label="Ativos operacionais"
                  value={metrics.operationalAssets}
                  total={Math.max(metrics.totalAssets, 1)}
                  color="bg-emerald-500"
                />

                <StatusLine
                  label="Em manutenção"
                  value={metrics.maintenanceAssets}
                  total={Math.max(metrics.totalAssets, 1)}
                  color="bg-amber-500"
                />

                <StatusLine
                  label="Indisponíveis"
                  value={metrics.unavailableAssets}
                  total={Math.max(metrics.totalAssets, 1)}
                  color="bg-red-500"
                />

                <StatusLine
                  label="Ordens encerradas"
                  value={metrics.closedOrders}
                  total={Math.max(metrics.totalOrders, 1)}
                  color="bg-cyan-500"
                />

                <StatusLine
                  label="Ordens canceladas"
                  value={metrics.canceledOrders}
                  total={Math.max(metrics.totalOrders, 1)}
                  color="bg-purple-500"
                />
              </div>
            </Card>
          </div>

          <Card className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/10 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                <FileText className="h-6 w-6" />
              </div>

              <div>
                <h3 className="font-black text-white [.light_&]:text-slate-900">
                  Observações Executivas
                </h3>
                <p className="text-xs text-slate-500">
                  Interpretação rápida dos indicadores atuais
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 [.light_&]:border-slate-200 [.light_&]:bg-slate-50">
                <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-400" />
                <p className="text-sm font-bold text-white [.light_&]:text-slate-900">
                  Disponibilidade
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  A disponibilidade atual está em{" "}
                  <strong>{metrics.availability}%</strong>, classificada como{" "}
                  <strong>{getAvailabilityLevel(metrics.availability)}</strong>.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 [.light_&]:border-slate-200 [.light_&]:bg-slate-50">
                <Wrench className="mb-3 h-5 w-5 text-cyan-400" />
                <p className="text-sm font-bold text-white [.light_&]:text-slate-900">
                  Ordens
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Existem <strong>{metrics.totalOrders}</strong> ordens
                  registradas, com <strong>{metrics.executionOrders}</strong>{" "}
                  em execução e <strong>{metrics.closedOrders}</strong>{" "}
                  encerradas.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 [.light_&]:border-slate-200 [.light_&]:bg-slate-50">
                <XCircle className="mb-3 h-5 w-5 text-red-400" />
                <p className="text-sm font-bold text-white [.light_&]:text-slate-900">
                  Atenção
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Há <strong>{metrics.pendingOrders}</strong> ordens pendentes e{" "}
                  <strong>{metrics.canceledOrders}</strong> canceladas para
                  acompanhamento gerencial.
                </p>
              </div>
            </div>
          </Card>
        </>
      )}

      {selectedReport && (
        <div className="fixed inset-0 z-[9999] flex flex-col bg-slate-950 text-slate-900">
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-4 shadow-lg">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-black text-slate-900">
                <Eye className="h-5 w-5 text-cyan-600" />
                Pré-visualização - {reportInfo[selectedReport].title}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Visualização em tela cheia do relatório analítico gerado pelo
                FIXER.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={() => handleGeneratePdf(selectedReport)}
                className="rounded-2xl bg-[#082f4d] text-white hover:bg-[#0b6680]"
              >
                <Download className="mr-2 h-4 w-4" />
                Gerar PDF
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedReport(null)}
                className="rounded-2xl border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Fechar
              </Button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto bg-slate-100 p-8">
            <div className="mx-auto min-h-full w-full max-w-[1280px] overflow-hidden rounded-3xl bg-white shadow-2xl">
              <PreviewReport
                type={selectedReport}
                assets={assets}
                orders={orders}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}