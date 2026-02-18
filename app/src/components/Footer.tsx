import { Instagram, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const quickLinks = [
    { label: 'Colección', page: 'catalog' },
    { label: 'Nosotros', page: 'about' },
    { label: 'Contacto', page: 'contact' },
    { label: 'Envíos', page: 'shipping' },
  ];

  const categories = [
    { label: 'Para Ella', filter: 'Mujer' },
    { label: 'Para Él', filter: 'Hombre' },
    { label: 'Unisex', filter: 'Unisex' },
    { label: 'Novedades', filter: 'new' },
  ];

  return (
    <footer className="bg-[#0B0B0C] border-t border-[#2A2A2C]">
      {/* Newsletter */}
      <div className="section-padding py-16 border-b border-[#2A2A2C]">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl sm:text-4xl font-bold text-[#F4F2EE] mb-4">
            Únete al club <span className="gold-text">Aromas</span>
          </h3>
          <p className="text-[#B9B2A6] mb-8 max-w-lg mx-auto">
            Lanzamientos exclusivos, descuentos especiales y tips sobre fragancias 
            directo a tu correo.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu correo electrónico"
                className="input-dark w-full pl-12"
                required
              />
            </div>
            <button type="submit" className="btn-gold flex items-center justify-center gap-2">
              {subscribed ? '¡Suscrito!' : 'Suscribirme'}
              <Send size={16} />
            </button>
          </form>
          <p className="text-[#666] text-xs mt-4">
            Puedes darte de baja en cualquier momento. Respetamos tu privacidad.
          </p>
        </div>
      </div>

      {/* Main Footer */}
      <div className="section-padding py-16">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-[#F4F2EE] mb-4">AROMAS</h2>
            <p className="text-[#B9B2A6] text-sm mb-6">
              El eco de tu piel. Fragancias premium seleccionadas para los amantes de lo extraordinario.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#141416] border border-[#2A2A2C] rounded-full flex items-center justify-center text-[#B9B2A6] hover:text-[#D7A04D] hover:border-[#D7A04D] transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="mailto:contacto@aromas.cl"
                className="w-10 h-10 bg-[#141416] border border-[#2A2A2C] rounded-full flex items-center justify-center text-[#B9B2A6] hover:text-[#D7A04D] hover:border-[#D7A04D] transition-colors"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#F4F2EE] font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => onNavigate(link.page)}
                    className="text-[#B9B2A6] hover:text-[#D7A04D] transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[#F4F2EE] font-semibold mb-4">Categorías</h4>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.filter}>
                  <button
                    onClick={() => onNavigate('catalog')}
                    className="text-[#B9B2A6] hover:text-[#D7A04D] transition-colors text-sm"
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#F4F2EE] font-semibold mb-4">Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#D7A04D] mt-0.5" />
                <span className="text-[#B9B2A6] text-sm">
                  Chile<br />
                  Envíos a todo el país
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#D7A04D]" />
                <span className="text-[#B9B2A6] text-sm">+56 9 XXXX XXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#D7A04D]" />
                <span className="text-[#B9B2A6] text-sm">contacto@aromas.cl</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="section-padding py-6 border-t border-[#2A2A2C]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#666] text-sm">
            © 2026 Aromas. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <button className="text-[#666] hover:text-[#B9B2A6] text-sm transition-colors">
              Términos y Condiciones
            </button>
            <button className="text-[#666] hover:text-[#B9B2A6] text-sm transition-colors">
              Política de Privacidad
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
