import { Router } from 'express';
import { pool } from '../db/pool.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();
const adminOnly = [requireAuth, requireRole('admin')];

// POST /api/orders — доступно всем
router.post('/', async (req, res, next) => {
  try {
    const { product_id, customer_name, phone, address, quantity } = req.body;
    if (!customer_name || !phone || !address) {
      return res.status(400).json({ error: 'Имя, телефон и адрес обязательны' });
    }
    const { rows } = await pool.query(
      `INSERT INTO orders (product_id, customer_name, phone, address, quantity)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [product_id || null, customer_name, phone, address, quantity || 1]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// GET /api/orders — только admin
router.get('/', adminOnly, async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM orders ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/orders/:id — только admin
router.patch('/:id', adminOnly, async (req, res, next) => {
  try {
    const { status } = req.body;
    const { rows } = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Заявка не найдена' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;