import { useState } from "react";
import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
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

const categories = [
  { id: "all", label: "All Programs" },
  { id: "web", label: "Web Development" },
  { id: "cloud", label: "Cloud & DevOps" },
  { id: "mobile", label: "Mobile" },
  { id: "design", label: "Design" },
  { id: "data", label: "Data & AI" },
];

const trainings = [
  {
    id: 1,
    title: "React.js Masterclass",
    description: "Build modern, scalable web applications with React, Redux, TypeScript, and modern tooling. Learn component architecture, state management, and testing.",
    duration: "8 weeks",
    price: 15000,
    enrolled: 45,
    category: "web",
    icon: Code2,
    badge: "Popular",
    badgeColor: "default" as const,
  },
  {
    id: 2,
    title: "Cloud Architecture with AWS",
    description: "Design and deploy scalable cloud infrastructure on Amazon Web Services. Master EC2, S3, Lambda, and advanced services.",
    duration: "10 weeks",
    price: 25000,
    enrolled: 32,
    category: "cloud",
    icon: Cloud,
    badge: "Advanced",
    badgeColor: "secondary" as const,
  },
  {
    id: 3,
    title: "Full Stack Development",
    description: "Comprehensive training covering React, Node.js, databases, and deployment. Build complete applications from scratch.",
    duration: "12 weeks",
    price: 35000,
    enrolled: 28,
    category: "web",
    icon: Code2,
    badge: "Comprehensive",
    badgeColor: "outline" as const,
  },
  {
    id: 4,
    title: "React Native Development",
    description: "Build cross-platform mobile applications using React Native. Learn navigation, state management, and native integrations.",
    duration: "8 weeks",
    price: 20000,
    enrolled: 24,
    category: "mobile",
    icon: Smartphone,
    badge: "Trending",
    badgeColor: "default" as const,
  },
  {
    id: 5,
    title: "UI/UX Design Fundamentals",
    description: "Learn user-centered design principles, Figma, prototyping, and design systems. Create beautiful, functional interfaces.",
    duration: "6 weeks",
    price: 12000,
    enrolled: 38,
    category: "design",
    icon: Palette,
    badge: "Beginner Friendly",
    badgeColor: "outline" as const,
  },
  {
    id: 6,
    title: "Data Engineering with Python",
    description: "Master data pipelines, ETL processes, and analytics with Python. Work with Pandas, SQL, and cloud data services.",
    duration: "10 weeks",
    price: 22000,
    enrolled: 19,
    category: "data",
    icon: Database,
    badge: "In Demand",
    badgeColor: "secondary" as const,
  },
  {
    id: 7,
    title: "DevOps & CI/CD",
    description: "Implement DevOps practices with Docker, Kubernetes, Jenkins, and GitHub Actions. Automate your development workflow.",
    duration: "8 weeks",
    price: 18000,
    enrolled: 26,
    category: "cloud",
    icon: Shield,
    badge: "Essential",
    badgeColor: "default" as const,
  },
  {
    id: 8,
    title: "Node.js Backend Development",
    description: "Build robust backend services with Node.js, Express, and MongoDB. Learn authentication, APIs, and microservices.",
    duration: "8 weeks",
    price: 16000,
    enrolled: 34,
    category: "web",
    icon: Code2,
    badge: "Popular",
    badgeColor: "default" as const,
  },
];

const Training = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTrainings = trainings.filter((training) => {
    const matchesCategory = selectedCategory === "all" || training.category === selectedCategory;
    const matchesSearch = training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          training.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-accent font-medium text-sm uppercase tracking-wider">Training Programs</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mt-4 mb-6">
              Advance Your Career with Expert Training
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Industry-relevant training programs designed to equip you with practical skills and knowledge demanded by today's tech landscape.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-background border-b border-border sticky top-16 z-30 backdrop-blur-md bg-background/95">
        <div className="container mx-auto px-4">
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
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Training Cards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {filteredTrainings.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTrainings.map((training, index) => (
                <Link
                  key={training.id}
                  to={`/training/${training.id}`}
                  className="group animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="h-full bg-card rounded-2xl border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300 overflow-hidden">
                    {/* Header */}
                    <div className="p-6 pb-0">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                          <training.icon className="w-6 h-6" />
                        </div>
                        <Badge variant={training.badgeColor}>{training.badge}</Badge>
                      </div>

                      <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                        {training.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                        {training.description}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="p-6 pt-4 border-t border-border mt-auto">
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{training.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{training.enrolled} enrolled</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xl font-bold text-foreground">
                          <IndianRupee className="w-5 h-5" />
                          {training.price.toLocaleString("en-IN")}
                        </div>
                        <Button variant="accent" size="sm" className="group/btn">
                          Enroll
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No programs found matching your criteria.</p>
              <Button
                variant="ghost"
                className="mt-4"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default Training;
