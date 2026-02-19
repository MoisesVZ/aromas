import { useState, useEffect, useRef } from 'react';
import { Filter, Grid, List, ChevronDown, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';

interface CatalogProps {
  onNavigate: (page: string) => void;
}

// --- SUB-COMPONENTE PARA GESTIONAR LA CARGA DE IMÁGENES ---
// Esto evita que el celular se congele intentando pintar imágenes gigantes
const ProductImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#1A1A1C] ${className}`}>
      {/* Skeleton (Cargando...) - Se muestra mientras la imagen baja */}
      <div 
        className={`absolute inset-0 bg-[#2A2A2C] animate-pulse transition-opacity duration-500 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`} 
      />
      
      {/* Imagen Real */}
      <img
        src={src || 'https://via.placeholder.com/300?text=No+Image'}
        alt={alt}
        loading="lazy"   // CLAVE: Solo carga si está cerca de la pantalla
        decoding="async" // CLAVE: No bloquea el scroll del celular
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-700 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
      />
    </div>
  );
};
// -----------------------------------------------------------

export function Catalog({ onNavigate }: CatalogProps) {
  // Estado para datos reales
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterType, setFilterType] = useState<'all' | 'Mujer' | 'Hombre' | 'Unisex'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'name'>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { addToCart } = useCart();
  const sectionRef = useRef<HTMLDivElement>(null);

  // 1. Cargar productos reales de Supabase
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    // Traemos solo los activos
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true);

    if (error) {
      console.error('Error cargando catálogo:', error);
    } else {
      setProducts((data as any[]) || []);
    }
    setLoading(false);
  };

  // Efecto de animación scroll (mantenido)
  useEffect(() => {
    if (loading) return; // Esperar a que cargue
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate-visible');
        });
      },
      { threshold: 0.1 }
    );
    // Pequeño delay para asegurar que el DOM se pintó
    setTimeout(() => {
      const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
      elements?.forEach((el) => observer.observe(el));
    }, 100);

    return () => observer.disconnect();
  }, [loading, products, filterType]); // Agregué filterType para re-animar al filtrar

  // 2. Filtrado
  const filteredProducts = products.filter((product) => {
    if (filterType === 'all') return true;
    return (product as any).category === filterType;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'name': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div ref={sectionRef} className="min-h-screen bg-[#0B0B0C] pt-24 pb-16">
      <div className="section-padding max-w-7xl mx-auto">
        {/* Header */}
        <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#F4F2EE] mb-4">
            Nuestra <span className="gold-text">Colección</span>
          </h1>
          <p className="text-[#B9B2A6] max-w-2xl">
            Descubre nuestra selección de fragancias premium.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100 sticky top-20 z-30 bg-[#0B0B0C]/95 backdrop-blur-md py-4 mb-8 border-y border-[#2A2A2C]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
              {[
                { key: 'all', label: 'Todos' },
                { key: 'Mujer', label: 'Mujer' },
                { key: 'Hombre', label: 'Hombre' },
                { key: 'Unisex', label: 'Unisex' },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setFilterType(filter.key as any)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    filterType === filter.key
                      ? 'bg-[#D7A04D] text-[#0B0B0C]'
                      : 'bg-[#141416] text-[#B9B2A6] border border-[#2A2A2C] hover:border-[#D7A04D]/50'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Sort & View */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-[#141416] border border-[#2A2A2C] rounded-lg px-4 py-2 pr-10 text-[#F4F2EE] text-sm focus:outline-none focus:border-[#D7A04D]"
                >
                  <option value="default">Ordenar por</option>
                  <option value="price-low">Precio: Menor a Mayor</option>
                  <option value="price-high">Precio: Mayor a Menor</option>
                  <option value="name">Nombre</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none" size={16} />
              </div>

              <div className="hidden sm:flex items-center bg-[#141416] border border-[#2A2A2C] rounded-lg p-1">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-[#D7A04D] text-[#0B0B0C]' : 'text-[#B9B2A6]'}`}>
                  <Grid size={18} />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-[#D7A04D] text-[#0B0B0C]' : 'text-[#B9B2A6]'}`}>
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
           <div className="text-center py-20">
             <div className="animate-spin w-10 h-10 border-4 border-[#D7A04D] border-t-transparent rounded-full mx-auto mb-4"></div>
             <p className="text-[#B9B2A6]">Cargando catálogo...</p>
           </div>
        )}

        {/* Results Count */}
        {!loading && (
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200 mb-6">
            <p className="text-[#B9B2A6] text-sm">
                Mostrando <span className="text-[#F4F2EE] font-semibold">{sortedProducts.length}</span> productos
            </p>
            </div>
        )}

        {/* Products Grid/List */}
        {!loading && (
        <div className={`animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-300 ${
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }`}>
          {sortedProducts.map((product, index) => (
            <div
              key={product.id}
              onClick={() => onNavigate(`product-${product.id}`)}
              className={`group cursor-pointer ${viewMode === 'list' ? 'flex gap-6 p-4 bg-[#141416] border border-[#2A2A2C] rounded-xl hover:border-[#D7A04D]/50 transition-colors' : ''}`}
              // Limitamos el delay en móvil para que no parezca que no carga
              style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
            >
              {viewMode === 'grid' ? (
                <div className="card-dark overflow-hidden transition-all duration-500 group-hover:border-[#D7A04D]/50 group-hover:shadow-lg group-hover:shadow-[#D7A04D]/10">
                  {/* Image con Lazy Loading Mejorado */}
                  <div className="relative aspect-[3/4] w-full">
                    <ProductImage 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-full"
                    />
                    
                    {/* Quick Add */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10">
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-full btn-gold text-sm flex items-center justify-center gap-2 shadow-lg"
                      >
                        <ShoppingBag size={16} />
                        Añadir
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-[#F4F2EE] font-medium mb-2 line-clamp-1 group-hover:text-[#D7A04D] transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[#D7A04D] font-bold">{formatPrice(product.price)}</span>
                      {/* Mostrar categoría si existe */}
                      {(product as any).category && (
                        <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-[#2A2A2C] text-[#B9B2A6]">
                            {(product as any).category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* List View */
                <>
                  <div className="relative w-24 h-24 sm:w-40 sm:h-40 flex-shrink-0 overflow-hidden rounded-lg">
                    <ProductImage 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full" 
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-[#F4F2EE] font-semibold text-lg mb-2">{product.name}</h3>
                        <p className="text-[#666] text-sm line-clamp-2 mb-3 hidden sm:block">{product.description || 'Sin descripción'}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[#D7A04D] font-bold text-xl">{formatPrice(product.price)}</span>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-4">
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="btn-gold text-sm flex items-center gap-2"
                      >
                        <ShoppingBag size={16} />
                        Añadir
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        )}

        {/* Empty State */}
        {!loading && sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <Filter size={64} className="mx-auto text-[#2A2A2C] mb-4" />
            <h3 className="text-xl font-semibold text-[#F4F2EE] mb-2">No hay productos disponibles</h3>
            <p className="text-[#B9B2A6]">Intenta cambiar los filtros o vuelve más tarde.</p>
          </div>
        )}
      </div>

      <style>{`
        .animate-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
}