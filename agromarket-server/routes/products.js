import { Router } from 'express';
import { products } from '../data/products.js';

const router = Router();

// Пути — ОТНОСИТЕЛЬНО точки подключения роутера:
// '/'    -> /api/products
// '/:id' -> /api/products/:id

// GET /api/products?search=мёд&maxPrice=5000&sort=-price
router.get('/', (req, res) => {
  const search = (req.query.search || '').toLowerCase();
  const maxPrice = req.query.maxPrice;
  const sort = req.query.sort;

  let result = products.filter((p) => p.name.toLowerCase().includes(search));

  // Бонус: фильтр по цене
  if (maxPrice !== undefined && maxPrice !== '' && !Number.isNaN(Number(maxPrice))) {
    result = result.filter((p) => p.price <= Number(maxPrice));
  }

  // Бонус: сортировка. ?sort=price — по возрастанию, ?sort=-price — по убыванию
  if (sort === 'price' || sort === '-price') {
    const direction = sort === 'price' ? 1 : -1;
    // .sort() меняет массив, поэтому сортируем копию
    result = [...result].sort((a, b) => (a.price - b.price) * direction);
  }

  res.json(result);
});

router.get('/:id', (req, res) => {
  const product = products.find((p) => String(p.id) === req.params.id);

  if (!product) {
    return res.status(404).json({ error: 'Товар не найден' });
  }

  res.json(product);
});

export default router;
