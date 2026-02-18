import type { Product } from '@/types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Coconut Sol Shimmer',
    brand: 'Victoria Secret',
    type: 'Mujer',
    price: 15990,
    image: 'https://i.etsystatic.com/58496351/r/il/a7beac/6797144072/il_300x300.6797144072_3zr3.jpg',
    description: 'Body mist con destellos dorados y aroma tropical de coco. Perfecto para el verano.',
    notes: {
      top: ['Coco', 'Vainilla'],
      heart: ['Flor de Tiaré', 'Monoi'],
      base: ['Sándalo', 'Almizcle']
    },
    stock: 15,
    isNew: true
  },
  {
    id: '2',
    name: 'Guava Fiesta Shimmer',
    brand: 'Victoria Secret',
    type: 'Mujer',
    price: 15990,
    image: 'https://http2.mlstatic.com/D_NQ_NP_864554-MLB86534021134_062025-O.webp',
    description: 'Fragancia frutal con guayaba jugosa y destellos brillantes.',
    notes: {
      top: ['Guayaba', 'Piña'],
      heart: ['Jazmín', 'Pétalos de Rosa'],
      base: ['Vainilla', 'Almizcle']
    },
    stock: 12,
    isNew: true
  },
  {
    id: '3',
    name: 'Bare Vanilla Bliss',
    brand: 'Victoria Secret',
    type: 'Mujer',
    price: 15990,
    image: 'https://cdn.deloox.com/cdn/product/1377258/570648_500.jpg?class=product_small&format=jpeg&dpr=3',
    description: 'La icónica vainilla de VS en una versión aún más suave y blissful.',
    notes: {
      top: ['Vainilla', 'Azúcar'],
      heart: ['Flor de Vainilla', 'Caramelo'],
      base: ['Sándalo', 'Almizcle']
    },
    stock: 20,
    isBestseller: true
  },
  {
    id: '4',
    name: 'Pure Seduction Bliss',
    brand: 'Victoria Secret',
    type: 'Mujer',
    price: 15990,
    image: 'https://www.victoriassecret.com/p/874x1165/png/zz/25/02/06/03/112532236716_OM_F.jpg',
    description: 'Seducción pura con notas frutales y florales irresistibles.',
    notes: {
      top: ['Melón', 'Ciruela'],
      heart: ['Freesia', 'Orquídea'],
      base: ['Vainilla', 'Ámbar']
    },
    stock: 18,
    isBestseller: true
  },
  {
    id: '5',
    name: 'Miami Glow',
    brand: 'Jennifer Lopez',
    type: 'Mujer',
    price: 22990,
    image: 'https://slimages.macysassets.com/is/image/MCY/products/0/optimized/8194830_fpx.tif',
    description: 'El brillo y la energía de Miami en una fragancia vibrante.',
    notes: {
      top: ['Toronja', 'Pimienta Rosa'],
      heart: ['Orquídea', 'Peonía'],
      base: ['Vainilla', 'Ámbar']
    },
    stock: 8,
    isBestseller: true
  },
  {
    id: '6',
    name: 'Dance Midnight Set',
    brand: 'Shakira',
    type: 'Mujer',
    price: 19990,
    image: 'https://www.shakiraperfumes.com/images/perfumes/dance-midnight/producto/dance-midnight-perfume-5.webp',
    description: 'Set exclusivo con perfume 80ml + 30ml. La magia de la noche en cada nota.',
    notes: {
      top: ['Bergamota', 'Pimienta Rosa'],
      heart: ['Jazmín', 'Gardenia'],
      base: ['Vainilla', 'Pachulí']
    },
    stock: 10,
    isNew: true
  },
  {
    id: '7',
    name: 'Can Can Burlesque',
    brand: 'Paris Hilton',
    type: 'Mujer',
    price: 29990,
    image: 'https://i.ebayimg.com/images/g/gcgAAOSwwkhmONmA/s-l1200.jpg',
    description: 'Una fragancia atrevida y sensual inspirada en el mundo del burlesque.',
    notes: {
      top: ['Grosella Negra', 'Mandarina'],
      heart: ['Orquídea', 'Ylang Ylang'],
      base: ['Vainilla', 'Almizcle']
    },
    stock: 6,
    isBestseller: true
  },
  {
    id: '8',
    name: 'Platinum Rush Body Mist',
    brand: 'Paris Hilton',
    type: 'Mujer',
    price: 9990,
    image: 'https://www.perfumisimo.cl/cdn/shop/files/paris-hilton-platinum-rush-body-mist-236ml-mujer-perfumisimo-perfumes-y-colonias-302.jpg?v=1705137392',
    description: 'Body mist elegante y sofisticado con toques florales.',
    notes: {
      top: ['Mandarina', 'Bayas Rojas'],
      heart: ['Jazmín', 'Gardenia'],
      base: ['Ámbar', 'Sándalo']
    },
    stock: 25
  },
  {
    id: '9',
    name: 'Platinum Rush Body Lotion',
    brand: 'Paris Hilton',
    type: 'Mujer',
    price: 12990,
    image: 'https://m.media-amazon.com/images/I/611+OlzmLlL._AC_UF1000,1000_QL80_.jpg',
    description: 'Loción corporal hidratante con la fragancia Platinum Rush.',
    notes: {
      top: ['Mandarina', 'Bayas Rojas'],
      heart: ['Jazmín', 'Gardenia'],
      base: ['Ámbar', 'Sándalo']
    },
    stock: 20
  },
  {
    id: '10',
    name: 'Yara',
    brand: 'Lattafa',
    type: 'Mujer',
    price: 19990,
    image: 'https://shop.sa-usa.com/cdn/shop/files/51xxIWzhThL._SL1012_1200x.jpg?v=1682707821',
    description: 'Fragancia árabe elegante con notas dulces y florales.',
    notes: {
      top: ['Helado', 'Frutas Rojas'],
      heart: ['Jazmín', 'Gardenia'],
      base: ['Vainilla', 'Almizcle']
    },
    stock: 14,
    isBestseller: true
  },
  {
    id: '11',
    name: 'Asad Bourbon',
    brand: 'Lattafa',
    type: 'Hombre',
    price: 27990,
    image: 'https://beautyhouse.com/cdn/shop/files/01avtwayjt.png?v=1723945307&width=1600',
    description: 'Fragancia masculina intensa con notas de bourbon y especias.',
    notes: {
      top: ['Bourbon', 'Pimienta Negra'],
      heart: ['Tabaco', 'Canela'],
      base: ['Cuero', 'Vainilla']
    },
    stock: 10,
    isNew: true
  },
  {
    id: '12',
    name: 'Odyssey Candee',
    brand: 'Armaf',
    type: 'Mujer',
    price: 19990,
    image: 'https://fimgs.net/mdimg/perfume/o.96990.jpg',
    description: 'Dulce y encantadora, perfecta para las amantes de los aromas gourmand.',
    notes: {
      top: ['Caramelo', 'Frutas'],
      heart: ['Rosa', 'Jazmín'],
      base: ['Vainilla', 'Almizcle']
    },
    stock: 16,
    isNew: true
  },
  {
    id: '13',
    name: 'Be Delicious Crystallized',
    brand: 'DKNY',
    type: 'Mujer',
    price: 24990,
    image: 'https://i5.walmartimages.com/asr/2f2e7ad6-648a-4f9b-b066-f1350f3e1864.daa46d1cc605e48727db01d39a8f36b4.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF',
    description: 'La icónica manzana verde ahora con un toque cristalino y brillante.',
    notes: {
      top: ['Manzana Verde', 'Pepino'],
      heart: ['Magnolia', 'Rosa'],
      base: ['Maderas', 'Ámbar']
    },
    stock: 7,
    isBestseller: true
  },
  {
    id: '14',
    name: '9PM',
    brand: 'Afnan',
    type: 'Hombre',
    price: 26990,
    image: 'https://cdn2.jomashop.com/media/catalog/product/cache/0ee3019724ce73007b606b54ba535a23/a/f/afnan-perfumes-mens-9pm-edp-spray-34-oz100ml-fragrances-6290171002338_4.jpg?width=546&height=546',
    description: 'Fragancia nocturna masculina con notas cítricas y amaderadas.',
    notes: {
      top: ['Cítricos', 'Especias'],
      heart: ['Lavanda', 'Canela'],
      base: ['Ámbar', 'Maderas']
    },
    stock: 9,
    isNew: true
  },
  {
    id: '15',
    name: 'Khamrah',
    brand: 'Lattafa',
    type: 'Unisex',
    price: 25990,
    image: 'https://www.wyxloop.com/cdn/shop/files/Khamrah_001.jpg?v=1703086367&width=1920',
    description: 'Fragancia unisex árabe con notas dulces y especiadas.',
    notes: {
      top: ['Canela', 'Nuez Moscada'],
      heart: ['Dátiles', 'Praliné'],
      base: ['Vainilla', 'Maderas']
    },
    stock: 11,
    isBestseller: true
  },
  {
    id: '16',
    name: 'La Vivacité',
    brand: 'Maison Alhambra',
    type: 'Mujer',
    price: 15990,
    image: 'https://labelleperfumes.com/cdn/shop/files/MAISON-ALHAMBRA-LA-VIVACITE-EDP-a_800x.webp?v=1732659560',
    description: 'Fragancia fresca y vivaz con notas florales y frutales.',
    notes: {
      top: ['Cítricos', 'Frutas'],
      heart: ['Rosa', 'Peonía'],
      base: ['Maderas', 'Almizcle']
    },
    stock: 18
  },
  {
    id: '17',
    name: 'La Vivacité Intensa',
    brand: 'Maison Alhambra',
    type: 'Mujer',
    price: 15990,
    image: 'https://multimarcasperfumes.cl/cdn/shop/files/3_5af1d098-af8a-4cf0-b6a6-1dae74c236ff_300x.jpg?v=1742936247',
    description: 'Versión más intensa y duradera de La Vivacité.',
    notes: {
      top: ['Bergamota', 'Frutas'],
      heart: ['Rosa', 'Jazmín'],
      base: ['Pachulí', 'Vainilla']
    },
    stock: 15,
    isNew: true
  },
  {
    id: '18',
    name: 'Tequila Noir Set',
    brand: 'Tequila Perfumes',
    type: 'Mujer',
    price: 29990,
    image: 'https://beautyhouse.com/cdn/shop/files/02_a64e1b98-98cd-4ddb-aaea-035a7922a8f7.png?v=1723953014&width=2048',
    description: 'Set exclusivo 100ml + 5ml. Elegancia y sofisticación en cada gota.',
    notes: {
      top: ['Bergamota', 'Pimienta'],
      heart: ['Rosa', 'Iris'],
      base: ['Vainilla', 'Cuero']
    },
    stock: 5,
    isNew: true
  },
  {
    id: '19',
    name: 'Electrify Body Mist',
    brand: 'Paris Hilton',
    type: 'Mujer',
    price: 12900,
    image: 'https://us-i.makeupstore.com/t/tl/tlqsinyyahuy.jpg',
    description: 'Body mist energizante con notas florales y frutales vibrantes.',
    notes: {
      top: ['Frutas Rojas', 'Cítricos'],
      heart: ['Jazmín', 'Orquídea'],
      base: ['Almizcle', 'Sándalo']
    },
    stock: 22
  },
  {
    id: '20',
    name: 'Private Sundeck',
    brand: 'Victoria Secret',
    type: 'Mujer',
    price: 15990,
    image: 'http://www.myperfumeshop.qa/cdn/shop/files/victorias-secret-private-sundeck-fragrance-mist-hair-body-mist-543275.png?v=1722206820&width=2048',
    description: 'Fragancia exclusiva que evoca días de sol y relax en la cubierta privada.',
    notes: {
      top: ['Coco', 'Limón'],
      heart: ['Flor de Naranjo', 'Frangipani'],
      base: ['Vainilla', 'Almizcle']
    },
    stock: 13,
    isNew: true
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getProductsByType = (type: Product['type']): Product[] => {
  return products.filter(p => p.type === type);
};

export const getNewArrivals = (): Product[] => {
  return products.filter(p => p.isNew);
};

export const getBestsellers = (): Product[] => {
  return products.filter(p => p.isBestseller);
};
