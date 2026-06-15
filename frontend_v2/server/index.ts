import express, { Request, Response } from 'express';
import cors from 'cors';
import pool from './db';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(express.json());

// =====================================================
// ROTAS DE KPIs / DASHBOARD
// =====================================================

app.get('/api/kpis', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        calculate_mtbf() as mtbf_hours,
        calculate_mttr() as mttr_hours,
        calculate_availability() as availability_percent
    `);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar KPIs' });
  }
});

app.get('/api/dashboard/assets-by-status', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM assets_by_status');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar ativos por status' });
  }
});

app.get('/api/dashboard/recent-maintenances', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM maintenance_history_detailed
      WHERE start_time >= CURRENT_DATE - INTERVAL '7 days'
      ORDER BY start_time DESC
      LIMIT 5
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar manutenções recentes' });
  }
});

// =====================================================
// ROTAS DE ATIVOS
// =====================================================

app.get('/api/assets', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM assets
      ORDER BY code
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar ativos' });
  }
});

app.get('/api/assets/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM assets WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ativo não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar ativo' });
  }
});

app.post('/api/assets', async (req: Request, res: Response) => {
  try {
    const { code, name, location, qr_code, acquisition_date, status } = req.body;

    const result = await pool.query(`
      INSERT INTO assets (code, name, location, qr_code, acquisition_date, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [code, name, location, qr_code, acquisition_date, status || 'operational']);

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Código do ativo já existe' });
    }
    res.status(500).json({ error: 'Erro ao criar ativo' });
  }
});

app.put('/api/assets/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { code, name, location, qr_code, acquisition_date, status } = req.body;

    const result = await pool.query(`
      UPDATE assets
      SET code = $1, name = $2, location = $3, qr_code = $4,
          acquisition_date = $5, status = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `, [code, name, location, qr_code, acquisition_date, status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ativo não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar ativo' });
  }
});

app.delete('/api/assets/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM assets WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ativo não encontrado' });
    }

    res.json({ message: 'Ativo excluído com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao excluir ativo' });
  }
});

// =====================================================
// ROTAS DE ORDENS DE MANUTENÇÃO
// =====================================================

app.get('/api/work-orders', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM work_orders_detailed ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar ordens de manutenção' });
  }
});

app.get('/api/work-orders/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM work_orders_detailed WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ordem não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar ordem' });
  }
});

app.post('/api/work-orders', async (req: Request, res: Response) => {
  try {
    const { asset_id, maintenance_type, priority, description, responsible_id, scheduled_date } = req.body;

    const result = await pool.query(`
      INSERT INTO work_orders
      (asset_id, maintenance_type, priority, description, responsible_id, scheduled_date, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'criada')
      RETURNING *
    `, [asset_id, maintenance_type, priority, description, responsible_id, scheduled_date]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar ordem de manutenção' });
  }
});

// Atualizar status da ordem (seguindo diagrama de estados)
app.patch('/api/work-orders/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validar transições de estado permitidas
    const validTransitions: Record<string, string[]> = {
      'criada': ['em_validacao', 'cancelada'],
      'em_validacao': ['aprovada', 'reprovada', 'cancelada'],
      'reprovada': ['criada', 'cancelada'],
      'aprovada': ['em_execucao', 'cancelada'],
      'em_execucao': ['aguardando_teste', 'cancelada'],
      'aguardando_teste': ['encerrada', 'em_execucao', 'cancelada'],
      'encerrada': [],
      'cancelada': []
    };

    // Buscar ordem atual
    const currentOrder = await pool.query('SELECT status FROM work_orders WHERE id = $1', [id]);

    if (currentOrder.rows.length === 0) {
      return res.status(404).json({ error: 'Ordem não encontrada' });
    }

    const currentStatus = currentOrder.rows[0].status;

    // Verificar se transição é válida
    if (!validTransitions[currentStatus]?.includes(status)) {
      return res.status(400).json({
        error: `Transição inválida de '${currentStatus}' para '${status}'`,
        currentStatus,
        allowedTransitions: validTransitions[currentStatus]
      });
    }

    // Atualizar campos conforme o status
    let updateQuery = 'UPDATE work_orders SET status = $1, updated_at = CURRENT_TIMESTAMP';
    const params: any[] = [status];

    if (status === 'em_execucao') {
      updateQuery += ', started_at = CURRENT_TIMESTAMP';
    } else if (status === 'encerrada') {
      updateQuery += ', completed_at = CURRENT_TIMESTAMP';
    }

    updateQuery += ' WHERE id = $2 RETURNING *';
    params.push(id);

    const result = await pool.query(updateQuery, params);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar status da ordem' });
  }
});

// =====================================================
// ROTAS DE HISTÓRICO DE MANUTENÇÃO
// =====================================================

app.get('/api/maintenance-history', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM maintenance_history_detailed
      ORDER BY start_time DESC
      LIMIT 50
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
});

app.post('/api/maintenance-history', async (req: Request, res: Response) => {
  try {
    const { work_order_id, asset_id, maintenance_type, performed_by, start_time, end_time, observations, parts_replaced, cost } = req.body;

    const result = await pool.query(`
      INSERT INTO maintenance_history
      (work_order_id, asset_id, maintenance_type, performed_by, start_time, end_time, observations, parts_replaced, cost)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [work_order_id, asset_id, maintenance_type, performed_by, start_time, end_time, observations, parts_replaced, cost]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar registro de manutenção' });
  }
});

// =====================================================
// ROTAS DE USUÁRIOS
// =====================================================

app.get('/api/users', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT id, name, email, username, user_type, is_active, created_at
      FROM users
      WHERE is_active = true
      ORDER BY name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

app.get('/api/users/technicians', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT id, name, email
      FROM users
      WHERE user_type = 'tecnico' AND is_active = true
      ORDER BY name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar técnicos' });
  }
});

// =====================================================
// HEALTH CHECK
// =====================================================

app.get('/api/health', async (req: Request, res: Response) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'OK', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', database: 'disconnected' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor FIXER rodando na porta ${PORT}`);
  console.log(`📊 API disponível em http://localhost:${PORT}/api`);
});
