import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code2, Lightbulb, Palette, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
  {
    icon: Code2,
    title: "Product Development",
    description: "We build scalable, modern digital products using cutting-edge technologies. From MVPs to enterprise solutions.",
    color: "bg-blue-500/10 text-blue-600",
    features: ["Web & Mobile Apps", "Cloud Architecture", "API Development"],
  },
  {
    icon: Lightbulb,
    title: "Consultancy",
    description: "Strategic technology consulting to help you make informed decisions and drive digital transformation.",
    color: "bg-amber-500/10 text-amber-600",
    features: ["Tech Strategy", "Digital Transformation", "Process Optimization"],
  },
  {
    icon: Palette,
    title: "Design",
    description: "User-centered design that creates memorable experiences and drives engagement.",
    color: "bg-purple-500/10 text-purple-600",
    features: ["UI/UX Design", "Brand Identity", "Design Systems"],
  },
];

export function ServicesPreview() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-accent font-medium text-sm uppercase tracking-wider">What We Do</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mt-3 mb-4">
            Our Core Services
          </h2>
          <p className="text-muted-foreground">
            We combine technical excellence with strategic thinking to deliver solutions that make a real impact.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={cn(
                "group p-8 rounded-2xl card-elevated cursor-pointer",
                "animate-fade-up",
                index === 1 && "animation-delay-100",
                index === 2 && "animation-delay-200"
              )}
            >
              <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mb-6", service.color)}>
                <service.icon className="w-7 h-7" />
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                {service.title}
              </h3>
              
              <p className="text-muted-foreground mb-6">
                {service.description}
              </p>
              
              <ul className="space-y-2 mb-6">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent group-hover:gap-3 transition-all"
              >
                Learn More
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/services">
            <Button variant="outline" size="lg">
              View All Services
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
