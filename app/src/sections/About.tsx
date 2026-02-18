import { useEffect, useRef } from 'react';
import { Leaf, Droplets, Heart, Award, Truck, Shield } from 'lucide-react';

export function AboutSection() {
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

  const features = [
    {
      icon: Leaf,
      title: '100% Originales',
      description: 'Todos nuestros productos son auténticos y verificados.'
    },
    {
      icon: Droplets,
      title: 'Alta Concentración',
      description: 'Fragancias con mayor duración y proyección.'
    },
    {
      icon: Heart,
      title: 'Selección Curada',
      description: 'Solo los mejores perfumes de marcas reconocidas.'
    },
    {
      icon: Award,
      title: 'Calidad Premium',
      description: 'Estándares de calidad internacional.'
    },
    {
      icon: Truck,
      title: 'Envío a Todo Chile',
      description: 'Entregamos en todas las regiones del país.'
    },
    {
      icon: Shield,
      title: 'Garantía de Satisfacción',
      description: 'Tu compra está protegida con nosotros.'
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-[#0B0B0C]">
      <div className="section-padding max-w-7xl mx-auto">
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Image */}
          <div className="animate-on-scroll opacity-0 translate-x-[-50px] transition-all duration-1000 relative">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800&q=80"
                alt="Perfume craftsmanship"
                className="rounded-xl w-full"
              />
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#D7A04D]/10 rounded-xl -z-10" />
              <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-[#D7A04D]/30 rounded-xl -z-10" />
            </div>
          </div>

          {/* Text */}
          <div className="animate-on-scroll opacity-0 translate-x-[50px] transition-all duration-1000">
            <span className="text-[#D7A04D] text-sm tracking-wider mb-3 block">
              NUESTRA ESENCIA
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#F4F2EE] mb-6">
              Pureza que se <span className="gold-text">siente</span>
            </h2>
            <p className="text-[#B9B2A6] text-lg mb-6 leading-relaxed">
              En Aromas creemos que una fragancia es más que un aroma: es una extensión 
              de tu personalidad, tu firma invisible en cada habitación que entras.
            </p>
            <p className="text-[#B9B2A6] mb-8 leading-relaxed">
              Seleccionamos cuidadosamente cada perfume de nuestra colección, 
              asegurando que solo los mejores productos lleguen a tus manos. 
              Trabajamos con marcas reconocidas mundialmente para ofrecerte 
              autenticidad garantizada.
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#141416] border border-[#2A2A2C] rounded-full text-[#F4F2EE] text-sm">
                <Leaf size={16} className="text-[#D7A04D]" />
                100% Originales
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#141416] border border-[#2A2A2C] rounded-full text-[#F4F2EE] text-sm">
                <Heart size={16} className="text-[#D7A04D]" />
                Selección Premium
              </span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 p-6 bg-[#141416] border border-[#2A2A2C] rounded-xl hover:border-[#D7A04D]/50 transition-colors group"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 bg-[#D7A04D]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#D7A04D]/20 transition-colors">
                <feature.icon className="text-[#D7A04D]" size={24} />
              </div>
              <h3 className="text-[#F4F2EE] font-semibold mb-2">{feature.title}</h3>
              <p className="text-[#B9B2A6] text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .animate-visible {
          opacity: 1 !important;
          transform: translate(0, 0) !important;
        }
      `}</style>
    </section>
  );
}
