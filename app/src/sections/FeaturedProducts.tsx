import { useEffect, useRef, useState } from 'react';
import { ArrowRight, TrendingUp, ShoppingBag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';

interface FeaturedProductsProps {
  onNavigate: (page: string) => void;
}

export function FeaturedProducts({ onNavigate }: FeaturedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    // Traer los últimos 4 productos creados QUE TENGAN STOCK
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .gt('stock', 0) // CAMBIO: Solo productos con stock mayor a 0
      .order('created_at', { ascending: false })
      .limit(4);
    
    if (data) setProducts(data as any[]);
  };

  // Animación Scroll
  useEffect(() => {
    if (products.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate-visible');
        });
      },
      { threshold: 0.1 }
    );
    setTimeout(() => {
        const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
        elements?.forEach((el) => observer.observe(el));
    }, 100);
    return () => observer.disconnect();
  }, [products]);

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

  if (products.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-24 bg-[#0B0B0C]">
      <div className="section-padding max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <span className="inline-flex items-center gap-2 text-[#D7A04D] text-sm tracking-wider mb-3">
              <TrendingUp size={16} />
              NOVEDADES
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#F4F2EE]">
              Últimos <span className="gold-text">Lanzamientos</span>
            </h2>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100 inline-flex items-center gap-2 text-[#D7A04D] hover:text-[#E5B86A] transition-colors"
          >
            Ver catálogo completo
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              onClick={() => onNavigate(`product-${product.id}`)}
              className={`animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 group cursor-pointer`}
              style={{ transitionDelay: `${(index + 2) * 100}ms` }}
            >
              <div className="card-dark overflow-hidden transition-all duration-500 group-hover:border-[#D7A04D]/50 group-hover:shadow-lg group-hover:shadow-[#D7A04D]/10">
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#0B0B0C]">
                  <img
                    src={product.image_url || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Quick Add */}
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="w-full btn-gold text-sm flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={14} /> Añadir
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
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .animate-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </section>
  );
}