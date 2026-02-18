import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface CartDrawerProps {
  onNavigate: (page: string) => void;
}

export function CartDrawer({ onNavigate }: CartDrawerProps) {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    onNavigate('checkout');
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0B0B0C] border-l border-[#2A2A2C] z-50 flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2A2A2C]">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-[#D7A04D]" size={24} />
            <h2 className="text-xl font-semibold text-[#F4F2EE]">Tu Carrito</h2>
            <span className="text-sm text-[#B9B2A6]">({items.length} items)</span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-[#B9B2A6] hover:text-[#F4F2EE] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={64} className="text-[#2A2A2C] mb-4" />
              <p className="text-[#B9B2A6] text-lg mb-2">Tu carrito está vacío</p>
              <p className="text-[#666] text-sm mb-6">Explora nuestra colección y encuentra tu fragancia perfecta</p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onNavigate('catalog');
                }}
                className="btn-gold"
              >
                Ver Colección
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-[#141416] rounded-lg">
                  <img
                    // CORRECCIÓN AQUÍ: Usamos (item as any).image para evitar el error de TS
                    src={item.image_url || (item as any).image || 'https://via.placeholder.com/150'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-[#F4F2EE] font-medium text-sm">{item.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#666] hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    {/* Categoría */}
                    <p className="text-[#B9B2A6] text-xs mb-2">
                        {(item as any).category || 'Fragancia Exclusiva'}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center bg-[#2A2A2C] rounded text-[#F4F2EE] hover:bg-[#D7A04D] hover:text-[#0B0B0C] transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-[#F4F2EE] w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center bg-[#2A2A2C] rounded text-[#F4F2EE] hover:bg-[#D7A04D] hover:text-[#0B0B0C] transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-[#D7A04D] font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#2A2A2C] space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[#B9B2A6]">Subtotal</span>
              <span className="text-[#F4F2EE] font-semibold">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#B9B2A6]">Envío</span>
              <span className="text-[#D7A04D] text-sm">Calculado en checkout</span>
            </div>
            <hr className="border-[#2A2A2C]" />
            <div className="flex justify-between items-center">
              <span className="text-[#F4F2EE] font-semibold">Total</span>
              <span className="text-2xl font-bold gold-text">{formatPrice(totalPrice)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full btn-gold flex items-center justify-center gap-2"
            >
              Finalizar Compra
              <ArrowRight size={18} />
            </button>
            <button
              onClick={clearCart}
              className="w-full py-2 text-[#666] hover:text-red-500 text-sm transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
}