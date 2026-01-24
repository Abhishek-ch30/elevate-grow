import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Code2, Users } from "lucide-react";
import ModernButton from "@/components/ui/ModernButton";
import CountUp from "@/components/CountUp";

export function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-start overflow-hidden pb-16 px-4 sm:px-6 lg:px-8 circuit-board-bg">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" />
<div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-float animation-delay-500" />

        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-float animation-delay-500" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-accent/5 to-transparent rounded-full" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        <div className="absolute inset-0 z-[5] pointer-events-none">
          <div className="absolute inset-6 rounded-[2.5rem] bg-white/5 backdrop-blur-sm border border-white/10" />
        </div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-5">
              {/* Main Heading */}
              <h1 className="text-1xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight animate-fade-up animation-delay-100" style={{ fontFamily: "'Nasalization', sans-serif" }}>
                Building Tomorrow's
                <span className="block hero-text-gradient">Technology Solutions</span>
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-white/70 leading-relaxed animate-fade-up animation-delay-200">
                QThink Solutions delivers innovative digital products, strategic technology consulting, 
                and professional training programs that drive real business results.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animation-delay-300">
              <ModernButton 
                text="Explore Services"
                onClick={() => window.location.href = '/services'}
              />
              <ModernButton 
                text="View Training Programs"
                onClick={() => window.location.href = '/training'}
              />
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-8 pt-3 border-t border-white/20 animate-fade-up animation-delay-400">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Code2 className="w-5 h-5 text-accent" />
                  <CountUp 
                    to={50} 
                    className="text-3xl md:text-4xl font-bold text-white"
                    duration={2.5}
                    delay={0.5}
                  />
                  <span className="text-3xl md:text-4xl font-bold text-white">+</span>
                </div>
                <p className="text-sm text-white/60">Projects Delivered</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-accent" />
                  <CountUp 
                    to={500} 
                    className="text-3xl md:text-4xl font-bold text-white"
                    duration={2.5}
                    delay={0.7}
                  />
                  <span className="text-3xl md:text-4xl font-bold text-white">+</span>
                </div>
                <p className="text-sm text-white/60">Professionals Trained</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <CountUp 
                    to={98} 
                    className="text-3xl md:text-4xl font-bold text-white"
                    duration={2.5}
                    delay={0.9}
                  />
                  <span className="text-3xl md:text-4xl font-bold text-white">%</span>
                </div>
                <p className="text-sm text-white/60">Client Satisfaction</p>
              </div>
            </div>
          </div>

          {/* Right Content - Visual Element */}
          <div className="relative -mt-6 lg:-mt-10 lg:scale-95">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-white/20 space-y-6 overflow-visible">

              {/* Card 1 */}
              <div className="transform hover:scale-105 transition-transform duration-300">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-md border border-white/20 animate-fade-up animation-delay-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center text-white">
                      💡
                    </div>
                    <div className="text-white font-semibold">Product Development</div>
                  </div>
                  <div className="text-sm text-white/70">
                    Custom software solutions built with cutting-edge technology
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="transform hover:scale-105 transition-transform duration-300">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-md border border-white/20 animate-fade-up animation-delay-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white">
                      🎯
                    </div>
                    <div className="text-white font-semibold">Strategic Consulting</div>
                  </div>
                  <div className="text-sm text-white/70">
                    Expert guidance for digital transformation and growth
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="transform hover:scale-105 transition-transform duration-300">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-md border border-white/20 animate-fade-up animation-delay-400">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-accent to-primary rounded-lg flex items-center justify-center text-white">
                      📚
                    </div>
                    <div className="text-white font-semibold">Professional Training</div>
                  </div>
                  <div className="text-sm text-white/70">
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
