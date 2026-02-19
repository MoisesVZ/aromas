import { useEffect, useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onNavigate: (page: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = contentRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/perfumes.jpeg"
          alt="Luxury perfume background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0C] via-[#0B0B0C]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-transparent to-[#0B0B0C]/30" />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 section-padding w-full max-w-7xl mx-auto pt-20"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#D7A04D]/10 border border-[#D7A04D]/30 rounded-full text-[#D7A04D] text-sm tracking-wider">
                <Sparkles size={16} />
                EDICIÓN 2026
              </span>
            </div>

            <h1 className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100">
              <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#F4F2EE] leading-tight">
                EL ECO
              </span>
              <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold gold-text leading-tight">
                DE TU PIEL
              </span>
            </h1>

            <p className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200 text-lg text-[#B9B2A6] max-w-lg">
              Fragancias que se convierten en identidad. Descubre nuestra colección 
              exclusiva de perfumes seleccionados para los amantes de lo extraordinario.
            </p>

            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-300 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('catalog')}
                className="btn-gold flex items-center gap-2"
              >
                Descubrir la colección
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="btn-outline-gold"
              >
                Conócenos
              </button>
            </div>

            {/* Stats */}
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-400 grid grid-cols-3 gap-8 pt-8 border-t border-[#2A2A2C]">
              <div>
                <span className="block text-3xl font-bold text-[#D7A04D]">21+</span>
                <span className="text-sm text-[#B9B2A6]">Fragancias</span>
              </div>
              <div>
                <span className="block text-3xl font-bold text-[#D7A04D]">100%</span>
                <span className="text-sm text-[#B9B2A6]">Originales</span>
              </div>
              <div>
                <span className="block text-3xl font-bold text-[#D7A04D]">4.9</span>
                <span className="text-sm text-[#B9B2A6]">Rating</span>
              </div>
            </div>
          </div>

          {/* Right - Featured Product (Lattafa) */}
          <div className="hidden lg:block animate-on-scroll opacity-0 scale-95 transition-all duration-1000 delay-300">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-radial from-[#D7A04D]/20 to-transparent rounded-full blur-3xl" />
              {/* CAMBIO: Ruta de imagen actualizada a lattafa.jpeg */}
              <img
                src="/images/lattafa.jpeg"
                alt="Lattafa Exclusive"
                className="relative z-10 w-full max-w-md mx-auto drop-shadow-2xl rounded-2xl"
              />
              {/* Floating Badge */}
              <div className="absolute top-10 right-10 bg-[#D7A04D] text-[#0B0B0C] px-4 py-2 rounded-full font-semibold text-sm animate-bounce">
                Nuevo
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-[#D7A04D]/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-[#D7A04D] rounded-full animate-pulse" />
        </div>
      </div>

      <style>{`
        .animate-visible {
          opacity: 1 !important;
          transform: translateY(0) scale(1) !important;
        }
      `}</style>
    </section>
  );
}