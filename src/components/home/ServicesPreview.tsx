import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ModernButton from "@/components/ui/ModernButton";
import { Code2, Lightbulb, Palette, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const services = [
  {
    icon: Code2,
    title: "Product Development",
    description: "We build scalable, modern digital products using cutting-edge technologies. From MVPs to enterprise solutions.",
    color: "bg-cyan-500/20 text-cyan-400",
    features: ["Web & Mobile Apps", "Cloud Architecture", "API Development"],
  },
  {
    icon: Lightbulb,
    title: "Consultancy",
    description: "Strategic technology consulting to help you make informed decisions and drive digital transformation.",
    color: "bg-blue-500/20 text-blue-400",
    features: ["Tech Strategy", "Digital Transformation", "Process Optimization"],
  },
  {
    icon: Palette,
    title: "Design",
    description: "User-centered design that creates memorable experiences and drives engagement.",
    color: "bg-purple-500/20 text-purple-400",
    features: ["UI/UX Design", "Brand Identity", "Design Systems"],
  },
];

export function ServicesPreview() {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0');
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set(prev).add(index));
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      cardRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Circuit Board Pattern - Matching Landing Page */}
      <div className="absolute inset-0 circuit-board-bg opacity-30"></div>

      {/* White Glass Overlay */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <div className="absolute inset-2 md:inset-8 rounded-3xl md:rounded-[2.5rem] bg-white/5 backdrop-blur-sm border border-white/10" />
      </div>

      <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider">What We Do</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mt-4 mb-6">
            Our Core Services
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            We combine technical excellence with strategic thinking to deliver solutions that make a real impact.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <div
              key={service.title}
              ref={(el) => (cardRefs.current[index] = el)}
              data-index={index}
              className={cn(
                "group p-6 sm:p-8 rounded-2xl bg-black/40 backdrop-blur-md border-2 border-cyan-500/50 cursor-pointer transition-all duration-700",
                "hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-cyan-400",
                visibleCards.has(index) 
                  ? "opacity-100 translate-y-0 scale-100" 
                  : "opacity-0 translate-y-12 scale-95",
                index === 0 && visibleCards.has(index) && "animate-fade-up",
                index === 1 && visibleCards.has(index) && "animate-fade-up animation-delay-100",
                index === 2 && visibleCards.has(index) && "animate-fade-up animation-delay-200"
              )}
              style={{ 
                transform: visibleCards.has(index) ? 'scale(1)' : 'scale(0.95)',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >

              <div className={cn("w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-700", 
                service.color,
                visibleCards.has(index) ? "scale-100 rotate-0" : "scale-0 rotate-12"
              )}>
                <service.icon className="w-8 h-8 sm:w-9 sm:h-9" />
              </div>

              <h3 className={cn("text-xl sm:text-2xl font-semibold text-white mb-4 group-hover:text-cyan-400 transition-all duration-700",
                visibleCards.has(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}>
                {service.title}
              </h3>

              <p className={cn("text-base text-gray-300 mb-6 leading-relaxed transition-all duration-700 delay-100",
                visibleCards.has(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}>
                {service.description}
              </p>

              <ul className={cn("space-y-3 mb-6 transition-all duration-700 delay-200",
                visibleCards.has(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}>
                {service.features.map((feature, featureIndex) => (
                  <li 
                    key={feature} 
                    className={cn("flex items-center gap-3 text-sm text-gray-400 transition-all duration-500",
                      visibleCards.has(index) 
                        ? "opacity-100 translate-x-0" 
                        : "opacity-0 -translate-x-4"
                    )}
                    style={{ transitionDelay: visibleCards.has(index) ? `${300 + featureIndex * 100}ms` : '0ms' }}
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to="/services"
                className={cn("inline-flex items-center gap-2 text-base font-medium text-cyan-400 group-hover:gap-3 transition-all duration-700 delay-300",
                  visibleCards.has(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                Learn More
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <ModernButton
            text="View All Services"
            onClick={() => window.location.href = '/services'}
          />
        </div>
      </div>
    </section>
  );
}
