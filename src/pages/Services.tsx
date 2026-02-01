import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ModernButton from "@/components/ui/ModernButton";
import {
  Code2,
  Lightbulb,
  Palette,
  Cloud,
  Smartphone,
  Database,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const services = [
  {
    icon: Code2,
    title: "Product Development",
    description: "End-to-end product development from ideation to deployment. We build scalable, maintainable software that grows with your business.",
    features: [
      "Custom Web Applications",
      "Enterprise Software Solutions",
      "SaaS Product Development",
      "API Design & Development",
      "System Integration",
      "Performance Optimization",
    ],
    color: "text-blue-600 bg-blue-500/10",
  },
  {
    icon: Lightbulb,
    title: "Consultancy",
    description: "Strategic technology consulting to help you navigate complex decisions and drive digital transformation initiatives.",
    features: [
      "Technology Strategy",
      "Digital Transformation",
      "Architecture Review",
      "Process Optimization",
      "Technical Due Diligence",
      "Innovation Workshops",
    ],
    color: "text-amber-600 bg-amber-500/10",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Human-centered design that creates intuitive, engaging experiences across all digital touchpoints.",
    features: [
      "User Research & Testing",
      "UI/UX Design",
      "Design Systems",
      "Brand Identity",
      "Prototyping",
      "Accessibility Audits",
    ],
    color: "text-purple-600 bg-purple-500/10",
  },
  {
    icon: Cloud,
    title: "Cloud Solutions",
    description: "Cloud architecture and migration services to help you leverage the power of modern cloud platforms.",
    features: [
      "Cloud Migration",
      "Infrastructure as Code",
      "DevOps Implementation",
      "Serverless Architecture",
      "Cost Optimization",
      "Security & Compliance",
    ],
    color: "text-cyan-600 bg-cyan-500/10",
  },
  {
    icon: Smartphone,
    title: "Mobile Development",
    description: "Native and cross-platform mobile applications that deliver exceptional user experiences.",
    features: [
      "iOS Development",
      "Android Development",
      "React Native Apps",
      "App Store Optimization",
      "Push Notifications",
      "Offline Capabilities",
    ],
    color: "text-green-600 bg-green-500/10",
  },
  {
    icon: Database,
    title: "Data & Analytics",
    description: "Turn your data into actionable insights with our data engineering and analytics solutions.",
    features: [
      "Data Architecture",
      "ETL Pipelines",
      "Business Intelligence",
      "Real-time Analytics",
      "Data Visualization",
      "Machine Learning",
    ],
    color: "text-rose-600 bg-rose-500/10",
  },
];

const Services = () => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute('data-section') || '';
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(sectionId));
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <PageLayout>
      <div className="relative min-h-screen bg-black overflow-hidden">
        {/* Circuit Board Pattern - Matching Other Sections */}
        <div className="absolute inset-0 circuit-board-bg opacity-30"></div>

        {/* White Glass Overlay - Matching Other Sections */}
        <div className="absolute inset-0 z-[5] pointer-events-none">
          <div className="absolute inset-2 md:inset-8 rounded-3xl md:rounded-[2.5rem] bg-white/5 backdrop-blur-sm border border-white/10" />
        </div>

        {/* Content Container */}
        <div className="container mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-8 relative z-10">

            {/* HERO */}
            <section 
              ref={(el) => (sectionRefs.current[0] = el)}
              data-section="hero"
              className={cn(
                "text-center mb-20 transition-all duration-1200",
                visibleSections.has('hero') ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-20 scale-95"
              )}
            >
              <span className={cn(
                "text-cyan-400 font-medium text-sm uppercase tracking-wider inline-block transition-all duration-700 delay-200",
                visibleSections.has('hero') ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
              )}>
                Our Services
              </span>
              <h1 className={cn(
                "text-4xl md:text-5xl font-heading font-bold text-white mt-4 mb-6 transition-all duration-800 delay-300",
                visibleSections.has('hero') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}>
                Comprehensive Technology{" "}
                <span className="hero-text-gradient">Solutions</span>
              </h1>
              <p className={cn(
                "text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-500",
                visibleSections.has('hero') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}>
                From concept to launch and beyond, we provide end-to-end services to help you build, scale, and succeed in the digital landscape.
              </p>
            </section>
            {/* SERVICES GRID */}
            <section 
              ref={(el) => (sectionRefs.current[1] = el)}
              data-section="services"
              className={cn(
                "mb-20 transition-all duration-1000 delay-200",
                visibleSections.has('services') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              )}
            >
              <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
                {services.map((service, index) => (
                  <div
                    key={service.title}
                    className={cn(
                      "p-6 sm:p-8 rounded-xl bg-black/40 backdrop-blur-md border-2 border-cyan-500/50 cursor-pointer transition-all duration-700",
                      "hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20",
                      visibleSections.has('services') ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    )}
                    style={{ 
                      transform: visibleSections.has('services') ? 'scale(1)' : 'scale(0.95)',
                      transition: 'transform 0.3s ease',
                      transitionDelay: visibleSections.has('services') ? `${300 + index * 150}ms` : '0ms'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
                      <div className={cn(
                        "w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0 transition-all duration-800",
                        service.color,
                        visibleSections.has('services') ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-180 opacity-0"
                      )}
                        style={{ transitionDelay: visibleSections.has('services') ? `${400 + index * 150}ms` : '0ms' }}
                      >
                        <service.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                      </div>
                      <div className="flex-1 w-full">
                        <h3 className={cn(
                          "text-xl font-semibold text-white mb-3 group-hover:text-cyan-400 transition-all duration-700 delay-200",
                          visibleSections.has('services') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                        )}
                        style={{ transitionDelay: visibleSections.has('services') ? `${600 + index * 150}ms` : '0ms' }}
                        >
                          {service.title}
                        </h3>
                        <p className={cn(
                          "text-base text-gray-300 mb-6 leading-relaxed transition-all duration-700 delay-400",
                          visibleSections.has('services') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}
                        style={{ transitionDelay: visibleSections.has('services') ? `${800 + index * 150}ms` : '0ms' }}
                        >
                          {service.description}
                        </p>
                        <ul className={cn(
                          "grid grid-cols-1 sm:grid-cols-2 gap-3 transition-all duration-700 delay-600",
                          visibleSections.has('services') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}
                        style={{ transitionDelay: visibleSections.has('services') ? `${1000 + index * 150}ms` : '0ms' }}
                        >
                          {service.features.map((feature, featureIndex) => (
                            <li 
                              key={feature} 
                              className={cn(
                                "flex items-center gap-2 text-sm text-gray-400 transition-all duration-500",
                                visibleSections.has('services') 
                                  ? "opacity-100 translate-x-0" 
                                  : "opacity-0 -translate-x-4"
                              )}
                              style={{ transitionDelay: visibleSections.has('services') ? `${1200 + index * 150 + featureIndex * 50}ms` : '0ms' }}
                            >
                              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            {/* CTA SECTION */}
            <section 
              ref={(el) => (sectionRefs.current[2] = el)}
              data-section="cta"
              className={cn(
                "transition-all duration-1000 delay-400 mb-8",
                visibleSections.has('cta') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              )}
            >
              <div className="text-center p-10 sm:p-16 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-black/60 to-purple-500/10 backdrop-blur-md border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
                <div className="max-w-4xl mx-auto">
                  <div className={cn(
                    "mb-8 transition-all duration-700 delay-200",
                    visibleSections.has('cta') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30 mb-6">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                      <span className="text-cyan-400 text-sm font-medium">Start Your Journey</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6 leading-tight">
                      Ready to Transform Your Ideas?
                    </h2>
                    <p className="text-xl text-gray-200 mb-10 leading-relaxed">
                      Let's collaborate to bring your vision to life with our expert team and cutting-edge solutions.
                    </p>
                  </div>
                  <div className={cn(
                    "flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-600",
                    visibleSections.has('cta') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  )}>
                    <ModernButton
                      text="Get a Free Consultation"
                      onClick={() => window.location.href = '/contact'}
                    />
                    <ModernButton
                      text="Explore Training Programs"
                      onClick={() => window.location.href = '/training'}
                    />
                  </div>
                </div>
              </div>
            </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default Services;
