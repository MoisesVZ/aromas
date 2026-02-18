# Aromas - Tienda de Perfumes Premium

## 🌐 Tu webapp está en línea

**URL:** https://jqr242lsizxk4.ok.kimi.link

---

## ✨ Características Principales

### 🛍️ E-Commerce Completo
- **Catálogo de 21 perfumes** con imágenes reales
- **Filtros por categoría**: Mujer, Hombre, Unisex
- **Vista de cuadrícula y lista**
- **Ordenamiento por precio y nombre**
- **Páginas de detalle de producto** con notas olfativas

### 🛒 Carrito de Compras
- Agregar/eliminar productos
- Modificar cantidades
- Cálculo automático de totales
- Persistencia durante la sesión

### 💳 Checkout con Transferencia Bancaria
- Formulario de datos personales y envío
- Resumen del pedido
- **Datos bancarios para transferencia** (lista para personalizar)
- Confirmación de pedido
- Envío gratis en compras sobre $50.000

### 🔐 Panel de Administración
**URL:** https://jqr242lsizxk4.ok.kimi.link (navegar a "Panel Admin")

- **Usuario:** `admin`
- **Contraseña:** `aromas2026`

#### Funcionalidades del Admin:
- 📊 **Dashboard** con estadísticas:
  - Total de pedidos
  - Ingresos
  - Pedidos pendientes
  - Productos con stock bajo
- 📦 **Gestión de productos**:
  - Ver todos los productos
  - Editar stock en tiempo real
- 🛍️ **Gestión de pedidos**:
  - Ver todos los pedidos
  - Cambiar estados (Pendiente, Pagado, Enviado, Entregado, Cancelado)
  - Ver detalles completos del cliente y productos

---

## 📋 Lista de Productos Incluidos

### Victoria Secret (Mujer)
1. Coconut Sol Shimmer - $15.990
2. Guava Fiesta Shimmer - $15.990
3. Bare Vanilla Bliss - $15.990
4. Pure Seduction Bliss - $15.990
5. Private Sundeck - $15.990

### Paris Hilton (Mujer)
6. Can Can Burlesque - $29.990
7. Platinum Rush Body Mist - $9.990
8. Platinum Rush Body Lotion - $12.990
9. Electrify Body Mist - $12.900

### Lattafa
10. Yara (Mujer) - $19.990
11. Asad Bourbon (Hombre) - $27.990
12. Khamrah (Unisex) - $25.990

### Otras Marcas
13. Jennifer Lopez Miami Glow - $22.990
14. Shakira Dance Midnight Set - $19.990
15. DKNY Be Delicious Crystallized - $24.990
16. Afnan 9PM (Hombre) - $26.990
17. Armaf Odyssey Candee (Mujer) - $19.990
18. Maison Alhambra La Vivacité - $15.990
19. Maison Alhambra La Vivacité Intensa - $15.990
20. Tequila Noir Set - $29.990

---

## 🎨 Diseño

- **Paleta de colores**: Negro (#0B0B0C), Dorado (#D7A04D), Blanco (#F4F2EE)
- **Tipografía**: Playfair Display (títulos) + Inter (cuerpo)
- **Estilo**: Premium, elegante, minimalista
- **Animaciones**: Scroll reveal, hover effects, transiciones suaves

---

## 🚀 Próximos Pasos para Ti

### 1. Personalizar datos bancarios
Edita el archivo `src/pages/Checkout.tsx` y actualiza:
- Nombre del banco
- Tipo de cuenta
- Número de cuenta
- Nombre del titular
- RUT

### 2. Agregar más productos
Edita `src/data/products.ts` y sigue el formato existente.

### 3. Integrar pasarela de pago (cuando tengas el comercio registrado)
- Webpay Plus
- Mercado Pago
- Flow
- Khipu

### 4. Configurar envíos
- Definir tarifas por región
- Integrar con Starken/Chilexpress

### 5. SEO y Marketing
- Agregar Google Analytics
- Configurar Facebook Pixel
- Crear campañas en redes sociales

---

## 📁 Estructura del Proyecto

```
app/
├── src/
│   ├── components/       # Componentes reutilizables
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── CartDrawer.tsx
│   ├── sections/         # Secciones de la landing
│   │   ├── Hero.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── Categories.tsx
│   │   ├── About.tsx
│   │   └── Testimonials.tsx
│   ├── pages/            # Páginas completas
│   │   ├── Catalog.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Checkout.tsx
│   │   ├── Admin.tsx
│   │   └── Contact.tsx
│   ├── context/          # Estado global
│   │   └── CartContext.tsx
│   ├── data/             # Datos estáticos
│   │   └── products.ts
│   ├── types/            # Tipos TypeScript
│   │   └── index.ts
│   ├── App.tsx
│   └── index.css
├── dist/                 # Build de producción
└── index.html
```

---

## 🛠️ Tecnologías Utilizadas

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (estilos)
- **shadcn/ui** (componentes UI)
- **Lucide React** (iconos)

---

## 💡 Tips para tu Negocio

1. **Fotografía profesional**: Reemplaza las imágenes de internet con fotos propias de tus productos
2. **Descripciones únicas**: Escribe descripciones personalizadas para cada perfume
3. **Reseñas reales**: Solicita a tus primeros clientes que dejen reseñas
4. **Redes sociales**: Crea contenido sobre fragancias, tips, notas olfativas
5. **Email marketing**: Usa la lista de suscriptores para promociones

---

## 📞 Soporte

Si necesitas ayuda para modificar algo, no dudes en consultarme.

**¡Éxito con tu tienda Aromas!** 🌸✨
