import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Plus, Edit2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { supabase } from "../../lib/supabase";

interface Asset {
  id: string;
  code: string;
  name: string;
  location: string;
  status: string;
}

const statusConfig = {
  operational: { label: "Operacional", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  maintenance: { label: "Em Manutenção", className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  unavailable: { label: "Indisponível", className: "bg-red-500/20 text-red-400 border-red-500/30" },
};

export function AssetsList() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      const { data, error } = await supabase.from('assets').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setAssets(data);
      }
      setLoading(false);
    };

    fetchAssets();
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white">Lista de Ativos</h1>
        <Link to="/assets/new">
          <Button className="gap-2 bg-cyan-600 hover:bg-cyan-700 text-white">
            <Plus className="w-4 h-4" />
            Novo Ativo
          </Button>
        </Link>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-slate-800/50">
              <TableHead className="text-slate-400">Código</TableHead>
              <TableHead className="text-slate-400">Nome</TableHead>
              <TableHead className="text-slate-400">Localização</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
              <TableHead className="text-right text-slate-400">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                  Carregando ativos...
                </TableCell>
              </TableRow>
            ) : assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                  Nenhum ativo cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              assets.map((asset) => (
                <TableRow 
                  key={asset.id} 
                  className="border-slate-800 hover:bg-slate-800/50 cursor-pointer"
                  onClick={() => navigate(`/assets/${asset.id}/edit`)}
                >
                  <TableCell className="font-medium text-cyan-400">{asset.code}</TableCell>
                  <TableCell className="text-white">{asset.name}</TableCell>
                  <TableCell className="text-slate-400">{asset.location}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`${statusConfig[asset.status as keyof typeof statusConfig]?.className || ""} border`}
                    >
                      {statusConfig[asset.status as keyof typeof statusConfig]?.label || asset.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
