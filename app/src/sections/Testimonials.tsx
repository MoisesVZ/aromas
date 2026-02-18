import { useEffect, useRef } from 'react';
import { Star, Quote, MessageCircle } from 'lucide-react';

export function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);

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

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const testimonials = [
    {
      name: 'María Fernanda',
      location: 'Santiago',
      rating: 5,
      text: 'Increíble la calidad de los perfumes. Compré el Yara de Lattafa y es exactamente igual que en las fotos. El envío fue súper rápido.',
      avatar: 'MF'
    },
    {
      name: 'Carlos Andrés',
      location: 'Valparaíso',
      rating: 5,
      text: 'Excelente servicio y atención. El Asad Bourbon tiene una duración impresionante. Definitivamente volveré a comprar.',
      avatar: 'CA'
    },
    {
      name: 'Daniela Rojas',
      location: 'Concepción',
      rating: 5,
      text: 'Los productos son 100% originales, lo verifiqué. Me encantó la experiencia de compra, todo muy profesional.',
      avatar: 'DR'
    },
    {
      name: 'Felipe Herrera',
      location: 'La Serena',
      rating: 5,
      text: 'Gran variedad de fragancias a precios competitivos. El envío a regiones funcionó perfecto. Recomendado!',
      avatar: 'FH'
    }
  ];

  const averageRating = 4.9;
  const totalReviews = 127;

  return (
    <section ref={sectionRef} className="py-24 bg-[#0B0B0C]">
      <div className="section-padding max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 inline-flex items-center gap-2 text-[#D7A04D] text-sm tracking-wider mb-3">
            <MessageCircle size={16} />
            TESTIMONIOS
          </span>
          <h2 className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100 text-4xl sm:text-5xl font-bold text-[#F4F2EE] mb-4">
            Lo que dicen nuestros <span className="gold-text">clientes</span>
          </h2>
          
          {/* Rating Summary */}
          <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200 inline-flex items-center gap-4 bg-[#141416] border border-[#2A2A2C] rounded-full px-6 py-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={i < Math.floor(averageRating) ? 'text-[#D7A04D] fill-[#D7A04D]' : 'text-[#2A2A2C]'}
                />
              ))}
            </div>
            <span className="text-[#F4F2EE] font-semibold">{averageRating}/5</span>
            <span className="text-[#B9B2A6] text-sm">({totalReviews} reseñas)</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 p-6 bg-[#141416] border border-[#2A2A2C] rounded-xl hover:border-[#D7A04D]/30 transition-colors relative"
              style={{ transitionDelay: `${(index + 3) * 100}ms` }}
            >
              <Quote className="absolute top-4 right-4 text-[#D7A04D]/20" size={32} />
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={14} className="text-[#D7A04D] fill-[#D7A04D]" />
                ))}
              </div>

              {/* Text */}
              <p className="text-[#B9B2A6] text-sm mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D7A04D]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#D7A04D] text-sm font-semibold">{testimonial.avatar}</span>
                </div>
                <div>
                  <p className="text-[#F4F2EE] font-medium text-sm">{testimonial.name}</p>
                  <p className="text-[#666] text-xs">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-700 mt-16 flex flex-wrap justify-center gap-8">
          {['ENVÍO A TODO CHILE', 'PAGO SEGURO', 'ATENCIÓN PERSONALIZADA', 'GARANTÍA DE AUTENTICIDAD'].map((badge) => (
            <span key={badge} className="text-[#666] text-xs tracking-wider">
              {badge}
            </span>
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
