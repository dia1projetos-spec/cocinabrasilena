// =======================================
// COCINA BRASILEÑA - CART SYSTEM
// Sistema de carrito de compras completo
// =======================================

class ShoppingCart {
    constructor() {
        this.items = [];
        this.loadFromStorage();
    }

    // Cargar carrito desde localStorage
    loadFromStorage() {
        const savedCart = localStorage.getItem('cocinaBrasilenaCart');
        if (savedCart) {
            try {
                this.items = JSON.parse(savedCart);
            } catch (error) {
                console.error('Error al cargar el carrito:', error);
                this.items = [];
            }
        }
    }

    // Guardar carrito en localStorage
    saveToStorage() {
        try {
            localStorage.setItem('cocinaBrasilenaCart', JSON.stringify(this.items));
        } catch (error) {
            console.error('Error al guardar el carrito:', error);
        }
    }

    // Agregar item al carrito
    addItem(menuItem, quantity = 1) {
        const existingItem = this.items.find(item => item.id === menuItem.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                ...menuItem,
                quantity: quantity
            });
        }
        
        this.saveToStorage();
        this.updateUI();
        this.showNotification(`${menuItem.name} agregado al carrito`);
    }

    // Remover item del carrito
    removeItem(itemId) {
        const item = this.items.find(i => i.id === itemId);
        this.items = this.items.filter(i => i.id !== itemId);
        this.saveToStorage();
        this.updateUI();
        if (item) {
            this.showNotification(`${item.name} eliminado del carrito`, 'error');
        }
    }

    // Actualizar cantidad de un item
    updateQuantity(itemId, newQuantity) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(itemId);
            } else {
                item.quantity = newQuantity;
                this.saveToStorage();
                this.updateUI();
            }
        }
    }

    // Incrementar cantidad
    incrementQuantity(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            item.quantity++;
            this.saveToStorage();
            this.updateUI();
        }
    }

    // Decrementar cantidad
    decrementQuantity(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                this.removeItem(itemId);
                return;
            }
            this.saveToStorage();
            this.updateUI();
        }
    }

    // Obtener cantidad total de items
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Calcular total del carrito
    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    // Limpiar carrito
    clear() {
        this.items = [];
        this.saveToStorage();
        this.updateUI();
    }

    // Verificar si el carrito está vacío
    isEmpty() {
        return this.items.length === 0;
    }

    // Obtener todos los items
    getItems() {
        return this.items;
    }

    // Actualizar UI del carrito
    updateUI() {
        // Actualizar contador del carrito
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const total = this.getTotalItems();
            cartCount.textContent = total;
            cartCount.style.display = total > 0 ? 'flex' : 'none';
        }

        // Si el modal está abierto, actualizar su contenido
        const cartModal = document.getElementById('cartModal');
        if (cartModal && cartModal.classList.contains('active')) {
            this.renderCartModal();
        }
    }

    // Renderizar modal del carrito
    renderCartModal() {
        const cartItemsContainer = document.getElementById('cartItems');
        const emptyCart = document.getElementById('emptyCart');
        const cartFooter = document.getElementById('cartFooter');
        const totalAmount = document.getElementById('totalAmount');

        if (this.isEmpty()) {
            cartItemsContainer.style.display = 'none';
            emptyCart.style.display = 'block';
            cartFooter.style.display = 'none';
        } else {
            cartItemsContainer.style.display = 'flex';
            emptyCart.style.display = 'none';
            cartFooter.style.display = 'block';

            // Renderizar items
            cartItemsContainer.innerHTML = this.items.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${formatPrice(item.price)} c/u</div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="cart.decrementQuantity(${item.id})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="cart.incrementQuantity(${item.id})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="remove-btn" onclick="cart.removeItem(${item.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');

            // Actualizar total
            totalAmount.textContent = formatPrice(this.getTotal());
        }
    }

    // Abrir modal del carrito
    openCartModal() {
        const modal = document.getElementById('cartModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.renderCartModal();
    }

    // Cerrar modal del carrito
    closeCartModal() {
        const modal = document.getElementById('cartModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Mostrar notificación
    showNotification(message, type = 'success') {
        // Remover notificación existente si hay
        const existingNotification = document.querySelector('.cart-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Crear nueva notificación
        const notification = document.createElement('div');
        notification.className = `cart-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'times-circle'}"></i>
            <span>${message}</span>
        `;

        // Agregar estilos inline
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: type === 'success' 
                ? 'linear-gradient(135deg, #009739 0%, #006B28 100%)' 
                : 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            zIndex: '10000',
            animation: 'slideInRight 0.3s ease',
            fontSize: '1rem',
            fontWeight: '600'
        });

        document.body.appendChild(notification);

        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Proceder al checkout
    checkout() {
        if (this.isEmpty()) {
            this.showNotification('El carrito está vacío', 'error');
            return;
        }

        this.closeCartModal();
        this.openCheckoutModal();
    }

    // Abrir modal de checkout
    openCheckoutModal() {
        const modal = document.getElementById('checkoutModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.renderCheckoutSummary();
    }

    // Cerrar modal de checkout
    closeCheckoutModal() {
        const modal = document.getElementById('checkoutModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Renderizar resumen del checkout
    renderCheckoutSummary() {
        const checkoutItems = document.getElementById('checkoutItems');
        const checkoutTotal = document.getElementById('checkoutTotal');

        checkoutItems.innerHTML = this.items.map(item => `
            <div class="summary-item">
                <span>${item.name} x${item.quantity}</span>
                <span>${formatPrice(item.price * item.quantity)}</span>
            </div>
        `).join('');

        checkoutTotal.textContent = formatPrice(this.getTotal());
    }

    // Enviar pedido por WhatsApp
    sendOrderToWhatsApp(customerData) {
        const { name, phone, street, number, notes } = customerData;

        // Construir mensaje
        let message = `🇧🇷 *NUEVO PEDIDO - COCINA BRASILEÑA* 🇧🇷\n\n`;
        message += `👤 *Cliente:* ${name}\n`;
        message += `📱 *Teléfono:* ${phone}\n`;
        message += `📍 *Dirección:* ${street} ${number}\n`;
        
        if (notes) {
            message += `📝 *Observaciones:* ${notes}\n`;
        }
        
        message += `\n🍽️ *PEDIDO:*\n`;
        message += `━━━━━━━━━━━━━━━━\n`;
        
        this.items.forEach(item => {
            message += `\n▪️ ${item.name}\n`;
            message += `   Cantidad: ${item.quantity}\n`;
            message += `   Precio unitario: ${formatPrice(item.price)}\n`;
            message += `   Subtotal: ${formatPrice(item.price * item.quantity)}\n`;
        });
        
        message += `\n━━━━━━━━━━━━━━━━\n`;
        message += `💰 *TOTAL: ${formatPrice(this.getTotal())}*\n\n`;
        message += `¡Gracias por tu pedido! 🙏`;

        // Codificar mensaje para URL
        const encodedMessage = encodeURIComponent(message);
        
        // Número de WhatsApp (formato internacional sin +)
        const whatsappNumber = '5513981763452';
        
        // Construir URL de WhatsApp
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // Abrir WhatsApp
        window.open(whatsappURL, '_blank');
        
        // Limpiar carrito y cerrar modal
        setTimeout(() => {
            this.clear();
            this.closeCheckoutModal();
            this.showNotification('Pedido enviado! Te redirigimos a WhatsApp', 'success');
        }, 500);
    }
}

// Crear instancia global del carrito
const cart = new ShoppingCart();

// Inicializar eventos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Botón del carrito en el header
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => cart.openCartModal());
    }

    // Botón cerrar modal carrito
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', () => cart.closeCartModal());
    }

    // Overlay del modal carrito
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', () => cart.closeCartModal());
    }

    // Botón cerrar carrito vacío
    const closeCartEmpty = document.getElementById('closeCartEmpty');
    if (closeCartEmpty) {
        closeCartEmpty.addEventListener('click', () => cart.closeCartModal());
    }

    // Botón finalizar pedido
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => cart.checkout());
    }

    // Botón cerrar modal checkout
    const checkoutClose = document.getElementById('checkoutClose');
    if (checkoutClose) {
        checkoutClose.addEventListener('click', () => cart.closeCheckoutModal());
    }

    // Overlay del modal checkout
    const checkoutOverlay = document.getElementById('checkoutOverlay');
    if (checkoutOverlay) {
        checkoutOverlay.addEventListener('click', () => cart.closeCheckoutModal());
    }

    // Formulario de checkout
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener datos del formulario
            const customerData = {
                name: document.getElementById('customerName').value.trim(),
                phone: document.getElementById('customerPhone').value.trim(),
                street: document.getElementById('customerStreet').value.trim(),
                number: document.getElementById('customerNumber').value.trim(),
                notes: document.getElementById('customerNotes').value.trim()
            };

            // Validar datos
            if (!customerData.name || !customerData.phone || !customerData.street || !customerData.number) {
                cart.showNotification('Por favor completá todos los campos requeridos', 'error');
                return;
            }

            // Enviar pedido
            cart.sendOrderToWhatsApp(customerData);
            
            // Limpiar formulario
            checkoutForm.reset();
        });
    }

    // Cerrar modales con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            cart.closeCartModal();
            cart.closeCheckoutModal();
        }
    });

    // Actualizar UI inicial
    cart.updateUI();
});

// Agregar estilos de animación para las notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .cart-notification {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);
