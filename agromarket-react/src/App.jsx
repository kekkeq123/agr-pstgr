import { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import Header from './components/Header';
import Footer from './components/Footer';
import ContactForm from './components/ContactForm';

const API_URL = 'http://localhost:3000/api';

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      }
    }
    loadProducts();
  }, []);

  function handleAddToCart() {
    setCartCount(cartCount + 1);
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header cartCount={cartCount} />

      <main className="page">
        <section id="catalog" className="catalog">
          <div className="catalog-toolbar">
            <h2>Каталог</h2>
            <input
              type="search"
              placeholder="Поиск товара..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAdd={handleAddToCart}
                featured={product.id === 1}
              />
            ))}
          </div>
        </section>

        <aside id="delivery" className="sidebar">
          <h3>Доставка</h3>
          <ul>
            <li>Астана —  в день</li>
            <li> область — 2–3 дня</li>
            <li>Бесплатно от </li>
          </ul>
        </aside>

        <ContactForm />
      </main>

      <Footer />
    </>
  );
}
export default App; 