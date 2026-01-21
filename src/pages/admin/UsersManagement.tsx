import { useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
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

const users = [
  { 
    id: 1, 
    name: "Rahul Sharma", 
    email: "rahul.sharma@email.com", 
    phone: "+91 98765 43210",
    type: "Professional",
    enrollments: 2,
    paymentStatus: "verified",
    joinedDate: "2024-01-10"
  },
  { 
    id: 2, 
    name: "Priya Patel", 
    email: "priya.patel@email.com", 
    phone: "+91 98765 43211",
    type: "Student",
    enrollments: 1,
    paymentStatus: "pending",
    joinedDate: "2024-01-12"
  },
  { 
    id: 3, 
    name: "Amit Kumar", 
    email: "amit.kumar@email.com", 
    phone: "+91 98765 43212",
    type: "Professional",
    enrollments: 3,
    paymentStatus: "verified",
    joinedDate: "2024-01-08"
  },
  { 
    id: 4, 
    name: "Sneha Reddy", 
    email: "sneha.reddy@email.com", 
    phone: "+91 98765 43213",
    type: "Student",
    enrollments: 1,
    paymentStatus: "pending",
    joinedDate: "2024-01-14"
  },
  { 
    id: 5, 
    name: "Vikram Singh", 
    email: "vikram.singh@email.com", 
    phone: "+91 98765 43214",
    type: "Professional",
    enrollments: 2,
    paymentStatus: "verified",
    joinedDate: "2024-01-05"
  },
];

const UsersManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
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
          <Button variant="outline" className="sm:w-auto">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Users Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
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
                          {user.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="font-medium text-foreground">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-3.5 h-3.5" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3.5 h-3.5" />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.type === "Professional" ? "default" : "secondary"}>
                        {user.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <GraduationCap className="w-4 h-4 text-accent" />
                        <span className="font-medium text-foreground">{user.enrollments}</span>
                        <span className="text-muted-foreground">programs</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                        user.paymentStatus === "verified" 
                          ? "bg-green-500/10 text-green-600" 
                          : "bg-amber-500/10 text-amber-600"
                      )}>
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          user.paymentStatus === "verified" ? "bg-green-500" : "bg-amber-500"
                        )} />
                        {user.paymentStatus === "verified" ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {user.joinedDate}
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
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No users found matching your search.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default UsersManagement;
