import { PageLayout } from "@/components/layout/PageLayout";
import { Target, Eye, Heart, Award, Users, Zap } from "lucide-react";

const values = [
  {
    icon: Award,
    title: "Excellence",
    description: "We strive for excellence in every project, delivering solutions that exceed expectations.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "We believe in the power of teamwork and close partnership with our clients.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "We embrace new technologies and creative approaches to solve complex problems.",
  },
  {
    icon: Heart,
    title: "Integrity",
    description: "Transparency and honesty guide all our interactions and business decisions.",
  },
];

const About = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 hero-gradient overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className="text-accent font-medium text-sm uppercase tracking-wider">About Us</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mt-4 mb-6">
              Driving Innovation Through Technology
            </h1>
            <p className="text-lg text-white/70">
              We are a team of passionate technologists and strategists dedicated to helping businesses thrive in the digital age.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Company Overview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-up">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
                Who We Are
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                TechNova is a premier product development and consultancy firm established with a vision to bridge the gap between innovative ideas and successful digital products. With years of experience across diverse industries, we bring technical excellence and strategic insight to every engagement.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Our team comprises seasoned developers, architects, designers, and strategists who are passionate about creating impactful solutions. We don't just build products—we build partnerships that drive long-term success.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Beyond our core services, we're committed to nurturing the next generation of tech professionals through our comprehensive training programs, sharing the knowledge and expertise we've accumulated over the years.
              </p>
            </div>
            <div className="relative animate-fade-up animation-delay-200">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/5 to-accent/10 border border-border p-8 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
                  <div className="stat-card text-center">
                    <span className="text-3xl font-bold text-accent">8+</span>
                    <p className="text-sm text-muted-foreground mt-1">Years Experience</p>
                  </div>
                  <div className="stat-card text-center">
                    <span className="text-3xl font-bold text-accent">50+</span>
                    <p className="text-sm text-muted-foreground mt-1">Projects Delivered</p>
                  </div>
                  <div className="stat-card text-center">
                    <span className="text-3xl font-bold text-accent">500+</span>
                    <p className="text-sm text-muted-foreground mt-1">Professionals Trained</p>
                  </div>
                  <div className="stat-card text-center">
                    <span className="text-3xl font-bold text-accent">25+</span>
                    <p className="text-sm text-muted-foreground mt-1">Team Members</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 md:p-10 rounded-2xl bg-card shadow-sm border border-border animate-fade-up">
              <div className="w-14 h-14 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-6">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-heading font-semibold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be the catalyst for digital transformation, empowering businesses and professionals to harness the full potential of technology. We envision a future where innovative solutions drive sustainable growth and create lasting impact.
              </p>
            </div>
            <div className="p-8 md:p-10 rounded-2xl bg-card shadow-sm border border-border animate-fade-up animation-delay-100">
              <div className="w-14 h-14 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-6">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-heading font-semibold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To deliver exceptional digital solutions through innovative product development, strategic consultancy, and transformative training. We are committed to excellence, continuous learning, and creating value for our clients and the broader tech community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-accent font-medium text-sm uppercase tracking-wider">What Drives Us</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mt-3">
              Our Core Values
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="p-6 rounded-xl bg-card border border-border hover:border-accent/30 hover:shadow-md transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">{value.title}</h4>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default About;
