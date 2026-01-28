import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api, Enrollment, Payment, Certificate, TrainingProgram } from "../lib/api";
import { UserLayout } from "../components/layout/UserLayout";
import { 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Download,
  IndianRupee,
  CreditCard,
  Bell,
  GraduationCap,
  Award,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardData {
  enrollments: (Enrollment & { training_program: TrainingProgram })[];
  payments: Payment[];
  certificates: (Certificate & { training_program: TrainingProgram })[];
}

const Dashboard = () => {
  const { user, userProfile } = useAuth();
  const [data, setData] = useState<DashboardData>({
    enrollments: [],
    payments: [],
    certificates: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Use backend API to fetch dashboard data
      const dashboardResponse = await api.user.getDashboard();
      const dashboard = dashboardResponse.data?.dashboard;

      if (dashboard) {
        // Map the dashboard data to match our component's expected structure
        const enrollmentsWithPrograms = dashboard.recent_enrollments.map(enrollment => ({
          ...enrollment,
          training_program: {
            id: enrollment.training_id,
            title: enrollment.training_title,
            description: enrollment.training_description,
            duration: enrollment.duration,
            price: enrollment.price,
            is_active: true,
            created_at: new Date().toISOString(),
          }
        }));

        const certificatesWithPrograms = dashboard.recent_certificates.map(cert => ({
          ...cert,
          training_program: {
            id: cert.training_id,
            title: cert.training_title,
            description: '',
            duration: '',
            price: 0,
            is_active: true,
            created_at: new Date().toISOString(),
          }
        }));

        setData({
          enrollments: enrollmentsWithPrograms,
          payments: dashboard.recent_payments,
          certificates: certificatesWithPrograms
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending_payment': { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300', icon: AlertCircle, text: 'Payment Pending' },
      'enrolled': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300', icon: BookOpen, text: 'Enrolled' },
      'completed': { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300', icon: CheckCircle, text: 'Completed' },
      'pending_verification': { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300', icon: Clock, text: 'Payment Verification Pending' },
      'verified': { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300', icon: CheckCircle, text: 'Verified' },
      'failed': { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300', icon: AlertCircle, text: 'Failed' },
      'refunded': { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300', icon: AlertCircle, text: 'Refunded' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['pending_payment'];
    const Icon = config.icon;

    return (
      <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium", config.color)}>
        <Icon className="w-3 h-3" />
        {config.text}
      </span>
    );
  };

  // Calculate stats
  const stats = [
    {
      label: "Enrolled Programs",
      value: data.enrollments.length.toString(),
      icon: GraduationCap,
      color: "text-blue-600 bg-blue-500/10 dark:text-blue-400 dark:bg-blue-900/20",
    },
    {
      label: "Completed Programs", 
      value: data.enrollments.filter(e => e.status === 'completed').length.toString(),
      icon: CheckCircle,
      color: "text-green-600 bg-green-500/10 dark:text-green-400 dark:bg-green-900/20",
    },
    {
      label: "Total Payments",
      value: `₹${data.payments.reduce((sum, p) => sum + Number(p.amount), 0).toLocaleString()}`,
      icon: CreditCard,
      color: "text-purple-600 bg-purple-500/10 dark:text-purple-400 dark:bg-purple-900/20",
    },
    {
      label: "Certificates Earned",
      value: data.certificates.length.toString(),
      icon: Award,
      color: "text-amber-600 bg-amber-500/10 dark:text-amber-400 dark:bg-amber-900/20",
    },
  ];

  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {userProfile?.full_name || user?.email?.split('@')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your learning journey and progress.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="tracking-tight text-sm font-medium">{stat.label}</h3>
                  <Icon className={cn("h-4 w-4", stat.color.split(' ')[0])} />
                </div>
                <div className="p-6 pt-0">
                  <div className="text-2xl font-bold">{stat.value}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enrolled Training Programs */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Enrolled Training Programs
            </h2>
            {data.enrollments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No training programs enrolled yet.</p>
            ) : (
              <div className="space-y-4">
                {data.enrollments.map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{enrollment.training_program.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {enrollment.training_program.duration || 'Duration not specified'}
                        </div>
                        {enrollment.training_program.price && (
                          <div className="flex items-center gap-1">
                            <IndianRupee className="w-4 h-4" />
                            {enrollment.training_program.price}
                          </div>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(enrollment.status)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Payment Status */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Status
            </h2>
            {data.payments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No payment records found.</p>
            ) : (
              <div className="space-y-4">
                {data.payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-5 h-5 text-green-600" />
                        <span className="font-semibold">₹{payment.amount}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CreditCard className="w-4 h-4" />
                        {payment.payment_method}
                      </div>
                    </div>
                    {getStatusBadge(payment.status)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Certificates */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Certificates
            </h2>
            {data.certificates.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Certificate will be available after successful completion.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {data.certificates.map((certificate) => (
                  <div key={certificate.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{certificate.training_program.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Issued on {new Date(certificate.issue_date).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">System Update</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Your dashboard is ready to use!</p>
                </div>
              </div>
              {data.payments.some(p => p.status === 'verified') && (
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">Payment Verified</p>
                    <p className="text-xs text-green-700 dark:text-green-300">Your payment has been successfully verified.</p>
                  </div>
                </div>
              )}
              {data.enrollments.some(e => e.status === 'completed') && (
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">Training Completed</p>
                    <p className="text-xs text-green-700 dark:text-green-300">Congratulations on completing your training!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Dashboard;
