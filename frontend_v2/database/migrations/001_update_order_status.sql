-- Migration: Atualizar estados das ordens existentes para o novo diagrama

-- Mapear estados antigos para novos
UPDATE work_orders SET status = 'criada' WHERE status = 'pendente';
UPDATE work_orders SET status = 'em_execucao' WHERE status = 'em_andamento';
UPDATE work_orders SET status = 'encerrada' WHERE status = 'concluida';
-- 'cancelada' permanece igual

-- Adicionar comentário
COMMENT ON TYPE order_status IS 'Estados baseados no diagrama de fluxo de trabalho';
