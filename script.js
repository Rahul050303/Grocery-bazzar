document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu ---
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    // --- Shopping Cart Logic ---
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    const cartPanel = document.querySelector('.cart-panel');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCartBtn = document.querySelector('.close-cart-btn');
    const cartLink = document.querySelector('.cart-link');
    const cartItemsContainer = document.querySelector('.cart-items-container');
    const totalPriceEl = document.querySelector('.total-price');
    const cartCountEl = document.querySelector('.cart-count');
    
    let cart = []; // Array to store cart items

    // Function to open the cart panel
    const openCart = () => {
        cartPanel.classList.add('active');
        cartOverlay.classList.add('active');
    };

    // Function to close the cart panel
    const closeCart = () => {
        cartPanel.classList.remove('active');
        cartOverlay.classList.remove('active');
    };

    // Event listeners to open/close cart
    cartLink.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
    });
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Function to add item to cart
    const addItemToCart = (item) => {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        renderCart();
        openCart();
    };
    
    // Add event listeners to "Add to Cart" buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const item = {
                id: button.dataset.id,
                name: button.dataset.name,
                price: parseFloat(button.dataset.price),
                image: button.dataset.image
            };
            addItemToCart(item);
        });
    });

    // Function to render cart items in the panel
    const renderCart = () => {
        cartItemsContainer.innerHTML = ''; // Clear previous items

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty-msg">Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                const cartItemHTML = `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <p class="cart-item-price">₹${item.price.toFixed(2)}</p>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn decrease-btn">-</button>
                                <span class="quantity-value">${item.quantity}</span>
                                <button class="quantity-btn increase-btn">+</button>
                            </div>
                        </div>
                        <button class="remove-item-btn"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                cartItemsContainer.innerHTML += cartItemHTML;
            });
        }
        updateCartTotal();
    };

    // Function to update cart total price and item count
    const updateCartTotal = () => {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalPriceEl.textContent = `₹${total.toFixed(2)}`;

        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = totalItems;
    };

    // Event delegation for cart item actions (increase, decrease, remove)
    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const cartItemDiv = target.closest('.cart-item');
        const itemId = cartItemDiv.dataset.id;
        const itemInCart = cart.find(item => item.id === itemId);

        if (target.classList.contains('increase-btn')) {
            itemInCart.quantity++;
        } else if (target.classList.contains('decrease-btn')) {
            itemInCart.quantity--;
            if (itemInCart.quantity === 0) {
                cart = cart.filter(item => item.id !== itemId);
            }
        } else if (target.classList.contains('remove-item-btn')) {
            cart = cart.filter(item => item.id !== itemId);
        }
        
        renderCart();
    });

});