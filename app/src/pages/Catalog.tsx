import { useState, useEffect, useRef } from 'react';
import { Filter, Grid, List, ChevronDown, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';

interface CatalogProps {
  onNavigate: (page: string) => void;
}

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
  }, [loading, products]);

  // 2. Filtrado (Usando 'category' de la BD que mapea a tu filtro)
  const filteredProducts = products.filter((product) => {
    if (filterType === 'all') return true;
    // Asumimos que guardaste 'Mujer', 'Hombre', etc en la columna 'category'
    // Si usaste otros nombres, ajusta esta línea.
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
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
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
            ? 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }`}>
          {sortedProducts.map((product, index) => (
            <div
              key={product.id}
              onClick={() => onNavigate(`product-${product.id}`)}
              className={`group cursor-pointer ${viewMode === 'list' ? 'flex gap-6 p-4 bg-[#141416] border border-[#2A2A2C] rounded-xl hover:border-[#D7A04D]/50 transition-colors' : ''}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {viewMode === 'grid' ? (
                <div className="card-dark overflow-hidden transition-all duration-500 group-hover:border-[#D7A04D]/50 group-hover:shadow-lg group-hover:shadow-[#D7A04D]/10">
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#0B0B0C]">
                    <img
                      src={product.image_url || 'https://via.placeholder.com/300?text=No+Image'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Quick Add */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-full btn-gold text-sm flex items-center justify-center gap-2"
                      >
                        <ShoppingBag size={16} />
                        Añadir al carrito
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
                        <span className="text-xs px-2 py-1 rounded bg-[#2A2A2C] text-[#B9B2A6]">
                            {(product as any).category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* List View (simplificado) */
                <>
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={product.image_url || 'https://via.placeholder.com/300'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-[#F4F2EE] font-semibold text-lg mb-2">{product.name}</h3>
                        <p className="text-[#666] text-sm line-clamp-2 mb-3">{product.description || 'Sin descripción'}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[#D7A04D] font-bold text-xl">{formatPrice(product.price)}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="btn-gold text-sm flex items-center gap-2"
                      >
                        <ShoppingBag size={16} />
                        Añadir al carrito
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
      `}</style>
    </div>
  );
}