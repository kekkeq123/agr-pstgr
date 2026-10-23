async function loadProducts() {
    const catalog = document.querySelector('.catalog');

    try {
        
        const response = await fetch('http://localhost:3001/products');
        
      
        if (!response.ok) {
            throw new Error('Не удалось загрузить данные с сервера');
        }

        const products = await response.json();
        renderProducts(products);

    } catch (error) {
        
        console.error('Ошибка:', error);
        catalog.innerHTML += `
            <div class="error-message">
                ⚠️ Не удалось загрузить каталог. Убедитесь, что запущен json-server (<br>
                <code>npx json-server --watch db.json --port 3001</code>).
            </div>
        `;
    }
}

function renderProducts(products) {
    const catalog = document.querySelector('.catalog');
    const cartCountElement = document.getElementById('cart-count');
    let cartCount = 0;

    products.forEach((product) => {
        // Создаем тег <article class="card">
        const card = document.createElement('article');
        card.className = 'card';

        // Заполняем карточку содержимым
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price} тг</p>
            <button>В корзину</button>
        `;

        
        const button = card.querySelector('button');
        button.addEventListener('click', () => {
            cartCount++;
            cartCountElement.textContent = cartCount;
        });

        catalog.appendChild(card);
    });
}

loadProducts();