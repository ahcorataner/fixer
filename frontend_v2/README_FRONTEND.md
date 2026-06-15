# 🎨 Frontend FIXER - Guia Completo

## 📁 Arquivos Criados

### Utilitários e Hooks
```
src/app/lib/api.ts          # Cliente API para comunicação com backend
src/app/hooks/useApi.ts     # Hook React para fetch de dados
```

### Componentes de Negócio
```
src/app/components/DashboardConnected.tsx    # Dashboard conectado ao backend
src/app/components/StateFlowDiagram.tsx      # Diagrama de estados visual
src/app/components/WorkOrderFlow.tsx         # Gerenciador de transições de estado
```

### Configuração
```
.env.local                  # Variáveis de ambiente (URL da API)
```

## 🚀 Como Usar

### 1. Instalar Dependências

Já está tudo instalado, mas caso precise:

```bash
pnpm install
```

### 2. Iniciar Backend

Em um terminal:

```bash
# Configurar banco (primeira vez apenas)
createdb fixer_db
psql -d fixer_db -f database/schema.sql

# Iniciar servidor
pnpm run server
```

Você verá:
```
✅ Conectado ao PostgreSQL
🚀 Servidor FIXER rodando na porta 3001
```

### 3. Iniciar Frontend

Em outro terminal:

```bash
pnpm run dev
```

Acesse: `http://localhost:5173`

## 📚 Componentes Disponíveis

### 1. API Client (`src/app/lib/api.ts`)

Cliente centralizado para todas as chamadas à API:

```typescript
import { api } from './lib/api';

// KPIs
const kpis = await api.getKPIs();

// Ativos
const assets = await api.getAssets();
const asset = await api.getAsset(1);
await api.createAsset({ code: 'AT-009', name: 'Novo Ativo', ... });
await api.updateAsset(1, { status: 'maintenance' });
await api.deleteAsset(1);

// Ordens de Manutenção
const orders = await api.getWorkOrders();
await api.createWorkOrder({ asset_id: 1, maintenance_type: 'preventiva', ... });
await api.updateWorkOrderStatus(1, 'em_validacao');

// Histórico
const history = await api.getMaintenanceHistory();

// Usuários
const users = await api.getUsers();
const technicians = await api.getTechnicians();
```

### 2. Hook useApi (`src/app/hooks/useApi.ts`)

Hook para simplificar fetch de dados com loading e erro:

```typescript
import { useApi } from './hooks/useApi';
import { api } from './lib/api';

function MyComponent() {
  const { data, loading, error, refetch } = useApi(() => api.getAssets());

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error.message}</p>;

  return (
    <div>
      {data?.map(asset => <div key={asset.id}>{asset.name}</div>)}
      <button onClick={refetch}>Recarregar</button>
    </div>
  );
}
```

### 3. Dashboard Conectado (`DashboardConnected.tsx`)

Dashboard que busca dados reais do backend:

```typescript
import { DashboardConnected } from './components/DashboardConnected';

// No seu router:
{ index: true, Component: DashboardConnected }
```

Exibe:
- KPIs em tempo real (MTBF, MTTR, Disponibilidade)
- Ativos por status
- Manutenções recentes do banco
- Mensagem de erro se o backend estiver offline

### 4. Diagrama de Estados (`StateFlowDiagram.tsx`)

Visualização interativa do diagrama de estados:

```typescript
import { StateFlowDiagram } from './components/StateFlowDiagram';

<StateFlowDiagram currentStatus="em_validacao" />
```

Estados:
1. **criada** → Ordem criada
2. **em_validacao** → Aguardando validação
3. **aprovada** / **reprovada** → Resultado da validação
4. **em_execucao** → Manutenção em andamento
5. **aguardando_teste** → Aguardando testes
6. **encerrada** → Finalizada
7. **cancelada** → Cancelada

### 5. Fluxo de Ordem (`WorkOrderFlow.tsx`)

Gerenciador completo de transições com validação:

```typescript
import { WorkOrderFlow } from './components/WorkOrderFlow';

<WorkOrderFlow
  orderId={1}
  currentStatus="criada"
  onStatusChange={(newStatus) => console.log('Status alterado:', newStatus)}
/>
```

Funcionalidades:
- Mostra status atual com ícone
- Botões apenas para transições válidas
- Validação automática de transições
- Integração com a API para atualizar status

## 🔄 Exemplo Completo de Integração

### Atualizar AssetsList para usar API

```typescript
import { useApi } from "../hooks/useApi";
import { api } from "../lib/api";

export function AssetsList() {
  const { data: assets, loading, error, refetch } = useApi(() => api.getAssets());

  const handleDelete = async (id: number) => {
    if (confirm('Deseja excluir este ativo?')) {
      await api.deleteAsset(id);
      refetch(); // Recarrega a lista
    }
  };

  if (loading) return <div>Carregando ativos...</div>;
  if (error) return <div>Erro ao carregar: {error.message}</div>;

  return (
    <div className="p-8">
      <h1 className="text-white mb-6">Lista de Ativos</h1>

      <div className="grid gap-4">
        {assets?.map((asset) => (
          <Card key={asset.id} className="p-4">
            <div className="flex justify-between">
              <div>
                <h3 className="text-white">{asset.name}</h3>
                <p className="text-slate-400 text-sm">{asset.code}</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(asset.id)}
              >
                Excluir
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### Criar Novo Ativo com API

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { api } from '../lib/api';

export function AssetForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      await api.createAsset({
        code: formData.get('code'),
        name: formData.get('name'),
        location: formData.get('location'),
        acquisition_date: formData.get('acquisition_date'),
        status: formData.get('status'),
      });

      alert('Ativo criado com sucesso!');
      navigate('/assets');
    } catch (error) {
      alert('Erro ao criar ativo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* seus campos */}
      <Button type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar Ativo'}
      </Button>
    </form>
  );
}
```

## 🎯 Próximos Passos

Para integrar completamente o frontend:

1. ✅ API Client criado
2. ✅ Hook useApi criado
3. ✅ Dashboard conectado
4. ✅ Diagrama de estados criado
5. 🔲 Atualizar AssetsList para usar API
6. 🔲 Atualizar AssetForm para criar/editar via API
7. 🔲 Atualizar WorkOrder para usar API
8. 🔲 Atualizar MaintenanceHistory para usar API
9. 🔲 Integrar autenticação com JWT
10. 🔲 Adicionar toast notifications (sonner)

## 🐛 Troubleshooting

### Erro: "Failed to fetch"
- Backend não está rodando → `pnpm run server`
- Porta incorreta → Verificar `.env.local`

### Erro: "CORS policy"
- Backend está configurado para aceitar `http://localhost:5173`
- Se frontend roda em outra porta, altere `FRONTEND_URL` no `.env` do servidor

### Dados não aparecem
- Verifique se o banco está populado: `psql -d fixer_db -c "SELECT * FROM assets;"`
- Verifique os logs do servidor backend
- Abra o DevTools (F12) → Network para ver as requisições

## 📊 Estrutura de Dados da API

### Asset
```typescript
{
  id: number;
  code: string;
  name: string;
  location: string;
  qr_code?: string;
  acquisition_date: string;
  status: 'operational' | 'maintenance' | 'unavailable';
  created_at: string;
  updated_at: string;
}
```

### Work Order
```typescript
{
  id: number;
  asset_id: number;
  maintenance_type: 'preventiva' | 'corretiva';
  priority: 'baixa' | 'media' | 'alta' | 'critica';
  status: 'criada' | 'em_validacao' | 'aprovada' | 'reprovada' |
           'em_execucao' | 'aguardando_teste' | 'encerrada' | 'cancelada';
  description: string;
  responsible_id: number;
  scheduled_date: string;
  created_at: string;
}
```

### Maintenance History
```typescript
{
  id: number;
  asset_id: number;
  asset_name: string;
  maintenance_type: 'preventiva' | 'corretiva';
  performed_by_name: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  observations: string;
  cost: number;
}
```

## 🔐 Variáveis de Ambiente

### Frontend (`.env.local`)
```env
VITE_API_URL=http://localhost:3001/api
```

### Backend (`.env`)
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=fixer_db
DB_PASSWORD=sua_senha
DB_PORT=5432
PORT=3001
FRONTEND_URL=http://localhost:5173
```
