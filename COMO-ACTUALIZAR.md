# 🔄 GUÍA DE ACTUALIZACIÓN DIARIA - Cocina Brasileña

## ⚠️ IMPORTANTE: Sistema Anti-Cache

Este sitio web está configurado con un sistema de **versioning** para evitar problemas de cache. Cuando actualizás el sitio, los clientes verán SIEMPRE la versión más reciente.

---

## 📝 CÓMO ACTUALIZAR EL MENÚ/CARDÁPIO

### Paso 1: Abrir el archivo de datos del menú

Abrí el archivo: `js/menu-data.js`

### Paso 2: Modificar lo que necesites

**Para cambiar un precio:**
```javascript
{
    id: 1,
    name: "Feijoada Completa",
    price: 8500, // <-- Cambiar este número
    // ...
}
```

**Para agregar un plato nuevo:**
```javascript
{
    id: 31, // Usar un ID único (31, 32, 33...)
    name: "Nombre del Nuevo Plato",
    category: "principales", // principales, acompañamientos, bebidas, postres
    price: 7500,
    description: "Descripción del plato...",
    image: "https://url-de-imagen.jpg",
    popular: false,
    badge: "Nuevo" // Opcional
}
```

**Para eliminar un plato:**
Simplemente borrá todo el objeto del plato (desde la `{` hasta la `}`).

**Para cambiar nombre o descripción:**
```javascript
{
    id: 1,
    name: "Nuevo Nombre del Plato", // Cambiar aquí
    description: "Nueva descripción...", // Cambiar aquí
    // ...
}
```

### Paso 3: ACTUALIZAR LA VERSIÓN (MUY IMPORTANTE)

Después de cualquier cambio, tenés que actualizar el número de versión en el archivo `index.html`:

**Ubicación:** línea 8 del archivo `index.html`

**ANTES:**
```html
<link rel="stylesheet" href="css/styles.css?v=1.0.0">
```

**DESPUÉS (cambiar el último número):**
```html
<link rel="stylesheet" href="css/styles.css?v=1.0.1">
```

**También en las líneas del final del index.html:**

**ANTES:**
```html
<script src="js/menu-data.js?v=1.0.0"></script>
<script src="js/cart.js?v=1.0.0"></script>
<script src="js/main.js?v=1.0.0"></script>
```

**DESPUÉS:**
```html
<script src="js/menu-data.js?v=1.0.1"></script>
<script src="js/cart.js?v=1.0.1"></script>
<script src="js/main.js?v=1.0.1"></script>
```

### 📌 Reglas para los números de versión:

- **Cambios pequeños** (precios, descripciones): `1.0.0` → `1.0.1` → `1.0.2`
- **Cambios medianos** (agregar/quitar platos): `1.0.9` → `1.1.0`
- **Cambios grandes** (cambiar todo el menú): `1.9.0` → `2.0.0`

---

## 🚀 SUBIR LAS ACTUALIZACIONES

### Si usás hosting web (FTP/cPanel):

1. ✅ Guardá los archivos modificados
2. ✅ Conectate a tu hosting por FTP (FileZilla, etc.)
3. ✅ Subí SOLO los archivos que modificaste:
   - `js/menu-data.js` (si cambiaste el menú)
   - `index.html` (si cambiaste la versión)
4. ✅ Sobrescribí los archivos existentes
5. ✅ ¡Listo! Los clientes verán la versión nueva

### Si usás servidor propio:

1. ✅ Copiá los archivos al servidor
2. ✅ Reiniciá el servicio web si es necesario
3. ✅ Verificá en el navegador con `Ctrl + F5`

---

## 🔍 VERIFICAR QUE FUNCIONÓ

### Método 1: Modo Incógnito
1. Abrí el sitio en **modo incógnito** del navegador
2. Si ves los cambios = ¡Funciona!

### Método 2: Forzar actualización
1. Presioná `Ctrl + Shift + R` (Windows/Linux)
2. O `Cmd + Shift + R` (Mac)
3. Esto fuerza al navegador a descargar todo de nuevo

### Método 3: Ver código fuente
1. Clic derecho en la página → Ver código fuente
2. Buscá `?v=` en el código
3. Verificá que el número coincida con el que pusiste

---

## 📋 CHECKLIST DE ACTUALIZACIÓN DIARIA

```
[ ] 1. Abrir js/menu-data.js
[ ] 2. Hacer los cambios necesarios (precios, platos, etc.)
[ ] 3. Guardar el archivo
[ ] 4. Abrir index.html
[ ] 5. Cambiar TODOS los números de versión (?v=X.X.X)
[ ] 6. Guardar el archivo
[ ] 7. Subir ambos archivos al servidor
[ ] 8. Verificar en modo incógnito
[ ] 9. ¡Listo!
```

---

## ⚡ ATAJOS RÁPIDOS

### Cambiar solo precios (RÁPIDO):
1. `js/menu-data.js` → cambiar números
2. `index.html` → cambiar versión
3. Subir → Listo (2 minutos)

### Agregar plato nuevo (MEDIO):
1. `js/menu-data.js` → agregar objeto completo
2. `index.html` → cambiar versión
3. Subir → Listo (5 minutos)

### Cambiar muchos platos (LENTO):
1. `js/menu-data.js` → modificar varios
2. `index.html` → cambiar versión
3. Verificar bien → Subir (10 minutos)

---

## 🎯 EJEMPLOS PRÁCTICOS

### Ejemplo 1: Cambiar el precio de la Feijoada
```javascript
// ANTES
{
    id: 1,
    name: "Feijoada Completa",
    price: 8500,
    // ...
}

// DESPUÉS
{
    id: 1,
    name: "Feijoada Completa",
    price: 9200, // Nuevo precio
    // ...
}
```
Luego cambiar versión: `?v=1.0.0` → `?v=1.0.1`

### Ejemplo 2: Marcar un plato como "Más Pedido"
```javascript
// ANTES
{
    id: 10,
    name: "Couve à Mineira",
    popular: false,
    // ...
}

// DESPUÉS
{
    id: 10,
    name: "Couve à Mineira",
    popular: true, // Ahora aparecerá destacado
    badge: "Más Pedido", // Agregar badge
    // ...
}
```

### Ejemplo 3: Agregar plato de temporada
```javascript
// Agregar al final de la lista, antes del ];
{
    id: 31, // Nuevo ID único
    name: "Vatapá Especial",
    category: "principales",
    price: 8900,
    description: "Crema tradicional de Bahía con camarones, leche de coco y aceite de dendê. Acompañado con arroz blanco.",
    image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800",
    popular: true,
    badge: "Temporada"
},
```

---

## 🛠️ PROBLEMAS COMUNES Y SOLUCIONES

### ❌ Problema: Los clientes siguen viendo precios viejos

**Solución:**
1. Verificá que cambiaste la versión en index.html
2. Asegurate de subir AMBOS archivos (menu-data.js e index.html)
3. Esperá 5 minutos y probá de nuevo

### ❌ Problema: El menú no carga

**Solución:**
1. Revisá que no olvidaste ninguna coma (,) en el archivo
2. Verificá que todos los `{` tengan su `}` correspondiente
3. Verificá que el último item NO tenga coma al final

### ❌ Problema: Aparece error en la consola

**Solución:**
1. Abrí la consola del navegador (F12)
2. Buscá el error (generalmente en rojo)
3. Revisá la sintaxis del archivo menu-data.js

---

## 📞 SOPORTE

Si tenés algún problema con las actualizaciones:

1. **Revisá este documento** primero
2. **Verificá la sintaxis** del archivo (comas, llaves, etc.)
3. **Probá en modo incógnito** siempre
4. **Contactá al desarrollador** si el problema persiste

---

## 💡 CONSEJOS PROFESIONALES

✅ **Guardá copias de seguridad** antes de cambios grandes
✅ **Cambiá la versión SIEMPRE** que modifiques algo
✅ **Probá en varios dispositivos** (celular, computadora)
✅ **Anotá los cambios** que hacés (para tener registro)
✅ **Hacé cambios pequeños frecuentes** en vez de muchos juntos

---

## 📊 REGISTRO DE VERSIONES (Ejemplo)

Podés llevar un registro así:

```
v1.0.0 - 29/01/2025 - Versión inicial
v1.0.1 - 30/01/2025 - Actualizado precio Feijoada a $9200
v1.0.2 - 30/01/2025 - Agregado plato "Vatapá Especial"
v1.1.0 - 31/01/2025 - Actualizado todo el menú de bebidas
v2.0.0 - 05/02/2025 - Menú completamente renovado
```

---

**¡Con este sistema tus actualizaciones siempre se verán reflejadas inmediatamente para todos los clientes! 🎉**

Última actualización: Enero 2025
