document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('iqraCart')) || [];
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');
    const cartItemsList = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenu = document.getElementById('close-menu');

    updateCartUI();

    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', () => {
            cartModal.classList.toggle('translate-x-full');
            if (mobileMenu) mobileMenu.classList.add('translate-x-full');
        });
    }

    if (closeCart) closeCart.addEventListener('click', () => cartModal.classList.add('translate-x-full'));

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('translate-x-full');
            if (cartModal) cartModal.classList.add('translate-x-full');
        });
    }

    if (closeMenu && mobileMenu) closeMenu.addEventListener('click', () => mobileMenu.classList.add('translate-x-full'));

    const buyButtons = document.querySelectorAll('.buy-btn');
    buyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const bookName = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));
            const image = btn.getAttribute('data-image');

            addToCart(bookName, price, image);

            const originalText = btn.innerText;
            btn.innerText = 'Added!';
            btn.classList.add('bg-green-500', 'text-white');
            setTimeout(() => {
                btn.innerText = originalText;
                btn.classList.remove('bg-green-500', 'text-white');
            }, 1000);
        });
    });

    function addToCart(name, price, image) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, image, quantity: 1 });
        }
        saveCart();
        updateCartUI();
    }

    function saveCart() {
        localStorage.setItem('iqraCart', JSON.stringify(cart));
    }

    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) cartCount.innerText = totalItems;

        if (cartItemsList) {
            if (cart.length === 0) {
                cartItemsList.innerHTML = `
                    <div class="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40">
                        <i data-lucide="shopping-cart" class="w-16 h-16"></i>
                        <p class="uppercase tracking-widest text-xs">Your bag is empty</p>
                    </div>
                `;
                if (window.lucide) window.lucide.createIcons();
            } else {
                cartItemsList.innerHTML = cart.map((item, index) => `
                    <div class="flex items-center gap-4 p-4 border-b border-gray-100 group">
                        <img src="${item.image}" class="w-16 h-20 object-cover rounded-lg">
                        <div class="flex-1">
                            <h5 class="font-bold text-sm text-primary truncate w-32">${item.name}</h5>
                            <p class="text-xs text-gray-500">$${item.price} x ${item.quantity}</p>
                        </div>
                        <button onclick="removeFromCart(${index})" class="text-gray-300 hover:text-red-500 transition-colors">✕</button>
                    </div>
                `).join('');
            }
        }

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartTotal) cartTotal.innerText = `$${total.toFixed(2)}`;
    }

    window.removeFromCart = (index) => {
        cart.splice(index, 1);
        saveCart();
        updateCartUI();
    };
});