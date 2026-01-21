import { AdminLayout } from "./AdminLayout";
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

const stats = [
  {
    label: "Total Users",
    value: "1,234",
    change: "+12%",
    changeType: "positive",
    icon: Users,
    color: "text-blue-600 bg-blue-500/10",
  },
  {
    label: "Active Enrollments",
    value: "456",
    change: "+8%",
    changeType: "positive",
    icon: GraduationCap,
    color: "text-green-600 bg-green-500/10",
  },
  {
    label: "Total Revenue",
    value: "₹12,45,000",
    change: "+23%",
    changeType: "positive",
    icon: CreditCard,
    color: "text-purple-600 bg-purple-500/10",
  },
  {
    label: "Certificates Issued",
    value: "389",
    change: "+15%",
    changeType: "positive",
    icon: Award,
    color: "text-amber-600 bg-amber-500/10",
  },
];

const recentPayments = [
  { id: 1, user: "Rahul Sharma", training: "React.js Masterclass", amount: 15000, status: "verified", date: "2024-01-15" },
  { id: 2, user: "Priya Patel", training: "Cloud Architecture", amount: 25000, status: "pending", date: "2024-01-15" },
  { id: 3, user: "Amit Kumar", training: "Full Stack Development", amount: 35000, status: "verified", date: "2024-01-14" },
  { id: 4, user: "Sneha Reddy", training: "React Native", amount: 20000, status: "pending", date: "2024-01-14" },
  { id: 5, user: "Vikram Singh", training: "UI/UX Design", amount: 12000, status: "verified", date: "2024-01-13" },
];

const pendingActions = [
  { label: "Payments awaiting verification", count: 8, icon: CreditCard },
  { label: "Certificates ready to issue", count: 12, icon: Award },
  { label: "New enrollments today", count: 5, icon: GraduationCap },
];

const Dashboard = () => {
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
          {stats.map((stat) => (
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
                {recentPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{payment.user}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{payment.training}</td>
                    <td className="px-6 py-4 text-sm text-foreground flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" />
                      {payment.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                        payment.status === "verified" 
                          ? "bg-green-500/10 text-green-600" 
                          : "bg-amber-500/10 text-amber-600"
                      )}>
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          payment.status === "verified" ? "bg-green-500" : "bg-amber-500"
                        )} />
                        {payment.status === "verified" ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {payment.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
