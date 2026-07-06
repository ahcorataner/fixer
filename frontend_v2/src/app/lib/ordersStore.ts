import { supabase } from "../../lib/supabase";

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

type CurrentUser = {
  name: string;
  email?: string;
  role: "gestor" | "tecnico";
};

function normalizeText(value?: string | null) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function normalizeResponsibleName(name?: string | null) {
  const value = String(name || "").trim();
  const normalized = normalizeText(value);

  if (
    normalized === "tecnico teste" ||
    normalized === "tecnico fixer" ||
    normalized === "tecnico@fixer.com" ||
    normalized === "joao da silva"
  ) {
    return "João da Silva";
  }

  return value || "João da Silva";
}

export function isCurrentTechnicianResponsible(
  responsible?: string | null,
  currentUserName?: string | null
) {
  const responsibleNormalized = normalizeText(responsible);
  const currentNormalized = normalizeText(currentUserName);

  return (
    responsibleNormalized === currentNormalized ||
    responsibleNormalized === "joao da silva" ||
    responsibleNormalized === "tecnico teste" ||
    responsibleNormalized === "tecnico@fixer.com"
  );
}

function getLocalStorageProfile() {
  try {
    const fixerUser = localStorage.getItem("fixer_user") || "";
    const fixerRole = localStorage.getItem("fixer_role") || "";
    const fixerEmail = localStorage.getItem("fixer_email") || "";

    return {
      name: fixerUser,
      role: fixerRole,
      email: fixerEmail,
    };
  } catch {
    return {
      name: "",
      role: "",
      email: "",
    };
  }
}

export function getCurrentUser(): CurrentUser {
  const localProfile = getLocalStorageProfile();

  const normalizedRole = normalizeText(localProfile.role);
  const normalizedEmail = normalizeText(localProfile.email);
  const normalizedName = normalizeText(localProfile.name);

  const isTecnico =
    normalizedRole === "tecnico" ||
    normalizedRole === "técnico" ||
    normalizedEmail === "tecnico@fixer.com" ||
    normalizedName === "tecnico teste" ||
    normalizedName === "joao da silva";

  if (isTecnico) {
    return {
      name: "João da Silva",
      email: "tecnico@fixer.com",
      role: "tecnico",
    };
  }

  return {
    name: localProfile.name || "Renata Rocha",
    email: localProfile.email || "gestor@fixer.com",
    role: "gestor",
  };
}

function mapDatabaseOrderToOrder(d: any): Order {
  return {
    id: d.id,
    asset: d.asset,
    type: d.type,
    priority: d.priority,
    status: d.status,
    responsible: normalizeResponsibleName(d.responsible),
    description: d.description,
    createdAt: d.created_at
      ? new Date(d.created_at).toLocaleDateString("pt-BR")
      : "",
    updatedAt: d.updated_at
      ? new Date(d.updated_at).toLocaleDateString("pt-BR")
      : "",
    executionNotes: d.execution_notes || "",
    rejectionReason: d.rejection_reason || "",
    closureNotes: d.closure_notes || "",
  };
}

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("work_orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map(mapDatabaseOrderToOrder);
}

export async function updateOrder(
  id: number,
  patch: Partial<Order>
): Promise<void> {
  const dbPatch: any = {};

  if (patch.asset !== undefined) dbPatch.asset = patch.asset;
  if (patch.type !== undefined) dbPatch.type = patch.type;
  if (patch.priority !== undefined) dbPatch.priority = patch.priority;
  if (patch.status !== undefined) dbPatch.status = patch.status;

  if (patch.responsible !== undefined) {
    dbPatch.responsible = normalizeResponsibleName(patch.responsible);
  }

  if (patch.description !== undefined) dbPatch.description = patch.description;

  if (patch.executionNotes !== undefined) {
    dbPatch.execution_notes = patch.executionNotes;
  }

  if (patch.rejectionReason !== undefined) {
    dbPatch.rejection_reason = patch.rejectionReason;
  }

  if (patch.closureNotes !== undefined) {
    dbPatch.closure_notes = patch.closureNotes;
  }

  dbPatch.updated_at = new Date().toISOString();

  await supabase.from("work_orders").update(dbPatch).eq("id", id);
}

export async function addOrder(
  order: Omit<Order, "id" | "createdAt" | "updatedAt">
): Promise<void> {
  await supabase.from("work_orders").insert([
    {
      asset: order.asset,
      type: order.type,
      priority: order.priority,
      status: order.status,
      responsible: normalizeResponsibleName(order.responsible),
      description: order.description,
      execution_notes: order.executionNotes || null,
      rejection_reason: order.rejectionReason || null,
      closure_notes: order.closureNotes || null,
    },
  ]);
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
  baixa: {
    label: "Baixa",
    color: "text-slate-300",
    bg: "bg-slate-700/50 border-slate-600",
  },
  media: {
    label: "Média",
    color: "text-blue-300",
    bg: "bg-blue-500/10 border-blue-500/30",
  },
  alta: {
    label: "Alta",
    color: "text-amber-300",
    bg: "bg-amber-500/10 border-amber-500/30",
  },
  critica: {
    label: "Crítica",
    color: "text-red-300",
    bg: "bg-red-500/10 border-red-500/30",
  },
};

export const TYPE_CONFIG: Record<MaintenanceType, { label: string }> = {
  preventiva: { label: "Preventiva" },
  corretiva: { label: "Corretiva" },
  preditiva: { label: "Preditiva" },
};
