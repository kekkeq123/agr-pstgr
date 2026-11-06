import { Router } from 'express';
import { pool } from '../db/pool.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();
const adminOnly = [requireAuth, requireRole('admin')];

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Товар не найден' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post('/', adminOnly, async (req, res, next) => {
  try {
    const { name, category, price, unit } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Название и цена обязательны' });
    }
    const { rows } = await pool.query(
      'INSERT INTO products (name, category, price, unit) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, category || null, price, unit || 'кг']
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', adminOnly, async (req, res, next) => {
  try {
    const { name, category, price, unit } = req.body;
    const { rows } = await pool.query(
      'UPDATE products SET name = $1, category = $2, price = $3, unit = $4 WHERE id = $5 RETURNING *',
      [name, category, price, unit, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Товар не найден' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', adminOnly, async (req, res, next) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Товар не найден' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;