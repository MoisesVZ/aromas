import { useState, useEffect, useRef } from 'react';
import { Filter, Grid, List, ChevronDown, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';

interface CatalogProps {
  onNavigate: (page: string) => void;
}

// --- COMPONENTE DE IMAGEN OPTIMIZADA ---
const ProductImage = ({ src, alt, index }: { src: string; alt: string; index: number }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#1A1A1C]">
      {/* Skeleton (Cargando...) */}
      <div 
        className={`absolute inset-0 bg-[#2A2A2C] animate-pulse transition-opacity duration-500 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`} 
      />
      
      <img
        src={src || 'https://via.placeholder.com/300?text=No+Image'}
        alt={alt}
        // SOLUCIÓN CARGA MÓVIL: Las primeras 4 cargan inmediato (eager), el resto lazy
        loading={index < 4 ? "eager" : "lazy"} 
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-700 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
      />
    </div>
  );
};

export function Catalog({ onNavigate }: CatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'Mujer' | 'Hombre' | 'Unisex'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'name'>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { addToCart } = useCart();
  
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true);

    if (error) console.error('Error cargando catálogo:', error);
    else setProducts((data as any[]) || []);
    setLoading(false);
  };

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
    // Validar stock antes de añadir
    if (product.stock > 0) {
        addToCart(product);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] pt-24 pb-16">
      <div className="section-padding max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#F4F2EE] mb-4">
            Nuestra <span className="gold-text">Colección</span>
          </h1>
          <p className="text-[#B9B2A6] max-w-2xl">
            Descubre nuestra selección de fragancias premium.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="sticky top-16 z-30 bg-[#0B0B0C]/95 backdrop-blur-md py-4 mb-6 border-y border-[#2A2A2C]">
          <div className="flex flex-wrap items-center justify-between gap-4">
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
                      : 'bg-[#141416] text-[#B9B2A6] border border-[#2A2A2C]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
               {/* Selector Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-[#141416] border border-[#2A2A2C] rounded-lg px-4 py-2 pr-8 text-[#F4F2EE] text-xs sm:text-sm focus:outline-none focus:border-[#D7A04D]"
                >
                  <option value="default">Ordenar</option>
                  <option value="price-low">Precio: Menor</option>
                  <option value="price-high">Precio: Mayor</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none" size={14} />
              </div>

              <div className="hidden sm:flex items-center bg-[#141416] border border-[#2A2A2C] rounded-lg p-1">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#D7A04D] text-[#0B0B0C]' : 'text-[#B9B2A6]'}`}>
                  <Grid size={16} />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#D7A04D] text-[#0B0B0C]' : 'text-[#B9B2A6]'}`}>
                  <List size={16} />
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

        {/* Products Grid/List */}
        {!loading && (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6'
            : 'space-y-4'
        }>
          {sortedProducts.map((product, index) => (
            <div
              key={product.id}
              onClick={() => onNavigate(`product-${product.id}`)}
              className={`group cursor-pointer relative ${viewMode === 'list' ? 'flex gap-4 p-3 bg-[#141416] border border-[#2A2A2C] rounded-xl' : ''}`}
            >
              {viewMode === 'grid' ? (
                <div className="card-dark overflow-hidden h-full flex flex-col">
                  
                  {/* IMAGEN Y BOTÓN */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden">
                    <ProductImage 
                        src={product.image_url} 
                        alt={product.name} 
                        index={index}
                    />
                    
                    {/* BOTÓN FLOTANTE (Grid) */}
                    {/* Si no hay stock, no mostramos el hover de añadir, o mostramos 'Agotado' fijo/deshabilitado */}
                    <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={product.stock === 0}
                        className={`w-full text-sm font-bold py-2 rounded shadow-lg flex items-center justify-center gap-2 transition-all ${
                            product.stock > 0 
                            ? 'bg-[#D7A04D] text-[#0B0B0C] hover:bg-[#F4F2EE] active:scale-95' 
                            : 'bg-[#2A2A2C] text-[#666] cursor-not-allowed'
                        }`}
                      >
                        <ShoppingBag size={16} />
                        {product.stock > 0 ? 'Añadir' : 'Agotado'}
                      </button>
                    </div>
                    
                    {/* Etiqueta de Agotado visual sobre la imagen si quieres que sea muy obvio */}
                    {product.stock === 0 && (
                        <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                            Agotado
                        </div>
                    )}
                  </div>

                  {/* INFO DEL PRODUCTO */}
                  <div className="p-3 flex flex-col flex-1 justify-between bg-[#141416]">
                    <div>
                      <h3 className="text-[#F4F2EE] text-sm sm:text-base font-medium mb-1 line-clamp-2 leading-tight">
                        {product.name}
                      </h3>
                      {(product as any).category && (
                        <p className="text-[10px] sm:text-xs text-[#666] uppercase tracking-wider mb-2">
                            {(product as any).category}
                        </p>
                      )}
                    </div>
                    <div className="mt-1">
                      <span className="text-[#D7A04D] font-bold text-sm sm:text-lg block">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* VISTA DE LISTA */
                <>
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden">
                    <ProductImage src={product.image_url} alt={product.name} index={index} />
                    {product.stock === 0 && (
                         <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">
                             AGOTADO
                         </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-[#F4F2EE] font-medium mb-1">{product.name}</h3>
                    <p className="text-[#D7A04D] font-bold">{formatPrice(product.price)}</p>
                    <button
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={product.stock === 0}
                        className={`mt-2 w-fit px-4 py-2 text-xs rounded transition-colors ${
                            product.stock > 0
                            ? 'bg-[#2A2A2C] text-[#F4F2EE] hover:bg-[#D7A04D] hover:text-black'
                            : 'bg-[#1A1A1C] text-[#666] cursor-not-allowed'
                        }`}
                      >
                         {product.stock > 0 ? 'Añadir' : 'Agotado'}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        )}
        
        {/* Empty State */}
        {!loading && sortedProducts.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-[#F4F2EE]">No se encontraron productos</h3>
          </div>
        )}
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
      `}</style>
    </div>
  );
}