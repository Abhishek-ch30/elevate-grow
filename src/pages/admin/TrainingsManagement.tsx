import { useState, useEffect } from "react";
import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import ModernButton from "@/components/ui/ModernButton";
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
import { api, TrainingProgram } from "@/lib/api";

interface TrainingWithEnrollments extends TrainingProgram {
  enrolled_count?: number;
}

const TrainingsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [trainingsList, setTrainingsList] = useState<TrainingWithEnrollments[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    price: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const { data: trainings, error } = await supabase
        .from('training_programs')
        .select(`
          *,
          enrollments:enrollments(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const trainingsWithCount = trainings?.map(training => ({
        ...training,
        enrolled_count: training.enrollments?.length || 0
      })) || [];
      
      setTrainingsList(trainingsWithCount);
    } catch (error) {
      console.error('Error fetching trainings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch training programs.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTrainings = trainingsList.filter(training => 
    training.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStatus = async (id: string) => {
    try {
      const training = trainingsList.find(t => t.id === id);
      if (!training) return;

      const { error } = await supabase
        .from('training_programs')
        .update({ is_active: !training.is_active })
        .eq('id', id);

      if (error) throw error;

      setTrainingsList(prev => prev.map(t => 
        t.id === id ? { ...t, is_active: !t.is_active } : t
      ));
      toast({
        title: "Status Updated",
        description: "Training program status has been updated.",
      });
    } catch (error) {
      console.error('Error toggling status:', error);
      toast({
        title: "Error",
        description: "Failed to update training status.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!formData.title.trim() || !formData.description.trim() || !formData.duration.trim() || !formData.price.trim()) {
      toast({
        title: "Validation Error",
        description: "All fields are compulsory. Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const priceValue = parseFloat(formData.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      toast({
        title: "Validation Error", 
        description: "Please enter a valid price greater than 0.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('training_programs')
        .insert({
          title: formData.title.trim(),
          description: formData.description.trim(),
          duration: formData.duration.trim(),
          price: priceValue,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      setTrainingsList(prev => [...prev, { ...data, enrolled_count: 0 }]);
      setFormData({ title: '', description: '', duration: '', price: '' });
      setIsDialogOpen(false);
      toast({
        title: "Program Created",
        description: "Training program has been created successfully.",
      });
    } catch (error) {
      console.error('Error creating training:', error);
      toast({
        title: "Error",
        description: "Failed to create training program.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
          <ModernButton 
            text="Add Program"
            onClick={() => setIsDialogOpen(true)}
          />
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
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading training programs...
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrainings.map((training) => (
              <div key={training.id} className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant={training.is_active ? "default" : "secondary"}>
                    {training.is_active ? "Active" : "Inactive"}
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
                <p className="text-sm text-muted-foreground mb-4">{training.description || 'No description available'}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      Duration
                    </span>
                    <span className="font-medium text-foreground">{training.duration || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <IndianRupee className="w-4 h-4" />
                      Price
                    </span>
                    <span className="font-medium text-foreground">₹{training.price?.toLocaleString("en-IN") || '0'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      Enrolled
                    </span>
                    <span className="font-medium text-foreground">{training.enrolled_count || 0} users</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground">Enrollments Open</span>
                  <Switch 
                    checked={training.is_active} 
                    onCheckedChange={() => toggleStatus(training.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredTrainings.length === 0 && (
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
          <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="title">Program Title *</Label>
              <Input 
                id="title" 
                placeholder="e.g., React.js Masterclass" 
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea 
                id="description" 
                placeholder="Brief description of the program..." 
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration *</Label>
                <Input 
                  id="duration" 
                  placeholder="e.g., 8 weeks"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input 
                  id="price" 
                  type="number" 
                  placeholder="15000"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button 
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="flex-1"
              >
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
