import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useRegisterSW } from 'virtual:pwa-register/react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ProtectedAdminRoute } from "./components/auth/ProtectedAdminRoute";
import { AuthCheck } from "./components/auth/AuthCheck";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Training from "./pages/Training";
import TrainingDetail from "./pages/TrainingDetail";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import EnrolledPrograms from "./pages/EnrolledPrograms";
import Profile from "./pages/Profile";
import Certificates from "./pages/Certificates";
import Settings from "./pages/Settings";
import AdminLogin from "./pages/admin/Login";

import AdminDashboard from "./pages/admin/Dashboard";
import UsersManagement from "./pages/admin/UsersManagement";
import TrainingsManagement from "./pages/admin/TrainingsManagement";
import PaymentsManagement from "./pages/admin/PaymentsManagement";
import CertificatesManagement from "./pages/admin/CertificatesManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // PWA Update handling
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  // Debug layout issues
  useEffect(() => {
    console.log("Window Info Debug:", {
      innerWidth: window.innerWidth,
      outerWidth: window.outerWidth,
      devicePixelRatio: window.devicePixelRatio,
      screenWidth: window.screen.width,
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {needRefresh && (
            <div className="fixed bottom-4 right-4 z-50 p-4 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 animate-in slide-in-from-bottom-5">
              <div className="mb-2 text-sm font-medium">
                New content available, click on reload button to update.
              </div>
              <button
                className="px-4 py-2 text-sm text-white bg-zinc-900 rounded hover:bg-zinc-800 transition-colors"
                onClick={() => updateServiceWorker(true)}
              >
                Reload
              </button>
              <button
                className="ml-2 px-4 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                onClick={() => setNeedRefresh(false)}
              >
                Close
              </button>
            </div>
          )}
          <BrowserRouter>
            <AuthCheck>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/training" element={<Training />} />
                <Route path="/training/:id" element={<TrainingDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Protected User Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/enrolled-programs" element={
                  <ProtectedRoute>
                    <EnrolledPrograms />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/certificates" element={
                  <ProtectedRoute>
                    <Certificates />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />

                {/* Protected Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                } />
                <Route path="/admin/users" element={
                  <ProtectedAdminRoute>
                    <UsersManagement />
                  </ProtectedAdminRoute>
                } />
                <Route path="/admin/trainings" element={
                  <ProtectedAdminRoute>
                    <TrainingsManagement />
                  </ProtectedAdminRoute>
                } />
                <Route path="/admin/payments" element={
                  <ProtectedAdminRoute>
                    <PaymentsManagement />
                  </ProtectedAdminRoute>
                } />
                <Route path="/admin/certificates" element={
                  <ProtectedAdminRoute>
                    <CertificatesManagement />
                  </ProtectedAdminRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthCheck>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
