import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ModernButton from "@/components/ui/ModernButton";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Users, IndianRupee } from "lucide-react";

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
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Circuit Board Pattern - Matching Other Sections */}
      <div className="absolute inset-0 circuit-board-bg opacity-30"></div>
      
      {/* White Glass Overlay */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <div className="absolute inset-6 rounded-[2.5rem] bg-white/5 backdrop-blur-sm border border-white/10" />
      </div>
      
      <div className="container mx-auto px-10 py-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider">Level Up Your Skills</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mt-3">
              Featured Training Programs
            </h2>
          </div>
          <Link to="/training">
            <ModernButton text="View All Programs" />
          </Link>
        </div>

        {/* Training Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {featuredTrainings.map((training, index) => (
            <Link
              key={training.id}
              to={`/training/${training.id}`}
              className="group animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-full bg-black/40 backdrop-blur-md rounded-2xl p-8 shadow-sm border-2 border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-cyan-400"
                style={{ transform: 'scale(1)', transition: 'transform 0.3s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <Badge variant={training.badgeColor}>{training.badge}</Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{training.enrolled} enrolled</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {training.title}
                </h3>
                <p className="text-gray-300 text-sm mb-6 line-clamp-2">
                  {training.description}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{training.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-lg font-semibold text-white">
                    <IndianRupee className="w-4 h-4" />
                    {training.price.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center p-8 rounded-2xl bg-black/60 backdrop-blur-md border border-cyan-500/20">
          <h3 className="hero-text-gradient text-2xl font-heading font-semibold mb-3 text-white">
            Ready to Advance Your Career?
          </h3>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            Join hundreds of professionals who have transformed their careers through our training programs.
          </p>
          <Link to="/training">
            <ModernButton text="Browse All Programs" />
          </Link>
        </div>
      </div>
    </section>
  );
}
