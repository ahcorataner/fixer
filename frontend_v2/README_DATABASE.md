# 🚀 Guia de Configuração - FIXER Database & API

## 📋 Pré-requisitos

1. **PostgreSQL instalado** (versão 12 ou superior)
2. **Node.js** (versão 16 ou superior)
3. **pnpm** (gerenciador de pacotes)

## 🗄️ Configuração do Banco de Dados

### 1. Criar o banco de dados

```bash
# No terminal PostgreSQL
createdb fixer_db

# Ou via psql
psql -U postgres
CREATE DATABASE fixer_db;
\q
```

### 2. Executar o schema

```bash
psql -U postgres -d fixer_db -f database/schema.sql
```

### 3. Verificar se foi criado corretamente

```bash
psql -U postgres -d fixer_db

# Dentro do psql:
\dt              # Listar tabelas
\dT              # Listar tipos
SELECT * FROM assets;  # Ver dados de exemplo
\q
```

## 🔧 Configuração do Servidor API

### 1. Criar arquivo de ambiente

Copie o arquivo de exemplo e configure suas credenciais:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=fixer_db
DB_PASSWORD=sua_senha_aqui
DB_PORT=5432

PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 2. Instalar dependências

As dependências já foram instaladas, mas caso precise:

```bash
pnpm install
```

### 3. Iniciar o servidor

```bash
pnpm run server
```

Você verá:
```
✅ Conectado ao PostgreSQL
🚀 Servidor FIXER rodando na porta 3001
📊 API disponível em http://localhost:3001/api
```

## 🧪 Testar a API

### Health Check

```bash
curl http://localhost:3001/api/health
```

### Buscar KPIs

```bash
curl http://localhost:3001/api/kpis
```

### Listar Ativos

```bash
curl http://localhost:3001/api/assets
```

### Listar Ordens de Manutenção

```bash
curl http://localhost:3001/api/work-orders
```

## 🔄 Diagrama de Estados

O sistema implementa o seguinte fluxo de estados para ordens de manutenção:

1. **Criada** → Ordem criada e aguardando validação
2. **Em Validação** → Validando se o ativo está pronto
   - ✅ **Aprovada** → Ativo validado, pode iniciar
   - ❌ **Reprovada** → Ativo não está pronto, corrigir e voltar
3. **Em Execução** → Manutenção sendo realizada
4. **Aguardando Testes** → Manutenção concluída, aguardando validação
5. **Encerrada** → Ordem finalizada com sucesso
6. **Cancelada** → Ordem cancelada (pode ser feito em qualquer etapa)

### Endpoints de Transição de Estado

```bash
# Atualizar status de uma ordem
curl -X PATCH http://localhost:3001/api/work-orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "em_validacao"}'
```

Transições válidas são validadas automaticamente pela API.

## 📊 Estrutura da API

### Endpoints Disponíveis

#### KPIs / Dashboard
- `GET /api/kpis` - MTBF, MTTR, Disponibilidade
- `GET /api/dashboard/assets-by-status` - Ativos agrupados por status
- `GET /api/dashboard/recent-maintenances` - Últimas manutenções

#### Ativos
- `GET /api/assets` - Listar todos
- `GET /api/assets/:id` - Buscar por ID
- `POST /api/assets` - Criar novo
- `PUT /api/assets/:id` - Atualizar
- `DELETE /api/assets/:id` - Excluir

#### Ordens de Manutenção
- `GET /api/work-orders` - Listar todas
- `GET /api/work-orders/:id` - Buscar por ID
- `POST /api/work-orders` - Criar nova
- `PATCH /api/work-orders/:id/status` - Atualizar status

#### Histórico
- `GET /api/maintenance-history` - Listar histórico
- `POST /api/maintenance-history` - Adicionar registro

#### Usuários
- `GET /api/users` - Listar todos
- `GET /api/users/technicians` - Listar apenas técnicos

## 🔐 Segurança

**IMPORTANTE:** Este é um protótipo. Para produção, implemente:

1. Autenticação JWT
2. Validação de inputs
3. Rate limiting
4. HTTPS
5. Sanitização de dados
6. Bcrypt para senhas

## 📝 Próximos Passos

1. ✅ Banco de dados configurado
2. ✅ API REST funcionando
3. ✅ Diagrama de estados implementado
4. 🔲 Integrar frontend com a API
5. 🔲 Adicionar autenticação
6. 🔲 Implementar WebSockets para updates em tempo real

## 🐛 Troubleshooting

### Erro: "Connection refused"
- Verifique se o PostgreSQL está rodando: `sudo service postgresql status`
- Verifique as credenciais no arquivo `.env`

### Erro: "Database does not exist"
- Crie o banco: `createdb fixer_db`
- Execute o schema: `psql -d fixer_db -f database/schema.sql`

### Erro: "Port 3001 already in use"
- Altere a porta no arquivo `.env`
- Ou mate o processo: `lsof -ti:3001 | xargs kill`

## 📚 Documentação Adicional

- `database/README.md` - Documentação do schema
- `database/queries.sql` - Queries úteis
- `database/schema.sql` - Schema completo
