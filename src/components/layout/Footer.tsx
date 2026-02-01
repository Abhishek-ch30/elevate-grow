import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Twitter, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-black text-white overflow-hidden">
      {/* Circuit Board Pattern */}
      <div className="absolute inset-0 circuit-board-bg opacity-30"></div>

      {/* White Glass Overlay */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <div className="absolute inset-1 md:inset-6 rounded-3xl md:rounded-[2.5rem] bg-white/5 backdrop-blur-sm border border-white/10" />
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Brand Column */}
          <div className="space-y-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="https://i.ibb.co/wFJCHfcK/Screenshot-2026-01-21-121113.png"
                alt="QThink Solutions Logo"
                className="w-10 h-10 rounded-lg object-contain"
              />
              <span className="text-xl font-heading font-semibold hero-text-gradient">
                QThink Solutions
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              Empowering businesses through innovative product development, strategic consultancy, and cutting-edge training programs.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-cyan-400 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-cyan-400 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-cyan-400 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 hero-text-gradient">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Services", href: "/services" },
                { label: "Training Programs", href: "/training" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-cyan-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 hero-text-gradient">Our Services</h4>
            <ul className="space-y-3">
              {[
                "Product Development",
                "Consultancy",
                "UI/UX Design",
                "Technical Training",
                "Cloud Solutions",
              ].map((service) => (
                <li key={service}>
                  <span className="text-white/70 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4 hero-text-gradient">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm">
                  Agti Nagar, Vennampatti Housing Board,
                  Dharmapuri-5
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-cyan-400 shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="text-white/70 hover:text-cyan-400 transition-colors text-sm"
                >
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-cyan-400 shrink-0" />
                <a
                  href="mailto:hello@QThinkSolutions.com"
                  className="text-white/70 hover:text-cyan-400 transition-colors text-sm"
                >
                  hello@QThinkSolutions.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} QThink Solutions. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="text-white/50 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-white/50 hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
