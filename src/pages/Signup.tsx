import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, ArrowRight, User, Phone, Building, GraduationCap, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

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
  const { toast } = useToast();
  const navigate = useNavigate();

  // Test Supabase connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing Supabase connection...');
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (error) {
          console.error('❌ Supabase connection failed:', error);
        } else {
          console.log('✅ Supabase connection successful');
        }
      } catch (err) {
        console.error('❌ Connection test error:', err);
      }
    };
    
    testConnection();
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

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
    
    const { error } = await signUp({
      email: formData.email,
      password: formData.password,
      fullName: formData.name,
      phone: formData.phone ? parseInt(formData.phone) : undefined,
      profession: formData.profession as 'student' | 'professional',
      college: formData.college || undefined,
      company: formData.company || undefined
    }, false); // Regular user signup
    
    if (error) {
      toast({
        title: "Signup Failed",
        description: error.message || "An error occurred during signup.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Account Created Successfully!",
        description: "Please check your email to verify your account.",
      });
      navigate("/login");
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
    <div className="relative min-h-screen bg-black circuit-board-bg overflow-hidden">
      {/* Background Effects */}
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

      {/* Centered Signup Card */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-lg bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/15 shadow-2xl p-8 flex flex-col items-center gap-6">
          {/* Logo & Heading */}
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <img
              src="https://i.ibb.co/wFJCHfcK/Screenshot-2026-01-21-121113.png"
              alt="QThink Solutions Logo"
              className="w-10 h-10 rounded-lg object-contain"
            />
            <span className="text-base font-heading font-semibold text-white">
              QThink Solutions
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <p className="text-white/70 text-sm text-center">Join us today! Please fill in your details</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            {/* Name */}
            <div>
              <Label htmlFor="name" className="text-white/80 text-sm mb-1 block">Full Name *</Label>
              <div className="flex items-center gap-3 bg-black/40 border border-cyan-500/30 rounded-lg px-3 py-2 focus-within:border-cyan-400">
                <User className="w-5 h-5 text-white/60 flex-shrink-0" />
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

            {/* Phone */}
            <div>
              <Label htmlFor="phone" className="text-white/80 text-sm mb-1 block">Phone Number *</Label>
              <div className="flex items-center gap-3 bg-black/40 border border-cyan-500/30 rounded-lg px-3 py-2 focus-within:border-cyan-400">
                <Phone className="w-5 h-5 text-white/60 flex-shrink-0" />
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

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-white/80 text-sm mb-1 block">Email Address *</Label>
              <div className="flex items-center gap-3 bg-black/40 border border-cyan-500/30 rounded-lg px-3 py-2 focus-within:border-cyan-400">
                <Mail className="w-5 h-5 text-white/60 flex-shrink-0" />
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

              {/* Profession */}
              <div>
                <Label htmlFor="profession" className="text-white/80 text-sm mb-1 block">Profession *</Label>
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
                <Label htmlFor="college" className="text-white/80 text-sm mb-1 block">College/University *</Label>
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
                <Label htmlFor="company" className="text-white/80 text-sm mb-1 block">Company *</Label>
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
              <Label htmlFor="password" className="text-white/80 text-sm mb-1 block">Password *</Label>
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
                    <div key={key} className="flex items-center gap-1 text-xs">
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
                <Label htmlFor="confirmPassword" className="text-white/80 text-sm mb-1 block">Confirm Password *</Label>
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
                  <div className="flex items-center gap-1 text-xs mt-1 px-1">
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
            <p className="text-white/60 text-sm text-center mt-2">
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
