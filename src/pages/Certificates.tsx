import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { UserLayout } from "../components/layout/UserLayout";
import { Certificate, TrainingProgram } from "../lib/supabase";
import { 
  Award, 
  Download, 
  Calendar, 
  CheckCircle, 
  Clock, 
  BookOpen,
  Search,
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CertificateWithTraining extends Certificate {
  training_program: TrainingProgram;
}

const Certificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<CertificateWithTraining[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "earned" | "pending">("all");

  useEffect(() => {
    fetchCertificates();
  }, [user]);

  const fetchCertificates = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          training_program:training_programs(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledPrograms = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          training_program:training_programs(*)
        `)
        .eq('user_id', user.id)
        .neq('status', 'completed');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching enrolled programs:', error);
      return [];
    }
  };

  const handleDownload = async (certificate: CertificateWithTraining) => {
    // In a real app, this would generate and download a PDF certificate
    const certificateData = {
      certificateId: certificate.certificate_id,
      studentName: user?.email?.split('@')[0] || 'Student',
      courseName: certificate.training_program.title,
      issueDate: certificate.issue_date,
      fileName: `${certificate.certificate_id}.pdf`
    };

    // Create a simple text download for now
    const element = document.createElement("a");
    const file = new Blob([
      `Certificate ID: ${certificateData.certificateId}\n` +
      `Student: ${certificateData.studentName}\n` +
      `Course: ${certificateData.courseName}\n` +
      `Issue Date: ${certificateData.issueDate}\n\n` +
      `This is to certify that ${certificateData.studentName} has successfully completed the ${certificateData.courseName} course.`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = certificateData.fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.training_program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.certificate_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const [enrolledPrograms, setEnrolledPrograms] = useState<any[]>([]);

  useEffect(() => {
    fetchEnrolledPrograms().then(setEnrolledPrograms);
  }, [user]);

  const pendingCertificates = enrolledPrograms.filter(program => 
    program.status === 'enrolled' || program.status === 'pending_payment'
  );

  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading certificates...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Certificates</h1>
          <p className="text-muted-foreground">
            View and download your earned certificates and track your progress.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search certificates..."
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
              All ({certificates.length + pendingCertificates.length})
            </Button>
            <Button
              variant={filterStatus === "earned" ? "default" : "outline"}
              onClick={() => setFilterStatus("earned")}
              size="sm"
            >
              Earned ({certificates.length})
            </Button>
            <Button
              variant={filterStatus === "pending" ? "default" : "outline"}
              onClick={() => setFilterStatus("pending")}
              size="sm"
            >
              In Progress ({pendingCertificates.length})
            </Button>
          </div>
        </div>

        {/* Earned Certificates */}
        {(filterStatus === "all" || filterStatus === "earned") && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Award className="w-5 h-5" />
              Earned Certificates
            </h2>
            
            {filteredCertificates.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-muted/20">
                <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No certificates earned yet
                </h3>
                <p className="text-muted-foreground">
                  Complete your training programs to earn certificates.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCertificates.map((certificate) => (
                  <div key={certificate.id} className="border rounded-lg bg-card text-card-foreground shadow-sm">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                          <Award className="w-6 h-6" />
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Earned
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold mb-2">{certificate.training_program.title}</h3>
                      
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Issued: {new Date(certificate.issue_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          ID: {certificate.certificate_id}
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => handleDownload(certificate)}
                        className="w-full"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Certificate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* In Progress Certificates */}
        {(filterStatus === "all" || filterStatus === "pending") && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5" />
              In Progress
            </h2>
            
            {pendingCertificates.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-muted/20">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No programs in progress
                </h3>
                <p className="text-muted-foreground">
                  Enroll in training programs to start earning certificates.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pendingCertificates.map((program) => (
                  <div key={program.id} className="border rounded-lg bg-card text-card-foreground shadow-sm">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          <Clock className="w-3 h-3 mr-1" />
                          In Progress
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold mb-2">{program.training_program.title}</h3>
                      
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Status: {program.status.replace('_', ' ')}
                        </div>
                        {program.training_program.duration && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Duration: {program.training_program.duration}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center p-3 bg-muted rounded-md">
                        <p className="text-sm text-muted-foreground">
                          Certificate will be available after successful completion
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default Certificates;
