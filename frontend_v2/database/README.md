# Banco de Dados FIXER - PostgreSQL

Este diretório contém toda a estrutura do banco de dados PostgreSQL para o sistema FIXER.

## Arquivos

- **schema.sql** - Schema completo do banco (tabelas, triggers, views, funções)
- **queries.sql** - Queries úteis para consultas e relatórios

## Instalação

### 1. Criar o banco de dados

```bash
createdb fixer_db
```

### 2. Executar o schema

```bash
psql -d fixer_db -f database/schema.sql
```

## Estrutura do Banco

### Tabelas Principais

#### `users`
- Armazena usuários do sistema (gestores e técnicos)
- Campos: id, name, email, username, password_hash, user_type

#### `assets`
- Catálogo de ativos gerenciados
- Campos: id, code, name, location, qr_code, status, acquisition_date

#### `work_orders`
- Ordens de manutenção (preventiva/corretiva)
- Campos: id, asset_id, maintenance_type, priority, status, description, responsible_id

#### `maintenance_history`
- Histórico completo de todas as manutenções
- Campos: id, asset_id, maintenance_type, performed_by, start_time, end_time, observations, cost

### Tipos Enumerados

- `user_type`: 'gestor', 'tecnico'
- `asset_status`: 'operational', 'maintenance', 'unavailable'
- `maintenance_type`: 'preventiva', 'corretiva'
- `priority_level`: 'baixa', 'media', 'alta', 'critica'
- `order_status`: 'pendente', 'em_andamento', 'concluida', 'cancelada'

### Views

- `assets_by_status` - Contagem de ativos por status
- `work_orders_detailed` - Ordens com detalhes de ativos e usuários
- `maintenance_history_detailed` - Histórico completo com joins

### Funções KPI

#### `calculate_mtbf(asset_id)`
Calcula o tempo médio entre falhas (Mean Time Between Failures)

```sql
SELECT calculate_mtbf(); -- Global
SELECT calculate_mtbf(1); -- Para ativo específico
```

#### `calculate_mttr(asset_id)`
Calcula o tempo médio de reparo (Mean Time To Repair)

```sql
SELECT calculate_mttr(); -- Global
SELECT calculate_mttr(1); -- Para ativo específico
```

#### `calculate_availability(asset_id, days)`
Calcula a taxa de disponibilidade em %

```sql
SELECT calculate_availability(); -- Últimos 30 dias global
SELECT calculate_availability(1, 60); -- Ativo 1, últimos 60 dias
```

### Triggers

- **update_updated_at**: Atualiza automaticamente o campo `updated_at`
- **update_asset_status**: Atualiza status do ativo baseado na ordem de manutenção

## Queries Úteis

### Dashboard KPIs

```sql
SELECT 
    calculate_mtbf() as mtbf_hours,
    calculate_mttr() as mttr_hours,
    calculate_availability() as availability_percent;
```

### Ordens do Dia

```sql
SELECT * FROM work_orders_detailed
WHERE DATE(scheduled_date) = CURRENT_DATE
ORDER BY priority DESC;
```

### Ativos com Manutenção Atrasada

```sql
SELECT code, name, next_maintenance_date
FROM assets
WHERE next_maintenance_date < CURRENT_DATE
ORDER BY next_maintenance_date;
```

### Histórico Recente

```sql
SELECT * FROM maintenance_history_detailed
WHERE start_time >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY start_time DESC;
```

## Dados de Exemplo

O schema já inclui dados de exemplo (seed data):
- 5 usuários (3 técnicos, 2 gestores)
- 8 ativos
- 5 ordens de manutenção
- 5 registros de histórico

## Conexão

### String de conexão padrão

```
postgresql://usuario:senha@localhost:5432/fixer_db
```

### Usando psql

```bash
psql -h localhost -U usuario -d fixer_db
```

### Node.js / JavaScript

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: 'usuario',
  host: 'localhost',
  database: 'fixer_db',
  password: 'senha',
  port: 5432,
});
```

## Backup e Restore

### Backup

```bash
pg_dump -U usuario fixer_db > backup_fixer.sql
```

### Restore

```bash
psql -U usuario fixer_db < backup_fixer.sql
```

## Manutenção

### Reindexar tabelas

```sql
REINDEX DATABASE fixer_db;
```

### Vacuum

```sql
VACUUM ANALYZE;
```

### Verificar tamanho das tabelas

```sql
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```
