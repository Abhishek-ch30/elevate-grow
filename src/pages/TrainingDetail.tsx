import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import PaymentQRComponent from "@/components/payment/PaymentQRComponent";
import {
  Clock,
  Users,
  IndianRupee,
  CheckCircle2,
  ArrowLeft,
  GraduationCap,
  Calendar,
  Award,
  BookOpen,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api, TrainingProgram, PaymentSession } from "@/lib/api";

// Training detail component for displaying individual training program information

const TrainingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [training, setTraining] = useState<TrainingProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [paymentSession, setPaymentSession] = useState<PaymentSession | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    userType: "professional" as "professional" | "student",
  });
  const { toast } = useToast();
  const { user } = useAuth();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTrainingDetails();
  }, [id]);


  const fetchTrainingDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      // Use public endpoint if user is not authenticated, otherwise use authenticated endpoint
      const response = user
        ? await api.user.getTrainingProgramDetails(id)
        : await api.getPublicTrainingProgramDetails(id);
      
      if (response?.status === 'success' && response.data) {
        setTraining(response.data.program);
      } else if (response) {
        setTraining(response);
      }
    } catch (error: any) {
      console.error('Error fetching training details:', error);
      toast({
        title: "Error",
        description: "Failed to load training details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!training) {
    return (
      <PageLayout>
        <div className="relative min-h-screen circuit-board-bg overflow-hidden">
          {/* BACKGROUND ELEMENTS */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-float animation-delay-500" />
          </div>

          {/* 🔥 SINGLE GLASS OVERLAY */}
          <div className="container mx-auto max-w-7xl relative z-10 px-4 sm:px-6 lg:px-8 mt-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/15 shadow-2xl p-8 sm:p-12 lg:p-16">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white mb-4">Program Not Found</h1>
                <Link to="/training">
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white/90 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group">
                    <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-0.5 transition-transform duration-300" />
                    <span className="font-medium">Back to Programs</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  const handleEnrollClick = async () => {
    if (!user) {
      toast({
        title: "Account Required",
        description: "Please create an account to enroll in training programs",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Fetch fresh user data from database
      const userProfileResponse = await api.user.getProfile();
      if (userProfileResponse.status === 'success' && userProfileResponse.data) {
        const profile = userProfileResponse.data.profile;
        
        // Pre-fill form with database data
        setFormData({
          name: profile.full_name || "",
          email: profile.email || "",
          mobile: profile.phone?.toString() || "",
          userType: profile.profession || "professional"
        });
        
        setIsEnrollOpen(true);
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!training || !user) {
      toast({
        title: "Error",
        description: "Please login to enroll",
        variant: "destructive",
      });
      return;
    }

    try {
      setEnrolling(true);
      
      // Create enrollment with user details
      const enrollmentResponse = await api.user.createEnrollmentWithDetails({
        training_id: training.id,
        full_name: formData.name,
        email: formData.email,
        phone: formData.mobile
      });

      if (enrollmentResponse.status === 'success' && enrollmentResponse.data) {
        toast({
          title: "Enrollment Created!",
          description: "Initiating payment process...",
        });

        // Initiate payment session
        const paymentResponse = await api.user.initiatePayment(enrollmentResponse.data.enrollment.id);
        
        if (paymentResponse.status === 'success' && paymentResponse.data) {
          setPaymentSession(paymentResponse.data.payment_session);
          setIsEnrollOpen(false);
          setIsPaymentOpen(true);
        } else {
          throw new Error(paymentResponse.message || 'Failed to initiate payment');
        }
      } else {
        throw new Error(enrollmentResponse.message || 'Failed to create enrollment');
      }
    } catch (error: any) {
      console.error('Error during enrollment:', error);
      toast({
        title: "Enrollment Failed",
        description: error.message || "Failed to process enrollment",
        variant: "destructive",
      });
    } finally {
      setEnrolling(false);
    }
  };

  const handlePaymentRetry = async (enrollmentId: string) => {
    try {
      // Re-initiate payment for the existing enrollment
      const paymentResponse = await api.user.initiatePayment(enrollmentId);
      
      if (paymentResponse.status === 'success' && paymentResponse.data) {
        setPaymentSession(paymentResponse.data.payment_session);
        setIsPaymentOpen(true);
        toast({
          title: "Payment Retry Initiated",
          description: "New payment session created. Please complete the payment.",
        });
      } else {
        throw new Error(paymentResponse.message || 'Failed to retry payment');
      }
    } catch (error: any) {
      toast({
        title: "Retry Failed",
        description: error.message || "Failed to retry payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="relative min-h-screen circuit-board-bg overflow-hidden">
          <div className="container mx-auto max-w-7xl relative z-10 px-4 sm:px-6 lg:px-8 mt-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/15 shadow-2xl p-8 sm:p-12 lg:p-16">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-white mb-4">Loading Training Details...</h1>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

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
          
          {/* Breadcrumb */}
          <section className="mb-8">
            <Link
              to="/training"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-sm text-white/90 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-0.5 transition-transform duration-300" />
              <span className="font-medium">Back to All Programs</span>
            </Link>
          </section>

          {/* Hero */}
          <section className="mb-16">
            <div className="max-w-4xl">
              <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-4">
                Available
              </div>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
                style={{ fontFamily: "'Nasalization', sans-serif" }}
              >
                {training?.title}
              </h1>
              <p className="text-lg text-white/70 mb-6">
                {training?.description}
              </p>
              
              {/* Meta */}
              <div className="flex flex-wrap gap-6 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <span>{training?.duration || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <span>Open for enrollment</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <span>Next batch: Starting Soon</span>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="mb-16">
            <div className="max-w-4xl">
              <h2
                className="text-3xl md:text-4xl font-bold text-white mb-6 flex items-center gap-3"
                style={{ fontFamily: "'Nasalization', sans-serif" }}
              >
                <BookOpen className="w-6 h-6 text-cyan-400" />
                About This Training
              </h2>
              <div className="p-6 rounded-xl bg-black/40 backdrop-blur-md border-2 border-cyan-500/50">
                <p className="text-white/90 leading-relaxed text-lg">
                  {training?.description || 'This comprehensive training program is designed to equip you with industry-relevant skills and practical knowledge.'}
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-cyan-500/30">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-cyan-400 mb-2">
                      <GraduationCap className="w-5 h-5" />
                      <span className="font-semibold">Expert-Led</span>
                    </div>
                    <p className="text-white/70 text-sm">Industry professionals as instructors</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-cyan-400 mb-2">
                      <BookOpen className="w-5 h-5" />
                      <span className="font-semibold">Hands-On</span>
                    </div>
                    <p className="text-white/70 text-sm">Practical projects and real-world scenarios</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-cyan-400 mb-2">
                      <Award className="w-5 h-5" />
                      <span className="font-semibold">Certified</span>
                    </div>
                    <p className="text-white/70 text-sm">Industry-recognized completion certificate</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Enrollment Card - Full Width */}
          <section className="mb-16">
            <div className="p-8 rounded-2xl bg-black/40 backdrop-blur-md border-2 border-cyan-500/50 cursor-pointer transition-all duration-300 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-4xl md:text-5xl font-bold text-white mb-2">
                    <IndianRupee className="w-8 h-8 md:w-10 md:h-10 text-cyan-400" />
                    {training?.price?.toLocaleString("en-IN") || '0'}
                  </div>
                  <p className="text-base md:text-lg text-white/60">One-time payment</p>
                </div>
                
                <div className="text-center md:text-right">
                  {!user ? (
                    <Link
                      to="/signup"
                      className="inline-flex items-center justify-center gap-3 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 py-4 px-8 rounded-xl hover:bg-cyan-500/30 hover:border-cyan-400 transition-all duration-300 font-medium text-lg md:text-xl"
                    >
                      Create Account to Enroll
                    </Link>
                  ) : (
                    <button
                      onClick={handleEnrollClick}
                      disabled={enrolling}
                      className="inline-flex items-center justify-center gap-3 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 py-4 px-8 rounded-xl hover:bg-cyan-500/30 hover:border-cyan-400 transition-all duration-300 font-medium text-lg md:text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {enrolling ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Enroll Now'
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-6 mt-8">
                <div className="flex items-center gap-3 text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span className="text-sm">Certificate of Completion</span>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span className="text-sm">Hands-on Projects</span>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span className="text-sm">Expert Instructors</span>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span className="text-sm">Lifetime Access to Materials</span>
                </div>
              </div>
            </div>
          </section>
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      <Dialog open={isEnrollOpen} onOpenChange={setIsEnrollOpen}>
        <DialogContent className="sm:max-w-md bg-white/5 backdrop-blur-xl border border-white/15">
          <DialogHeader>
            <DialogTitle className="text-white">Enroll in {training.title}</DialogTitle>
            <DialogDescription className="text-white/70">
              Fill in your details to proceed with enrollment.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEnrollSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/80 text-sm">Full Name</Label>
              <div className="flex items-center gap-3 bg-black/40 border border-cyan-500/30 rounded-lg px-3 py-2 focus-within:border-cyan-400">
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-transparent border-none text-white placeholder:text-white/60 w-full focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80 text-sm">Email</Label>
              <div className="flex items-center gap-3 bg-black/40 border border-cyan-500/30 rounded-lg px-3 py-2 focus-within:border-cyan-400">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-transparent border-none text-white placeholder:text-white/60 w-full focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-white/80 text-sm">Mobile Number</Label>
              <div className="flex items-center gap-3 bg-black/40 border border-cyan-500/30 rounded-lg px-3 py-2 focus-within:border-cyan-400">
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="bg-transparent border-none text-white placeholder:text-white/60 w-full focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                  required
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-white/80 text-sm">I am a</Label>
              <RadioGroup
                value={formData.userType}
                onValueChange={(value) => setFormData({ ...formData, userType: value })}
                className="text-white"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="professional" id="professional" className="border-cyan-500/30 text-cyan-400" />
                  <Label htmlFor="professional" className="font-normal text-white/80">Professional</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" className="border-cyan-500/30 text-cyan-400" />
                  <Label htmlFor="student" className="font-normal text-white/80">Student</Label>
                </div>
              </RadioGroup>
            </div>
            <button
              type="submit"
              disabled={enrolling}
              className="w-full flex items-center justify-center gap-3 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 py-3 px-4 rounded-lg hover:bg-cyan-500/30 hover:border-cyan-400 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {enrolling ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Processing Enrollment...
                </>
              ) : (
                'Proceed to Payment'
              )}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Payment QR Modal */}
      {paymentSession && (
        <PaymentQRComponent
          isOpen={isPaymentOpen}
          onClose={() => {
            setIsPaymentOpen(false);
            // Optional: Reset payment session after closing
            // setPaymentSession(null);
          }}
          paymentSession={paymentSession}
          onRetryPayment={handlePaymentRetry}
        />
      )}
    </PageLayout>
  );
};

export default TrainingDetail;
