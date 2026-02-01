import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  CreditCard,
  Award,
  Menu,
  X,
  LogOut,
  ChevronRight,
  User,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ModernButton from "@/components/ui/ModernButton";
import { useAuth } from "../../contexts/AuthContext";

interface UserLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/enrolled-programs", icon: BookOpen, label: "My Training Programs" },
  { href: "/certificates", icon: Award, label: "Certificates" },
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function UserLayout({ children }: UserLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar border-b border-sidebar-border z-50 flex items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <img
            src="https://i.ibb.co/wFJCHfcK/Screenshot-2026-01-21-121113.png"
            alt="QThink Solution Logo"
            className="w-8 h-8 rounded-lg object-contain"
          />
          <span className="text-lg font-semibold text-sidebar-foreground">QThink Solution</span>
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

        {/* User Info */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-medium text-sidebar-foreground truncate">
                {userProfile?.full_name || user?.email?.split('@')[0]}
              </p>
              <p className="text-sm text-sidebar-foreground/70 truncate">
                {user?.email}
              </p>
            </div>
          </div>
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
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
