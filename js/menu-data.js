// =======================================
// COCINA BRASILEÑA - MENU DATA
// Datos del menú con precios en pesos argentinos
// =======================================

const menuData = [
    // === PLATOS PRINCIPALES ===
    {
        id: 1,
        name: "6 Coxinhas de Pollo + Mini Coca-cola",
        category: "principales",
        price: 7000,
        description: "Coxinhas fritas, rellenas con pollo desmenuzado.",
        image: "images/combopollo.jpeg",
        popular: true,
        badge: "Más Pedido"
    },

    {
        id: 2,
        name: "Vaso de Maravillas Saladas",
        category: "principales",
        price: 4000,
        description: "Vaso lleno de maravillas fritas, rellenas de jamón y queso",
        image: "images/copomaravilla.jpeg",
        popular: true,
        badge: "Más Pedido"
    },
   
    

    // === Combos ===
    {
        id: 9,
        name: "3 Estrellas rellenas",
        category: "Combos",
        price: 4500,
        description: "Estrella rellena con un delicioso puré de papas, queso cremoso y un toque de orégano.",
        image: "images/tresestrellas.jpeg",
        popular: false
    },

    {
        id: 10,
        name: "3 Estrellas rellenas + Mini Coca-Cola",
        category: "Combos",
        price: 5500,
        description: "Estrella rellena con un delicioso puré de papas, queso cremoso y un toque de orégano + Una Mini-Coca",
        image: "images/tresestrellasycoca.jpeg",
        popular: false
    },

    {
        id: 11,
        name: "Copo de Maraviilas + Milshake Alcohólico de Durazno",
        category: "Combos",
        price: 8000,
        description: "Un Combo Perfecto",
        image: "images/milkshakeyaravilla.jpg",
        popular: false
    },
   

    // === BEBIDAS ===
    {
        id: 15,
        name: "Caipirinha Original",
        category: "bebidas",
        price: 6000,
        description: "El cóctel más famoso de Brasil. Cachaça, limón, azúcar y hielo. Refrescante y potente.",
        image: "images/caipirinha.png   ",
        popular: true,
        badge: "Clásico"
    },

    {
        id: 16,
        name: "Milkshake Alcohólico de Durazno",
        category: "bebidas",
        price: 5000,
        description: "Rica bebida hecha con leche, vodka y durazno",
        image: "images/milshakededurazno.png   ",
        popular: true,
        badge: "Novedad"
    },
    

    // === ECONÓMICOS ===
    {
        id: 22,
        name: "Una estrella Rellena",
        category: "económicos",
        price: 2000,
        description: "Estrella rellena con un delicioso puré de papas, queso cremoso y un toque de orégano.",
        image: "images/unaestrella.jpeg",
        popular: true,
        badge: "Imperdible"
    },
   
];

// Función para formatear precios
function formatPrice(price) {
    return `$${price.toLocaleString('es-AR')}`;
}

// Función para obtener todos los items del menú
function getAllMenuItems() {
    return menuData;
}

// Función para filtrar items por categoría
function getItemsByCategory(category) {
    if (category === 'todos') {
        return menuData;
    }
    return menuData.filter(item => item.category === category);
}

// Función para obtener un item por ID
function getItemById(id) {
    return menuData.find(item => item.id === id);
}

// Función para obtener items populares
function getPopularItems() {
    return menuData.filter(item => item.popular);
}

// Función para buscar items por nombre
function searchItems(query) {
    const lowerQuery = query.toLowerCase();
    return menuData.filter(item => 
        item.name.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery)
    );
}

// Exportar funciones para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        menuData,
        formatPrice,
        getAllMenuItems,
        getItemsByCategory,
        getItemById,
        getPopularItems,
        searchItems
    };
}
