import { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Send, Instagram, Clock, Check } from 'lucide-react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'contacto@aromas.cl',
      link: 'mailto:contacto@aromas.cl'
    },
    {
      icon: Phone,
      title: 'Teléfono',
      content: '+56 9 XXXX XXXX',
      link: 'tel:+569XXXXXXXX'
    },
    {
      icon: MapPin,
      title: 'Ubicación',
      content: 'Chile - Envíos a todo el país',
      link: null
    },
    {
      icon: Clock,
      title: 'Horario',
      content: 'Lun - Vie: 9:00 - 18:00',
      link: null
    }
  ];

  return (
    <div ref={sectionRef} className="min-h-screen bg-[#0B0B0C] pt-24 pb-16">
      <div className="section-padding max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 inline-block text-[#D7A04D] text-sm tracking-wider mb-3">
            ESTAMOS AQUÍ PARA AYUDARTE
          </span>
          <h1 className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100 text-4xl sm:text-5xl font-bold text-[#F4F2EE] mb-4">
            Contáctanos
          </h1>
          <p className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200 text-[#B9B2A6] max-w-2xl mx-auto">
            ¿Tienes alguna pregunta sobre nuestros productos o necesitas ayuda con tu pedido? 
            Estamos aquí para ayudarte.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((info, index) => (
              <div
                key={info.title}
                className="animate-on-scroll opacity-0 translate-x-[-30px] transition-all duration-700 p-6 bg-[#141416] border border-[#2A2A2C] rounded-xl hover:border-[#D7A04D]/30 transition-colors"
                style={{ transitionDelay: `${(index + 3) * 100}ms` }}
              >
                <div className="w-12 h-12 bg-[#D7A04D]/20 rounded-lg flex items-center justify-center mb-4">
                  <info.icon className="text-[#D7A04D]" size={24} />
                </div>
                <h3 className="text-[#F4F2EE] font-semibold mb-1">{info.title}</h3>
                {info.link ? (
                  <a
                    href={info.link}
                    className="text-[#B9B2A6] hover:text-[#D7A04D] transition-colors"
                  >
                    {info.content}
                  </a>
                ) : (
                  <p className="text-[#B9B2A6]">{info.content}</p>
                )}
              </div>
            ))}

            {/* Social */}
            <div className="animate-on-scroll opacity-0 translate-x-[-30px] transition-all duration-700 delay-700 p-6 bg-[#141416] border border-[#2A2A2C] rounded-xl">
              <h3 className="text-[#F4F2EE] font-semibold mb-4">Síguenos</h3>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-4 py-3 bg-[#0B0B0C] border border-[#2A2A2C] rounded-lg text-[#B9B2A6] hover:text-[#D7A04D] hover:border-[#D7A04D]/50 transition-colors"
              >
                <Instagram size={20} />
                @aromas.cl
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="animate-on-scroll opacity-0 translate-x-[30px] transition-all duration-700 delay-300 p-8 bg-[#141416] border border-[#2A2A2C] rounded-xl">
              <h2 className="text-2xl font-bold text-[#F4F2EE] mb-6">Envíanos un mensaje</h2>
              
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-[#D7A04D]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="text-[#D7A04D]" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#F4F2EE] mb-2">¡Mensaje enviado!</h3>
                  <p className="text-[#B9B2A6]">Te responderemos lo antes posible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[#B9B2A6] text-sm mb-2">Nombre *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-dark w-full"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label className="block text-[#B9B2A6] text-sm mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input-dark w-full"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#B9B2A6] text-sm mb-2">Asunto *</label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="input-dark w-full"
                    >
                      <option value="">Selecciona un asunto</option>
                      <option value="consulta">Consulta general</option>
                      <option value="pedido">Estado de mi pedido</option>
                      <option value="producto">Información de producto</option>
                      <option value="envio">Envíos</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#B9B2A6] text-sm mb-2">Mensaje *</label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="input-dark w-full h-32 resize-none"
                      placeholder="Escribe tu mensaje..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full btn-gold flex items-center justify-center gap-2 py-4"
                  >
                    <Send size={18} />
                    Enviar mensaje
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 text-2xl font-bold text-[#F4F2EE] text-center mb-8">
            Preguntas <span className="gold-text">Frecuentes</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                q: '¿Los productos son originales?',
                a: 'Sí, todos nuestros productos son 100% originales y auténticos. Trabajamos directamente con distribuidores oficiales.'
              },
              {
                q: '¿Cuánto tarda el envío?',
                a: 'El envío dentro de Santiago toma 1-2 días hábiles. A regiones, 3-5 días hábiles dependiendo de la ubicación.'
              },
              {
                q: '¿Hacen envíos a todo Chile?',
                a: 'Sí, realizamos envíos a todas las regiones de Chile a través de Starken y Chilexpress.'
              },
              {
                q: '¿Puedo cambiar mi pedido?',
                a: 'Una vez realizado el pago, el pedido no puede ser modificado. Contactanos lo antes posible si necesitas ayuda.'
              },
              {
                q: '¿Tienen tienda física?',
                a: 'Actualmente operamos solo de forma online, lo que nos permite ofrecer mejores precios.'
              },
              {
                q: '¿Cómo puedo pagar?',
                a: 'Aceptamos transferencia bancaria. Una vez confirmado el pago, procesamos tu envío en 24-48 horas.'
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 p-6 bg-[#141416] border border-[#2A2A2C] rounded-xl"
                style={{ transitionDelay: `${(index + 5) * 100}ms` }}
              >
                <h3 className="text-[#F4F2EE] font-semibold mb-3">{faq.q}</h3>
                <p className="text-[#B9B2A6] text-sm">{faq.a}</p>
              </div>
            ))}
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
