import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Users, 
  IndianRupee, 
  Clock, 
  Edit, 
  Eye, 
  Trash2,
  GraduationCap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api, TrainingProgram } from "@/lib/api";
import { AdminLayout } from "./AdminLayout";

interface TrainingWithEnrollments extends TrainingProgram {
  enrolled_count: number;
}

const TrainingsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<TrainingWithEnrollments | null>(null);
  const [trainingsList, setTrainingsList] = useState<TrainingWithEnrollments[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      const response = await api.admin.getAllTrainingPrograms();
      setTrainingsList(response.data?.programs || []);
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

      const newStatus = !training.is_active;
      const response = await api.admin.updateTrainingProgram(id, {
        is_active: newStatus
      });

      if (response.status === 'error') throw new Error(response.message);

      setTrainingsList(prev => prev.map(t =>
        t.id === id ? { ...t, is_active: newStatus } : t
      ));
      
      toast({
        title: newStatus ? "Enrollments Opened" : "Enrollments Closed",
        description: newStatus 
          ? "Training program is now visible on the public website."
          : "Training program has been removed from the public website.",
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

    if (isSubmitting) return;

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

    setIsSubmitting(true);

    try {
      const response = await api.admin.createTrainingProgram({
        title: formData.title.trim(),
        description: formData.description.trim(),
        duration: formData.duration.trim(),
        price: priceValue,
        is_active: true
      });

      if (response.status === 'error') throw new Error(response.message);

      const data = response.data?.program;

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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEdit = (program: TrainingWithEnrollments) => {
    setSelectedProgram(program);
    setFormData({
      title: program.title,
      description: program.description || "",
      duration: program.duration || "",
      price: program.price?.toString() || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleView = (program: TrainingWithEnrollments) => {
    setSelectedProgram(program);
    setIsViewDialogOpen(true);
  };

  const handleDelete = async (program: TrainingWithEnrollments) => {
    if (!window.confirm(`Are you sure you want to delete "${program.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await api.admin.deleteTrainingProgram(program.id);

      if (response.status === 'error') throw new Error(response.message);

      setTrainingsList(prev => prev.filter(p => p.id !== program.id));
      toast({
        title: "Program Deleted",
        description: "Training program has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting training:', error);
      toast({
        title: "Error",
        description: "Failed to delete training program.",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProgram || isSubmitting) return;

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

    setIsSubmitting(true);

    try {
      const response = await api.admin.updateTrainingProgram(selectedProgram.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        duration: formData.duration.trim(),
        price: priceValue,
        is_active: selectedProgram.is_active
      });

      if (response.status === 'error') throw new Error(response.message);

      const data = response.data?.program;

      setTrainingsList(prev => prev.map(p => 
        p.id === selectedProgram.id ? { ...data, enrolled_count: p.enrolled_count } : p
      ));
      
      setIsEditDialogOpen(false);
      setSelectedProgram(null);
      setFormData({ title: '', description: '', duration: '', price: '' });
      toast({
        title: "Program Updated",
        description: "Training program has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating training:', error);
      toast({
        title: "Error",
        description: "Failed to update training program.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
          <Button onClick={() => setIsDialogOpen(true)}>
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
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading training programs...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrainings.map((training) => (
              <Card key={training.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <div className="flex flex-col gap-2">
                        <Badge variant={training.is_active ? "default" : "secondary"}>
                          {training.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant={training.is_active ? "default" : "secondary"} className="bg-green-500/20 text-green-400 border-green-500/30">
                          {training.is_active ? "Public" : "Hidden"}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(training)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Program
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleView(training)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(training)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Program
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{training.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <p className="line-clamp-3 overflow-hidden">
                      {training.description || 'No description available'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        Duration
                      </span>
                      <span className="font-medium">{training.duration || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <IndianRupee className="w-4 h-4" />
                        Price
                      </span>
                      <span className="font-medium">₹{training.price?.toLocaleString("en-IN") || '0'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        Enrolled
                      </span>
                      <span className="font-medium">{training.enrolled_count || 0} users</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Public Visibility</span>
                      <span className="text-xs text-muted-foreground">
                        {training.is_active 
                          ? "Program is visible on public website" 
                          : "Program is hidden from public website"}
                      </span>
                    </div>
                    <Switch
                      checked={training.is_active}
                      onCheckedChange={() => toggleStatus(training.id)}
                    />
                  </div>
                </CardContent>
              </Card>
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
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Program"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Training Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Training Program</DialogTitle>
            <DialogDescription>
              Update the training program details below.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4 mt-4" onSubmit={handleUpdate}>
            <div className="space-y-2">
              <Label htmlFor="edit-title">Program Title *</Label>
              <Input
                id="edit-title"
                placeholder="e.g., React.js Masterclass"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                placeholder="Brief description of the program..."
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duration *</Label>
                <Input
                  id="edit-duration"
                  placeholder="e.g., 8 weeks"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (₹) *</Label>
                <Input
                  id="edit-price"
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
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedProgram(null);
                  setFormData({ title: '', description: '', duration: '', price: '' });
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Program"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Training Program Details</DialogTitle>
            <DialogDescription>
              Complete information about the training program.
            </DialogDescription>
          </DialogHeader>
          {selectedProgram && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Program Title</Label>
                <p className="text-foreground">{selectedProgram.title}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <p className="text-foreground">{selectedProgram.description || 'No description available'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Duration</Label>
                  <p className="text-foreground">{selectedProgram.duration || 'Not specified'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Price</Label>
                  <p className="text-foreground">₹{selectedProgram.price?.toLocaleString("en-IN") || '0'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge variant={selectedProgram.is_active ? "default" : "secondary"}>
                    {selectedProgram.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Enrolled Users</Label>
                  <p className="text-foreground">{selectedProgram.enrolled_count || 0} users</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Created Date</Label>
                <p className="text-foreground">{new Date(selectedProgram.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    setSelectedProgram(null);
                  }}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    handleEdit(selectedProgram);
                  }}
                  className="flex-1"
                >
                  Edit Program
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default TrainingsManagement;
