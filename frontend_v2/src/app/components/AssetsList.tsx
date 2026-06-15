import { Link } from "react-router";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";

const mockAssets = [
  { id: "AT-001", name: "Compressor AR-01", location: "Setor A - Linha 1", status: "operational" },
  { id: "AT-002", name: "Bomba HID-03", location: "Setor B - Área 2", status: "maintenance" },
  { id: "AT-003", name: "Motor EL-12", location: "Setor A - Linha 2", status: "operational" },
  { id: "AT-004", name: "Esteira TR-05", location: "Setor C - Expedição", status: "operational" },
  { id: "AT-005", name: "Prensa PR-08", location: "Setor A - Linha 1", status: "unavailable" },
  { id: "AT-006", name: "Gerador GE-02", location: "Área Externa", status: "operational" },
  { id: "AT-007", name: "Caldeira CA-01", location: "Setor B - Utilidades", status: "maintenance" },
  { id: "AT-008", name: "Torno TC-15", location: "Setor D - Usinagem", status: "operational" },
];

const statusConfig = {
  operational: { label: "Operacional", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  maintenance: { label: "Em Manutenção", className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  unavailable: { label: "Indisponível", className: "bg-red-500/20 text-red-400 border-red-500/30" },
};

export function AssetsList() {
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
              <TableHead className="text-slate-400">ID</TableHead>
              <TableHead className="text-slate-400">Nome</TableHead>
              <TableHead className="text-slate-400">Localização</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAssets.map((asset) => (
              <TableRow key={asset.id} className="border-slate-800 hover:bg-slate-800/50">
                <TableCell className="font-medium text-cyan-400">{asset.id}</TableCell>
                <TableCell className="text-white">{asset.name}</TableCell>
                <TableCell className="text-slate-400">{asset.location}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`${statusConfig[asset.status as keyof typeof statusConfig].className} border`}
                  >
                    {statusConfig[asset.status as keyof typeof statusConfig].label}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
