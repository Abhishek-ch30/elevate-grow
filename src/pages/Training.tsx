import { useState, useEffect } from "react";
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
import { supabase } from "@/lib/supabase";

interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  is_active: boolean;
  created_at: string;
}

interface TrainingWithEnrollments extends TrainingProgram {
  enrolled_count?: number;
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

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const { data: trainingsData, error } = await supabase
        .from('training_programs')
        .select(`
          *,
          enrollments:enrollments(count)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const trainingsWithCount = trainingsData?.map(training => ({
        ...training,
        enrolled_count: training.enrollments?.length || 0
      })) || [];
      
      setTrainings(trainingsWithCount);
    } catch (error) {
      console.error('Error fetching trainings:', error);
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
      <div className="relative min-h-screen circuit-board-bg overflow-hidden">
        {/* BACKGROUND ELEMENTS */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-float animation-delay-500" />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* 🔥 SINGLE GLASS OVERLAY */}
        <div className="container mx-auto max-w-7xl relative z-10 px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/15 shadow-2xl p-8 sm:p-12 lg:p-16">

          {/* HERO */}
          <section className="mb-16">
            <span className="text-accent text-sm uppercase tracking-wider">
              Training Programs
            </span>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6"
              style={{ fontFamily: "'Nasalization', sans-serif" }}
            >
              Advance Your Career with{" "}
              <span className="hero-text-gradient">Expert Training</span>
            </h1>
            <p className="text-lg text-white/70 max-w-3xl">
              Industry-relevant training programs designed to equip you with practical skills and knowledge demanded by today's tech landscape.
            </p>
          </section>
          {/* FILTERS */}
          <section className="mb-16">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                      selectedCategory === category.id
                        ? "bg-cyan-500 text-white"
                        : "bg-black/40 text-white/70 border border-cyan-500/30 hover:border-cyan-400 hover:bg-black/60"
                    )}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full md:w-72">
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
          <section>
          {loading ? (
            <div className="text-center py-16">
              <p className="text-white/70">Loading training programs...</p>
            </div>
          ) : filteredTrainings.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTrainings.map((training, index) => {
                const icon = getIconForTraining(training.title, training.description);
                const badge = getBadgeForTraining(training.title, training.description);
                
                return (
                  <Link
                    key={training.id}
                    to={`/training/${training.id}`}
                    className="group animate-fade-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="h-full bg-black/40 backdrop-blur-md rounded-2xl border-2 border-cyan-500/50 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 overflow-hidden"
                         style={{ transform: 'scale(1)', transition: 'transform 0.3s ease' }}
                         onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                         onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                      {/* Header */}
                      <div className="p-6 pb-0">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                            {React.createElement(icon, { className: "w-6 h-6" })}
                          </div>
                          <Badge variant={badge.color}>{badge.text}</Badge>
                        </div>

                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                          {training.title}
                        </h3>
                        <p className="text-white/70 text-sm line-clamp-2 mb-4">
                          {training.description}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="p-6 pt-4 border-t border-cyan-500/30 mt-auto">
                        <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{training.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{training.enrolled_count || 0} enrolled</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xl font-bold text-white">
                            <IndianRupee className="w-5 h-5" />
                            {training.price.toLocaleString("en-IN")}
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
              <p className="text-white/70 mb-4">No programs found matching your criteria.</p>
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
      </div>
    </PageLayout>
  );
};

export default Training;
