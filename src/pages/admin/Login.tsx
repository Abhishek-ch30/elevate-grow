import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error, user } = await signIn({ email, password });

      if (error) {
        throw new Error(error.message);
      }

      // Check if user is admin
      if (!user || user.role !== 'admin' || !user.is_admin) {
        throw new Error('Access denied. Admin privileges required.');
      }

      toast({
        title: "Login Successful",
        description: "Welcome to Admin Dashboard",
      });
      navigate("/admin");
      
    } catch (error: any) {
      console.error('Admin login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black circuit-board-bg overflow-hidden">
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

      {/* LOGIN CONTAINER */}
      <div className="relative z-10 h-screen flex items-start justify-center px-4 pt-1 pb-4 overflow-hidden">
        <div className="w-full max-w-4xl bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/15 shadow-2xl p-6">
          <div className="flex items-center gap-8">
            {/* LOGIN FORM CONTAINER */}
            <div className="flex-1 max-w-md">
              {/* LOGO SECTION */}
              <div className="text-center mb-6">
                <Link to="/" className="inline-flex items-center gap-3 mb-4">
                  <img
                    src="https://i.ibb.co/wFJCHfcK/Screenshot-2026-01-21-121113.png"
                    alt="QThink Solution Logo"
                    className="w-12 h-12 rounded-lg object-contain"
                  />
                  <span className="text-xl font-heading font-semibold text-white">
                    QThink Solution
                  </span>
                </Link>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Admin Portal
                </h2>
                <p className="text-white/70 text-sm">
                  Welcome back! Please enter your admin credentials
                </p>
              </div>

              {/* LOGIN FORM */}
              <form onSubmit={handleLogin} className="space-y-3">
                {/* EMAIL FIELD */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/80 text-sm">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter admin email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-black/40 border-cyan-500/30 text-white placeholder:text-white/60 focus:border-cyan-400 focus:bg-black/40 focus:outline-none rounded-lg"
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
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/80 text-sm">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter admin password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-black/40 border-cyan-500/30 text-white placeholder:text-white/60 focus:border-cyan-400 focus:bg-black/40 focus:outline-none rounded-lg"
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-cyan-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* REMEMBER & FORGOT */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="rounded border-cyan-500/30 bg-black/40 text-cyan-400 focus:ring-cyan-400 focus:ring-offset-0"
                    />
                    <Label htmlFor="remember" className="text-white/70 text-sm">Remember me</Label>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      toast({
                        title: "Reset Password",
                        description: "Password reset functionality coming soon. Please contact system administrator.",
                      });
                    }}
                    className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* SIGN IN BUTTON */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 py-3 px-4 rounded-lg hover:bg-cyan-500/30 hover:border-cyan-400 transition-all duration-300 font-medium"
                >
                  {isLoading ? "Signing in..." : "Sign in to Admin"}
                </button>
              </form>

              {/* ADMIN INFO */}
              <div className="mt-4 p-3 bg-black/40 border border-cyan-500/30 rounded-lg">
                <p className="text-xs text-white/60 text-center">
                  <strong>Admin Access:</strong><br />
                  New admin accounts can be created via signup<br />
                  Existing admins can sign in with their credentials
                </p>
              </div>

              {/* SIGNUP LINK */}
              <p className="text-white/60 text-sm text-center mt-4">
                Don't have an admin account?{" "}
                <Link to="/admin/signup" className="text-cyan-400 hover:text-cyan-300 font-medium">
                  Sign up
                </Link>
              </p>
            </div>

            {/* VERTICAL LINE */}
            <div className="h-96 w-px bg-white/20 mt-8"></div>

            {/* IMAGE SECTION */}
            <div className="flex-1 flex items-center justify-center mt-8">
              <div className="relative w-full max-w-md">
                <div className="w-full h-64 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl border border-cyan-500/30 flex items-center justify-center">
                  <div className="text-center">
                    <Shield className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Secure Admin Access</h3>
                    <p className="text-white/70 text-sm">QThink Solution Admin Dashboard</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-cyan-500/10 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
