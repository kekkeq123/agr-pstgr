export function errorHandler(err, req, res, next) {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Слишком большой запрос' });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Некорректный JSON в теле запроса' });
  }

  if (err.code === '23505') {
    return res.status(409).json({ error: 'Такая запись уже существует' });
  }

  console.error(err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
}