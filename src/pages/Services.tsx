import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-muted/50 to-background overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-accent font-medium text-sm uppercase tracking-wider">Our Services</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mt-4 mb-6">
              Comprehensive Technology Solutions
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From concept to launch and beyond, we provide end-to-end services to help you build, scale, and succeed in the digital landscape.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={service.title}
                className={cn(
                  "group p-8 rounded-2xl bg-card border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300 animate-fade-up"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-5">
                  <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center shrink-0", service.color)}>
                    <service.icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {service.description}
                    </p>
                    <ul className="grid grid-cols-2 gap-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-muted-foreground mb-8">
              Let's discuss how we can help bring your vision to life. Our team is ready to understand your needs and propose the best solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="accent" size="lg" className="group">
                  Get a Free Consultation
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/training">
                <Button variant="outline" size="lg">
                  Explore Training Programs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Services;
