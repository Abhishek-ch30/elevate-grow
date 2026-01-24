import { useState, useEffect } from "react";
import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import ModernButton from "@/components/ui/ModernButton";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Award,
  Download,
  Eye,
  FileText,
  CheckCircle2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Certificate, User, TrainingProgram, Enrollment } from "@/lib/supabase";

interface CertificateWithDetails extends Certificate {
  user: User;
  training_program: TrainingProgram;
}

interface EligibleCertificate {
  user_id: string;
  training_id: string;
  user: User;
  training_program: TrainingProgram;
  status: 'eligible';
}

type CertificateItem = CertificateWithDetails | EligibleCertificate;

const CertificatesManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateItem | null>(null);
  const [certificatesList, setCertificatesList] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      
      // Fetch issued certificates
      const { data: issuedCertificates, error: issuedError } = await supabase
        .from('certificates')
        .select(`
          *,
          user:users(*),
          training_program:training_programs(*)
        `)
        .order('created_at', { ascending: false });

      if (issuedError) throw issuedError;

      // Fetch completed enrollments without certificates (eligible for certificates)
      const { data: completedEnrollments, error: enrollmentError } = await supabase
        .from('enrollments')
        .select(`
          user_id,
          training_id,
          user:users(*),
          training_program:training_programs(*)
        `)
        .eq('status', 'completed');

      if (enrollmentError) throw enrollmentError;

      // Get existing certificate user-training pairs
      const existingPairs = new Set(
        issuedCertificates?.map(cert => `${cert.user_id}-${cert.training_id}`) || []
      );

      // Filter out completed enrollments that already have certificates
      const eligibleCertificates: EligibleCertificate[] = (completedEnrollments || [])
        .filter(enrollment => !existingPairs.has(`${enrollment.user_id}-${enrollment.training_id}`))
        .map(enrollment => ({
          user_id: enrollment.user_id,
          training_id: enrollment.training_id,
          user: enrollment.user,
          training_program: enrollment.training_program,
          status: 'eligible' as const
        }));

      const allCertificates: CertificateItem[] = [
        ...(issuedCertificates || []),
        ...eligibleCertificates
      ];

      setCertificatesList(allCertificates);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch certificates.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCertificates = certificatesList.filter(cert => {
    const user = 'user' in cert ? cert.user.full_name : cert.user.full_name;
    const training = 'training_program' in cert ? cert.training_program.title : cert.training_program.title;
    const certId = 'certificate_id' in cert ? cert.certificate_id : null;
    
    const matchesSearch = user?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          training?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (certId && certId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || cert.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleIssueCertificate = async (userId: string, trainingId: string) => {
    try {
      // Generate unique certificate ID
      const certificateId = `CERT-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
      
      const { error } = await supabase
        .from('certificates')
        .insert({
          certificate_id: certificateId,
          user_id: userId,
          training_id: trainingId,
          issue_date: new Date().toISOString().split('T')[0]
        });

      if (error) throw error;

      // Refresh certificates list
      await fetchCertificates();
      
      setSelectedCertificate(null);
      toast({
        title: "Certificate Issued",
        description: `Certificate ${certificateId} has been generated successfully.`,
      });
    } catch (error) {
      console.error('Error issuing certificate:', error);
      toast({
        title: "Error",
        description: "Failed to issue certificate.",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">Certificates</h1>
          <p className="text-muted-foreground mt-1">Issue and manage training completion certificates.</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Issued Certificates</p>
                <p className="text-2xl font-bold text-green-600">
                  {certificatesList.filter(c => c.status === "issued").length}
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ready to Issue</p>
                <p className="text-2xl font-bold text-amber-600">
                  {certificatesList.filter(c => c.status === "eligible").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by user, training, or certificate ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {["all", "issued", "eligible"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize",
                  statusFilter === status
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {status === "eligible" ? "Ready to Issue" : status}
              </button>
            ))}
          </div>
        </div>

        {/* Certificates Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading certificates...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Certificate ID</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">User</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Training</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Issue Date</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCertificates.map((cert, index) => {
                    const user = 'user' in cert ? cert.user : cert.user;
                    const training = 'training_program' in cert ? cert.training_program : cert.training_program;
                    const certId = 'certificate_id' in cert ? cert.certificate_id : null;
                    const issueDate = 'issue_date' in cert ? cert.issue_date : null;
                    
                    return (
                      <tr key={certId || `${cert.user_id}-${cert.training_id}`} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          {certId ? (
                            <span className="font-mono text-sm text-foreground">{certId}</span>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-foreground">{user?.full_name || 'Unknown User'}</p>
                            <p className="text-sm text-muted-foreground">{user?.email || 'No email'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">{training?.title || 'Unknown Training'}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {issueDate || "—"}
                        </td>
                        <td className="px-6 py-4">
                          {cert.status === "issued" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Issued
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600">
                              <FileText className="w-3.5 h-3.5" />
                              Eligible
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {cert.status === "issued" ? (
                            <div className="flex gap-2 justify-end">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          ) : (
                            <ModernButton 
                              text="Issue"
                              onClick={() => setSelectedCertificate(cert)}
                            />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {filteredCertificates.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  No certificates found matching your criteria.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Issue Certificate Dialog */}
      <Dialog open={!!selectedCertificate} onOpenChange={() => setSelectedCertificate(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Issue Certificate</DialogTitle>
          </DialogHeader>
          {selectedCertificate && (
            <div className="space-y-4 mt-4">
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <p className="text-sm text-muted-foreground">Recipient</p>
                <p className="font-medium text-foreground">
                  {'user' in selectedCertificate ? selectedCertificate.user.full_name : selectedCertificate.user.full_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {'user' in selectedCertificate ? selectedCertificate.user.email : selectedCertificate.user.email}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <p className="text-sm text-muted-foreground">Training Program</p>
                <p className="font-medium text-foreground">
                  {'training_program' in selectedCertificate ? selectedCertificate.training_program.title : selectedCertificate.training_program.title}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                <p className="text-sm text-muted-foreground">Certificate ID (Auto-generated)</p>
                <p className="font-mono font-medium text-foreground">
                  CERT-{new Date().getFullYear()}-{Date.now().toString().slice(-6)}
                </p>
              </div>
              <ModernButton 
                text="Generate & Issue Certificate"
                onClick={() => {
                  if ('user_id' in selectedCertificate) {
                    handleIssueCertificate(selectedCertificate.user_id, selectedCertificate.training_id);
                  }
                }}
                className="w-full"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default CertificatesManagement;
