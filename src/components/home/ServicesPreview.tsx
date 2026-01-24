import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ModernButton from "@/components/ui/ModernButton";
import { Code2, Lightbulb, Palette, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Circuit Board Pattern - Matching Landing Page */}
      <div className="absolute inset-0 circuit-board-bg opacity-30"></div>
      
      {/* White Glass Overlay */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <div className="absolute inset-6 rounded-[2.5rem] bg-white/5 backdrop-blur-sm border border-white/10" />
      </div>
      
      <div className="container mx-auto px-10 py-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider">What We Do</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mt-3 mb-4">
            Our Core Services
          </h2>
          <p className="text-gray-300">
            We combine technical excellence with strategic thinking to deliver solutions that make a real impact.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, index) => (
        <div
          key={service.title}
          className={cn(
            "group p-6 rounded-xl bg-black/40 backdrop-blur-md border-2 border-cyan-500/50 cursor-pointer transition-all duration-300",
            "hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20",
            "animate-fade-up",
            index === 1 && "animation-delay-100",
            index === 2 && "animation-delay-200"
          )}
          style={{ transform: 'scale(1)', transition: 'transform 0.3s ease' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >


              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", service.color)}>
                <service.icon className="w-7 h-7" />
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                {service.title}
              </h3>
              
              <p className="text-gray-300 mb-6">
                {service.description}
              </p>
              
              <ul className="space-y-2 mb-4">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 group-hover:gap-3 transition-all"
              >
                Learn More
                <ArrowRight className="w-4 h-4" />
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
