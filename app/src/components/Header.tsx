import { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Search, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Inicio', page: 'home' },
    { label: 'Colección', page: 'catalog' },
    { label: 'Nosotros', page: 'about' },
    { label: 'Contacto', page: 'contact' },
  ];

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#0B0B0C]/95 backdrop-blur-md border-b border-[#2A2A2C]/50'
            : 'bg-transparent'
        }`}
      >
        <div className="section-padding">
          {/* MODIFICACIÓN: Aumenté un poco la altura del contenedor del header en desktop (lg:h-24) para dar espacio al logo más grande */}
          <div className="flex items-center justify-between h-16 lg:h-24">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#F4F2EE] hover:text-[#D7A04D] transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <button
              onClick={() => handleNavClick('home')}
              // Quitamos gap-2 porque ya no hay texto
              className="flex items-center"
            >
              {/* CAMBIO IMPORTANTE AQUÍ EN EL CLASSNAME */}
              <img 
                src="/images/aromaslogo.png" 
                alt="Aromas Logo" 
                // Usamos 'w-' (width) para controlar el ancho.
                // w-32 en móvil, lg:w-56 en escritorio. h-auto mantiene la proporción.
                className="w-32 lg:w-56 h-auto object-contain" 
              />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => handleNavClick(link.page)}
                  className={`text-sm tracking-wide transition-colors relative ${
                    currentPage === link.page
                      ? 'text-[#D7A04D]'
                      : 'text-[#F4F2EE] hover:text-[#D7A04D]'
                  }`}
                >
                  {link.label}
                  {currentPage === link.page && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#D7A04D]" />
                  )}
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 lg:gap-4">
              <button 
                onClick={() => handleNavClick('admin')}
                className="hidden lg:flex p-2 text-[#F4F2EE] hover:text-[#D7A04D] transition-colors"
              >
                <User size={20} />
              </button>
              <button 
                className="hidden lg:flex p-2 text-[#F4F2EE] hover:text-[#D7A04D] transition-colors"
              >
                <Search size={20} />
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-[#F4F2EE] hover:text-[#D7A04D] transition-colors"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D7A04D] text-[#0B0B0C] text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <nav
          className={`absolute top-16 left-0 right-0 bg-[#0B0B0C] border-b border-[#2A2A2C] p-6 transition-transform duration-500 ${
            isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNavClick(link.page)}
                className={`text-left text-lg py-2 transition-colors ${
                  currentPage === link.page
                    ? 'text-[#D7A04D]'
                    : 'text-[#F4F2EE] hover:text-[#D7A04D]'
                }`}
              >
                {link.label}
              </button>
            ))}
            <hr className="border-[#2A2A2C] my-2" />
            <button
              onClick={() => handleNavClick('admin')}
              className="text-left text-lg py-2 text-[#F4F2EE] hover:text-[#D7A04D] transition-colors"
            >
              Panel Admin
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}