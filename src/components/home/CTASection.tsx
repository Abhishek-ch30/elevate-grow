import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ModernButton from "@/components/ui/ModernButton";
import { ArrowRight, MessageCircle } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Circuit Board Pattern - Matching Other Sections */}
      <div className="absolute inset-0 circuit-board-bg opacity-30"></div>
      
      {/* White Glass Overlay */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <div className="absolute inset-2 md:inset-8 rounded-3xl md:rounded-[2.5rem] bg-white/5 backdrop-blur-sm border border-white/10" />
      </div>
      
      <div className="container mx-auto px-2 md:px-8 py-6 relative z-10">
        <div className="relative overflow-hidden rounded-3xl bg-black/40 backdrop-blur-md p-12 md:p-16 border border-cyan-500/20">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/15 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-6">
              Let's Build Something
              <span className="hero-text-gradient"> Amazing Together</span>
            </h2>
            <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
              Whether you need a digital product, strategic guidance, or professional training, 
              we're here to help you succeed. Get in touch with our team today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ModernButton 
                text="Get in Touch"
                onClick={() => window.location.href = '/contact'}
              />
              <ModernButton 
                text="Explore Services"
                onClick={() => window.location.href = '/services'}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
