import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/training", label: "Training" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHeroPage = location.pathname === "/" || location.pathname === "/about";

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-card/95 backdrop-blur-md shadow-md py-3"
          : isHeroPage
          ? "bg-transparent py-5"
          : "bg-card py-4 shadow-sm"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300",
              isScrolled || !isHeroPage
                ? "bg-primary text-primary-foreground"
                : "bg-white/20 text-white backdrop-blur-sm"
            )}
          >
            <GraduationCap className="w-6 h-6" />
          </div>
          <span
            className={cn(
              "text-xl font-heading font-semibold transition-colors duration-300",
              isScrolled || !isHeroPage ? "text-foreground" : "text-white"
            )}
          >
            TechNova
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "text-sm font-medium transition-colors duration-200 relative group",
                location.pathname === link.href
                  ? isScrolled || !isHeroPage
                    ? "text-accent"
                    : "text-white"
                  : isScrolled || !isHeroPage
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-white/80 hover:text-white"
              )}
            >
              {link.label}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300",
                  location.pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                )}
              />
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link to="/admin">
            <Button
              variant={isScrolled || !isHeroPage ? "ghost" : "hero-outline"}
              size="sm"
            >
              Admin
            </Button>
          </Link>
          <Link to="/training">
            <Button variant="accent" size="sm">
              Enroll Now
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X
              className={cn(
                "w-6 h-6",
                isScrolled || !isHeroPage ? "text-foreground" : "text-white"
              )}
            />
          ) : (
            <Menu
              className={cn(
                "w-6 h-6",
                isScrolled || !isHeroPage ? "text-foreground" : "text-white"
              )}
            />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-card shadow-lg border-t animate-fade-in">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-base font-medium py-2 transition-colors",
                  location.pathname === link.href
                    ? "text-accent"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t">
              <Link to="/admin" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full">
                  Admin Login
                </Button>
              </Link>
              <Link to="/training" onClick={() => setIsOpen(false)}>
                <Button variant="accent" className="w-full">
                  Enroll Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
