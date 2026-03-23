// --- 1. LISTA DE 15 PRODUTOS COM CATEGORIAS ---
const products = [
    // Dia a Dia
    { id: 1, name: "Sacola Ecológica", price: 29.99, category: "dia-a-dia", img: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=500&q=80" },
    { id: 2, name: "Garrafa Reutilizável", price: 58.99, category: "dia-a-dia", img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=500&q=80" },
    { id: 3, name: "Canudos de Metal (6pçs)", price: 19.90, category: "dia-a-dia", img: "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=500&q=80" },
    { id: 6, name: "Ecobag Algodão Cru", price: 35.00, category: "dia-a-dia", img: "https://images.unsplash.com/photo-1597484662317-9bd7baa12e8b?auto=format&fit=crop&w=500&q=80" },
    { id: 14, name: "Kit Talheres de Bambu", price: 25.90, category: "dia-a-dia", img: "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=500&q=80" },
    
    // Higiene
    { id: 4, name: "Escova de Bambu", price: 14.90, category: "higiene", img: "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=500&q=80" },
    { id: 8, name: "Hastes Flexíveis", price: 12.90, category: "higiene", img: "https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&w=500&q=80" },
    { id: 11, name: "Saboneteira Bambu", price: 22.00, category: "higiene", img: "https://images.unsplash.com/photo-1616400619175-5beda3a17896?auto=format&fit=crop&w=500&q=80" },
    { id: 15, name: "Bucha Vegetal", price: 9.90, category: "higiene", img: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=500&q=80" },

    // Papelaria
    { id: 5, name: "Caderno Reciclado", price: 28.00, category: "papelaria", img: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&q=80" },
    { id: 13, name: "Caneta de Kraft", price: 8.50, category: "papelaria", img: "https://images.unsplash.com/photo-1585336261022-680e2a537f90?auto=format&fit=crop&w=500&q=80" }
];

let cart = JSON.parse(localStorage.getItem('ecovida_cart')) || [];
let currentCategory = 'todos'; 

// --- 2. RENDERIZAR OS PRODUTOS (COM FILTRO) ---
function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    // Filtra os produtos com base na categoria atual
    const filteredProducts = currentCategory === 'todos' 
        ? products 
        : products.filter(product => product.category === currentCategory);

    // Renderiza apenas os produtos filtrados
    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <img src="${product.img}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/500?text=Sem+Imagem'">
            <h3>${product.name}</h3>
            <p class="price">R$ ${product.price.toFixed(2)}</p>
            <button class="btn-add" onclick="addToCart(${product.id})">
                <i class="fas fa-plus"></i> Adicionar
            </button>
        </div>
    `).join('');
}

// --- 3. LÓGICA DO FILTRO DE CATEGORIAS ---
function filterCategory(category) {
    currentCategory = category;
    renderProducts(); // Atualiza a tela

    // Muda a cor do botão ativo
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if(btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        }
    });
}

// --- 4. LÓGICA DO CARRINHO ---
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    
    // Abre o carrinho automaticamente ao adicionar item
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

    if (!cartItems) return;

    // Se o carrinho estiver vazio, mostra uma mensagem bonita
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <p>Seu carrinho está vazio.</p>
                <button onclick="toggleCart()" class="btn-add" style="margin-top: 15px;">Continuar Comprando</button>
            </div>
        `;
    } else {
        // Se tiver produtos, monta o visual completo com foto e botões de + e -
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://via.placeholder.com/60?text=Foto'">
                
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2)}</span>
                    
                    <div class="cart-item-qty">
                        <button onclick="changeQty(${item.id}, -1)"><i class="fas fa-minus"></i></button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQty(${item.id}, 1)"><i class="fas fa-plus"></i></button>
                    </div>
                </div>

                <button onclick="removeFromCart(${item.id})" class="btn-remove-item" title="Remover item">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `).join('');
    }

    // Atualiza os totais
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    if(cartTotal) cartTotal.innerText = `R$ ${total.toFixed(2)}`;
    if(cartCount) cartCount.innerText = cart.reduce((acc, item) => acc + item.quantity, 0);
}

// NOVA FUNÇÃO: Controla os botões de + e - dentro do carrinho
function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += delta;
        // Se a quantidade chegar a zero, remove o item
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCart();
        }
    }
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

// --- 5. LÓGICA DO CARROSSEL DE DEPOIMENTOS ---
let currentCarouselIndex = 0;

function moveCarousel(direction) {
    const track = document.getElementById('testimonial-track');
    
    // Se o elemento não existir na página (ex: se estiver na página de produtos), a função para aqui
    if (!track) return; 

    const items = track.querySelectorAll('.test-item');
    if (items.length === 0) return; // Evita erro se a lista estiver vazia

    // Descobre quantos itens estão visíveis na tela
    const itemsVisible = window.innerWidth <= 768 ? 1 : 2; 
    
    // Calcula o número máximo de cliques possíveis
    const maxIndex = items.length - itemsVisible;

    // Atualiza o índice atual
    currentCarouselIndex += direction;

    // Impede que passe do limite
    if (currentCarouselIndex < 0) {
        currentCarouselIndex = 0; 
    } else if (currentCarouselIndex > maxIndex) {
        currentCarouselIndex = maxIndex; 
    }

    // Calcula o movimento
    const itemWidth = items[0].getBoundingClientRect().width;
    const gap = 30; // Tem que ser igual ao gap do CSS
    const amountToMove = currentCarouselIndex * (itemWidth + gap);
    
    track.style.transform = `translateX(-${amountToMove}px)`;
}

// Recalcula a posição do carrossel ao redimensionar a tela
window.addEventListener('resize', () => {
    const track = document.getElementById('testimonial-track');
    if (track) {
        currentCarouselIndex = 0; 
        track.style.transform = `translateX(0px)`;
    }
});

// --- 6. INICIALIZAÇÃO AO CARREGAR A PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    renderCart();
});