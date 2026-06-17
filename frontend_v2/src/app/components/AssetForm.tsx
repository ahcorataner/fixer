import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ArrowLeft, QrCode, Trash2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

export function AssetForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [location, setLocation] = useState("");
  const [acquisitionDate, setAcquisitionDate] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (id) {
      const fetchAsset = async () => {
        const { data, error } = await supabase.from('assets').select('*').eq('id', id).single();
        if (data && !error) {
          setName(data.name);
          setCode(data.code);
          setLocation(data.location);
          if (data.acquisition_date) setAcquisitionDate(data.acquisition_date);
          setStatus(data.status);
        }
      };
      fetchAsset();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!status) {
      setError("Selecione um status.");
      return;
    }

    setLoading(true);

    try {
      if (id) {
        const { error: updateError } = await supabase.from('assets').update({
          name,
          code,
          location,
          acquisition_date: acquisitionDate || null,
          status,
        }).eq('id', id);

        if (updateError) throw updateError;
        alert("Ativo atualizado com sucesso!");
      } else {
        const { error: insertError } = await supabase.from('assets').insert([
          {
            name,
            code,
            location,
            acquisition_date: acquisitionDate || null,
            status,
          }
        ]);

        if (insertError) throw insertError;
        alert("Ativo cadastrado com sucesso!");
      }

      navigate("/assets");
    } catch (err: any) {
      setError(err.message || "Erro ao salvar ativo.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja excluir este ativo? Esta ação não pode ser desfeita.")) {
      setLoading(true);
      try {
        const { error: deleteError } = await supabase.from('assets').delete().eq('id', id);
        if (deleteError) throw deleteError;
        alert("Ativo excluído com sucesso!");
        navigate("/assets");
      } catch (err: any) {
        setError(err.message || "Erro ao excluir ativo.");
        setLoading(false);
      }
    }
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

      <h1 className="mb-6 text-white">{id ? "Editar Ativo" : "Cadastrar Novo Ativo"}</h1>

      <Card className="p-6 max-w-2xl bg-slate-900 border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300">Nome do Ativo</Label>
            <Input
              id="name"
              placeholder="Ex: Compressor AR-01"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
                value={code}
                onChange={(e) => setCode(e.target.value)}
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
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="acquisition" className="text-slate-300">Data de Aquisição</Label>
            <Input
              id="acquisition"
              type="date"
              value={acquisitionDate}
              onChange={(e) => setAcquisitionDate(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-slate-300">Status</Label>
            <Select required value={status} onValueChange={setStatus}>
              <SelectTrigger id="status" className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="operational" className="text-white hover:bg-slate-700">Operacional</SelectItem>
                <SelectItem value="unavailable" className="text-white hover:bg-slate-700">Indisponível</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50">
              {loading ? "Salvando..." : id ? "Atualizar Ativo" : "Salvar Ativo"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
              onClick={() => navigate("/assets")}
            >
              Cancelar
            </Button>
            {id && (
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white shrink-0"
                onClick={handleDelete}
                title="Excluir Ativo"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
