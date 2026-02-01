import { useState, useEffect } from "react";
import { AdminLayout } from "./AdminLayout";
import { api } from "../../lib/api";
import { 
  Users, 
  GraduationCap, 
  CreditCard, 
  Award,
  TrendingUp,
  Clock,
  IndianRupee,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStats {
  totalUsers: number;
  activeEnrollments: number;
  totalRevenue: number;
  certificatesIssued: number;
  pendingPayments: number;
  pendingCertificates: number;
  newEnrollmentsToday: number;
  // Add previous period stats for percentage calculations
  previousUsers?: number;
  previousEnrollments?: number;
  previousRevenue?: number;
  previousCertificates?: number;
}

interface RecentPayment {
  id: string;
  user_name: string;
  user_email: string;
  training_title: string;
  amount: number;
  status: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeEnrollments: 0,
    totalRevenue: 0,
    certificatesIssued: 0,
    pendingPayments: 0,
    pendingCertificates: 0,
    newEnrollmentsToday: 0,
    previousUsers: 0,
    previousEnrollments: 0,
    previousRevenue: 0,
    previousCertificates: 0
  });
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all users to count non-admin users
      const usersResponse = await api.admin.getAllUsers();
      const allUsers = usersResponse.data?.users || [];
      
      // Count only non-admin users (is_admin: false)
      const nonAdminUsers = allUsers.filter(user => user.is_admin === false);
      const nonAdminCount = nonAdminUsers.length;
      
      // Use admin dashboard API for other stats
      const dashboardResponse = await api.admin.getDashboard();
      const dashboard = dashboardResponse.data?.dashboard;
      
      if (dashboard) {
        setStats({
          totalUsers: nonAdminCount, // Only count non-admin users
          activeEnrollments: dashboard.stats.total_enrollments,
          totalRevenue: 0, // This would need to be calculated from payments
          certificatesIssued: dashboard.stats.total_certificates,
          pendingPayments: dashboard.stats.pending_payments,
          pendingCertificates: 0, // This would need to be calculated
          newEnrollmentsToday: 0, // This would need to be calculated
          previousUsers: 0,
          previousEnrollments: 0,
          previousRevenue: 0,
          previousCertificates: 0
        });

        // Map recent payments to expected format
        const formattedPayments: RecentPayment[] = dashboard.recent_payments?.map(payment => ({
          id: payment.id,
          user_name: payment.full_name || 'Unknown User',
          user_email: payment.email || '',
          training_title: payment.training_title || 'Unknown Training',
          amount: payment.amount,
          status: payment.status,
          created_at: payment.created_at
        })) || [];

        setRecentPayments(formattedPayments);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const statsData = [
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: calculatePercentageChange(stats.totalUsers, stats.previousUsers || 0),
      changeType: (stats.totalUsers >= (stats.previousUsers || 0) ? "positive" : "negative"),
      icon: Users,
      color: "text-blue-600 bg-blue-500/10",
    },
    {
      label: "Active Enrollments",
      value: stats.activeEnrollments.toLocaleString(),
      change: calculatePercentageChange(stats.activeEnrollments, stats.previousEnrollments || 0),
      changeType: (stats.activeEnrollments >= (stats.previousEnrollments || 0) ? "positive" : "negative"),
      icon: GraduationCap,
      color: "text-green-600 bg-green-500/10",
    },
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      change: calculatePercentageChange(stats.totalRevenue, stats.previousRevenue || 0),
      changeType: (stats.totalRevenue >= (stats.previousRevenue || 0) ? "positive" : "negative"),
      icon: CreditCard,
      color: "text-purple-600 bg-purple-500/10",
    },
    {
      label: "Certificates Issued",
      value: stats.certificatesIssued.toLocaleString(),
      change: calculatePercentageChange(stats.certificatesIssued, stats.previousCertificates || 0),
      changeType: (stats.certificatesIssued >= (stats.previousCertificates || 0) ? "positive" : "negative"),
      icon: Award,
      color: "text-amber-600 bg-amber-500/10",
    },
  ];

  const pendingActions = [
    { label: "Payments awaiting verification", count: stats.pendingPayments, icon: CreditCard },
    { label: "Certificates ready to issue", count: stats.pendingCertificates, icon: Award },
    { label: "New enrollments today", count: stats.newEnrollmentsToday, icon: GraduationCap },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="flex items-start justify-between">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className={cn(
                  "inline-flex items-center gap-1 text-sm font-medium",
                  stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                )}>
                  <TrendingUp className="w-4 h-4" />
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pending Actions */}
        <div className="grid sm:grid-cols-3 gap-4">
          {pendingActions.map((action) => (
            <div key={action.label} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
              <div className="w-10 h-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
                <action.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{action.count}</p>
                <p className="text-sm text-muted-foreground">{action.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Payments Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent Payments</h2>
            <a href="/admin/payments" className="text-sm text-accent hover:underline flex items-center gap-1">
              View All
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">User</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Training</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No recent payments found
                    </td>
                  </tr>
                ) : (
                  recentPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">{payment.user_name}</p>
                          <p className="text-xs text-muted-foreground">{payment.user_email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{payment.training_title}</td>
                      <td className="px-6 py-4 text-sm text-foreground flex items-center gap-1">
                        <IndianRupee className="w-3 h-3" />
                        {payment.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                          payment.status === "verified" 
                            ? "bg-green-500/10 text-green-600" 
                            : payment.status === "pending_verification"
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-red-500/10 text-red-600"
                        )}>
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            payment.status === "verified" ? "bg-green-500" : 
                            payment.status === "pending_verification" ? "bg-amber-500" : "bg-red-500"
                          )} />
                          {payment.status === "verified" ? "Verified" : 
                           payment.status === "pending_verification" ? "Pending" : "Failed"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(payment.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
