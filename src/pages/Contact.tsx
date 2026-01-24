import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import ModernButton from "@/components/ui/ModernButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  const { toast } = useToast();

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
          <section className="mb-16">
            <span className="text-accent text-sm uppercase tracking-wider">
              Get In Touch
            </span>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6"
              style={{ fontFamily: "'Nasalization', sans-serif" }}
            >
              Let's Start a{" "}
              <span className="hero-text-gradient">Conversation</span>
            </h1>
            <p className="text-lg text-white/70 max-w-3xl">
              Have a project in mind or want to learn more about our services? We'd love to hear from you.
            </p>
          </section>
          {/* CONTACT SECTION */}
          <section>
            <div className="grid lg:grid-cols-5 gap-12">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-2xl font-heading font-semibold text-white mb-6">
                    Contact Information
                  </h2>
                  <p className="text-white/70 mb-8">
                    Reach out to us through any of the following channels. We typically respond within 24 hours.
                  </p>
                </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-1">Email</h4>
                    <a href="mailto:hello@QThinkSolutions.com" className="text-white/60 hover:text-cyan-400 transition-colors">
                      hello@QThinkSolutions.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-1">Phone</h4>
                    <a href="tel:+919876543210" className="text-white/60 hover:text-cyan-400 transition-colors">
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-1">Office</h4>
                    <p className="text-white/60">
                      Agti Nagar, Vennampatti Housing Board,<br />
                      Dharmapuri-5
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-1">Business Hours</h4>
                    <p className="text-white/60">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 2:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* SOCIAL LINKS */}
              <div className="pt-6 border-t border-cyan-500/30">
                <h4 className="font-medium text-white mb-4">Follow Us</h4>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="w-10 h-10 rounded-lg bg-black/40 border border-cyan-500/30 flex items-center justify-center text-white/60 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-lg bg-black/40 border border-cyan-500/30 flex items-center justify-center text-white/60 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

              {/* CONTACT FORM */}
              <div className="lg:col-span-3">
                <div className="p-8 rounded-2xl bg-black/40 backdrop-blur-md border-2 border-cyan-500/50 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300"
                     style={{ transform: 'scale(1)', transition: 'transform 0.3s ease' }}
                     onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                     onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  <h2 className="text-2xl font-heading font-semibold text-white mb-6">
                    Send Us a Message
                  </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white/80">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-black/40 border-cyan-500/30 text-white placeholder:text-white/60 focus:border-cyan-400 [&:-webkit-autofill]:bg-black/40 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:border-cyan-500/30 [&:autofill]:bg-black/40 [&:autofill]:text-white [&:autofill]:border-cyan-500/30"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white/80">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-black/40 border-cyan-500/30 text-white placeholder:text-white/60 focus:border-cyan-400 [&:-webkit-autofill]:bg-black/40 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:border-cyan-500/30 [&:autofill]:bg-black/40 [&:autofill]:text-white [&:autofill]:border-cyan-500/30"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-white/80">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="How can we help you?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="bg-black/40 border-cyan-500/30 text-white placeholder:text-white/60 focus:border-cyan-400 [&:-webkit-autofill]:bg-black/40 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:border-cyan-500/30 [&:autofill]:bg-black/40 [&:autofill]:text-white [&:autofill]:border-cyan-500/30"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-white/80">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your project or inquiry..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-black/40 border-cyan-500/30 text-white placeholder:text-white/60 focus:border-cyan-400 [&:-webkit-autofill]:bg-black/40 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:border-cyan-500/30 [&:autofill]:bg-black/40 [&:autofill]:text-white [&:autofill]:border-cyan-500/30"
                      required
                    />
                  </div>
                  <div className="flex justify-center">
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
      </div>
    </PageLayout>
  );
};

export default Contact;
