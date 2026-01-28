// =======================================
// COCINA BRASILEÑA - MENU DATA
// Datos del menú con precios en pesos argentinos
// =======================================

const menuData = [
    // === PLATOS PRINCIPALES ===
    {
        id: 1,
        name: "Feijoada Completa",
        category: "principales",
        price: 8500,
        description: "El plato más tradicional de Brasil. Guiso de porotos negros con carne de cerdo, vacuna y embutidos. Servido con arroz blanco, farofa, naranja y couve.",
        image: "https://images.unsplash.com/photo-1623855244071-4508276c6287?w=800&h=600&fit=crop",
        popular: true,
        badge: "Más Pedido"
    },
    {
        id: 2,
        name: "Moqueca Bahiana",
        category: "principales",
        price: 9200,
        description: "Guiso de pescado en leche de coco con pimientos, tomates, cebolla y aceite de dendê. Un sabor único del nordeste brasileño.",
        image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop",
        popular: false
    },
    {
        id: 3,
        name: "Picanha a la Brasileña",
        category: "principales",
        price: 11500,
        description: "El corte de carne más noble de Brasil, asado a la parrilla con sal gruesa. Acompañado con vinagreta, farofa y arroz.",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop",
        popular: true,
        badge: "Especial"
    },
    {
        id: 4,
        name: "Bobó de Camarón",
        category: "principales",
        price: 10200,
        description: "Cremoso guiso de yuca con camarones grandes, leche de coco, aceite de dendê y especias. Servido con arroz blanco.",
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop",
        popular: false
    },
    {
        id: 5,
        name: "Coxinha de Frango",
        category: "principales",
        price: 4800,
        description: "Porción de 6 unidades. Croquetas de pollo desmechado con catupiry, empanadas y fritas hasta quedar crocantes. Un clásico brasileño.",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop",
        popular: true,
        badge: "Favorito"
    },
    {
        id: 6,
        name: "Acarajé Baiano",
        category: "principales",
        price: 5500,
        description: "Buñuelo de poroto fradinho frito en aceite de dendê, relleno con vatapá, camarón seco, ensalada y pimenta. Tradición afrobrasileña.",
        image: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=800&h=600&fit=crop",
        popular: false
    },
    {
        id: 7,
        name: "Baião de Dois",
        category: "principales",
        price: 7200,
        description: "Arroz con porotos verdes, carne seca, manteca de garrafa, queijo coalho y especias del sertão. Sabor del nordeste.",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop",
        popular: false
    },
    {
        id: 8,
        name: "Peixe na Brasa",
        category: "principales",
        price: 9800,
        description: "Pescado entero a las brasas con manteca de garrafa, limón y especias. Acompañado con pirão y ensalada.",
        image: "https://images.unsplash.com/photo-1580959375944-57c55d31d925?w=800&h=600&fit=crop",
        popular: false
    },

    // === ACOMPAÑAMIENTOS ===
    {
        id: 9,
        name: "Farofa Completa",
        category: "acompañamientos",
        price: 2800,
        description: "Harina de mandioca tostada con panceta, banana, huevo, aceitunas y especias. El acompañamiento perfecto.",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
        popular: false
    },
    {
        id: 10,
        name: "Couve à Mineira",
        category: "acompañamientos",
        price: 2200,
        description: "Col rizada cortada bien finita, salteada en ajo y aceite de oliva. Clásico de Minas Gerais.",
        image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&h=600&fit=crop",
        popular: false
    },
    {
        id: 11,
        name: "Vinagreta Brasileña",
        category: "acompañamientos",
        price: 1800,
        description: "Ensalada picada de tomate, cebolla, pimientos y cilantro en vinagre. Fresca y sabrosa.",
        image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop",
        popular: false
    },
    {
        id: 12,
        name: "Arroz Branco",
        category: "acompañamientos",
        price: 1500,
        description: "Arroz blanco suelto y perfumado, preparado a la manera brasileña con ajo.",
        image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800&h=600&fit=crop",
        popular: false
    },
    {
        id: 13,
        name: "Feijão Tropeiro",
        category: "acompañamientos",
        price: 3200,
        description: "Porotos cocidos con farofa, panceta, huevo, cebolla y cheiro verde. Sabor del interior.",
        image: "https://images.unsplash.com/photo-1596097635604-91d0c276f0fb?w=800&h=600&fit=crop",
        popular: false
    },
    {
        id: 14,
        name: "Pirão de Peixe",
        category: "acompañamientos",
        price: 2500,
        description: "Crema espesa de harina de mandioca con caldo de pescado. Tradicional acompañamiento de platos del mar.",
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop",
        popular: false
    },

    // === BEBIDAS ===
    {
        id: 15,
        name: "Caipirinha Original",
        category: "bebidas",
        price: 3800,
        description: "El cóctel más famoso de Brasil. Cachaça, limón, azúcar y hielo. Refrescante y potente.",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop",
        popular: true,
        badge: "Clásico"
    },
    {
        id: 16,
        name: "Caipirinha de Frutilla",
        category: "bebidas",
        price: 4000,
        description: "Variación de la caipirinha clásica con frutillas frescas. Dulce y refrescante.",
        image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&h=600&fit=crop",
        popular: false
    },
    {
        id: 17,
        name: "Caipirinha de Maracuyá",
        category: "bebidas",
        price: 4200,
        description: "Caipirinha con pulpa de maracuyá fresco. Sabor tropical único.",
        image: "https://images.unsplash.com/photo-1587223962930-cb7f31384c19?w=800&h=600&fit=crop",
        popular: false
    },
    {
        id: 18,
        name: "Guaraná Antarctica 350ml",
        category: "bebidas",
        price: 1800,
        description: "El refresco más tradicional de Brasil. Sabor único a base de guaraná.",
        image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=800&h=600&fit=crop",
        popular: false
    },
    {
        id: 19,
        name: "Agua de Coco Natural",
        category: "bebidas",
        price: 2500,
        description: "Agua de coco fresca y natural. Hidratante y refrescante.",
        image: "https://images.unsplash.com/photo-1556882046-33a8c2a3ee08?w=800&h=600&fit=crop",
        popular: false
    },
    {
        id: 20,
        name: "Jugo de Cajú",
        category: "bebidas",
        price: 2800,
        description: "Jugo natural de cajú (anacardo). Sabor exótico y refrescante del nordeste brasileño.",
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=600&fit=crop",
        popular: false
    },
    {
        id: 21,
        name: "Batida de Coco",
        category: "bebidas",
        price: 4500,
        description: "Cóctel cremoso de cachaça, leche condensada y coco. Dulce y suave.",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop",
        popular: false
    },

    // === POSTRES ===
    {
        id: 22,
        name: "Brigadeiro Gourmet",
        category: "postres",
        price: 3200,
        description: "Porción de 6 unidades. Dulce de leche condensada con cacao y manteca, cubierto con granulado. El postre más amado de Brasil.",
        image: "https://images.unsplash.com/photo-1606312619070-d48b4a0a3e0b?w=800&h=600&fit=crop",
        popular: true,
        badge: "Imperdible"
    },
    {
        id: 23,
        name: "Beijinho",
        category: "postres",
        price: 3200,
        description: "Porción de 6 unidades. Dulce de leche condensada con coco rallado. Suave y delicioso.",
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=600&fit=crop",
        popular: false
    },
    {
        id: 24,
        name: "Pudim de Leche",
        category: "postres",
        price: 4200,
        description: "Flan brasileño ultra cremoso con caramelo. Simplemente irresistible.",
        image: "https://images.unsplash.com/photo-1567327663250-c5f9ac58dfe7?w=800&h=600&fit=crop",
        popular: true,
        badge: "Favorito"
    },
    {
        id: 25,
        name: "Mousse de Maracuyá",
        category: "postres",
        price: 3800,
        description: "Mousse cremoso de maracuyá fresco. Equilibrio perfecto entre dulce y ácido.",
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=600&fit=crop",
        popular: false
    },
    {
        id: 26,
        name: "Quindim",
        category: "postres",
        price: 2800,
        description: "Porción de 4 unidades. Dulce de yema de huevo y coco rallado. Brillante y sabroso.",
        image: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=800&h=600&fit=crop",
        popular: false
    },
    {
        id: 27,
        name: "Bolo de Rolo",
        category: "postres",
        price: 3500,
        description: "Torta enrollada finísima con dulce de guayaba. Patrimonio de Pernambuco.",
        image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800&h=600&fit=crop",
        popular: false
    },
    {
        id: 28,
        name: "Açaí Bowl Premium",
        category: "postres",
        price: 5500,
        description: "Açaí batido con banana, cubierto con granola, frutillas, banana y miel. Energético y delicioso.",
        image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&h=600&fit=crop",
        popular: true,
        badge: "Saludable"
    },
    {
        id: 29,
        name: "Cocada Branca",
        category: "postres",
        price: 2200,
        description: "Porción de 5 unidades. Dulce tradicional de coco y azúcar. Crujiente y dulce.",
        image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&h=600&fit=crop",
        popular: false
    },
    {
        id: 30,
        name: "Pavê de Chocolate",
        category: "postres",
        price: 4800,
        description: "Postre en capas con crema de chocolate, galletitas y crema de leche. Clásico irresistible.",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop",
        popular: false
    }
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
