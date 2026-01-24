import { PageLayout } from "@/components/layout/PageLayout";
import { Target, Eye, Heart, Award, Users, Zap } from "lucide-react";
import CountUp from "@/components/CountUp";

const values = [
  {
    icon: Award,
    title: "Excellence",
    description:
      "We strive for excellence in every project, delivering solutions that exceed expectations.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description:
      "We believe in the power of teamwork and close partnership with our clients.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description:
      "We embrace new technologies and creative approaches to solve complex problems.",
  },
  {
    icon: Heart,
    title: "Integrity",
    description:
      "Transparency and honesty guide all our interactions and business decisions.",
  },
];

const About = () => {
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
              About Us
            </span>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6"
              style={{ fontFamily: "'Nasalization', sans-serif" }}
            >
              Driving Innovation Through{" "}
              <span className="hero-text-gradient">Technology</span>
            </h1>
            <p className="text-lg text-white/70 max-w-3xl">
              We are a team of passionate technologists and strategists dedicated
              to helping businesses thrive in the digital age.
            </p>
          </section>

          {/* COMPANY OVERVIEW */}
          <section className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2
                className="text-3xl md:text-4xl font-bold text-white mb-6"
                style={{ fontFamily: "'Nasalization', sans-serif" }}
              >
                Who We Are
              </h2>
              <p className="text-white/70 mb-6 leading-relaxed">
                QThink Solutions is a premier product development and consultancy
                firm focused on transforming innovative ideas into impactful
                digital products.
              </p>
              <p className="text-white/70 mb-6 leading-relaxed">
                Our team consists of developers, designers, and strategists who
                believe in long-term partnerships—not just delivery.
              </p>
              <p className="text-white/70 leading-relaxed">
                We also empower future professionals through hands-on training
                and mentorship programs.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                [8, "Years Experience"],
                [50, "Projects Delivered"],
                [500, "Professionals Trained"],
                [25, "Team Members"],
              ].map(([value, label], index) => (
                <div
                  key={label}
                  className="text-center p-6 rounded-xl border border-white/10 bg-white/5 cursor-pointer transition-all duration-300 hover:scale-105 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10"
                >
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <CountUp 
                      to={value} 
                      className="text-3xl font-bold text-accent"
                      duration={2.5}
                      delay={index * 0.2}
                    />
                    <span className="text-3xl font-bold text-accent">+</span>
                  </div>
                  <p className="text-sm text-white/60">{label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* VISION & MISSION */}
          <section className="grid md:grid-cols-2 gap-10 mb-24">
            <div className="p-8 rounded-xl bg-black/40 backdrop-blur-md border-2 border-cyan-500/50 cursor-pointer transition-all duration-300 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20"
                 style={{ transform: 'scale(1)', transition: 'transform 0.3s ease' }}
                 onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                 onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <div className="w-14 h-14 mb-6 rounded-xl bg-accent/20 text-accent flex items-center justify-center">
                <Eye />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Our Vision
              </h3>
              <p className="text-white/70">
                To empower businesses and professionals to unlock the full
                potential of technology through innovation and expertise.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-black/40 backdrop-blur-md border-2 border-cyan-500/50 cursor-pointer transition-all duration-300 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20"
                 style={{ transform: 'scale(1)', transition: 'transform 0.3s ease' }}
                 onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                 onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <div className="w-14 h-14 mb-6 rounded-xl bg-accent/20 text-accent flex items-center justify-center">
                <Target />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Our Mission
              </h3>
              <p className="text-white/70">
                Delivering world-class digital solutions, strategic consulting,
                and transformative training with integrity and excellence.
              </p>
            </div>
          </section>

          {/* CORE VALUES */}
          <section>
            <div className="text-center mb-12">
              <span className="text-accent text-sm uppercase tracking-wider">
                What Drives Us
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">
                Our Core Values
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="p-6 rounded-xl bg-black/40 backdrop-blur-md border-2 border-cyan-500/50 cursor-pointer transition-all duration-300 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20"
                  style={{ transform: 'scale(1)', transition: 'transform 0.3s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div className="w-12 h-12 mb-4 rounded-lg bg-accent/20 text-accent flex items-center justify-center">
                    <value.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {value.title}
                  </h4>
                  <p className="text-sm text-white/70">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default About;
