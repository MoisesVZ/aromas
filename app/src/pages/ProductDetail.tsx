import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ShoppingBag, Truck, Shield, Check, Minus, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';

interface ProductDetailProps {
  productId: string;
  onNavigate: (page: string) => void;
}

export function ProductDetail({ productId, onNavigate }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) console.error(error);
    else setProduct(data as any);
    
    setLoading(false);
  };

  // Animaciones
  useEffect(() => {
    if (!product) return;
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
  }, [product]);


  if (loading) {
     return <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center text-[#D7A04D]">Cargando detalle...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#F4F2EE] mb-4">Producto no encontrado</h2>
          {/* CORRECCIÓN 1: Aseguramos que lleve al catálogo */}
          <button onClick={() => onNavigate('catalog')} className="btn-gold">
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    alert('Producto añadido al carrito');
  };

  return (
    <div ref={sectionRef} className="min-h-screen bg-[#0B0B0C] pt-24 pb-16">
      <div className="section-padding max-w-7xl mx-auto">
        {/* Back Button */}
        {/* CORRECCIÓN 2: Este es el botón principal de volver. Apunta a 'catalog' */}
        <button
          onClick={() => onNavigate('catalog')}
          className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-500 inline-flex items-center gap-2 text-[#B9B2A6] hover:text-[#D7A04D] mb-8"
        >
          <ArrowLeft size={18} />
          Volver al catálogo
        </button>

        {/* Main Product */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="animate-on-scroll opacity-0 translate-x-[-30px] transition-all duration-700">
            <div className="relative aspect-square bg-[#141416] rounded-2xl overflow-hidden border border-[#2A2A2C]">
              <img
                src={product.image_url || 'https://via.placeholder.com/500'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="animate-on-scroll opacity-0 translate-x-[30px] transition-all duration-700">
            <div className="flex items-center gap-2 mb-4">
              {/* Categoría si existe */}
              {(product as any).category && (
                  <span className="text-xs px-3 py-1 rounded-full bg-[#2A2A2C] text-[#B9B2A6]">
                    {(product as any).category}
                  </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-[#F4F2EE] mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-[#D7A04D]">{formatPrice(product.price)}</span>
              {product.stock < 10 && (
                <span className="text-orange-500 text-sm">
                  ¡Solo {product.stock} disponibles!
                </span>
              )}
            </div>

            <p className="text-[#B9B2A6] mb-8 leading-relaxed whitespace-pre-wrap">
              {product.description || 'Sin descripción disponible.'}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[#F4F2EE] font-medium">Cantidad:</span>
              <div className="flex items-center gap-3 bg-[#141416] border border-[#2A2A2C] rounded-lg p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-[#2A2A2C] rounded text-[#F4F2EE] hover:bg-[#D7A04D] hover:text-[#0B0B0C] transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="text-[#F4F2EE] w-8 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center bg-[#2A2A2C] rounded text-[#F4F2EE] hover:bg-[#D7A04D] hover:text-[#0B0B0C] transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 btn-gold flex items-center justify-center gap-2 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={20} />
                {product.stock === 0 ? 'Sin Stock' : 'Añadir al carrito'}
              </button>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-4 p-6 bg-[#141416] rounded-xl">
              <div className="flex items-center gap-3">
                <Truck className="text-[#D7A04D]" size={20} />
                <span className="text-[#B9B2A6] text-sm">Envío rápido</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="text-[#D7A04D]" size={20} />
                <span className="text-[#B9B2A6] text-sm">Garantía</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-[#D7A04D]" size={20} />
                <span className="text-[#B9B2A6] text-sm">Original</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .animate-visible {
          opacity: 1 !important;
          transform: translate(0, 0) !important;
        }
      `}</style>
    </div>
  );
}