import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  ArrowLeft,
  Package,
  Save,
  MapPin,
  Hash,
  Activity,
  Info,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

interface AssetFormData {
  code: string;
  name: string;
  location: string;
  status: string;
}

const initialFormData: AssetFormData = {
  code: "",
  name: "",
  location: "",
  status: "operational",
};

const statusOptions = [
  {
    value: "operational",
    label: "Operacional",
    description: "Ativo disponível para operação normal.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
  },
  {
    value: "maintenance",
    label: "Em Manutenção",
    description: "Status reservado para ordens de manutenção em execução.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    disabled: true,
  },
  {
    value: "unavailable",
    label: "Indisponível",
    description: "Ativo fora de operação ou impossibilitado de uso.",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
  },
];

export function AssetForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<AssetFormData>(initialFormData);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchAsset = async () => {
      const { data, error } = await supabase
        .from("assets")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setErrorMessage("Não foi possível carregar os dados do ativo.");
        setLoading(false);
        return;
      }

      if (data) {
        setFormData({
          code: data.code || "",
          name: data.name || "",
          location: data.location || "",
          status: data.status || "operational",
        });
      }

      setLoading(false);
    };

    fetchAsset();
  }, [id]);

  const updateField = (field: keyof AssetFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrorMessage("");
  };

  const validateForm = () => {
    if (!formData.code.trim()) {
      return "Informe o código do ativo.";
    }

    if (!formData.name.trim()) {
      return "Informe o nome do ativo.";
    }

    if (!formData.location.trim()) {
      return "Informe a localização do ativo.";
    }

    return "";
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setSaving(true);
    setErrorMessage("");

    const payload = {
      code: formData.code.trim(),
      name: formData.name.trim(),
      location: formData.location.trim(),
      status: formData.status,
    };

    const { error } = isEditing
      ? await supabase.from("assets").update(payload).eq("id", id)
      : await supabase.from("assets").insert(payload);

    setSaving(false);

    if (error) {
      setErrorMessage(
        "Não foi possível salvar o ativo. Verifique os dados e tente novamente."
      );
      return;
    }

    navigate("/assets");
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-slate-400">
        Carregando dados do ativo...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* CABEÇALHO */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate("/assets")}
            className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-cyan-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para ativos
          </button>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-400">
            Gestão de Ativos
          </p>

          <h1 className="text-3xl font-extrabold text-white [.light_&]:text-slate-900">
            {isEditing ? "Editar Ativo" : "Novo Ativo"}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {isEditing
              ? "Atualize as informações cadastrais e operacionais do ativo."
              : "Cadastre um novo ativo para acompanhamento da manutenção."}
          </p>
        </div>

        <Button
          type="button"
          onClick={() => navigate("/assets")}
          variant="outline"
          className="rounded-2xl border-slate-700 bg-slate-900 px-5 py-6 text-slate-300 hover:bg-slate-800 hover:text-white [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:text-slate-700 [.light_&]:hover:bg-slate-50"
        >
          Cancelar
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* FORMULÁRIO PRINCIPAL */}
        <Card className="xl:col-span-2 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/10 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-500/10 p-3">
              <Package className="h-5 w-5 text-cyan-400" />
            </div>

            <div>
              <h2 className="font-bold text-white [.light_&]:text-slate-900">
                Dados do Ativo
              </h2>

              <p className="text-xs text-slate-500">
                Preencha as informações básicas do equipamento.
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-300 [.light_&]:text-slate-700">
                  Código do Ativo
                </Label>

                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                  <Input
                    value={formData.code}
                    onChange={(e) => updateField("code", e.target.value)}
                    placeholder="Ex: ATV-001"
                    className="h-12 rounded-2xl border-slate-700 bg-slate-950 pl-11 text-white placeholder:text-slate-600 focus:border-cyan-500 [.light_&]:border-slate-200 [.light_&]:bg-slate-50 [.light_&]:text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-300 [.light_&]:text-slate-700">
                  Nome do Ativo
                </Label>

                <div className="relative">
                  <Package className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                  <Input
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Ex: Compressor Principal"
                    className="h-12 rounded-2xl border-slate-700 bg-slate-950 pl-11 text-white placeholder:text-slate-600 focus:border-cyan-500 [.light_&]:border-slate-200 [.light_&]:bg-slate-50 [.light_&]:text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-bold text-slate-300 [.light_&]:text-slate-700">
                  Localização
                </Label>

                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                  <Input
                    value={formData.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    placeholder="Ex: Setor de Produção - Linha 01"
                    className="h-12 rounded-2xl border-slate-700 bg-slate-950 pl-11 text-white placeholder:text-slate-600 focus:border-cyan-500 [.light_&]:border-slate-200 [.light_&]:bg-slate-50 [.light_&]:text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-6 [.light_&]:border-slate-200">
              <Label className="mb-3 block text-sm font-bold text-slate-300 [.light_&]:text-slate-700">
                Status do Ativo
              </Label>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {statusOptions.map((status) => {
                  const active = formData.status === status.value;

                  return (
                    <button
                      key={status.value}
                      type="button"
                      disabled={status.disabled}
                      onClick={() => {
                        if (!status.disabled) {
                          updateField("status", status.value);
                        }
                      }}
                      className={`rounded-2xl border p-4 text-left transition-all ${
                        active
                          ? `${status.border} ${status.bg}`
                          : "border-slate-800 bg-slate-950/40 hover:border-cyan-500/40 [.light_&]:border-slate-200 [.light_&]:bg-slate-50"
                      } ${
                        status.disabled
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            status.value === "operational"
                              ? "bg-emerald-500"
                              : status.value === "maintenance"
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}
                        />

                        <span
                          className={`text-sm font-bold ${
                            active
                              ? status.color
                              : "text-white [.light_&]:text-slate-900"
                          }`}
                        >
                          {status.label}
                        </span>
                      </div>

                      <p className="text-xs leading-relaxed text-slate-500">
                        {status.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-800 pt-6 [.light_&]:border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/assets")}
                className="rounded-2xl border-slate-700 bg-transparent px-5 text-slate-300 hover:bg-slate-800 hover:text-white [.light_&]:border-slate-200 [.light_&]:text-slate-700 [.light_&]:hover:bg-slate-50"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-[#082f4d] px-6 text-white shadow-lg shadow-cyan-950/20 hover:bg-[#0b6680]"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving
                  ? "Salvando..."
                  : isEditing
                  ? "Salvar Alterações"
                  : "Cadastrar Ativo"}
              </Button>
            </div>
          </form>
        </Card>

        {/* PAINEL LATERAL */}
        <div className="space-y-6">
          <Card className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/10 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-blue-500/10 p-3">
                <Info className="h-5 w-5 text-blue-400" />
              </div>

              <h3 className="font-bold text-white [.light_&]:text-slate-900">
                Orientação
              </h3>
            </div>

            <p className="text-sm leading-relaxed text-slate-500">
              O cadastro de ativos permite acompanhar disponibilidade,
              manutenção, falhas e histórico operacional dentro do Fixer.
            </p>
          </Card>

          <Card className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/10 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-amber-500/10 p-3">
                <Activity className="h-5 w-5 text-amber-400" />
              </div>

              <h3 className="font-bold text-white [.light_&]:text-slate-900">
                Status de manutenção
              </h3>
            </div>

            <p className="text-sm leading-relaxed text-slate-500">
              O status “Em Manutenção” é controlado pelo fluxo de ordens de
              serviço. Por isso, ele não deve ser selecionado manualmente no
              cadastro.
            </p>
          </Card>

          <Card className="rounded-3xl border border-cyan-500/30 bg-cyan-500/10 p-6 shadow-lg shadow-cyan-950/10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              Fixer
            </p>

            <h3 className="mt-2 font-bold text-white [.light_&]:text-slate-900">
              Controle centralizado
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Cada ativo cadastrado pode ser associado a ordens de manutenção,
              histórico e indicadores do dashboard.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
