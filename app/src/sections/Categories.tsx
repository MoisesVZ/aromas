import { useEffect, useRef } from 'react';
import { ArrowRight, User, Users, Sparkles } from 'lucide-react';

interface CategoriesProps {
  onNavigate: (page: string) => void;
}

export function Categories({ onNavigate }: CategoriesProps) {
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

  const categories = [
    {
      id: 'mujer',
      title: 'Para Ella',
      subtitle: 'FEMINIDAD',
      description: 'Fragancias florales, dulces y sofisticadas que capturan la esencia femenina.',
      icon: Sparkles,
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
      color: 'from-pink-500/20 to-rose-500/20',
      filter: 'Mujer'
    },
    {
      id: 'hombre',
      title: 'Para Él',
      subtitle: 'MASCULINIDAD',
      description: 'Notas amaderadas, frescas y especiadas que definen el carácter masculino.',
      icon: User,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      color: 'from-blue-500/20 to-cyan-500/20',
      filter: 'Hombre'
    },
    {
      id: 'unisex',
      title: 'Unisex',
      subtitle: 'VERSATILIDAD',
      description: 'Aromas que trascienden géneros, perfectos para quienes crean su propio estilo.',
      icon: Users,
      image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&q=80',
      color: 'from-purple-500/20 to-violet-500/20',
      filter: 'Unisex'
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-[#0B0B0C]">
      <div className="section-padding max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 inline-block text-[#D7A04D] text-sm tracking-wider mb-3">
            EXPLORA POR CATEGORÍA
          </span>
          <h2 className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100 text-4xl sm:text-5xl font-bold text-[#F4F2EE]">
            Encuentra Tu <span className="gold-text">Esencia</span>
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.id}
              onClick={() => onNavigate('catalog')}
              className={`animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 group cursor-pointer relative overflow-hidden rounded-xl`}
              style={{ transitionDelay: `${(index + 2) * 100}ms` }}
            >
              {/* Background Image */}
              <div className="aspect-[4/5] relative overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60`} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-3">
                  <category.icon className="text-[#D7A04D]" size={20} />
                  <span className="text-[#D7A04D] text-sm tracking-wider">{category.subtitle}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#F4F2EE] mb-2">
                  {category.title}
                </h3>
                <p className="text-[#B9B2A6] text-sm mb-4 line-clamp-2">
                  {category.description}
                </p>
                <div className="flex items-center gap-2 text-[#D7A04D] group-hover:gap-4 transition-all">
                  <span className="text-sm font-medium">Explorar</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Hover Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#D7A04D]/50 rounded-xl transition-colors" />
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
