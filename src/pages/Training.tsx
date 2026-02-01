import { useState, useEffect, useRef } from "react";
import React from "react";
import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import ModernButton from "@/components/ui/ModernButton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Clock, 
  Users, 
  IndianRupee, 
  Search,
  ArrowRight,
  Code2,
  Cloud,
  Database,
  Smartphone,
  Palette,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api, TrainingProgram } from "@/lib/api";

interface TrainingWithEnrollments extends TrainingProgram {
  enrolled_count: number;
}

const categories = [
  { id: "all", label: "All Programs" },
  { id: "web", label: "Web Development" },
  { id: "cloud", label: "Cloud & DevOps" },
  { id: "mobile", label: "Mobile" },
  { id: "design", label: "Design" },
  { id: "data", label: "Data & AI" },
];

const iconMap = {
  web: Code2,
  cloud: Cloud,
  mobile: Smartphone,
  design: Palette,
  data: Database,
  default: Code2
};

const Training = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [trainings, setTrainings] = useState<TrainingWithEnrollments[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchTrainings();
  }, []);

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

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      // Use user endpoint which already filters active programs
      const trainingsData = await api.getTrainingPrograms();
      
      // Add enrollment count for each training (using 0 as fallback for public view)
      const trainingsWithCount = trainingsData.map(training => ({
        ...training,
        enrolled_count: 0 // Public users don't need to see exact enrollment counts
      }));
      
      setTrainings(trainingsWithCount);
    } catch (error) {
      console.error('Error fetching trainings:', error);
      setTrainings([]);
    } finally {
      setLoading(false);
    }
  };

  const getIconForTraining = (title: string, description: string) => {
    const content = (title + ' ' + description).toLowerCase();
    
    if (content.includes('react') || content.includes('web') || content.includes('javascript') || content.includes('node')) {
      return iconMap.web;
    } else if (content.includes('cloud') || content.includes('aws') || content.includes('devops') || content.includes('docker')) {
      return iconMap.cloud;
    } else if (content.includes('mobile') || content.includes('react native') || content.includes('ios') || content.includes('android')) {
      return iconMap.mobile;
    } else if (content.includes('design') || content.includes('ui') || content.includes('ux') || content.includes('figma')) {
      return iconMap.design;
    } else if (content.includes('data') || content.includes('python') || content.includes('analytics') || content.includes('machine learning')) {
      return iconMap.data;
    }
    
    return iconMap.default;
  };

  const getBadgeForTraining = (title: string, description: string) => {
    const content = (title + ' ' + description).toLowerCase();
    
    if (content.includes('masterclass') || content.includes('advanced')) {
      return { text: "Advanced", color: "secondary" as const };
    } else if (content.includes('fundamentals') || content.includes('beginner')) {
      return { text: "Beginner Friendly", color: "secondary" as const };
    } else if (content.includes('full stack') || content.includes('comprehensive')) {
      return { text: "Comprehensive", color: "secondary" as const };
    }
    
    return { text: "Popular", color: "secondary" as const };
  };

  const filteredTrainings = trainings.filter((training) => {
    const matchesSearch = training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          training.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

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
              Training Programs
            </span>
            <h1 className={cn(
              "text-4xl md:text-5xl font-heading font-bold text-white mt-4 mb-6 transition-all duration-800 delay-300",
              visibleSections.has('hero') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
              Advance Your Career with{" "}
              <span className="hero-text-gradient">Expert Training</span>
            </h1>
            <p className={cn(
              "text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-500",
              visibleSections.has('hero') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}>
              Industry-relevant training programs designed to equip you with practical skills and knowledge demanded by today's tech landscape.
            </p>
          </section>
          {/* FILTERS */}
          <section 
            ref={(el) => (sectionRefs.current[1] = el)}
            data-section="filters"
            className={cn(
              "mb-20 transition-all duration-1000 delay-200",
              visibleSections.has('filters') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            )}
          >
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              {/* Category Filter */}
              <div className={cn(
                "flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto transition-all duration-700 delay-300",
                visibleSections.has('filters') ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              )}>
                {categories.map((category, index) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                      selectedCategory === category.id
                        ? "bg-cyan-500 text-white"
                        : "bg-black/40 text-white/70 border border-cyan-500/30 hover:border-cyan-400 hover:bg-black/60"
                    )}
                    style={{ transitionDelay: visibleSections.has('filters') ? `${400 + index * 50}ms` : '0ms' }}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className={cn(
                "relative w-full md:w-72 transition-all duration-700 delay-500",
                visibleSections.has('filters') ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              )}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                <Input
                  placeholder="Search programs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-black/40 border-cyan-500/30 text-white placeholder:text-white/60 focus:border-cyan-400"
                />
              </div>
            </div>
          </section>

          {/* TRAINING CARDS */}
          <section 
            ref={(el) => (sectionRefs.current[2] = el)}
            data-section="trainings"
            className={cn(
              "transition-all duration-1000 delay-400",
              visibleSections.has('trainings') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            )}
          >
          {loading ? (
            <div className="text-center py-16">
              <p className="text-gray-300">Loading training programs...</p>
            </div>
          ) : filteredTrainings.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredTrainings.map((training, index) => {
                const icon = getIconForTraining(training.title, training.description);
                const badge = getBadgeForTraining(training.title, training.description);
                
                return (
                  <Link
                    key={training.id}
                    to={`/training/${training.id}`}
                    className="group"
                  >
                    <div className={cn(
                      "h-full bg-black/40 backdrop-blur-md rounded-2xl border-2 border-cyan-500/50 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-700 overflow-hidden",
                      visibleSections.has('trainings') ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    )}
                    style={{ 
                      transform: visibleSections.has('trainings') ? 'scale(1)' : 'scale(0.95)',
                      transition: 'transform 0.3s ease',
                      transitionDelay: visibleSections.has('trainings') ? `${300 + index * 150}ms` : '0ms'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                      {/* Header */}
                      <div className="p-6 pb-0">
                        <div className={cn(
                          "flex items-start justify-between mb-4 transition-all duration-800 delay-200",
                          visibleSections.has('trainings') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                        )}
                        style={{ transitionDelay: visibleSections.has('trainings') ? `${400 + index * 150}ms` : '0ms' }}
                        >
                          <div className={cn(
                            "w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center transition-all duration-800",
                            visibleSections.has('trainings') ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-180 opacity-0"
                          )}
                            style={{ transitionDelay: visibleSections.has('trainings') ? `${500 + index * 150}ms` : '0ms' }}
                          >
                            {React.createElement(icon, { className: "w-6 h-6" })}
                          </div>
                          <div className="flex flex-col gap-2">
                            <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
                              Enrollments Open
                            </Badge>
                          </div>
                        </div>

                        <h3 className={cn(
                          "text-xl font-semibold text-white mb-3 group-hover:text-cyan-400 transition-all duration-700 delay-400",
                          visibleSections.has('trainings') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}
                        style={{ transitionDelay: visibleSections.has('trainings') ? `${600 + index * 150}ms` : '0ms' }}
                        >
                          {training.title}
                        </h3>
                        <p className={cn(
                          "text-gray-300 text-sm line-clamp-2 mb-4 leading-relaxed transition-all duration-700 delay-600",
                          visibleSections.has('trainings') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}
                        style={{ transitionDelay: visibleSections.has('trainings') ? `${800 + index * 150}ms` : '0ms' }}
                        >
                          {training.description}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className={cn(
                        "p-6 pt-4 border-t border-cyan-500/30 mt-auto transition-all duration-700 delay-800",
                        visibleSections.has('trainings') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      )}
                      style={{ transitionDelay: visibleSections.has('trainings') ? `${1000 + index * 150}ms` : '0ms' }}
                      >
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{training.duration || 'Not specified'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>Open for enrollment</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xl font-bold text-white">
                            <IndianRupee className="w-5 h-5" />
                            {training.price?.toLocaleString("en-IN") || '0'}
                          </div>
                          <ModernButton 
                            text="Enroll"
                            onClick={() => window.location.href = `/training/${training.id}`}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-300 mb-4">No programs found matching your criteria.</p>
              <ModernButton
                text="Clear Filters"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
              />
            </div>
          )}
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default Training;
