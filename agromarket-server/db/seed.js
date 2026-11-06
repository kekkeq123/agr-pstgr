import bcrypt from 'bcryptjs';
import { pool } from './pool.js';
import products from './db.json' assert { type: 'json' };

async function seed() {
  await pool.query(`
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;

    CREATE TABLE users (
      id            SERIAL PRIMARY KEY,
      name          TEXT NOT NULL,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE products (
      id          SERIAL PRIMARY KEY,
      name        TEXT NOT NULL,
      category    TEXT,
      price       NUMERIC(10, 2) NOT NULL,
      unit        TEXT DEFAULT 'кг',
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE orders (
      id            SERIAL PRIMARY KEY,
      product_id    INTEGER REFERENCES products(id) ON DELETE SET NULL,
      user_id       INTEGER REFERENCES users(id) ON DELETE SET NULL,
      customer_name TEXT NOT NULL,
      phone         TEXT NOT NULL,
      address       TEXT NOT NULL,
      quantity      NUMERIC(10, 2) NOT NULL DEFAULT 1,
      status        TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'processing', 'completed', 'cancelled')),
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  for (const p of products) {
    await pool.query(
      'INSERT INTO products (name, category, price, unit) VALUES ($1, $2, $3, $4)',
      [p.name, p.category, p.price, p.unit]
    );
  }

  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin12345', 10);
  await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, 'admin')`,
    ['Администратор', (process.env.ADMIN_EMAIL || 'admin@agromarket.kz').toLowerCase(), hash]
  );

  console.log(
    `Готово: товаров — ${products.length}, админ — ${process.env.ADMIN_EMAIL || 'admin@agromarket.kz'}`
  );
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});