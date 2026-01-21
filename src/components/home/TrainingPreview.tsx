import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
    badgeColor: "default" as const,
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
    badgeColor: "outline" as const,
  },
];

export function TrainingPreview() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="text-accent font-medium text-sm uppercase tracking-wider">Level Up Your Skills</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mt-3">
              Featured Training Programs
            </h2>
          </div>
          <Link to="/training">
            <Button variant="ghost" className="group">
              View All Programs
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
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
              <div className="h-full bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-lg hover:border-accent/30 transition-all duration-300">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <Badge variant={training.badgeColor}>{training.badge}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{training.enrolled} enrolled</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                  {training.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
                  {training.description}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{training.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-lg font-semibold text-foreground">
                    <IndianRupee className="w-4 h-4" />
                    {training.price.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center p-8 rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <h3 className="text-2xl font-heading font-semibold mb-3">
            Ready to Advance Your Career?
          </h3>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
            Join hundreds of professionals who have transformed their careers through our training programs.
          </p>
          <Link to="/training">
            <Button variant="accent" size="lg">
              Browse All Programs
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
