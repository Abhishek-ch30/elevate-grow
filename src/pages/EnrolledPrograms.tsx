import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api, Enrollment, TrainingProgram, Payment } from "../lib/api";
import { UserLayout } from "../components/layout/UserLayout";
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  IndianRupee,
  CreditCard,
  Calendar,
  Search,
  Filter,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EnrolledProgram extends Enrollment {
  training_program: TrainingProgram;
  training_title: string;
  training_description?: string;
  duration?: string;
  price?: number;
  payment?: Payment;
}

const EnrolledPrograms = () => {
  const { user } = useAuth();
  const [enrolledPrograms, setEnrolledPrograms] = useState<EnrolledProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "enrolled" | "completed" | "pending" | "pending_payment" | "pending_verification">("all");

  useEffect(() => {
    fetchEnrolledPrograms();
  }, [user]);

  const fetchEnrolledPrograms = async () => {
    if (!user) return;

    try {
      // Fetch enrollments from backend API
      const enrollments = await api.getUserEnrollments();
      
      // Map the API response to match our EnrolledProgram interface
      const mappedEnrollments = enrollments.map(enrollment => ({
        ...enrollment,
        training_program: {
          id: enrollment.training_id,
          title: enrollment.training_title,
          description: enrollment.training_description,
          duration: enrollment.duration,
          price: enrollment.price,
          is_active: true,
          created_at: new Date().toISOString(),
        } as TrainingProgram
      })) as EnrolledProgram[];
      
      setEnrolledPrograms(mappedEnrollments);
    } catch (error) {
      console.error('Error fetching enrolled programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending_payment': { 
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300', 
        icon: AlertCircle, 
        text: 'Payment Pending' 
      },
      'enrolled': { 
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300', 
        icon: BookOpen, 
        text: 'Enrolled' 
      },
      'completed': { 
        color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300', 
        icon: CheckCircle, 
        text: 'Completed' 
      },
      'pending_verification': { 
        color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300', 
        icon: Clock, 
        text: 'Payment Verification Pending' 
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['enrolled'];
    const Icon = config.icon;

    return (
      <Badge variant="secondary" className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (payment?: Payment) => {
    if (!payment) {
      return <Badge variant="outline">No Payment</Badge>;
    }

    const statusConfig = {
      'pending_verification': { 
        color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300', 
        text: 'Pending Verification' 
      },
      'verified': { 
        color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300', 
        text: 'Verified' 
      },
      'failed': { 
        color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300', 
        text: 'Failed' 
      },
      'refunded': { 
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300', 
        text: 'Refunded' 
      }
    };

    const config = statusConfig[payment.status as keyof typeof statusConfig] || statusConfig['pending_verification'];
    return (
      <Badge variant="secondary" className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const filteredPrograms = enrolledPrograms.filter(program => {
    const matchesSearch = program.training_program.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || 
                          filterStatus === "pending" && (program.status === 'pending_payment' || program.status === 'pending_verification') ||
                          program.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your enrolled programs...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Training Programs</h1>
          <p className="text-muted-foreground">
            View and manage your enrolled training programs and track your progress.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
              size="sm"
            >
              All ({enrolledPrograms.length})
            </Button>
            <Button
              variant={filterStatus === "enrolled" ? "default" : "outline"}
              onClick={() => setFilterStatus("enrolled")}
              size="sm"
            >
              Active ({enrolledPrograms.filter(p => p.status === 'enrolled').length})
            </Button>
            <Button
              variant={filterStatus === "completed" ? "default" : "outline"}
              onClick={() => setFilterStatus("completed")}
              size="sm"
            >
              Completed ({enrolledPrograms.filter(p => p.status === 'completed').length})
            </Button>
            <Button
              variant={filterStatus === "pending" ? "default" : "outline"}
              onClick={() => setFilterStatus("pending")}
              size="sm"
            >
              Pending ({enrolledPrograms.filter(p => p.status === 'pending_payment' || p.status === 'pending_verification').length})
            </Button>
          </div>
        </div>

        {/* Programs Grid */}
        {filteredPrograms.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              {searchTerm ? 'No programs found' : 'No programs enrolled yet'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search terms' : 'Browse our training programs to get started'}
            </p>
            {!searchTerm && (
              <Button className="mt-4" onClick={() => window.location.href = '/training'}>
                Browse Training Programs
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPrograms.map((program) => (
              <Card key={program.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    {getStatusBadge(program.status)}
                  </div>
                  <CardTitle className="text-lg">{program.training_program.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {program.training_program.description || 'No description available'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Program Details */}
                  <div className="space-y-2 text-sm">
                    {program.training_program.duration && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{program.training_program.duration}</span>
                      </div>
                    )}
                    {program.training_program.price && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <IndianRupee className="w-4 h-4" />
                        <span className="font-semibold text-foreground">₹{program.training_program.price}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Enrolled: {new Date(program.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Payment Status */}
                  {program.payment && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Payment Status</span>
                        {getPaymentStatusBadge(program.payment)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          {program.payment.payment_method} • ₹{program.payment.amount}
                        </div>
                        {program.payment.status === 'pending_verification' && (
                          <p className="text-orange-600 mt-1">
                            Payment is under verification
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {program.status === 'pending_payment' && (
                      <Button size="sm" className="flex-1">
                        Complete Payment
                      </Button>
                    )}
                    {program.status === 'enrolled' && (
                      <Button size="sm" variant="outline" className="flex-1">
                        Continue Learning
                      </Button>
                    )}
                    {program.status === 'completed' && (
                      <Button size="sm" variant="outline" className="flex-1">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Certificate
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default EnrolledPrograms;
