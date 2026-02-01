import { PageLayout } from "@/components/layout/PageLayout";
import { Target, Eye, Heart, Award, Users, Zap } from "lucide-react";
import CountUp from "@/components/CountUp";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const values = [
  {
    icon: Award,
    title: "Excellence",
    description:
      "We strive for excellence in every project, delivering solutions that exceed expectations.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description:
      "We believe in the power of teamwork and close partnership with our clients.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description:
      "We embrace new technologies and creative approaches to solve complex problems.",
  },
  {
    icon: Heart,
    title: "Integrity",
    description:
      "Transparency and honesty guide all our interactions and business decisions.",
  },
];

const About = () => {
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
            About Us
          </span>
          <h1 className={cn(
            "text-4xl md:text-5xl font-heading font-bold text-white mt-4 mb-6 transition-all duration-800 delay-300",
            visibleSections.has('hero') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            Driving Innovation Through{" "}
            <span className="hero-text-gradient">Technology</span>
          </h1>
          <p className={cn(
            "text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-500",
            visibleSections.has('hero') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}>
            We are a team of passionate technologists and strategists dedicated
            to helping businesses thrive in the digital age.
          </p>
        </section>

        {/* COMPANY OVERVIEW */}
        <section 
          ref={(el) => (sectionRefs.current[1] = el)}
          data-section="overview"
          className={cn(
            "grid lg:grid-cols-2 gap-16 items-center mb-20 transition-all duration-1000 delay-200",
            visibleSections.has('overview') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}
        >
          <div className={cn(
            "transition-all duration-800 delay-400",
            visibleSections.has('overview') ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
          )}>
            <h2 className={cn(
              "text-3xl md:text-4xl font-heading font-bold text-white mb-6 transition-all duration-600 delay-500",
              visibleSections.has('overview') ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            )}>
              Who We Are
            </h2>
            <p className={cn(
              "text-gray-300 mb-6 leading-relaxed transition-all duration-600 delay-600",
              visibleSections.has('overview') ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
            )}>
              QThink Solutions is a premier product development and consultancy
              firm focused on transforming innovative ideas into impactful
              digital products.
            </p>
            <p className={cn(
              "text-gray-300 mb-6 leading-relaxed transition-all duration-600 delay-700",
              visibleSections.has('overview') ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
            )}>
              Our team consists of developers, designers, and strategists who
              believe in long-term partnerships—not just delivery.
            </p>
            <p className={cn(
              "text-gray-300 leading-relaxed transition-all duration-600 delay-800",
              visibleSections.has('overview') ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
            )}>
              We also empower future professionals through hands-on training
              and mentorship programs.
            </p>
          </div>

          <div className={cn(
            "grid grid-cols-2 gap-6 transition-all duration-800 delay-600",
            visibleSections.has('overview') ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
          )}>
            {[
              [8, "Years Experience"],
              [50, "Projects Delivered"],
              [500, "Professionals Trained"],
              [25, "Team Members"],
            ].map(([value, label], index) => (
              <div
                key={label}
                className={cn(
                  "text-center p-6 rounded-xl border border-cyan-500/50 bg-black/40 backdrop-blur-md cursor-pointer transition-all duration-600",
                  "hover:scale-105 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10",
                  visibleSections.has('overview') ? "opacity-100 scale-100" : "opacity-0 scale-90"
                )}
                style={{ 
                  transitionDelay: visibleSections.has('overview') ? `${700 + index * 150}ms` : '0ms',
                  transform: visibleSections.has('overview') ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)'
                }}
              >
                <div className="flex items-center justify-center gap-1 mb-2">
                  <CountUp 
                    to={value} 
                    className="text-3xl font-bold text-cyan-400"
                    duration={2.5}
                    delay={index * 0.2}
                  />
                  <span className="text-3xl font-bold text-cyan-400">+</span>
                </div>
                <p className="text-sm text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* VISION & MISSION */}
        <section 
          ref={(el) => (sectionRefs.current[2] = el)}
          data-section="vision"
          className={cn(
            "grid md:grid-cols-2 gap-10 mb-20 transition-all duration-1000 delay-300",
            visibleSections.has('vision') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}
        >
          <div 
            className={cn(
              "p-8 rounded-xl bg-black/40 backdrop-blur-md border-2 border-cyan-500/50 cursor-pointer transition-all duration-700",
              "hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20",
              visibleSections.has('vision') ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
            style={{ transform: 'scale(1)', transition: 'transform 0.3s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div className={cn(
              "w-14 h-14 mb-6 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center transition-all duration-800",
              visibleSections.has('vision') ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-180 opacity-0"
            )}>
              <Eye />
            </div>
            <h3 className={cn(
              "text-2xl font-bold text-white mb-4 transition-all duration-700 delay-200",
              visibleSections.has('vision') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
              Our Vision
            </h3>
            <p className={cn(
              "text-gray-300 transition-all duration-700 delay-400",
              visibleSections.has('vision') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}>
              To empower businesses and professionals to unlock the full
              potential of technology through innovation and expertise.
            </p>
          </div>

          <div 
            className={cn(
              "p-8 rounded-xl bg-black/40 backdrop-blur-md border-2 border-cyan-500/50 cursor-pointer transition-all duration-700",
              "hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20",
              visibleSections.has('vision') ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
            style={{ transform: 'scale(1)', transition: 'transform 0.3s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div className={cn(
              "w-14 h-14 mb-6 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center transition-all duration-800",
              visibleSections.has('vision') ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-180 opacity-0"
            )}>
              <Target />
            </div>
            <h3 className={cn(
              "text-2xl font-bold text-white mb-4 transition-all duration-700 delay-200",
              visibleSections.has('vision') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
              Our Mission
            </h3>
            <p className={cn(
              "text-gray-300 transition-all duration-700 delay-400",
              visibleSections.has('vision') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}>
              Delivering world-class digital solutions, strategic consulting,
              and transformative training with integrity and excellence.
            </p>
          </div>
        </section>

        {/* CORE VALUES */}
        <section 
          ref={(el) => (sectionRefs.current[3] = el)}
          data-section="values"
          className={cn(
            "transition-all duration-1000 delay-500 mb-8",
            visibleSections.has('values') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}
        >
          <div className={cn(
            "text-center mb-12 transition-all duration-700 delay-200",
            visibleSections.has('values') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider">
              What Drives Us
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mt-3">
              Our Core Values
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={value.title}
                className={cn(
                  "p-6 rounded-xl bg-black/40 backdrop-blur-md border-2 border-cyan-500/50 cursor-pointer transition-all duration-700",
                  "hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20",
                  visibleSections.has('values') ? "opacity-100 scale-100" : "opacity-0 scale-95"
                )}
                style={{ 
                  transform: 'scale(1)', 
                  transition: 'transform 0.3s ease',
                  transitionDelay: visibleSections.has('values') ? `${300 + index * 100}ms` : '0ms'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div className={cn(
                  "w-12 h-12 mb-4 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center transition-all duration-800",
                  visibleSections.has('values') ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-180 opacity-0"
                )}
                style={{ transitionDelay: visibleSections.has('values') ? `${400 + index * 150}ms` : '0ms' }}
                >
                  <value.icon className="w-6 h-6" />
                </div>
                <h4 className={cn(
                  "text-lg font-semibold text-white mb-2 transition-all duration-700",
                  visibleSections.has('values') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: visibleSections.has('values') ? `${600 + index * 150}ms` : '0ms' }}
                >
                  {value.title}
                </h4>
                <p className={cn(
                  "text-sm text-gray-300 transition-all duration-700",
                  visibleSections.has('values') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                )}
                style={{ transitionDelay: visibleSections.has('values') ? `${800 + index * 150}ms` : '0ms' }}
                >
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  </PageLayout>
  );
};

export default About;
