import { useState, useEffect } from 'react';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/Header';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';
import { Hero } from '@/sections/Hero';
import { FeaturedProducts } from '@/sections/FeaturedProducts';
import { Categories } from '@/sections/Categories';
import { AboutSection } from '@/sections/About';
import { Testimonials } from '@/sections/Testimonials';
import { Catalog } from '@/pages/Catalog';
import { ProductDetail } from '@/pages/ProductDetail';
import { Checkout } from '@/pages/Checkout';
import { Admin } from '@/pages/Admin';
import { Contact } from '@/pages/Contact';

// Modificamos la interfaz de navegación para aceptar un filtro opcional
type NavigateFunction = (page: string, initialFilter?: string) => void;

function HomePage({ onNavigate }: { onNavigate: NavigateFunction }) {
  return (
    <>
      <Hero onNavigate={onNavigate} />
      <FeaturedProducts onNavigate={onNavigate} />
      <Categories onNavigate={onNavigate} />
      <AboutSection />
      <Testimonials />
    </>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [productId, setProductId] = useState<string | null>(null);
  // Nuevo estado para guardar el filtro inicial del catálogo
  const [catalogFilter, setCatalogFilter] = useState<string>('all');

  // Handle navigation
  const handleNavigate = (page: string, initialFilter?: string) => {
    if (page.startsWith('product-')) {
      setProductId(page.replace('product-', ''));
      setCurrentPage('product');
    } else {
      // Si vamos al catálogo y traemos un filtro, lo guardamos
      if (page === 'catalog' && initialFilter) {
        setCatalogFilter(initialFilter);
      } else if (page === 'catalog' && !initialFilter) {
         // Si vamos al catálogo sin filtro específico, reseteamos a 'all'
         setCatalogFilter('all');
      }
      setCurrentPage(page);
      setProductId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'catalog':
        // Pasamos el filtro inicial al Catálogo
        return <Catalog onNavigate={handleNavigate} initialFilter={catalogFilter} />;
      case 'product':
        return productId ? <ProductDetail productId={productId} onNavigate={handleNavigate} /> : <Catalog onNavigate={handleNavigate} initialFilter={catalogFilter} />;
      case 'checkout':
        return <Checkout onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'contact':
        return <Contact />;
      case 'admin':
        return <Admin onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-[#0B0B0C]">
        {/* Grain Overlay */}
        <div className="grain-overlay" />
        
        {/* Header */}
        {currentPage !== 'admin' && (
          <Header onNavigate={handleNavigate} currentPage={currentPage} />
        )}
        
        {/* Cart Drawer */}
        <CartDrawer onNavigate={handleNavigate} />
        
        {/* Main Content */}
        <main>
          {renderPage()}
        </main>
        
        {/* Footer */}
        {currentPage !== 'admin' && currentPage !== 'checkout' && (
          <Footer onNavigate={handleNavigate} />
        )}
      </div>
    </CartProvider>
  );
}

// About Page Component
function AboutPage({ onNavigate }: { onNavigate: NavigateFunction }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0C] pt-24 pb-16">
      <div className="section-padding max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#F4F2EE] mb-8 text-center">
          Sobre <span className="gold-text">Aromas</span>
        </h1>
        
        <div className="space-y-8 text-[#B9B2A6] leading-relaxed">
          <p className="text-lg">
            Aromas nace de la pasión por las fragancias y el deseo de compartir lo mejor 
            del mundo de los perfumes con Chile. Seleccionamos cuidadosamente cada producto 
            de nuestra colección, asegurando que solo los mejores aromas lleguen a tus manos.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-8 my-12">
            <div className="p-6 bg-[#141416] border border-[#2A2A2C] rounded-xl">
              <h3 className="text-[#F4F2EE] font-semibold text-xl mb-3">Nuestra Misión</h3>
              <p>
                Hacer accesibles las mejores fragancias del mundo, ofreciendo productos 
                100% originales con un servicio excepcional.
              </p>
            </div>
            <div className="p-6 bg-[#141416] border border-[#2A2A2C] rounded-xl">
              <h3 className="text-[#F4F2EE] font-semibold text-xl mb-3">Nuestra Visión</h3>
              <p>
                Ser la tienda de referencia en Chile para los amantes de los perfumes, 
                reconocidos por nuestra calidad y autenticidad.
              </p>
            </div>
          </div>
          
          <p>
            Trabajamos directamente con distribuidores oficiales de las marcas más 
            prestigiosas del mundo: Victoria's Secret, Lattafa, Paris Hilton, DKNY, 
            Shakira, Jennifer Lopez y muchas más.
          </p>
          
          <p>
            Cada fragancia en nuestra colección ha sido seleccionada pensando en 
            diferentes personalidades y ocasiones. Desde aromas florales y dulces 
            hasta notas amaderadas y frescas, tenemos el perfume perfecto para ti.
          </p>
          
          <div className="text-center mt-12">
            <button onClick={() => onNavigate('catalog')} className="btn-gold">
              Explorar Colección
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;