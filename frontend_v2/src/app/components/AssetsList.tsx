import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Plus, Edit2, Package, Search, MapPin, Activity } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { supabase } from "../../lib/supabase";

interface Asset {
  id: string;
  code: string;
  name: string;
  location: string;
  status: string;
}

const statusConfig = {
  operational: {
    label: "Operacional",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  maintenance: {
    label: "Em Manutenção",
    className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    dot: "bg-amber-500",
  },
  unavailable: {
    label: "Indisponível",
    className: "bg-red-500/15 text-red-400 border-red-500/30",
    dot: "bg-red-500",
  },
};

export function AssetsList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const fetchAssets = async () => {
      const { data, error } = await supabase
        .from("assets")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setAssets(data);
      }

      setLoading(false);
    };

    fetchAssets();
  }, []);

  useEffect(() => {
    setSearch(searchParams.get("q") || "");
  }, [searchParams]);

  const filteredAssets = assets.filter((asset) => {
    const term = search.toLowerCase().trim();

    if (!term) return true;

    return (
      asset.name?.toLowerCase().includes(term) ||
      asset.code?.toLowerCase().includes(term) ||
      asset.location?.toLowerCase().includes(term) ||
      asset.status?.toLowerCase().includes(term)
    );
  });

  const totalAssets = assets.length;
  const operational = assets.filter((a) => a.status === "operational").length;
  const maintenance = assets.filter((a) => a.status === "maintenance").length;
  const unavailable = assets.filter((a) => a.status === "unavailable").length;

  return (
    <div className="p-8 space-y-6">
      {/* CABEÇALHO */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-400">
            Gestão de Ativos
          </p>

          <h1 className="text-3xl font-extrabold text-white [.light_&]:text-slate-900">
            Lista de Ativos
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Visualize, cadastre e acompanhe a situação dos ativos de manutenção.
          </p>
        </div>

        <Link to="/assets/new">
          <Button className="rounded-2xl bg-[#082f4d] px-5 py-6 text-white shadow-lg shadow-cyan-950/20 hover:bg-[#0b6680]">
            <Plus className="mr-2 h-4 w-4" />
            Novo Ativo
          </Button>
        </Link>
      </div>

      {/* CARDS RESUMO */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          {
            label: "Total de Ativos",
            value: totalAssets,
            icon: Package,
            color: "text-cyan-400",
            bg: "bg-cyan-500/10",
          },
          {
            label: "Operacionais",
            value: operational,
            icon: Activity,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Em Manutenção",
            value: maintenance,
            icon: Activity,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
          },
          {
            label: "Indisponíveis",
            value: unavailable,
            icon: Activity,
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

      {/* BUSCA LOCAL */}
      <Card className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/10 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

          <Input
            placeholder="Buscar por código, nome, localização ou status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 rounded-2xl border-slate-700 bg-slate-950 pl-11 text-white placeholder:text-slate-600 focus:border-cyan-500 [.light_&]:border-slate-200 [.light_&]:bg-slate-50 [.light_&]:text-slate-900"
          />
        </div>

        {search && (
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>
              Filtrando por:{" "}
              <strong className="text-cyan-400">{search}</strong>
            </span>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                navigate("/assets");
              }}
              className="font-bold text-cyan-400 hover:text-cyan-300"
            >
              Limpar busca
            </button>
          </div>
        )}
      </Card>

      {/* TABELA */}
      <Card className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-lg shadow-black/10 [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:shadow-slate-200/70">
        <div className="border-b border-slate-800 px-6 py-5 [.light_&]:border-slate-200">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-500/10 p-3">
              <Package className="h-5 w-5 text-cyan-400" />
            </div>

            <div>
              <h2 className="font-bold text-white [.light_&]:text-slate-900">
                Ativos Cadastrados
              </h2>

              <p className="text-xs text-slate-500">
                {filteredAssets.length} registro(s) encontrado(s)
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent [.light_&]:border-slate-200">
                <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Código
                </TableHead>

                <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Nome
                </TableHead>

                <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Localização
                </TableHead>

                <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Status
                </TableHead>

                <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-slate-500"
                  >
                    Carregando ativos...
                  </TableCell>
                </TableRow>
              ) : filteredAssets.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center text-slate-500"
                  >
                    Nenhum ativo encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAssets.map((asset) => {
                  const currentStatus =
                    statusConfig[asset.status as keyof typeof statusConfig];

                  return (
                    <TableRow
                      key={asset.id}
                      className="cursor-pointer border-slate-800 transition-all hover:bg-slate-800/50 [.light_&]:border-slate-200 [.light_&]:hover:bg-slate-50"
                      onClick={() => navigate(`/assets/${asset.id}/edit`)}
                    >
                      <TableCell>
                        <span className="rounded-xl bg-cyan-500/10 px-3 py-1.5 text-sm font-bold text-cyan-400">
                          {asset.code}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 text-cyan-400 [.light_&]:bg-cyan-50">
                            <Package className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="font-bold text-white [.light_&]:text-slate-900">
                              {asset.name}
                            </p>

                            <p className="text-xs text-slate-500">
                              Ativo de manutenção
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-slate-400 [.light_&]:text-slate-600">
                          <MapPin className="h-4 w-4 text-slate-500" />
                          {asset.location}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`border ${
                            currentStatus?.className ||
                            "bg-slate-500/10 text-slate-400 border-slate-500/30"
                          }`}
                        >
                          <span
                            className={`mr-2 inline-block h-2 w-2 rounded-full ${
                              currentStatus?.dot || "bg-slate-400"
                            }`}
                          />
                          {currentStatus?.label || asset.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/assets/${asset.id}/edit`);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}