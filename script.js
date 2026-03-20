const products = [
    { id: 1, name: "Sacola Ecológica", price: 29.99, img: "sacola.png" },
    { id: 2, name: "Garrafa Reutilizável", price: 58.99, img: "garrafa.png" },
    { id: 3, name: "Canudos de Metal (6pçs)", price: 19.90, img: "canudos.png" },
    { id: 4, name: "Escova de Bambu", price: 14.90, img: "escova.png" },
    { id: 5, name: "Caderno Reciclado", price: 28.00, img: "caderno.png" }
];

let cart = JSON.parse(localStorage.getItem('ecovida_cart')) || [];

// Renderizar produtos na tela
function renderProducts() {
    const grid = document.getElementById('products-grid');
    
    // VERIFICAÇÃO IMPORTANTE: Só executa se o elemento existir na página atual
    if (!grid) return; 

    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.img}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/200?text=EcoVida'">
            <h3>${product.name}</h3>
            <p class="price">R$ ${product.price.toFixed(2)}</p>
            <button class="btn-add" onclick="addToCart(${product.id})">
                <i class="fas fa-plus"></i> Adicionar
            </button>
        </div>
    `).join('');
}

// Lógica do Carrinho
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    
    // Opcional: Abre o carrinho automaticamente ao adicionar item
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar && !sidebar.classList.contains('active')) {
        toggleCart();
    }
}

function updateCart() {
    localStorage.setItem('ecovida_cart', JSON.stringify(cart));
    renderCart();
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');

    // Se o elemento do carrinho não existir (erro de ID), para aqui
    if (!cartItems) return;

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <h4>${item.name}</h4>
                <small>${item.quantity}x R$ ${item.price.toFixed(2)}</small>
            </div>
            <button onclick="removeFromCart(${item.id})" class="btn-remove">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    if(cartTotal) cartTotal.innerText = `R$ ${total.toFixed(2)}`;
    if(cartCount) cartCount.innerText = cart.reduce((acc, item) => acc + item.quantity, 0);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

function checkout() {
    if (cart.length === 0) return alert("Seu carrinho está vazio!");
    alert("Pedido simulado com sucesso! Obrigado por comprar na EcoVida.");
    cart = [];
    updateCart();
    toggleCart();
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    renderCart();
});