import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
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
import AdminSignup from "./pages/admin/Signup";
import AdminDashboard from "./pages/admin/Dashboard";
import UsersManagement from "./pages/admin/UsersManagement";
import TrainingsManagement from "./pages/admin/TrainingsManagement";
import PaymentsManagement from "./pages/admin/PaymentsManagement";
import CertificatesManagement from "./pages/admin/CertificatesManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/training" element={<Training />} />
            <Route path="/training/:id" element={<TrainingDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/enrolled-programs" element={<EnrolledPrograms />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignup />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UsersManagement />} />
            <Route path="/admin/trainings" element={<TrainingsManagement />} />
            <Route path="/admin/payments" element={<PaymentsManagement />} />
            <Route path="/admin/certificates" element={<CertificatesManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
