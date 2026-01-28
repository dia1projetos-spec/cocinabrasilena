// =======================================
// COCINA BRASILEÑA - MAIN JAVASCRIPT
// Funcionalidades principales del sitio
// =======================================

// ==================
// INICIALIZACIÓN
// ==================
document.addEventListener('DOMContentLoaded', function() {
    initializeMenu();
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
});

// ==================
// MENÚ / CARDÁPIO
// ==================

// Inicializar menú
function initializeMenu() {
    const menuGrid = document.getElementById('menuGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Renderizar todos los items inicialmente
    renderMenuItems(getAllMenuItems());

    // Eventos de filtros
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Actualizar botón activo
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filtrar y renderizar items
            const category = this.getAttribute('data-category');
            const items = getItemsByCategory(category);
            renderMenuItems(items);
        });
    });
}

// Renderizar items del menú
function renderMenuItems(items) {
    const menuGrid = document.getElementById('menuGrid');
    
    if (!menuGrid) return;

    // Animación de salida
    menuGrid.style.opacity = '0';
    menuGrid.style.transform = 'translateY(20px)';

    setTimeout(() => {
        menuGrid.innerHTML = items.map(item => createMenuItemHTML(item)).join('');
        
        // Animación de entrada
        setTimeout(() => {
            menuGrid.style.opacity = '1';
            menuGrid.style.transform = 'translateY(0)';
        }, 50);

        // Agregar eventos a botones
        const addToCartButtons = menuGrid.querySelectorAll('.add-to-cart-btn');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-item-id'));
                const item = getItemById(itemId);
                if (item) {
                    cart.addItem(item);
                }
            });
        });
    }, 300);

    // Agregar transición suave
    menuGrid.style.transition = 'all 0.3s ease';
}

// Crear HTML de item del menú
function createMenuItemHTML(item) {
    const badgeHTML = item.badge 
        ? `<span class="menu-item-badge">${item.badge}</span>` 
        : '';

    return `
        <div class="menu-item fade-in">
            <div class="menu-item-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                ${badgeHTML}
            </div>
            <div class="menu-item-content">
                <div class="menu-item-header">
                    <h3 class="menu-item-title">${item.name}</h3>
                    <span class="menu-item-category">${getCategoryName(item.category)}</span>
                </div>
                <p class="menu-item-description">${item.description}</p>
                <div class="menu-item-footer">
                    <span class="menu-item-price">${formatPrice(item.price)}</span>
                    <button class="add-to-cart-btn" data-item-id="${item.id}">
                        <i class="fas fa-cart-plus"></i>
                        <span>Agregar</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Obtener nombre de categoría en español
function getCategoryName(category) {
    const categoryNames = {
        'principales': 'Principal',
        'acompañamientos': 'Acompañamiento',
        'bebidas': 'Bebida',
        'postres': 'Postre'
    };
    return categoryNames[category] || category;
}

// ==================
// NAVEGACIÓN
// ==================

// Inicializar navegación
function initializeNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menú móvil
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Cerrar menú al hacer click en links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Actualizar link activo
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Cerrar menú móvil
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }

            // Smooth scroll
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Actualizar link activo al hacer scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

// Actualizar link activo basado en scroll
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && 
            window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ==================
// EFECTOS DE SCROLL
// ==================

// Inicializar efectos de scroll
function initializeScrollEffects() {
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Agregar sombra al header al hacer scroll
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });

    // Parallax effect en hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.mascot-container');
        
        if (heroImage && scrolled < window.innerHeight) {
            heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
}

// ==================
// ANIMACIONES
// ==================

// Inicializar animaciones al hacer scroll
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos
    const animatedElements = document.querySelectorAll('.about-card, .contact-card, .stat-item');
    animatedElements.forEach(el => observer.observe(el));
}

// ==================
// UTILIDADES
// ==================

// Smooth scroll para todos los links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Prevenir zoom en inputs en dispositivos móviles
if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
        viewportMeta.content = 'width=device-width, initial-scale=1, maximum-scale=1';
    }
}

// ==================
// LAZY LOADING DE IMÁGENES
// ==================

// Implementar lazy loading para imágenes
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==================
// PERFORMANCE
// ==================

// Debounce function para eventos de scroll
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Aplicar debounce a eventos de scroll
window.addEventListener('scroll', debounce(updateActiveNavLink, 10));

// ==================
// ACCESIBILIDAD
// ==================

// Detectar navegación por teclado
let isTabbing = false;

document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        isTabbing = true;
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    isTabbing = false;
    document.body.classList.remove('keyboard-navigation');
});

// Trap focus en modales abiertos
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function(e) {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    });
}

// Aplicar trap focus a modales cuando se abran
const modals = document.querySelectorAll('.modal');
modals.forEach(modal => {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                if (modal.classList.contains('active')) {
                    trapFocus(modal);
                    // Focus en el primer elemento interactivo
                    const firstInput = modal.querySelector('input, button');
                    if (firstInput) {
                        setTimeout(() => firstInput.focus(), 100);
                    }
                }
            }
        });
    });

    observer.observe(modal, { attributes: true });
});

// ==================
// MENSAJES DE CONSOLA
// ==================

console.log('%c🇧🇷 Cocina Brasileña 🇧🇷', 'font-size: 20px; font-weight: bold; color: #009739;');
console.log('%cSitio web desarrollado con ❤️ para traer los sabores de Brasil a Argentina', 'font-size: 12px; color: #666;');
console.log('%c¿Interesado en el código? Contactanos por WhatsApp: +55 13 98176-3452', 'font-size: 12px; color: #FEDD00; font-weight: bold;');

// ==================
// SERVICE WORKER (PWA - opcional)
// ==================

// Registrar service worker si está disponible
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Descomentar la siguiente línea si se implementa PWA
        // navigator.serviceWorker.register('/sw.js');
    });
}

// ==================
// ANALYTICS (opcional)
// ==================

// Función para trackear eventos (integrar con Google Analytics u otro)
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    
    // Log en consola para desarrollo
    console.log('Event tracked:', { category, action, label });
}

// Trackear clicks en botones importantes
document.addEventListener('click', function(e) {
    const button = e.target.closest('button, a');
    if (!button) return;

    if (button.classList.contains('add-to-cart-btn')) {
        const itemId = button.getAttribute('data-item-id');
        const item = getItemById(parseInt(itemId));
        if (item) {
            trackEvent('Carrito', 'Agregar Item', item.name);
        }
    }

    if (button.id === 'checkoutBtn') {
        trackEvent('Carrito', 'Iniciar Checkout', 'Total: ' + cart.getTotal());
    }

    if (button.classList.contains('whatsapp-float')) {
        trackEvent('Contacto', 'Click WhatsApp Float', 'Footer Button');
    }
});

// ==================
// ERROR HANDLING
// ==================

// Manejo global de errores
window.addEventListener('error', function(e) {
    console.error('Error global:', e.error);
    // Aquí se podría enviar el error a un servicio de logging
});

// Manejo de errores de promesas no capturados
window.addEventListener('unhandledrejection', function(e) {
    console.error('Promise rejection no manejado:', e.reason);
    // Aquí se podría enviar el error a un servicio de logging
});

// ==================
// EXPORT (si se usa como módulo)
// ==================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderMenuItems,
        initializeMenu,
        initializeNavigation,
        trackEvent
    };
}
