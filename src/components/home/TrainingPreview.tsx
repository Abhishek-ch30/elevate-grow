import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ModernButton from "@/components/ui/ModernButton";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Users, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const featuredTrainings = [
  {
    id: 1,
    title: "React.js Masterclass",
    description: "Build modern, scalable web applications with React, Redux, and modern tooling.",
    duration: "8 weeks",
    price: 15000,
    enrolled: 45,
    badge: "Popular",
    badgeColor: "secondary" as const,
  },
  {
    id: 2,
    title: "Cloud Architecture with AWS",
    description: "Design and deploy scalable cloud infrastructure on Amazon Web Services.",
    duration: "10 weeks",
    price: 25000,
    enrolled: 32,
    badge: "Advanced",
    badgeColor: "secondary" as const,
  },
  {
    id: 3,
    title: "Full Stack Development",
    description: "Comprehensive training covering frontend, backend, databases, and deployment.",
    duration: "12 weeks",
    price: 35000,
    enrolled: 28,
    badge: "Comprehensive",
    badgeColor: "secondary" as const,
  },
];

export function TrainingPreview() {
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
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Circuit Board Pattern - Matching Other Sections */}
      <div className="absolute inset-0 circuit-board-bg opacity-30"></div>

      {/* White Glass Overlay */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <div className="absolute inset-2 md:inset-8 rounded-3xl md:rounded-[2.5rem] bg-white/5 backdrop-blur-sm border border-white/10" />
      </div>

      <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20">
          <div>
            <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider">Level Up Your Skills</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mt-4 mb-2">
              Featured Training Programs
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
              Comprehensive training programs designed to transform your career and accelerate your professional growth.
            </p>
          </div>
          <Link to="/training">
            <ModernButton text="View All Programs" />
          </Link>
        </div>

        {/* Training Cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {featuredTrainings.map((training, index) => (
            <Link
              key={training.id}
              to={`/training/${training.id}`}
              className="group"
            >
              <div
                ref={(el) => (cardRefs.current[index] = el)}
                data-index={index}
                className={cn(
                  "h-full bg-black/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-sm border-2 border-cyan-500/50 transition-all duration-700",
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
                {/* Header */}
                <div className={cn("flex items-start justify-between mb-6 transition-all duration-700",
                  visibleCards.has(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}>
                  <Badge variant={training.badgeColor} className="text-xs px-3 py-1">{training.badge}</Badge>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{training.enrolled} enrolled</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className={cn("text-xl sm:text-2xl font-semibold text-white mb-4 group-hover:text-cyan-400 transition-all duration-700 delay-100",
                  visibleCards.has(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}>
                  {training.title}
                </h3>
                <p className={cn("text-gray-300 text-base mb-8 line-clamp-3 leading-relaxed transition-all duration-700 delay-200",
                  visibleCards.has(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}>
                  {training.description}
                </p>

                {/* Meta */}
                <div className={cn("flex items-center justify-between pt-6 border-t border-gray-700 transition-all duration-700 delay-300",
                  visibleCards.has(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}>
                  <div className="flex items-center gap-3 text-base text-gray-400">
                    <Clock className="w-5 h-5" />
                    <span>{training.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xl font-semibold text-white">
                    <IndianRupee className="w-5 h-5" />
                    {training.price.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center p-10 sm:p-16 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-black/60 to-purple-500/10 backdrop-blur-md border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30 mb-6">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                <span className="text-cyan-400 text-sm font-medium">Limited Seats Available</span>
              </div>
              <h3 className="hero-text-gradient text-4xl md:text-5xl font-heading font-bold mb-6 text-white leading-tight">
                Ready to Transform Your Career?
              </h3>
              <p className="text-xl text-gray-200 mb-10 leading-relaxed">
                Join <span className="text-cyan-400 font-semibold">1,000+ professionals</span> who have accelerated their careers through our industry-recognized training programs.
              </p>
            </div>
            <div className="flex justify-center items-center">
              <Link to="/training">
                <ModernButton text="Browse All Programs" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
