export type OrderStatus =
  | "rascunho"
  | "em_validacao"
  | "aprovada"
  | "reprovada"
  | "em_execucao"
  | "aguardando_encerramento"
  | "encerrada"
  | "cancelada";

export type Priority = "baixa" | "media" | "alta" | "critica";
export type MaintenanceType = "preventiva" | "corretiva" | "preditiva";

export interface Order {
  id: number;
  asset: string;
  type: MaintenanceType;
  priority: Priority;
  status: OrderStatus;
  responsible: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  executionNotes?: string;
  rejectionReason?: string;
  closureNotes?: string;
}

const STORAGE_KEY = "fixer_orders";

const today = "15/06/2026";

const initialOrders: Order[] = [
  {
    id: 1,
    asset: "Compressor AR-01",
    type: "preventiva",
    priority: "alta",
    status: "em_validacao",
    responsible: "João Silva",
    description: "Manutenção preventiva semestral — troca de filtros e lubrificação geral do sistema.",
    createdAt: "10/06/2026",
    updatedAt: "11/06/2026",
  },
  {
    id: 2,
    asset: "Bomba HID-03",
    type: "corretiva",
    priority: "critica",
    status: "aprovada",
    responsible: "João Silva",
    description: "Vazamento identificado na vedação principal. Reparo urgente necessário antes da próxima operação.",
    createdAt: "11/06/2026",
    updatedAt: "12/06/2026",
  },
  {
    id: 3,
    asset: "Motor EL-12",
    type: "preventiva",
    priority: "media",
    status: "em_execucao",
    responsible: "Maria Santos",
    description: "Inspeção elétrica completa e revisão das correias de transmissão.",
    createdAt: "12/06/2026",
    updatedAt: "14/06/2026",
    executionNotes: "Inspeção elétrica concluída. Correias verificadas, uma com desgaste avançado sendo substituída.",
  },
  {
    id: 4,
    asset: "Esteira TR-05",
    type: "corretiva",
    priority: "baixa",
    status: "rascunho",
    responsible: "Carlos Oliveira",
    description: "Sensor de posição com leituras inconsistentes. Verificar fiação e substituir se necessário.",
    createdAt: "13/06/2026",
    updatedAt: "13/06/2026",
  },
  {
    id: 5,
    asset: "Prensa PR-08",
    type: "preventiva",
    priority: "alta",
    status: "aguardando_encerramento",
    responsible: "Maria Santos",
    description: "Lubrificação do sistema hidráulico e verificação completa de segurança.",
    createdAt: "08/06/2026",
    updatedAt: today,
    executionNotes: "Lubrificação concluída. Teste de pressão aprovado a 250 bar. Sistema operando normalmente. Aguardando liberação do gestor.",
  },
  {
    id: 6,
    asset: "Gerador GE-02",
    type: "preventiva",
    priority: "media",
    status: "encerrada",
    responsible: "Carlos Oliveira",
    description: "Troca de óleo e filtros. Teste de carga por 2 horas.",
    createdAt: "05/06/2026",
    updatedAt: "10/06/2026",
    executionNotes: "Todas as atividades concluídas com sucesso. Gerador operando normalmente.",
    closureNotes: "Ordem encerrada pelo gestor. Ativo disponibilizado para operação.",
  },
  {
    id: 7,
    asset: "Caldeira CA-01",
    type: "corretiva",
    priority: "critica",
    status: "reprovada",
    responsible: "João Silva",
    description: "Ruído anormal no sistema de combustão.",
    createdAt: "14/06/2026",
    updatedAt: today,
    rejectionReason: "Descrição insuficiente. Necessário incluir laudo técnico e histórico do ativo. Reenviar com documentação completa.",
  },
  {
    id: 8,
    asset: "Torno TC-15",
    type: "preditiva",
    priority: "media",
    status: "cancelada",
    responsible: "Carlos Oliveira",
    description: "Análise preditiva de vibração no eixo principal.",
    createdAt: "03/06/2026",
    updatedAt: "06/06/2026",
  },
];

export function getOrders(): Order[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore parse errors
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialOrders));
  return [...initialOrders];
}

export function resetOrders(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialOrders));
}

export function saveOrders(orders: Order[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function updateOrder(id: number, patch: Partial<Order>): void {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx >= 0) {
    orders[idx] = {
      ...orders[idx],
      ...patch,
      updatedAt: new Date().toLocaleDateString("pt-BR"),
    };
    saveOrders(orders);
  }
}

export function addOrder(order: Omit<Order, "id" | "createdAt" | "updatedAt">): Order {
  const orders = getOrders();
  const id = orders.length > 0 ? Math.max(...orders.map((o) => o.id)) + 1 : 1;
  const dateStr = new Date().toLocaleDateString("pt-BR");
  const newOrder: Order = { ...order, id, createdAt: dateStr, updatedAt: dateStr };
  orders.push(newOrder);
  saveOrders(orders);
  return newOrder;
}

export const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bg: string; dot: string; step: number }
> = {
  rascunho: {
    label: "Rascunho",
    color: "text-slate-300",
    bg: "bg-slate-700/60 border-slate-600",
    dot: "bg-slate-400",
    step: 1,
  },
  em_validacao: {
    label: "Em Validação",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/30",
    dot: "bg-blue-400",
    step: 2,
  },
  aprovada: {
    label: "Aprovada",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/30",
    dot: "bg-green-400",
    step: 3,
  },
  reprovada: {
    label: "Reprovada",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/30",
    dot: "bg-red-400",
    step: 4,
  },
  em_execucao: {
    label: "Em Execução",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/30",
    dot: "bg-amber-400",
    step: 5,
  },
  aguardando_encerramento: {
    label: "Aguardando Encerramento",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/30",
    dot: "bg-purple-400",
    step: 6,
  },
  encerrada: {
    label: "Encerrada",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/30",
    dot: "bg-emerald-400",
    step: 7,
  },
  cancelada: {
    label: "Cancelada",
    color: "text-slate-400",
    bg: "bg-slate-500/10 border-slate-500/30",
    dot: "bg-slate-400",
    step: 8,
  },
};

export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; color: string; bg: string }
> = {
  baixa: { label: "Baixa", color: "text-slate-300", bg: "bg-slate-700/50 border-slate-600" },
  media: { label: "Média", color: "text-blue-300", bg: "bg-blue-500/10 border-blue-500/30" },
  alta: { label: "Alta", color: "text-amber-300", bg: "bg-amber-500/10 border-amber-500/30" },
  critica: { label: "Crítica", color: "text-red-300", bg: "bg-red-500/10 border-red-500/30" },
};

export const TYPE_CONFIG: Record<MaintenanceType, { label: string }> = {
  preventiva: { label: "Preventiva" },
  corretiva: { label: "Corretiva" },
  preditiva: { label: "Preditiva" },
};

export function getCurrentUser(): { name: string; role: "gestor" | "tecnico" } {
  return {
    name: localStorage.getItem("fixer_user") || "Usuário",
    role: (localStorage.getItem("fixer_role") as "gestor" | "tecnico") || "gestor",
  };
}
