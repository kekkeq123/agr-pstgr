import React from 'react';

export default function ProductList({ products = [] }) {
  // Пример данных на случай, если массив пустой
  const displayProducts = products.length > 0 ? products : [
    { id: 1, name: 'Органическая пшеница', description: 'Экологически чистое зерно высшего сорта от локальных фермеров.', price: '450 ₸ / кг' },
    { id: 2, name: 'Свежий подсолнечник', description: 'Отборные масличные культуры богатые витаминами.', price: '380 ₸ / кг' },
    { id: 3, name: 'Удобрения минеральные', description: 'Комплексные азотно-фосфорные удобрения для повышения урожайности.', price: '12 000 ₸ / мешок' }
  ];

  return (
    <div className="agro-container">
      <header className="agro-header">
        <h1>🌾 AgroMarket Каталог</h1>
        <p>Лучшая сельскохозяйственная продукция и сырье напрямую от производителей</p>
      </header>

      <div className="products-grid">
        {displayProducts.map((item) => (
          <div key={item.id} className="product-card">
            <div>
              <h3 className="product-title">{item.name}</h3>
              <p className="product-description">{item.description}</p>
            </div>
            <div className="product-footer">
              <span className="product-price">{item.price}</span>
              <button className="btn-agro" onClick={() => alert(`Товар "${item.name}" добавлен в корзину!`)}>
                В корзину
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}