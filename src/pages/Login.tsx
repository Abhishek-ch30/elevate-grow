import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ModernButton from "@/components/ui/ModernButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const { signIn, user } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state or default
  const from = location.state?.from?.pathname || "/dashboard";

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      // Check if user is admin and redirect accordingly
      if (user.role === 'admin' && user.is_admin === true) {
        // If admin was trying to access admin routes, redirect to admin dashboard
        if (from.startsWith('/admin')) {
          navigate(from, { replace: true });
        } else {
          navigate("/admin", { replace: true });
        }
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [user, navigate, from]);

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
    setIsLoading(true);

    const { error, user: loggedInUser } = await signIn({ email: formData.email, password: formData.password });

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred during login.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Login Successful!",
        description: "Welcome back to QThink Solutions.",
      });
      
      // Check if logged in user is admin and redirect accordingly
      if (loggedInUser?.role === 'admin' && loggedInUser?.is_admin === true) {
        // If admin was trying to access admin routes, redirect to intended page
        if (from.startsWith('/admin')) {
          navigate(from, { replace: true });
        } else {
          navigate("/admin", { replace: true });
        }
      } else {
        navigate(from, { replace: true });
      }
    }

    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoogleSignIn = () => {
    // Handle Google Sign-In logic here
    toast({
      title: "Google Sign-In",
      description: "Google sign-in functionality coming soon!",
    });
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Circuit Board Pattern - Matching Other Sections */}
      <div className="absolute inset-0 circuit-board-bg opacity-30"></div>

      {/* LOGIN CONTAINER */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-3 sm:px-6 lg:px-8 py-8">
        <div className={cn(
          "w-full max-w-6xl bg-white/5 backdrop-blur-xl rounded-3xl md:rounded-[2.5rem] border border-white/15 shadow-2xl p-10 md:p-16 transition-all duration-1200",
          visibleSections.has('login') ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
        ref={(el) => (sectionRefs.current[0] = el)}
        data-section="login"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* LOGIN FORM CONTAINER */}
            <div className={cn(
              "flex-1 max-w-md transition-all duration-800 delay-200",
              visibleSections.has('login') ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
            )}>
              {/* LOGO SECTION */}
              <div className={cn(
                "text-center mb-6 transition-all duration-700 delay-300",
                visibleSections.has('login') ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
              )}>
                <Link to="/" className="inline-flex items-center gap-3 mb-4">
                  <img
                    src="https://i.ibb.co/wFJCHfcK/Screenshot-2026-01-21-121113.png"
                    alt="QThink Solutions Logo"
                    className="w-12 h-12 rounded-lg object-contain transition-transform duration-500 hover:scale-110"
                  />
                  <span className="text-xl font-heading font-semibold text-white">
                    QThink Solutions
                  </span>
                </Link>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Welcome back
                </h2>
                <p className="text-gray-300 text-base">
                  Welcome back! Please enter your details
                </p>
              </div>

              {/* LOGIN FORM */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* EMAIL FIELD */}
                <div className={cn(
                  "space-y-2 transition-all duration-700 delay-400",
                  visibleSections.has('login') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                )}>
                  <Label htmlFor="email" className="text-gray-300 text-base">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 bg-black/40 border-cyan-500/30 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:bg-black/40 focus:outline-none rounded-lg"
                      style={{
                        WebkitTextFillColor: 'white',
                        WebkitBoxShadow: '0 0 0px 1000px rgb(0 0 0 / 0.4) inset',
                        transition: 'background-color 5000s ease-in-out 0s',
                      }}
                      required
                    />
                  </div>
                </div>

                {/* PASSWORD FIELD */}
                <div className={cn(
                  "space-y-2 transition-all duration-700 delay-500",
                  visibleSections.has('login') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                )}>
                  <Label htmlFor="password" className="text-gray-300 text-base">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10 bg-black/40 border-cyan-500/30 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:bg-black/40 focus:outline-none rounded-lg"
                      style={{
                        WebkitTextFillColor: 'white',
                        WebkitBoxShadow: '0 0 0px 1000px rgb(0 0 0 / 0.4) inset',
                        transition: 'background-color 5000s ease-in-out 0s',
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* REMEMBER & FORGOT */}
                <div className={cn(
                  "flex items-center justify-between transition-all duration-700 delay-600",
                  visibleSections.has('login') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="rounded border-cyan-500/30 bg-black/40 text-cyan-400 focus:ring-cyan-400 focus:ring-offset-0"
                    />
                    <Label htmlFor="remember" className="text-gray-300 text-base">Remember me</Label>
                  </div>
                  <Link to="/forgot-password" className="text-cyan-400 hover:text-cyan-300 text-base transition-colors">
                    Forgot password?
                  </Link>
                </div>

                {/* SIGN IN BUTTON */}
                <button
                  type="submit"
                  className={cn(
                    "w-full flex items-center justify-center gap-3 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 py-3 px-4 rounded-lg hover:bg-cyan-500/30 hover:border-cyan-400 transition-all duration-500 font-medium",
                    visibleSections.has('login') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}
                  style={{ transitionDelay: visibleSections.has('login') ? '700ms' : '0ms' }}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              {/* DIVIDER */}
              <div className={cn(
                "flex items-center my-4 transition-all duration-700 delay-800",
                visibleSections.has('login') ? "opacity-100" : "opacity-0"
              )}>
                <div className="flex-1 h-px bg-white/20"></div>
                <span className="px-4 text-gray-400 text-base">or</span>
                <div className="flex-1 h-px bg-white/20"></div>
              </div>

              {/* GOOGLE SIGN IN */}
              <button
                onClick={handleGoogleSignIn}
                className={cn(
                  "w-full flex items-center justify-center gap-3 bg-black/40 border border-cyan-500/30 text-white py-3 px-4 rounded-lg hover:bg-black/60 hover:border-cyan-400 transition-all duration-500",
                  visibleSections.has('login') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: visibleSections.has('login') ? '900ms' : '0ms' }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              {/* SIGN UP LINK */}
              <div className={cn(
                "text-center mt-4 transition-all duration-700 delay-1000",
                visibleSections.has('login') ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}>
                <p className="text-gray-400 text-base">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>

            {/* VERTICAL LINE */}
            <div className="hidden md:block h-96 w-px bg-white/20 mt-8"></div>

            {/* IMAGE SECTION */}
            <div className={cn(
              "hidden md:flex flex-1 items-center justify-center mt-8 transition-all duration-800 delay-400",
              visibleSections.has('login') ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
            )}>
              <div className="relative w-full max-w-md">
                <img
                  src="https://i.ibb.co/5xsy5mT5/Secure-login-bro.jpg"
                  alt="Secure login illustration"
                  className="w-full h-auto rounded-2xl object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-cyan-500/10 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
