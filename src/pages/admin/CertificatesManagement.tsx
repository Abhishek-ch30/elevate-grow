import { useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
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

const certificates = [
  { 
    id: "CERT-2024-001", 
    user: "Rahul Sharma", 
    email: "rahul.sharma@email.com",
    training: "React.js Masterclass", 
    issueDate: "2024-01-15",
    status: "issued"
  },
  { 
    id: "CERT-2024-002", 
    user: "Vikram Singh", 
    email: "vikram.singh@email.com",
    training: "UI/UX Design Fundamentals", 
    issueDate: "2024-01-13",
    status: "issued"
  },
  { 
    id: null, 
    user: "Priya Patel", 
    email: "priya.patel@email.com",
    training: "Cloud Architecture with AWS", 
    issueDate: null,
    status: "eligible"
  },
  { 
    id: null, 
    user: "Amit Kumar", 
    email: "amit.kumar@email.com",
    training: "Full Stack Development", 
    issueDate: null,
    status: "eligible"
  },
];

const CertificatesManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCertificate, setSelectedCertificate] = useState<typeof certificates[0] | null>(null);
  const [certificatesList, setCertificatesList] = useState(certificates);
  const { toast } = useToast();

  const filteredCertificates = certificatesList.filter(cert => {
    const matchesSearch = cert.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cert.training.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (cert.id && cert.id.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || cert.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleIssueCertificate = (userEmail: string) => {
    const newId = `CERT-2024-${String(certificatesList.filter(c => c.id).length + 1).padStart(3, '0')}`;
    setCertificatesList(prev => prev.map(c => 
      c.email === userEmail ? { ...c, id: newId, issueDate: new Date().toISOString().split('T')[0], status: "issued" } : c
    ));
    setSelectedCertificate(null);
    toast({
      title: "Certificate Issued",
      description: `Certificate ${newId} has been generated successfully.`,
    });
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
                {filteredCertificates.map((cert, index) => (
                  <tr key={cert.id || index} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      {cert.id ? (
                        <span className="font-mono text-sm text-foreground">{cert.id}</span>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">{cert.user}</p>
                        <p className="text-sm text-muted-foreground">{cert.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{cert.training}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {cert.issueDate || "—"}
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
                        <Button 
                          variant="accent" 
                          size="sm"
                          onClick={() => setSelectedCertificate(cert)}
                        >
                          <Award className="w-4 h-4 mr-2" />
                          Issue
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredCertificates.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No certificates found matching your criteria.
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
                <p className="font-medium text-foreground">{selectedCertificate.user}</p>
                <p className="text-sm text-muted-foreground">{selectedCertificate.email}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <p className="text-sm text-muted-foreground">Training Program</p>
                <p className="font-medium text-foreground">{selectedCertificate.training}</p>
              </div>
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                <p className="text-sm text-muted-foreground">Certificate ID (Auto-generated)</p>
                <p className="font-mono font-medium text-foreground">
                  CERT-2024-{String(certificatesList.filter(c => c.id).length + 1).padStart(3, '0')}
                </p>
              </div>
              <Button 
                variant="accent" 
                className="w-full"
                onClick={() => handleIssueCertificate(selectedCertificate.email)}
              >
                <Award className="w-4 h-4 mr-2" />
                Generate & Issue Certificate
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default CertificatesManagement;
