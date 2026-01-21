import { useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Search, 
  Plus,
  MoreHorizontal,
  Users,
  IndianRupee,
  Clock,
  Edit,
  Eye
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const trainings = [
  { 
    id: 1, 
    title: "React.js Masterclass", 
    duration: "8 weeks",
    price: 15000,
    enrolled: 45,
    status: "active",
    category: "Web Development"
  },
  { 
    id: 2, 
    title: "Cloud Architecture with AWS", 
    duration: "10 weeks",
    price: 25000,
    enrolled: 32,
    status: "active",
    category: "Cloud & DevOps"
  },
  { 
    id: 3, 
    title: "Full Stack Development", 
    duration: "12 weeks",
    price: 35000,
    enrolled: 28,
    status: "active",
    category: "Web Development"
  },
  { 
    id: 4, 
    title: "React Native Development", 
    duration: "8 weeks",
    price: 20000,
    enrolled: 24,
    status: "active",
    category: "Mobile"
  },
  { 
    id: 5, 
    title: "UI/UX Design Fundamentals", 
    duration: "6 weeks",
    price: 12000,
    enrolled: 38,
    status: "inactive",
    category: "Design"
  },
];

const TrainingsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [trainingsList, setTrainingsList] = useState(trainings);
  const { toast } = useToast();

  const filteredTrainings = trainingsList.filter(training => 
    training.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStatus = (id: number) => {
    setTrainingsList(prev => prev.map(t => 
      t.id === id ? { ...t, status: t.status === "active" ? "inactive" : "active" } : t
    ));
    toast({
      title: "Status Updated",
      description: "Training program status has been updated.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">Training Programs</h1>
            <p className="text-muted-foreground mt-1">Create and manage training programs.</p>
          </div>
          <Button variant="accent" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Program
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search training programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Training Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainings.map((training) => (
            <div key={training.id} className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <Badge variant={training.status === "active" ? "default" : "secondary"}>
                  {training.status === "active" ? "Active" : "Inactive"}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Program
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">{training.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{training.category}</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    Duration
                  </span>
                  <span className="font-medium text-foreground">{training.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <IndianRupee className="w-4 h-4" />
                    Price
                  </span>
                  <span className="font-medium text-foreground">₹{training.price.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    Enrolled
                  </span>
                  <span className="font-medium text-foreground">{training.enrolled} users</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">Enrollments Open</span>
                <Switch 
                  checked={training.status === "active"} 
                  onCheckedChange={() => toggleStatus(training.id)}
                />
              </div>
            </div>
          ))}
        </div>

        {filteredTrainings.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No training programs found.
          </div>
        )}
      </div>

      {/* Add Training Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Training Program</DialogTitle>
            <DialogDescription>
              Create a new training program. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Program Title</Label>
              <Input id="title" placeholder="e.g., React.js Masterclass" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Brief description of the program..." rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" placeholder="e.g., 8 weeks" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input id="price" type="number" placeholder="15000" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" placeholder="e.g., Web Development" />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="accent" className="flex-1">
                Create Program
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default TrainingsManagement;
