import { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import Header from './components/Header';
import Footer from './components/Footer';
import ContactForm from './components/ContactForm';
import LoginForm from './components/LoginForm.jsx';
import AddProductForm from './components/AddProductForm.jsx';
import { apiFetch } from './api.js';

export default function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem('user') || 'null')
  );

  // Загрузка товаров с бэкенда
  useEffect(() => {
    apiFetch('/products')
      .then((data) => {
        // Защита на случай, если бэк вернул не массив
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error('Ошибка загрузки товаров:', err));
  }, []);

  // Проверка сессии пользователя при перезагрузке
  useEffect(() => {
    if (!localStorage.getItem('token')) return;

    apiFetch('/auth/me')
      .then(setUser)
      .catch(() => {});
  }, []);

  function handleLogin(userData, token) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  function handleAddToCart() {
    setCartCount(cartCount + 1);
  }

  // Фильтрация товаров по поисковому запросу
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="agro-container">
      {/* Шапка сайта с корзиной и авторизацией */}
      <Header cartCount={cartCount} />

      <div className="auth-bar" style={{ padding: '10px 20px', background: '#f1f5f9', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        {user ? (
          <div>
            <span>Вы вошли как <b>{user.name}</b> ({user.role})</span>
            <button onClick={handleLogout} className="btn-agro" style={{ marginLeft: '10px', padding: '4px 10px', fontSize: '0.85rem' }}>Выйти</button>
          </div>
        ) : (
          <LoginForm onLogin={handleLogin} />
        )}
      </div>

      <main className="page" style={{ padding: '20px' }}>
     
        {user?.role === 'admin' && (
          <div style={{ marginBottom: '30px', background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h3>Панель администратора: Добавить товар</h3>
            <AddProductForm onAdded={(p) => setProducts([p, ...products])} />
          </div>
        )}

        <section id="catalog" className="catalog">
          <div className="catalog-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Каталог товаров</h2>
            <input
              type="search"
              placeholder="Поиск товара..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '250px' }}
            />
          </div>

          <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAdd={handleAddToCart}
                  featured={product.id === 1}
                />
              ))
            ) : (
              <p>Товары не найдены</p>
            )}
          </div>
        </section>

      
        <aside id="delivery" className="sidebar" style={{ margin: '40px 0', background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3>🚚 Условия доставки</h3>
          <ul>
            <li>Астана — доставка в день заказа</li>
            <li>Акмолинская область — 2–3 дня</li>
            <li>Бесплатно при заказе от крупной партии</li>
          </ul>
        </aside>

        <ContactForm />
      </main>

      <Footer />
    </div>
  );
}