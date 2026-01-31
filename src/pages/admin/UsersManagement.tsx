import { useState, useEffect } from "react";
import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import ModernButton from "@/components/ui/ModernButton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  GraduationCap
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { api, User, Enrollment, Payment } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface UserWithDetails extends User {
  enrollments_count?: number;
  latest_payment_status?: string;
  user_type?: string;
}

const UsersManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [usersList, setUsersList] = useState<UserWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.admin.getAllUsers({
        search: searchQuery
      });

      if (response.status === 'error') {
        throw new Error(response.message);
      }

      const users = response.data?.users || [];

      const usersWithDetails: UserWithDetails[] = users.map(user => {
        // Since we don't have enrollments/payments included in the basic list yet,
        // we'll default these to 0/none. 
        // Real implementation should update getAllUsers to include counts if needed,
        // or fetch details separately. For now, showing basic user list.
        return {
          ...user,
          enrollments_count: 0,
          latest_payment_status: 'none',
          user_type: user.profession === 'professional' ? 'Professional' : 'Student'
        };
      });

      setUsersList(usersWithDetails);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = usersList.filter(user =>
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">Users</h1>
            <p className="text-muted-foreground mt-1">Manage enrolled users and their information.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <ModernButton
            text="Filters"
            onClick={() => { }}
          />
        </div>

        {/* Users Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading users...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">User</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Contact</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Type</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Enrollments</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Payment</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Joined</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
                            {user.full_name?.split(" ").map(n => n[0]).join("").toUpperCase() || 'U'}
                          </div>
                          <span className="font-medium text-foreground">{user.full_name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="w-3.5 h-3.5" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="w-3.5 h-3.5" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={user.user_type === "Professional" ? "default" : "secondary"}>
                          {user.user_type || "Student"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <GraduationCap className="w-4 h-4 text-accent" />
                          <span className="font-medium text-foreground">{user.enrollments_count || 0}</span>
                          <span className="text-muted-foreground">programs</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.latest_payment_status === 'none' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-600">
                            No Payments
                          </span>
                        ) : (
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                            user.latest_payment_status === "verified"
                              ? "bg-green-500/10 text-green-600"
                              : user.latest_payment_status === "pending_verification"
                                ? "bg-amber-500/10 text-amber-600"
                                : "bg-red-500/10 text-red-600"
                          )}>
                            <span className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              user.latest_payment_status === "verified" ? "bg-green-500" :
                                user.latest_payment_status === "pending_verification" ? "bg-amber-500" : "bg-red-500"
                            )} />
                            {user.latest_payment_status === "verified" ? "Verified" :
                              user.latest_payment_status === "pending_verification" ? "Pending" : "Failed"}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>View Enrollments</DropdownMenuItem>
                            <DropdownMenuItem>Send Email</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  No users found matching your search.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default UsersManagement;
