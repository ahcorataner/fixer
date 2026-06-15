import { useNavigate } from "react-router";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ArrowLeft, QrCode } from "lucide-react";

export function AssetForm() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/assets");
  };

  return (
    <div className="p-8">
      <Button
        variant="ghost"
        className="mb-4 gap-2 text-slate-300 hover:text-white hover:bg-slate-800"
        onClick={() => navigate("/assets")}
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Button>

      <h1 className="mb-6 text-white">Cadastrar Novo Ativo</h1>

      <Card className="p-6 max-w-2xl bg-slate-900 border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300">Nome do Ativo</Label>
            <Input
              id="name"
              placeholder="Ex: Compressor AR-01"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code" className="text-slate-300">Código / QR Code</Label>
            <div className="flex gap-2">
              <Input
                id="code"
                placeholder="Ex: AT-001"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                required
              />
              <Button type="button" variant="outline" size="icon" className="bg-slate-800 border-slate-700 text-cyan-400 hover:bg-slate-700">
                <QrCode className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-slate-300">Localização</Label>
            <Input
              id="location"
              placeholder="Ex: Setor A - Linha 1"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="acquisition" className="text-slate-300">Data de Aquisição</Label>
            <Input
              id="acquisition"
              type="date"
              className="bg-slate-800 border-slate-700 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-slate-300">Status</Label>
            <Select required>
              <SelectTrigger id="status" className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="operational" className="text-white hover:bg-slate-700">Operacional</SelectItem>
                <SelectItem value="maintenance" className="text-white hover:bg-slate-700">Em Manutenção</SelectItem>
                <SelectItem value="unavailable" className="text-white hover:bg-slate-700">Indisponível</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white">
              Salvar Ativo
            </Button>
            <Button
              type="button"
              variant="outline"
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
              onClick={() => navigate("/assets")}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
