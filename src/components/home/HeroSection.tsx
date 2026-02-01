import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Code2, Users } from "lucide-react";
import ModernButton from "@/components/ui/ModernButton";
import CountUp from "@/components/CountUp";

export function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden px-4 sm:px-6 lg:px-8 circuit-board-bg"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-float animation-delay-500" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-accent/5 to-transparent rounded-full" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
        <div className="absolute inset-0 z-[5] pointer-events-none">
          <div className="absolute inset-x-6 md:inset-x-8 top-6 bottom-6 rounded-3xl md:rounded-[2.5rem] bg-white/5 backdrop-blur-sm border border-white/10" />
        </div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10 px-0">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-6 pl-0">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight animate-fade-up animation-delay-100 font-orbitron tracking-tighter sm:tracking-tight">
                <span className="block">Building Tomorrow's</span>
                <span className="block hero-text-gradient mt-2">
                  Technology Solutions
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white/80 leading-relaxed animate-fade-up animation-delay-200">
                QThink Solutions delivers innovative digital products, strategic
                technology consulting, and professional training programs that
                drive real business results.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animation-delay-300">
              <ModernButton
                text="Explore Services"
                onClick={() => (window.location.href = "/services")}
              />
              <ModernButton
                text="View Training Programs"
                onClick={() => (window.location.href = "/training")}
              />
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20 animate-fade-up animation-delay-400">
              <div className="text-center">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-2">
                  <Code2 className="w-5 h-5 text-cyan-400" />
                  <div className="flex items-center gap-0.5">
                    <CountUp
                      to={50}
                      className="text-4xl sm:text-5xl md:text-6xl font-black text-white"
                      duration={2.5}
                      delay={0.5}
                    />
                    <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
                      +
                    </span>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-white/70">
                  Projects Delivered
                </p>
              </div>

              <div className="text-center">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <div className="flex items-center gap-0.5">
                    <CountUp
                      to={500}
                      className="text-4xl sm:text-5xl md:text-6xl font-black text-white"
                      duration={2.5}
                      delay={0.7}
                    />
                    <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
                      +
                    </span>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-white/70">
                  Professionals Trained
                </p>
              </div>

              <div className="text-center">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <div className="flex items-center gap-0.5">
                    <CountUp
                      to={98}
                      className="text-4xl sm:text-5xl md:text-6xl font-black text-white"
                      duration={2.5}
                      delay={0.9}
                    />
                    <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
                      %
                    </span>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-white/70">
                  Client Satisfaction
                </p>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative -mt-8 lg:-mt-12 lg:scale-110 lg:translate-x-8">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 space-y-6 overflow-visible min-h-[500px]">
              {/* Card 1 */}
              <div className="transform hover:scale-105 transition-transform duration-300">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-md border border-white/20 animate-fade-up animation-delay-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-cyan-500 rounded-lg flex items-center justify-center text-white text-2xl">
                      💡
                    </div>
                    <div className="text-white font-semibold text-lg">
                      Product Development
                    </div>
                  </div>
                  <div className="text-base text-white/70">
                    Custom software solutions built with cutting-edge technology
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="transform hover:scale-105 transition-transform duration-300">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-md border border-white/20 animate-fade-up animation-delay-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-purple-500 rounded-lg flex items-center justify-center text-white text-2xl">
                      🎯
                    </div>
                    <div className="text-white font-semibold text-lg">
                      Strategic Consulting
                    </div>
                  </div>
                  <div className="text-base text-white/70">
                    Expert guidance for digital transformation and growth
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="transform hover:scale-105 transition-transform duration-300">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-md border border-white/20 animate-fade-up animation-delay-400">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-2xl">
                      📚
                    </div>
                    <div className="text-white font-semibold text-lg">
                      Professional Training
                    </div>
                  </div>
                  <div className="text-base text-white/70">
                    Hands-on programs for real-world skill development
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
