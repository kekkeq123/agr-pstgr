# АгроМаркет API

Backend для «АгроМаркета» на Node.js + Express 5 + PostgreSQL.

## Запуск

1. Установить PostgreSQL, создать базу `agromarket`
2. Скопировать `.env.example` в `.env` и указать свой пароль
3. `npm install`
4. `npm run db:init`        # создать таблицы и загрузить товары
5. `npm run dev`            # http://localhost:3000

Frontend (`agromarket-react`) запускается отдельно: `npm run dev` → http://localhost:5173.

## Эндпоинты

| Метод  | Путь              | Описание                 | Ответы        |
|--------|-------------------|--------------------------|---------------|
| GET    | /api/health       | сервер и связь с БД      | 200           |
| GET    | /api/about        | информация о проекте     | 200           |
| GET    | /api/products     | товары, `?search=`       | 200           |
| GET    | /api/products/:id | один товар               | 200, 400, 404 |
| POST   | /api/products     | создать товар            | 201, 400      |
| PUT    | /api/products/:id | изменить товар           | 200, 400, 404 |
| DELETE | /api/products/:id | удалить товар            | 204, 400, 404 |
| GET    | /api/orders       | заявки + название товара | 200           |
| POST   | /api/orders       | новая заявка             | 201, 400      |
| PATCH  | /api/orders/:id   | сменить статус заявки    | 200, 400, 404 |

Тесты: коллекция `postman/agromarket.postman_collection.json`

## Структура

```
agromarket-server/
├── data/db.json            источник начальных данных
├── db/
│   ├── schema.sql          описание таблиц
│   ├── pool.js             подключение к PostgreSQL
│   └── seed.js             создать таблицы + загрузить товары
├── middleware/
│   ├── logger.js
│   └── errorHandler.js
├── routes/
│   ├── products.js
│   └── orders.js
├── postman/
├── .env.example
└── server.js
```

## Лабораторная 6 — ответы

- Ошибки из части 2 (price -5, без name, product_id 9999): ...
- SQL-инъекция: что вернул `zzz' OR 1=1 --` и одна кавычка до/после $1: ...
- Двойная защита quantity (JS-проверка + CHECK): ...
- Что стало с заявкой после удаления товара: ...
- Использовал(а) ли ИИ и для чего: ...
