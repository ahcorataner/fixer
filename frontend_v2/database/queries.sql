-- =====================================================
-- QUERIES ÚTEIS PARA O SISTEMA FIXER
-- =====================================================

-- =====================================================
-- CONSULTAS DE DASHBOARD
-- =====================================================

-- KPIs principais
SELECT
    calculate_mtbf() as mtbf_hours,
    calculate_mttr() as mttr_hours,
    calculate_availability() as availability_percent;

-- Ativos por status
SELECT * FROM assets_by_status;

-- Ordens de manutenção pendentes por prioridade
SELECT
    priority,
    COUNT(*) as total
FROM work_orders
WHERE status IN ('pendente', 'em_andamento')
GROUP BY priority
ORDER BY
    CASE priority
        WHEN 'critica' THEN 1
        WHEN 'alta' THEN 2
        WHEN 'media' THEN 3
        WHEN 'baixa' THEN 4
    END;

-- Manutenções do dia
SELECT * FROM work_orders_detailed
WHERE DATE(scheduled_date) = CURRENT_DATE
ORDER BY priority DESC, scheduled_date;

-- =====================================================
-- CONSULTAS DE ATIVOS
-- =====================================================

-- Listar todos os ativos com última manutenção
SELECT
    a.code,
    a.name,
    a.location,
    a.status,
    a.last_maintenance_date,
    a.next_maintenance_date,
    CASE
        WHEN a.next_maintenance_date < CURRENT_DATE THEN 'Atrasada'
        WHEN a.next_maintenance_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'Próxima'
        ELSE 'Em dia'
    END as maintenance_status
FROM assets a
ORDER BY a.next_maintenance_date NULLS LAST;

-- Ativos que precisam de manutenção urgente
SELECT
    code,
    name,
    location,
    next_maintenance_date,
    CURRENT_DATE - next_maintenance_date as days_overdue
FROM assets
WHERE next_maintenance_date < CURRENT_DATE
ORDER BY next_maintenance_date;

-- Histórico de manutenções por ativo
SELECT
    a.code,
    a.name,
    COUNT(mh.id) as total_maintenances,
    SUM(CASE WHEN mh.maintenance_type = 'preventiva' THEN 1 ELSE 0 END) as preventive_count,
    SUM(CASE WHEN mh.maintenance_type = 'corretiva' THEN 1 ELSE 0 END) as corrective_count,
    SUM(mh.cost) as total_cost,
    AVG(mh.duration_hours) as avg_duration
FROM assets a
LEFT JOIN maintenance_history mh ON a.id = mh.asset_id
GROUP BY a.id, a.code, a.name
ORDER BY total_maintenances DESC;

-- =====================================================
-- CONSULTAS DE ORDENS DE MANUTENÇÃO
-- =====================================================

-- Ordens abertas por técnico
SELECT
    u.name as technician,
    COUNT(*) as open_orders,
    SUM(CASE WHEN wo.priority = 'critica' THEN 1 ELSE 0 END) as critical_orders,
    SUM(CASE WHEN wo.priority = 'alta' THEN 1 ELSE 0 END) as high_orders
FROM work_orders wo
JOIN users u ON wo.responsible_id = u.id
WHERE wo.status IN ('pendente', 'em_andamento')
GROUP BY u.id, u.name
ORDER BY critical_orders DESC, high_orders DESC;

-- Timeline de ordens de manutenção (próximos 7 dias)
SELECT
    wo.id,
    a.code,
    a.name,
    wo.maintenance_type,
    wo.priority,
    wo.status,
    u.name as responsible,
    wo.scheduled_date,
    wo.estimated_hours
FROM work_orders wo
JOIN assets a ON wo.asset_id = a.id
LEFT JOIN users u ON wo.responsible_id = u.id
WHERE wo.scheduled_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
ORDER BY wo.scheduled_date, wo.priority DESC;

-- Ordens atrasadas
SELECT
    wo.id,
    a.code,
    a.name,
    wo.priority,
    wo.scheduled_date,
    CURRENT_DATE - DATE(wo.scheduled_date) as days_late,
    u.name as responsible
FROM work_orders wo
JOIN assets a ON wo.asset_id = a.id
LEFT JOIN users u ON wo.responsible_id = u.id
WHERE wo.status IN ('pendente', 'em_andamento')
AND wo.scheduled_date < CURRENT_TIMESTAMP
ORDER BY wo.priority DESC, wo.scheduled_date;

-- =====================================================
-- CONSULTAS DE HISTÓRICO
-- =====================================================

-- Histórico detalhado dos últimos 30 dias
SELECT * FROM maintenance_history_detailed
WHERE start_time >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY start_time DESC
LIMIT 50;

-- Estatísticas de manutenção por tipo
SELECT
    maintenance_type,
    COUNT(*) as total,
    AVG(duration_hours) as avg_duration,
    SUM(cost) as total_cost,
    MIN(duration_hours) as min_duration,
    MAX(duration_hours) as max_duration
FROM maintenance_history
WHERE start_time >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY maintenance_type;

-- Top 5 ativos com mais manutenções corretivas
SELECT
    a.code,
    a.name,
    COUNT(*) as corrective_maintenances,
    SUM(mh.cost) as total_cost,
    AVG(mh.duration_hours) as avg_duration
FROM assets a
JOIN maintenance_history mh ON a.id = mh.asset_id
WHERE mh.maintenance_type = 'corretiva'
AND mh.start_time >= CURRENT_DATE - INTERVAL '180 days'
GROUP BY a.id, a.code, a.name
ORDER BY corrective_maintenances DESC
LIMIT 5;

-- =====================================================
-- CONSULTAS DE PERFORMANCE DE TÉCNICOS
-- =====================================================

-- Produtividade por técnico
SELECT
    u.name as technician,
    u.user_type,
    COUNT(mh.id) as maintenances_completed,
    SUM(mh.duration_hours) as total_hours_worked,
    AVG(mh.duration_hours) as avg_duration_per_maintenance,
    SUM(mh.cost) as total_cost
FROM users u
LEFT JOIN maintenance_history mh ON u.id = mh.performed_by
WHERE u.user_type = 'tecnico'
AND (mh.start_time >= CURRENT_DATE - INTERVAL '30 days' OR mh.start_time IS NULL)
GROUP BY u.id, u.name, u.user_type
ORDER BY maintenances_completed DESC;

-- =====================================================
-- CONSULTAS DE CUSTOS
-- =====================================================

-- Custos de manutenção por mês
SELECT
    DATE_TRUNC('month', start_time) as month,
    maintenance_type,
    COUNT(*) as total_maintenances,
    SUM(cost) as total_cost,
    AVG(cost) as avg_cost
FROM maintenance_history
WHERE start_time >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', start_time), maintenance_type
ORDER BY month DESC, maintenance_type;

-- Custo total por ativo (últimos 12 meses)
SELECT
    a.code,
    a.name,
    COUNT(mh.id) as maintenances,
    SUM(mh.cost) as total_cost,
    AVG(mh.cost) as avg_cost_per_maintenance
FROM assets a
LEFT JOIN maintenance_history mh ON a.id = mh.asset_id
WHERE mh.start_time >= CURRENT_DATE - INTERVAL '12 months' OR mh.start_time IS NULL
GROUP BY a.id, a.code, a.name
ORDER BY total_cost DESC NULLS LAST;

-- =====================================================
-- CONSULTAS DE ANÁLISE
-- =====================================================

-- Taxa de manutenção preventiva vs corretiva
SELECT
    ROUND(
        SUM(CASE WHEN maintenance_type = 'preventiva' THEN 1 ELSE 0 END)::NUMERIC /
        COUNT(*)::NUMERIC * 100,
        2
    ) as preventive_percentage,
    ROUND(
        SUM(CASE WHEN maintenance_type = 'corretiva' THEN 1 ELSE 0 END)::NUMERIC /
        COUNT(*)::NUMERIC * 100,
        2
    ) as corrective_percentage
FROM maintenance_history
WHERE start_time >= CURRENT_DATE - INTERVAL '90 days';

-- Tempo médio de resposta para manutenções críticas
SELECT
    AVG(EXTRACT(EPOCH FROM (wo.started_at - wo.created_at)) / 3600) as avg_response_time_hours
FROM work_orders wo
WHERE wo.priority = 'critica'
AND wo.started_at IS NOT NULL
AND wo.created_at >= CURRENT_DATE - INTERVAL '90 days';

-- Disponibilidade por ativo (últimos 30 dias)
SELECT
    a.code,
    a.name,
    calculate_availability(a.id, 30) as availability_percent
FROM assets a
ORDER BY calculate_availability(a.id, 30) ASC;
