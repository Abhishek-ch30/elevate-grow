import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Mail, Lock, ArrowRight, User, Phone, Building, GraduationCap, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";

const Signup = () => {
  const { signUp, user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    profession: "",
    college: "",
    company: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      // Check if user is admin and redirect accordingly
      if (user.role === 'admin' && user.is_admin === true) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

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
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error, user } = await signUp({
      full_name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone ? parseInt(formData.phone) : undefined,
      profession: formData.profession as 'student' | 'professional',
      college: formData.college || undefined,
      company: formData.company || undefined
    });

    if (error) {
      toast({
        title: "Signup Failed",
        description: error.message || "An error occurred during signup.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Account Created Successfully!",
        description: "Welcome to ElevateGrow! You're now logged in.",
      });
      
      // Check if created user is admin and redirect accordingly
      if (user?.role === 'admin' && user?.is_admin === true) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }

    setIsLoading(false);
  };

  const passwordChecks = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  const allChecksPassed = Object.values(passwordChecks).every(Boolean);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfessionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      profession: value,
      college: value === "student" ? "" : prev.college,
      company: value === "professional" ? "" : prev.company,
    }));
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Circuit Board Pattern - Matching Other Sections */}
      <div className="absolute inset-0 circuit-board-bg opacity-30"></div>

      {/* Centered Signup Card */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-3 sm:px-6 lg:px-8 py-8">
        <div className={cn(
          "w-full max-w-4xl bg-white/5 backdrop-blur-xl rounded-3xl md:rounded-[2.5rem] border border-white/15 shadow-2xl p-10 md:p-16 flex flex-col items-center gap-8 transition-all duration-1200",
          visibleSections.has('signup') ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
        ref={(el) => (sectionRefs.current[0] = el)}
        data-section="signup"
        >
          {/* Logo & Heading */}
          <div className={cn(
            "text-center transition-all duration-700 delay-200",
            visibleSections.has('signup') ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
          )}>
            <Link to="/" className="inline-flex items-center gap-2 mb-2">
              <img
                src="https://i.ibb.co/wFJCHfcK/Screenshot-2026-01-21-121113.png"
                alt="QThink Solutions Logo"
                className="w-10 h-10 rounded-lg object-contain transition-transform duration-500 hover:scale-110"
              />
              <span className="text-base font-heading font-semibold text-white">
                QThink Solutions
              </span>
            </Link>
            <h2 className="text-3xl font-bold text-white">Create Account</h2>
            <p className="text-gray-300 text-base text-center">Join us today! Please fill in your details</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            {/* Name */}
            <div className={cn(
              "transition-all duration-700 delay-300",
              visibleSections.has('signup') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}>
              <Label htmlFor="name" className="text-gray-300 text-base mb-1 block">Full Name *</Label>
              <div className="flex items-center gap-3 bg-black/40 border border-cyan-500/30 rounded-lg px-3 py-2 focus-within:border-cyan-400">
                <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="
                      bg-transparent
                      border-none
                      text-white
                      placeholder:text-gray-500
                      w-full

                      focus:outline-none
                      focus:ring-0
                      focus:ring-offset-0
                      focus-visible:outline-none
                      focus-visible:ring-0
                      focus-visible:ring-offset-0 shadow-none focus:shadow-none focus-visible:shadow-none appearance-none"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className={cn(
              "transition-all duration-700 delay-400",
              visibleSections.has('signup') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}>
              <Label htmlFor="phone" className="text-gray-300 text-base mb-1 block">Phone Number *</Label>
              <div className="flex items-center gap-3 bg-black/40 border border-cyan-500/30 rounded-lg px-3 py-2 focus-within:border-cyan-400">
                <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="
                      bg-transparent
                      border-none
                      text-white
                      placeholder:text-gray-500
                      w-full

                      focus:outline-none
                      focus:ring-0
                      focus:ring-offset-0
                      focus-visible:outline-none
                      focus-visible:ring-0
                      focus-visible:ring-offset-0 shadow-none focus:shadow-none focus-visible:shadow-none appearance-none"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className={cn(
              "transition-all duration-700 delay-500",
              visibleSections.has('signup') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}>
              <Label htmlFor="email" className="text-gray-300 text-base mb-1 block">Email Address *</Label>
              <div className="flex items-center gap-3 bg-black/40 border border-cyan-500/30 rounded-lg px-3 py-2 focus-within:border-cyan-400">
                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="
                      bg-transparent
                      border-none
                      text-white
                      placeholder:text-gray-500
                      w-full

                      focus:outline-none
                      focus:ring-0
                      focus:ring-offset-0
                      focus-visible:outline-none
                      focus-visible:ring-0
                      focus-visible:ring-offset-0 shadow-none focus:shadow-none focus-visible:shadow-none appearance-none"
                  required
                />
              </div>
            </div>

            {/* Profession */}
            <div>
              <Label htmlFor="profession" className="text-white/80 text-base mb-1 block">Profession *</Label>
              <div className="flex items-center gap-3 bg-black/40 border border-cyan-500/30 rounded-lg px-3 py-1.5 focus-within:border-cyan-400">
                <Building className="w-5 h-5 text-white/60 flex-shrink-0" />
                <select
                  id="profession"
                  value={formData.profession}
                  onChange={(e) => handleProfessionChange(e.target.value)}
                  className="
                      bg-transparent
                      border-none
                      text-white
                      placeholder:text-white/60
                      w-full

                      focus:outline-none
                      focus:ring-0
                      focus:ring-offset-0
                      focus-visible:outline-none
                      focus-visible:ring-0
                      focus-visible:ring-offset-0 shadow-none focus:shadow-none focus-visible:shadow-none appearance-none"
                  required
                >
                  <option className="text-black" value="">Select profession</option>
                  <option className="text-black" value="student">Student</option>
                  <option className="text-black" value="professional">Professional</option>
                </select>
              </div>
            </div>


            {/* Dynamic College/Company */}
            {formData.profession === "student" && (
              <div>
                <Label htmlFor="college" className="text-white/80 text-base mb-1 block">College/University *</Label>
                <div className="flex items-center gap-3 bg-black/40 border border-cyan-500/30 rounded-lg px-3 py-2 focus-within:border-cyan-400">
                  <GraduationCap className="w-5 h-5 text-white/60 flex-shrink-0" />
                  <Input
                    id="college"
                    type="text"
                    placeholder="Enter your college name"
                    value={formData.college}
                    onChange={(e) => handleInputChange("college", e.target.value)}
                    className="
                      bg-transparent
                      border-none
                      text-white
                      placeholder:text-white/60
                      w-full

                      focus:outline-none
                      focus:ring-0
                      focus:ring-offset-0
                      focus-visible:outline-none
                      focus-visible:ring-0
                      focus-visible:ring-offset-0 shadow-none focus:shadow-none focus-visible:shadow-none appearance-none"
                    required
                  />
                </div>
              </div>
            )}
            {formData.profession === "professional" && (
              <div>
                <Label htmlFor="company" className="text-white/80 text-base mb-1 block">Company *</Label>
                <div className="flex items-center gap-3 bg-black/40 border border-cyan-500/30 rounded-lg px-3 py-2 focus-within:border-cyan-400">
                  <Building className="w-5 h-5 text-white/60 flex-shrink-0" />
                  <Input
                    id="company"
                    type="text"
                    placeholder="Enter your company name"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    className="
                      bg-transparent
                      border-none
                      text-white
                      placeholder:text-white/60
                      w-full

                      focus:outline-none
                      focus:ring-0
                      focus:ring-offset-0
                      focus-visible:outline-none
                      focus-visible:ring-0
                      focus-visible:ring-offset-0 shadow-none focus:shadow-none focus-visible:shadow-none appearance-none"
                    required
                  />
                </div>
              </div>
            )}

            {/* Password Section */}
            <div>
              <Label htmlFor="password" className="text-white/80 text-base mb-1 block">Password *</Label>
              <div className="flex items-center gap-3 bg-black/40 border border-cyan-500/30 rounded-lg px-3 py-2 focus-within:border-cyan-400 relative">
                <Lock className="w-5 h-5 text-white/60 flex-shrink-0" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="
                      bg-transparent
                      border-none
                      text-white
                      placeholder:text-white/60
                      w-full

                      focus:outline-none
                      focus:ring-0
                      focus:ring-offset-0
                      focus-visible:outline-none
                      focus-visible:ring-0
                      focus-visible:ring-offset-0 shadow-none focus:shadow-none focus-visible:shadow-none appearance-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-cyan-400 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Password Rules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-2 px-1">
                {Object.entries(passwordChecks).map(([key, passed]) => {
                  const labelMap: any = {
                    length: "8+ characters",
                    uppercase: "Uppercase letter",
                    lowercase: "Lowercase letter",
                    number: "Number",
                    special: "Special character",
                  };
                  return (
                    <div key={key} className="flex items-center gap-1 text-base">
                      {passed ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <X className="w-3 h-3 text-red-400" />
                      )}
                      <span className={passed ? "text-green-400" : "text-red-400"}>
                        {labelMap[key]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Confirm Password */}
            {allChecksPassed && (
              <div>
                <Label htmlFor="confirmPassword" className="text-white/80 text-base mb-1 block">Confirm Password *</Label>
                <div className="flex items-center gap-3 bg-black/40 border border-cyan-500/30 rounded-lg px-3 py-2 focus-within:border-cyan-400 relative">
                  <Lock className="w-5 h-5 text-white/60 flex-shrink-0" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="
                      bg-transparent
                      border-none
                      text-white
                      placeholder:text-white/60
                      w-full

                      focus:outline-none
                      focus:ring-0
                      focus:ring-offset-0
                      focus-visible:outline-none
                      focus-visible:ring-0
                      focus-visible:ring-offset-0 shadow-none focus:shadow-none focus-visible:shadow-none appearance-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-cyan-400 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <div className="flex items-center gap-1 text-base mt-1 px-1">
                    {formData.password === formData.confirmPassword ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <X className="w-3 h-3 text-red-400" />
                    )}
                    <span className={formData.password === formData.confirmPassword ? "text-green-400" : "text-red-400"}>
                      Passwords match
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 py-3 rounded-lg hover:bg-cyan-500/30 hover:border-cyan-400 transition-all duration-300 font-medium mt-2"
            >
              {isLoading ? "Creating account..." : "Create Account"}
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Login Link */}
            <p className="text-white/60 text-base text-center mt-2">
              Already have an account?{" "}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
