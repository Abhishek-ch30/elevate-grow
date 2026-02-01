import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CreditCard,
  Award,
  MessageSquare,
  Menu,
  X,
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ModernButton from "@/components/ui/ModernButton";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/trainings", icon: GraduationCap, label: "Training Programs" },
  { href: "/admin/payments", icon: CreditCard, label: "Payments" },
  { href: "/admin/certificates", icon: Award, label: "Certificates" },
  { href: "/admin/messages", icon: MessageSquare, label: "Messages" },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out from all sessions.",
      });
      navigate("/admin/login");
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar border-b border-sidebar-border z-50 flex items-center justify-between px-4">
        <Link to="/admin" className="flex items-center gap-2">
          <img
            src="https://i.ibb.co/wFJCHfcK/Screenshot-2026-01-21-121113.png"
            alt="QThink Solution Logo"
            className="w-8 h-8 rounded-lg object-contain"
          />
          <span className="text-lg font-semibold text-sidebar-foreground">QThink Solution Admin</span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-sidebar-foreground"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-80 bg-sidebar border-r border-sidebar-border z-40 transition-transform duration-300 circuit-board-bg",
          "lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-20 flex items-center gap-3 px-8 border-b border-sidebar-border">
          <img
            src="https://i.ibb.co/wFJCHfcK/Screenshot-2026-01-21-121113.png"
            alt="QThink Solution Logo"
            className="w-10 h-10 rounded-lg object-contain"
          />
          <span className="text-xl font-semibold text-sidebar-foreground">QThink Solution</span>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 rounded-lg transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <item.icon className="w-6 h-6" />
                <span className="font-medium text-base">{item.label}</span>
                {isActive && <ChevronRight className="w-5 h-5 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-sidebar-border">
          <ModernButton 
            text="Logout"
            onClick={handleLogout}
            className="w-full justify-start text-lg py-4 px-6"
          />
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-80 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
