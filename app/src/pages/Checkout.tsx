import { useState, useEffect } from 'react';
import { ArrowLeft, Check, Copy, CreditCard, Truck, User, MapPin, Mail, Phone, Package, Send } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { Order } from '@/types';

interface CheckoutProps {
  onNavigate: (page: string) => void;
}

export function Checkout({ onNavigate }: CheckoutProps) {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [copied, setCopied] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: '',
    notes: ''
  });

  // Generar ID de orden al montar el componente
  useEffect(() => {
    setOrderId(`ORD-${Date.now()}`);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Lógica de costo de envío dinámico
  const calculateShipping = () => {
    // Si la compra es mayor a 50.000, envío gratis (opcional, puedes quitarlo si quieres cobrar siempre)
    if (totalPrice >= 50000) return 0;
    
    // Si no ha seleccionado región, no cobramos aún (o cobramos el base)
    if (!formData.region) return 0;

    const region = formData.region;
    
    if (region === 'Metropolitana') {
      return 3990;
    } else if (
      region === 'Arica y Parinacota' || 
      region === 'Tarapacá' || 
      region === 'Antofagasta' ||
      region === 'Aysén' ||
      region === 'Magallanes'
    ) {
      return 6990; // Extremo Norte / Sur
    } else {
      return 4990; // Resto (Centro / Sur)
    }
  };

  const shippingCost = calculateShipping();
  const finalTotal = totalPrice + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('12345678');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = () => {
    const order: Order = {
      id: orderId,
      items: items.map(item => ({
        ...item,
        image: item.image_url || '', 
      })),
      total: finalTotal,
      customer: { ...formData },
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    const existingOrders = JSON.parse(localStorage.getItem('aromas_orders') || '[]');
    localStorage.setItem('aromas_orders', JSON.stringify([order, ...existingOrders]));
    
    clearCart();
    setStep('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Función para abrir WhatsApp
  const handleWhatsApp = () => {
    // REEMPLAZA ESTE NÚMERO CON TU WHATSAPP REAL (con código de país, ej: 56912345678)
    const phoneNumber = "56948031063"; 
    const message = `¡Hola Aromas! 👋%0A%0AAcabo de realizar el pedido *${orderId}* por un total de *${formatPrice(finalTotal)}*.%0A%0AAdjunto mi comprobante de transferencia.`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  // --- ESTADO VACÍO ---
  if (items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-[#0B0B0C] pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <Package size={64} className="mx-auto text-[#2A2A2C] mb-4" />
          <h2 className="text-2xl font-bold text-[#F4F2EE] mb-4">Tu carrito está vacío</h2>
          <p className="text-[#B9B2A6] mb-6">Agrega productos para continuar con tu compra</p>
          <button onClick={() => onNavigate('catalog')} className="btn-gold">
            Ver catálogo
          </button>
        </div>
      </div>
    );
  }

  // --- ESTADO ÉXITO ---
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-[#0B0B0C] pt-24 pb-16">
        <div className="section-padding max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-[#D7A04D]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="text-[#D7A04D]" size={40} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F4F2EE] mb-4">
            ¡Pedido recibido!
          </h1>
          <p className="text-[#B9B2A6] mb-8">
            Para finalizar tu compra, necesitamos validar tu transferencia. 
            Por favor, envíanos el comprobante haciendo clic en el botón de abajo.
          </p>
          
          <div className="p-6 bg-[#141416] border border-[#2A2A2C] rounded-xl mb-8 space-y-4">
            <div>
                <p className="text-[#B9B2A6] text-sm mb-1">Número de pedido</p>
                <p className="text-[#F4F2EE] font-mono text-lg">{orderId}</p>
            </div>
            <div className="pt-4 border-t border-[#2A2A2C]">
                <p className="text-[#B9B2A6] text-sm mb-1">Total a transferir</p>
                <p className="text-[#D7A04D] font-bold text-2xl">{formatPrice(finalTotal)}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 max-w-md mx-auto mb-8">
            <button 
                onClick={handleWhatsApp} 
                className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Send size={20} />
              Enviar comprobante por WhatsApp
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t border-[#2A2A2C]">
            <button onClick={() => onNavigate('catalog')} className="text-[#D7A04D] hover:text-[#F4F2EE] transition-colors">
              Seguir comprando
            </button>
            <span className="hidden sm:block text-[#2A2A2C]">|</span>
            <button onClick={() => onNavigate('home')} className="text-[#B9B2A6] hover:text-[#F4F2EE] transition-colors">
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- ESTADO PAGO ---
  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-[#0B0B0C] pt-24 pb-16">
        <div className="section-padding max-w-3xl mx-auto">
          <button
            onClick={() => setStep('form')}
            className="inline-flex items-center gap-2 text-[#B9B2A6] hover:text-[#D7A04D] mb-8"
          >
            <ArrowLeft size={18} />
            Volver
          </button>

          <h1 className="text-3xl font-bold text-[#F4F2EE] mb-8">
            Transferencia <span className="gold-text">Bancaria</span>
          </h1>

          <div className="space-y-6">
            {/* Order Summary */}
            <div className="p-6 bg-[#141416] border border-[#2A2A2C] rounded-xl">
              <h2 className="text-lg font-semibold text-[#F4F2EE] mb-4">Resumen del pedido</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-[#B9B2A6]">{item.name} x{item.quantity}</span>
                    <span className="text-[#F4F2EE]">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#2A2A2C] pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#B9B2A6]">Subtotal</span>
                  <span className="text-[#F4F2EE]">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#B9B2A6]">Envío ({formData.region})</span>
                  <span className={shippingCost === 0 ? 'text-green-500' : 'text-[#F4F2EE]'}>
                    {shippingCost === 0 ? 'GRATIS' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-[#F4F2EE]">Total</span>
                  <span className="text-[#D7A04D]">{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="p-6 bg-[#141416] border border-[#2A2A2C] rounded-xl">
              <h2 className="text-lg font-semibold text-[#F4F2EE] mb-4 flex items-center gap-2">
                <CreditCard className="text-[#D7A04D]" size={20} />
                Datos para transferencia
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-[#0B0B0C] rounded-lg">
                  <p className="text-[#B9B2A6] text-sm mb-1">Banco</p>
                  <p className="text-[#F4F2EE] font-medium">Banco de Chile</p>
                </div>
                <div className="p-4 bg-[#0B0B0C] rounded-lg">
                  <p className="text-[#B9B2A6] text-sm mb-1">Tipo de cuenta</p>
                  <p className="text-[#F4F2EE] font-medium">Cuenta Corriente</p>
                </div>
                <div className="p-4 bg-[#0B0B0C] rounded-lg">
                  <p className="text-[#B9B2A6] text-sm mb-1">Número de cuenta</p>
                  <div className="flex items-center justify-between">
                    <p className="text-[#F4F2EE] font-mono text-lg">12345678</p>
                    <button
                      onClick={handleCopyAccount}
                      className="flex items-center gap-2 px-3 py-1 bg-[#D7A04D]/20 text-[#D7A04D] rounded-lg text-sm hover:bg-[#D7A04D]/30 transition-colors"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? 'Copiado' : 'Copiar'}
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-[#0B0B0C] rounded-lg">
                  <p className="text-[#B9B2A6] text-sm mb-1">Titular</p>
                  <p className="text-[#F4F2EE] font-medium">Aromas SPA</p>
                </div>
                <div className="p-4 bg-[#0B0B0C] rounded-lg">
                  <p className="text-[#B9B2A6] text-sm mb-1">RUT</p>
                  <p className="text-[#F4F2EE] font-medium">76.XXX.XXX-X</p>
                </div>
                <div className="p-4 bg-[#D7A04D]/10 border border-[#D7A04D]/30 rounded-lg">
                  <p className="text-[#D7A04D] text-sm">
                    <strong>Importante:</strong> Usa tu nombre como referencia: "{formData.name}"
                  </p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="p-6 bg-[#141416] border border-[#2A2A2C] rounded-xl">
              <h2 className="text-lg font-semibold text-[#F4F2EE] mb-4">Instrucciones</h2>
              <ol className="space-y-3 text-[#B9B2A6] text-sm list-decimal list-inside">
                <li>Realiza la transferencia por el monto total indicado.</li>
                <li>Toma una foto o screenshot del comprobante.</li>
                <li>Haz clic en "Confirmar pedido" para generar tu orden.</li>
                <li>En la siguiente pantalla, envía el comprobante por WhatsApp.</li>
              </ol>
            </div>

            <button
              onClick={handleConfirmPayment}
              className="w-full btn-gold py-4 text-lg"
            >
              Confirmar pedido y Enviar Comprobante
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- ESTADO FORMULARIO ---
  return (
    <div className="min-h-screen bg-[#0B0B0C] pt-24 pb-16">
      <div className="section-padding max-w-6xl mx-auto">
        <button
          onClick={() => onNavigate('catalog')}
          className="inline-flex items-center gap-2 text-[#B9B2A6] hover:text-[#D7A04D] mb-8"
        >
          <ArrowLeft size={18} />
          Volver al catálogo
        </button>

        <h1 className="text-3xl font-bold text-[#F4F2EE] mb-8">
          Finalizar <span className="gold-text">Compra</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="p-6 bg-[#141416] border border-[#2A2A2C] rounded-xl">
                <h2 className="text-lg font-semibold text-[#F4F2EE] mb-6 flex items-center gap-2">
                  <User className="text-[#D7A04D]" size={20} />
                  Datos personales
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[#B9B2A6] text-sm mb-2">Nombre completo *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-dark w-full"
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div>
                    <label className="block text-[#B9B2A6] text-sm mb-2">Correo electrónico *</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]" size={18} />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input-dark w-full pl-12"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#B9B2A6] text-sm mb-2">Teléfono *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]" size={18} />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="input-dark w-full pl-12"
                        placeholder="+56 9 XXXX XXXX"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="p-6 bg-[#141416] border border-[#2A2A2C] rounded-xl">
                <h2 className="text-lg font-semibold text-[#F4F2EE] mb-6 flex items-center gap-2">
                  <MapPin className="text-[#D7A04D]" size={20} />
                  Dirección de envío
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#B9B2A6] text-sm mb-2">Dirección *</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="input-dark w-full"
                      placeholder="Av. Principal 123, Depto 45"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#B9B2A6] text-sm mb-2">Ciudad *</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="input-dark w-full"
                        placeholder="Santiago"
                      />
                    </div>
                    <div>
                      <label className="block text-[#B9B2A6] text-sm mb-2">Región *</label>
                      <select
                        required
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        className="input-dark w-full"
                      >
                        <option value="">Selecciona una región</option>
                        <option value="Arica y Parinacota">Arica y Parinacota</option>
                        <option value="Tarapacá">Tarapacá</option>
                        <option value="Antofagasta">Antofagasta</option>
                        <option value="Atacama">Atacama</option>
                        <option value="Coquimbo">Coquimbo</option>
                        <option value="Valparaíso">Valparaíso</option>
                        <option value="Metropolitana">Metropolitana de Santiago</option>
                        <option value="O'Higgins">O'Higgins</option>
                        <option value="Maule">Maule</option>
                        <option value="Ñuble">Ñuble</option>
                        <option value="Biobío">Biobío</option>
                        <option value="Araucanía">Araucanía</option>
                        <option value="Los Ríos">Los Ríos</option>
                        <option value="Los Lagos">Los Lagos</option>
                        <option value="Aysén">Aysén</option>
                        <option value="Magallanes">Magallanes</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#B9B2A6] text-sm mb-2">Notas adicionales (opcional)</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="input-dark w-full h-24 resize-none"
                      placeholder="Instrucciones especiales de entrega..."
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full btn-gold py-4 text-lg">
                Continuar al pago
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 bg-[#141416] border border-[#2A2A2C] rounded-xl">
              <h2 className="text-lg font-semibold text-[#F4F2EE] mb-6">Resumen</h2>
              
              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image_url || 'https://via.placeholder.com/80'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="text-[#F4F2EE] text-sm font-medium line-clamp-1">{item.name}</p>
                      <p className="text-[#B9B2A6] text-xs">x{item.quantity}</p>
                    </div>
                    <span className="text-[#F4F2EE] text-sm">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#2A2A2C] pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#B9B2A6]">Subtotal</span>
                  <span className="text-[#F4F2EE]">{formatPrice(totalPrice)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-[#B9B2A6]">Envío {formData.region ? `(${formData.region})` : ''}</span>
                  <span className={shippingCost === 0 ? 'text-green-500 font-medium' : 'text-[#F4F2EE]'}>
                    {formData.region === '' 
                      ? 'Calculado en siguiente paso' 
                      : (shippingCost === 0 ? 'GRATIS' : formatPrice(shippingCost))}
                  </span>
                </div>
                
                {shippingCost === 0 && totalPrice >= 50000 && (
                  <p className="text-green-500 text-xs">¡Envío gratis en compras sobre $50.000!</p>
                )}
                
                <div className="border-t border-[#2A2A2C] pt-3 flex justify-between items-center">
                  <span className="text-[#F4F2EE] font-semibold">Total</span>
                  <span className="text-[#D7A04D] font-bold text-xl">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-[#B9B2A6] text-sm">
                  <Truck size={16} className="text-[#D7A04D]" />
                  Envío a todo Chile
                </div>
                <div className="flex items-center gap-2 text-[#B9B2A6] text-sm">
                  <Check size={16} className="text-[#D7A04D]" />
                  Productos 100% originales
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #141416;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2A2A2C;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D7A04D;
        }
      `}</style>
    </div>
  );
}