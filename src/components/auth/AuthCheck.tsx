import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AuthCheckProps {
  children: React.ReactNode;
}

export function AuthCheck({ children }: AuthCheckProps) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only run after loading is complete
    if (loading) return;

    // Check if user is trying to access protected routes
    const isAdminRoute = location.pathname.startsWith('/admin');
    const isUserRoute = ['/dashboard', '/profile', '/settings', '/enrolled-programs', '/certificates'].some(route => 
      location.pathname.startsWith(route)
    );

    if (isAdminRoute && (!isAuthenticated || !isAdmin)) {
      // Redirect to admin login for admin routes
      navigate('/admin/login', { state: { from: location }, replace: true });
    } else if (isUserRoute && !isAuthenticated) {
      // Redirect to user login for user routes
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [isAuthenticated, isAdmin, loading, location, navigate]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
