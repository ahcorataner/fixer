-- =====================================================
-- FIXER - Sistema de Gestão de Manutenção de Ativos
-- Banco de Dados PostgreSQL
-- =====================================================

-- Remover tabelas existentes (cuidado em produção!)
DROP TABLE IF EXISTS maintenance_history CASCADE;
DROP TABLE IF EXISTS work_orders CASCADE;
DROP TABLE IF EXISTS assets CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS user_type CASCADE;
DROP TYPE IF EXISTS asset_status CASCADE;
DROP TYPE IF EXISTS maintenance_type CASCADE;
DROP TYPE IF EXISTS priority_level CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;

-- =====================================================
-- TIPOS ENUMERADOS
-- =====================================================

CREATE TYPE user_type AS ENUM ('gestor', 'tecnico');
CREATE TYPE asset_status AS ENUM ('operational', 'maintenance', 'unavailable');
CREATE TYPE maintenance_type AS ENUM ('preventiva', 'corretiva');
CREATE TYPE priority_level AS ENUM ('baixa', 'media', 'alta', 'critica');
-- Estados baseados no diagrama de estado
CREATE TYPE order_status AS ENUM (
    'criada',           -- 1. Criar ordem
    'em_validacao',     -- 2. Em Validação
    'reprovada',        -- 4. Reprovada
    'aprovada',         -- 3. Aprovada
    'em_execucao',      -- 5. Em Execução
    'aguardando_teste', -- 6. Aguardando Testes
    'encerrada',        -- 7. Encerrada
    'cancelada'         -- 8. Cancelada
);

-- =====================================================
-- TABELA: users (Usuários do Sistema)
-- =====================================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type user_type NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_type ON users(user_type);

-- =====================================================
-- TABELA: assets (Ativos)
-- =====================================================

CREATE TABLE assets (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    qr_code VARCHAR(255),
    acquisition_date DATE,
    status asset_status DEFAULT 'operational',
    last_maintenance_date TIMESTAMP,
    next_maintenance_date TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para assets
CREATE INDEX idx_assets_code ON assets(code);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_location ON assets(location);
CREATE INDEX idx_assets_next_maintenance ON assets(next_maintenance_date);

-- =====================================================
-- TABELA: work_orders (Ordens de Manutenção)
-- =====================================================

CREATE TABLE work_orders (
    id SERIAL PRIMARY KEY,
    asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    maintenance_type maintenance_type NOT NULL,
    priority priority_level NOT NULL,
    status order_status DEFAULT 'criada',
    description TEXT NOT NULL,
    responsible_id INTEGER REFERENCES users(id),
    created_by INTEGER REFERENCES users(id),
    scheduled_date TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para work_orders
CREATE INDEX idx_work_orders_asset ON work_orders(asset_id);
CREATE INDEX idx_work_orders_status ON work_orders(status);
CREATE INDEX idx_work_orders_priority ON work_orders(priority);
CREATE INDEX idx_work_orders_responsible ON work_orders(responsible_id);
CREATE INDEX idx_work_orders_scheduled ON work_orders(scheduled_date);

-- =====================================================
-- TABELA: maintenance_history (Histórico de Manutenções)
-- =====================================================

CREATE TABLE maintenance_history (
    id SERIAL PRIMARY KEY,
    work_order_id INTEGER REFERENCES work_orders(id) ON DELETE CASCADE,
    asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    maintenance_type maintenance_type NOT NULL,
    performed_by INTEGER REFERENCES users(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    duration_hours DECIMAL(5,2) GENERATED ALWAYS AS (
        EXTRACT(EPOCH FROM (end_time - start_time)) / 3600
    ) STORED,
    observations TEXT,
    parts_replaced TEXT,
    cost DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para maintenance_history
CREATE INDEX idx_maintenance_history_asset ON maintenance_history(asset_id);
CREATE INDEX idx_maintenance_history_work_order ON maintenance_history(work_order_id);
CREATE INDEX idx_maintenance_history_date ON maintenance_history(start_time);
CREATE INDEX idx_maintenance_history_performed_by ON maintenance_history(performed_by);

-- =====================================================
-- TRIGGERS PARA ATUALIZAR updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at
    BEFORE UPDATE ON assets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_orders_updated_at
    BEFORE UPDATE ON work_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TRIGGER PARA ATUALIZAR STATUS DO ATIVO
-- =====================================================

CREATE OR REPLACE FUNCTION update_asset_status_on_work_order()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'em_andamento' THEN
        UPDATE assets SET status = 'maintenance' WHERE id = NEW.asset_id;
    ELSIF NEW.status = 'concluida' THEN
        UPDATE assets
        SET status = 'operational',
            last_maintenance_date = NEW.completed_at
        WHERE id = NEW.asset_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_asset_status
    AFTER UPDATE OF status ON work_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_asset_status_on_work_order();

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View: Estatísticas de ativos por status
CREATE VIEW assets_by_status AS
SELECT
    status,
    COUNT(*) as total
FROM assets
GROUP BY status;

-- View: Ordens de manutenção com detalhes
CREATE VIEW work_orders_detailed AS
SELECT
    wo.id,
    wo.status,
    wo.priority,
    wo.maintenance_type,
    a.code as asset_code,
    a.name as asset_name,
    a.location as asset_location,
    u.name as responsible_name,
    creator.name as created_by_name,
    wo.description,
    wo.scheduled_date,
    wo.created_at
FROM work_orders wo
JOIN assets a ON wo.asset_id = a.id
LEFT JOIN users u ON wo.responsible_id = u.id
LEFT JOIN users creator ON wo.created_by = creator.id;

-- View: Histórico completo de manutenções
CREATE VIEW maintenance_history_detailed AS
SELECT
    mh.id,
    a.code as asset_code,
    a.name as asset_name,
    mh.maintenance_type,
    u.name as performed_by_name,
    mh.start_time,
    mh.end_time,
    mh.duration_hours,
    mh.observations,
    mh.parts_replaced,
    mh.cost
FROM maintenance_history mh
JOIN assets a ON mh.asset_id = a.id
LEFT JOIN users u ON mh.performed_by = u.id
ORDER BY mh.start_time DESC;

-- =====================================================
-- FUNÇÕES PARA CÁLCULO DE KPIs
-- =====================================================

-- Função: Calcular MTBF (Mean Time Between Failures)
CREATE OR REPLACE FUNCTION calculate_mtbf(asset_id_param INTEGER DEFAULT NULL)
RETURNS DECIMAL AS $$
DECLARE
    mtbf_value DECIMAL;
BEGIN
    SELECT
        AVG(EXTRACT(EPOCH FROM (
            LEAD(start_time) OVER (PARTITION BY asset_id ORDER BY start_time) - end_time
        )) / 3600) INTO mtbf_value
    FROM maintenance_history
    WHERE maintenance_type = 'corretiva'
    AND (asset_id_param IS NULL OR asset_id = asset_id_param);

    RETURN COALESCE(mtbf_value, 0);
END;
$$ LANGUAGE plpgsql;

-- Função: Calcular MTTR (Mean Time To Repair)
CREATE OR REPLACE FUNCTION calculate_mttr(asset_id_param INTEGER DEFAULT NULL)
RETURNS DECIMAL AS $$
DECLARE
    mttr_value DECIMAL;
BEGIN
    SELECT AVG(duration_hours) INTO mttr_value
    FROM maintenance_history
    WHERE maintenance_type = 'corretiva'
    AND (asset_id_param IS NULL OR asset_id = asset_id_param);

    RETURN COALESCE(mttr_value, 0);
END;
$$ LANGUAGE plpgsql;

-- Função: Calcular Disponibilidade (%)
CREATE OR REPLACE FUNCTION calculate_availability(
    asset_id_param INTEGER DEFAULT NULL,
    days_param INTEGER DEFAULT 30
)
RETURNS DECIMAL AS $$
DECLARE
    total_hours DECIMAL;
    downtime_hours DECIMAL;
    availability DECIMAL;
BEGIN
    total_hours := days_param * 24;

    SELECT COALESCE(SUM(duration_hours), 0) INTO downtime_hours
    FROM maintenance_history
    WHERE start_time >= CURRENT_TIMESTAMP - (days_param || ' days')::INTERVAL
    AND (asset_id_param IS NULL OR asset_id = asset_id_param);

    availability := ((total_hours - downtime_hours) / total_hours) * 100;

    RETURN ROUND(availability, 2);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- DADOS DE EXEMPLO (SEED DATA)
-- =====================================================

-- Inserir usuários
INSERT INTO users (name, email, username, password_hash, user_type) VALUES
('João Silva', 'joao.silva@fixer.com', 'joao.silva', '$2b$10$example_hash_1', 'tecnico'),
('Maria Santos', 'maria.santos@fixer.com', 'maria.santos', '$2b$10$example_hash_2', 'tecnico'),
('Carlos Oliveira', 'carlos.oliveira@fixer.com', 'carlos.oliveira', 'tecnico'),
('Ana Costa', 'ana.costa@fixer.com', 'ana.costa', '$2b$10$example_hash_4', 'gestor'),
('Pedro Almeida', 'pedro.almeida@fixer.com', 'pedro.almeida', '$2b$10$example_hash_5', 'gestor');

-- Inserir ativos
INSERT INTO assets (code, name, location, acquisition_date, status, created_by) VALUES
('AT-001', 'Compressor AR-01', 'Setor A - Linha 1', '2024-01-15', 'operational', 4),
('AT-002', 'Bomba HID-03', 'Setor B - Área 2', '2023-06-20', 'maintenance', 4),
('AT-003', 'Motor EL-12', 'Setor A - Linha 2', '2024-03-10', 'operational', 4),
('AT-004', 'Esteira TR-05', 'Setor C - Expedição', '2023-11-05', 'operational', 5),
('AT-005', 'Prensa PR-08', 'Setor A - Linha 1', '2023-02-18', 'unavailable', 5),
('AT-006', 'Gerador GE-02', 'Área Externa', '2022-08-30', 'operational', 4),
('AT-007', 'Caldeira CA-01', 'Setor B - Utilidades', '2023-09-12', 'maintenance', 5),
('AT-008', 'Torno TC-15', 'Setor D - Usinagem', '2024-02-25', 'operational', 4);

-- Inserir ordens de manutenção
INSERT INTO work_orders (asset_id, maintenance_type, priority, status, description, responsible_id, created_by, scheduled_date) VALUES
(1, 'preventiva', 'media', 'concluida', 'Troca de filtros e lubrificação geral', 1, 4, '2026-04-15 08:00:00'),
(2, 'corretiva', 'alta', 'em_andamento', 'Substituição de vedação com vazamento', 2, 4, '2026-04-18 10:00:00'),
(3, 'preventiva', 'media', 'pendente', 'Inspeção elétrica e térmica', 3, 5, '2026-04-20 14:00:00'),
(5, 'corretiva', 'critica', 'em_andamento', 'Sistema hidráulico com perda de pressão', 1, 5, '2026-04-17 09:00:00'),
(6, 'preventiva', 'baixa', 'pendente', 'Teste de carga programado', 2, 4, '2026-04-22 11:00:00');

-- Inserir histórico de manutenções
INSERT INTO maintenance_history (work_order_id, asset_id, maintenance_type, performed_by, start_time, end_time, observations, cost) VALUES
(1, 1, 'preventiva', 1, '2026-04-15 08:00:00', '2026-04-15 12:30:00', 'Troca de filtros e lubrificação geral. Equipamento operando normalmente.', 450.00),
(NULL, 3, 'preventiva', 3, '2026-04-13 09:00:00', '2026-04-13 11:30:00', 'Inspeção elétrica e térmica. Ajuste de tensão das correias.', 280.00),
(NULL, 4, 'corretiva', 1, '2026-04-12 14:00:00', '2026-04-12 17:00:00', 'Reparo em sensor de posição. Sistema de emergência testado.', 520.00),
(NULL, 6, 'preventiva', 3, '2026-04-10 08:00:00', '2026-04-10 10:00:00', 'Teste de carga realizado por 2 horas. Tudo funcionando corretamente.', 180.00),
(NULL, 7, 'preventiva', 2, '2026-04-09 13:00:00', '2026-04-09 16:00:00', 'Lubrificação do sistema. Verificação de segurança aprovada.', 340.00);

-- =====================================================
-- COMENTÁRIOS NAS TABELAS
-- =====================================================

COMMENT ON TABLE users IS 'Usuários do sistema (gestores e técnicos)';
COMMENT ON TABLE assets IS 'Ativos gerenciados pelo sistema';
COMMENT ON TABLE work_orders IS 'Ordens de manutenção (preventiva ou corretiva)';
COMMENT ON TABLE maintenance_history IS 'Histórico completo de todas as manutenções realizadas';

COMMENT ON COLUMN assets.code IS 'Código único do ativo (ex: AT-001)';
COMMENT ON COLUMN assets.qr_code IS 'Código QR para identificação rápida';
COMMENT ON COLUMN work_orders.estimated_hours IS 'Tempo estimado em horas para conclusão';
COMMENT ON COLUMN work_orders.actual_hours IS 'Tempo real gasto na manutenção';
COMMENT ON COLUMN maintenance_history.duration_hours IS 'Duração calculada automaticamente';
