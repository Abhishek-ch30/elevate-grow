import { useState, useEffect, useRef } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import ModernButton from "@/components/ui/ModernButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  Linkedin,
  Twitter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute('data-section') || '';
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(sectionId));
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <PageLayout>
      <div className="relative min-h-screen bg-black overflow-hidden">
        {/* Circuit Board Pattern - Matching Other Sections */}
        <div className="absolute inset-0 circuit-board-bg opacity-30"></div>

        {/* White Glass Overlay - Matching Other Sections */}
        <div className="absolute inset-0 z-[5] pointer-events-none">
          <div className="absolute inset-2 md:inset-8 rounded-3xl md:rounded-[2.5rem] bg-white/5 backdrop-blur-sm border border-white/10" />
        </div>

        {/* Content Container */}
        <div className="container mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* HERO */}
          <section 
            ref={(el) => (sectionRefs.current[0] = el)}
            data-section="hero"
            className={cn(
              "text-center mb-20 transition-all duration-1200",
              visibleSections.has('hero') ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-20 scale-95"
            )}
          >
            <span className={cn(
              "text-cyan-400 font-medium text-sm uppercase tracking-wider inline-block transition-all duration-700 delay-200",
              visibleSections.has('hero') ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            )}>
              Get In Touch
            </span>
            <h1 className={cn(
              "text-4xl md:text-5xl font-heading font-bold text-white mt-4 mb-6 transition-all duration-800 delay-300",
              visibleSections.has('hero') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
              Let's Start a{" "}
              <span className="hero-text-gradient">Conversation</span>
            </h1>
            <p className={cn(
              "text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-500",
              visibleSections.has('hero') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}>
              Have a project in mind or want to learn more about our services? We'd love to hear from you.
            </p>
          </section>
          {/* CONTACT SECTION */}
          <section 
            ref={(el) => (sectionRefs.current[1] = el)}
            data-section="contact"
            className={cn(
              "transition-all duration-1000 delay-200",
              visibleSections.has('contact') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            )}
          >
            <div className="grid lg:grid-cols-5 gap-12">
              <div className={cn(
                "lg:col-span-2 space-y-8 transition-all duration-800 delay-300",
                visibleSections.has('contact') ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
              )}>
                <div>
                  <h2 className="text-2xl font-heading font-semibold text-white mb-6">
                    Contact Information
                  </h2>
                  <p className="text-gray-300 mb-8 leading-relaxed">
                    Reach out to us through any of the following channels. We typically respond within 24 hours.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    { icon: Mail, label: "Email", value: "hello@QThinkSolutions.com", href: "mailto:hello@QThinkSolutions.com" },
                    { icon: Phone, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
                    { icon: MapPin, label: "Office", value: "Agti Nagar, Vennampatti Housing Board, Dharmapuri-5", href: null },
                    { icon: Clock, label: "Business Hours", value: "Monday - Friday: 9:00 AM - 6:00 PM | Saturday: 10:00 AM - 2:00 PM", href: null }
                  ].map((item, index) => (
                    <div 
                      key={item.label}
                      className={cn(
                        "flex items-start gap-4 transition-all duration-700",
                        visibleSections.has('contact') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                      )}
                      style={{ transitionDelay: visibleSections.has('contact') ? `${400 + index * 150}ms` : '0ms' }}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 transition-all duration-800",
                        visibleSections.has('contact') ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-180 opacity-0"
                      )}
                        style={{ transitionDelay: visibleSections.has('contact') ? `${500 + index * 150}ms` : '0ms' }}
                      >
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white mb-1">{item.label}</h4>
                        {item.href ? (
                          <a href={item.href} className="text-gray-400 hover:text-cyan-400 transition-colors">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-gray-400">
                            {item.value.split('|').map((line, i) => (
                              <span key={i}>
                                {line.trim()}
                                {i < item.value.split('|').length - 1 && <br />}
                              </span>
                            ))}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* SOCIAL LINKS */}
                <div className={cn(
                  "pt-4 border-t border-cyan-500/30 transition-all duration-700 delay-800",
                  visibleSections.has('contact') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                )}>
                  <h4 className="font-medium text-white mb-4">Follow Us</h4>
                  <div className="flex gap-3">
                    {[
                      { icon: Linkedin, label: "LinkedIn" },
                      { icon: Twitter, label: "Twitter" }
                    ].map((social, index) => (
                      <a
                        key={social.label}
                        href="#"
                        className={cn(
                          "w-10 h-10 rounded-lg bg-black/40 border border-cyan-500/30 flex items-center justify-center text-gray-400 hover:border-cyan-400 hover:text-cyan-400 transition-all duration-500",
                          visibleSections.has('contact') ? "opacity-100 scale-100" : "opacity-0 scale-90"
                        )}
                        style={{ transitionDelay: visibleSections.has('contact') ? `${900 + index * 100}ms` : '0ms' }}
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* CONTACT FORM */}
              <div className={cn(
                "lg:col-span-3 transition-all duration-800 delay-500",
                visibleSections.has('contact') ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
              )}>
                <div className={cn(
                  "p-8 rounded-2xl bg-black/40 backdrop-blur-md border-2 border-cyan-500/50 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-700",
                  visibleSections.has('contact') ? "opacity-100 scale-100" : "opacity-0 scale-95"
                )}
                style={{ 
                  transform: visibleSections.has('contact') ? 'scale(1)' : 'scale(0.95)',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <h2 className={cn(
                    "text-2xl font-heading font-semibold text-white mb-6 transition-all duration-700 delay-200",
                    visibleSections.has('contact') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  )}>
                    Send Us a Message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className={cn(
                      "grid sm:grid-cols-2 gap-6 transition-all duration-700 delay-300",
                      visibleSections.has('contact') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}>
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="bg-black/40 border-cyan-500/30 text-white placeholder:text-gray-500 focus:border-cyan-400 [&:-webkit-autofill]:bg-black/40 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:border-cyan-500/30 [&:autofill]:bg-black/40 [&:autofill]:text-white [&:autofill]:border-cyan-500/30"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-300">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="bg-black/40 border-cyan-500/30 text-white placeholder:text-gray-500 focus:border-cyan-400 [&:-webkit-autofill]:bg-black/40 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:border-cyan-500/30 [&:autofill]:bg-black/40 [&:autofill]:text-white [&:autofill]:border-cyan-500/30"
                          required
                        />
                      </div>
                    </div>
                    <div className={cn(
                      "space-y-2 transition-all duration-700 delay-400",
                      visibleSections.has('contact') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}>
                      <Label htmlFor="subject" className="text-gray-300">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="How can we help you?"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="bg-black/40 border-cyan-500/30 text-white placeholder:text-gray-500 focus:border-cyan-400 [&:-webkit-autofill]:bg-black/40 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:border-cyan-500/30 [&:autofill]:bg-black/40 [&:autofill]:text-white [&:autofill]:border-cyan-500/30"
                        required
                      />
                    </div>
                    <div className={cn(
                      "space-y-2 transition-all duration-700 delay-500",
                      visibleSections.has('contact') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}>
                      <Label htmlFor="message" className="text-gray-300">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your project or inquiry..."
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="bg-black/40 border-cyan-500/30 text-white placeholder:text-gray-500 focus:border-cyan-400 [&:-webkit-autofill]:bg-black/40 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:border-cyan-500/30 [&:autofill]:bg-black/40 [&:autofill]:text-white [&:autofill]:border-cyan-500/30"
                        required
                      />
                    </div>
                    <div className={cn(
                      "flex justify-center transition-all duration-700 delay-600",
                      visibleSections.has('contact') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}>
                      <ModernButton 
                        text={isSubmitting ? "Sending..." : "Send Message"}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default Contact;
