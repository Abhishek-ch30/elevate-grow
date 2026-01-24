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
          <section className="mb-24">
            <span className="text-accent text-sm uppercase tracking-wider">
              Our Services
            </span>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6"
              style={{ fontFamily: "'Nasalization', sans-serif" }}
            >
              Comprehensive Technology{" "}
              <span className="hero-text-gradient">Solutions</span>
            </h1>
            <p className="text-lg text-white/70 max-w-3xl">
              From concept to launch and beyond, we provide end-to-end services to help you build, scale, and succeed in the digital landscape.
            </p>
          </section>
          {/* SERVICES GRID */}
          <section className="mb-24">
            <div className="grid lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="p-8 rounded-xl bg-black/40 backdrop-blur-md border-2 border-cyan-500/50 cursor-pointer transition-all duration-300 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20"
                style={{ transform: 'scale(1)', transition: 'transform 0.3s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div className="flex items-start gap-5">
                  <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center shrink-0", service.color)}>
                    <service.icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-white/70 mb-6">
                      {service.description}
                    </p>
                    <ul className="grid grid-cols-2 gap-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-white/60">
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
          <section>
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Start Your Project?
              </h2>
              <p className="text-white/70 mb-8 max-w-2xl mx-auto">
                Let's discuss how we can help bring your vision to life. Our team is ready to understand your needs and propose the best solution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
          </section>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Services;
