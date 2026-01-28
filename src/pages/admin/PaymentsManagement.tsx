import { useState, useEffect } from "react";
import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import ModernButton from "@/components/ui/ModernButton";
import { Input } from "@/components/ui/input";
import { 
    Search, 
    Filter,
    CheckCircle2,
    XCircle,
    Clock,
    IndianRupee,
    Eye
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { api, Payment, User, TrainingProgram } from "@/lib/api";

interface PaymentWithDetails extends Payment {
  user: User;
  training_program: TrainingProgram;
}

const PaymentsManagement = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedPayment, setSelectedPayment] = useState<PaymentWithDetails | null>(null);
    const [paymentsList, setPaymentsList] = useState<PaymentWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const { data: payments, error } = await supabase
                .from('payments')
                .select(`
                    *,
                    user:users(*),
                    training_program:training_programs(*)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPaymentsList(payments || []);
        } catch (error) {
            console.error('Error fetching payments:', error);
            toast({
                title: "Error",
                description: "Failed to fetch payments.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const filteredPayments = paymentsList.filter(payment => {
        const matchesSearch = payment.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                      payment.training_program?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                      payment.transaction_reference?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleVerify = async (id: string) => {
        try {
            const { error } = await supabase
                .from('payments')
                .update({ status: 'verified' })
                .eq('id', id);

            if (error) throw error;

            setPaymentsList(prev => prev.map(p => 
                p.id === id ? { ...p, status: "verified" } : p
            ));
            setSelectedPayment(null);
            toast({
                title: "Payment Verified",
                description: "The payment has been verified successfully.",
            });
        } catch (error) {
            console.error('Error verifying payment:', error);
            toast({
                title: "Error",
                description: "Failed to verify payment.",
                variant: "destructive",
            });
        }
    };

    const handleReject = async (id: string) => {
        try {
            const { error } = await supabase
                .from('payments')
                .update({ status: 'failed' })
                .eq('id', id);

            if (error) throw error;

            setPaymentsList(prev => prev.map(p => 
                p.id === id ? { ...p, status: "failed" } : p
            ));
            setSelectedPayment(null);
            toast({
                title: "Payment Rejected",
                description: "The payment has been marked as failed.",
                variant: "destructive",
            });
        } catch (error) {
            console.error('Error rejecting payment:', error);
            toast({
                title: "Error",
                description: "Failed to reject payment.",
                variant: "destructive",
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "verified":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                    </span>
                );
            case "pending_verification":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600">
                        <Clock className="w-3.5 h-3.5" />
                        Pending
                    </span>
                );
            case "failed":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-600">
                        <XCircle className="w-3.5 h-3.5" />
                        Failed
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">Payments</h1>
                    <p className="text-muted-foreground mt-1">Verify and manage payment transactions.</p>
                </div>

                {/* Stats */}
                <div className="grid sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                        <p className="text-sm text-muted-foreground">Verified</p>
                        <p className="text-2xl font-bold text-green-600">
                            {paymentsList.filter(p => p.status === "verified").length}
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className="text-2xl font-bold text-amber-600">
                            {paymentsList.filter(p => p.status === "pending_verification").length}
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                        <p className="text-sm text-muted-foreground">Failed</p>
                        <p className="text-2xl font-bold text-red-600">
                            {paymentsList.filter(p => p.status === "failed").length}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by user, training, or transaction ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex gap-2">
                        {["all", "pending_verification", "verified", "failed"].map((status) => (
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
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Payments Table */}
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-muted-foreground">
                            Loading payments...
                        </div>
                    ) : (
                        <>
                            {filteredPayments.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    No payments found matching your criteria.
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border bg-muted/50">
                                            <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">User</th>
                                            <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Training</th>
                                            <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Amount</th>
                                            <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Transaction ID</th>
                                            <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                                            <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Date</th>
                                            <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPayments.map((payment) => (
                                            <tr key={payment.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-medium text-foreground">{payment.user?.full_name || 'Unknown'}</p>
                                                        <p className="text-sm text-muted-foreground">{payment.user?.email || 'No email'}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-foreground">{payment.training_program?.title || 'Unknown'}</td>
                                                <td className="px-6 py-4">
                                                    <span className="flex items-center gap-1 font-medium text-foreground">
                                                        <IndianRupee className="w-4 h-4" />
                                                        {payment.amount?.toLocaleString("en-IN") || '0'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{payment.transaction_reference || 'N/A'}</td>
                                                <td className="px-6 py-4">{getStatusBadge(payment.status)}</td>
                                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                                    {new Date(payment.created_at).toLocaleDateString('en-IN', { 
                                                        day: '2-digit', 
                                                        month: '2-digit', 
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <ModernButton 
                                                        text="View Details"
                                                        onClick={() => setSelectedPayment(payment)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Payment Detail Dialog */}
            <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Payment Details</DialogTitle>
                        <DialogDescription>
                            Review and verify this payment transaction.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedPayment && (
                        <div className="space-y-4 mt-4">
                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b border-border">
                                    <span className="text-muted-foreground">User</span>
                                    <span className="font-medium text-foreground">{selectedPayment.user?.full_name || 'Unknown'}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-border">
                                    <span className="text-muted-foreground">Email</span>
                                    <span className="text-foreground">{selectedPayment.user?.email || 'No email'}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-border">
                                    <span className="text-muted-foreground">Training</span>
                                    <span className="font-medium text-foreground">{selectedPayment.training_program?.title || 'Unknown'}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-border">
                                    <span className="text-muted-foreground">Amount</span>
                                    <span className="font-bold text-foreground flex items-center gap-1">
                                        <IndianRupee className="w-4 h-4" />
                                        {selectedPayment.amount?.toLocaleString("en-IN") || '0'}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-border">
                                    <span className="text-muted-foreground">Transaction ID</span>
                                    <span className="font-mono text-foreground">{selectedPayment.transaction_reference || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-border">
                                    <span className="text-muted-foreground">Date</span>
                                    <span className="text-foreground">
                                        {new Date(selectedPayment.created_at).toLocaleDateString('en-IN', { 
                                            day: '2-digit', 
                                            month: '2-digit', 
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-muted-foreground">Status</span>
                                    {getStatusBadge(selectedPayment.status)}
                                </div>
                            </div>

                            {selectedPayment.status === "pending_verification" && (
                                <div className="flex gap-3 pt-4">
                                    <ModernButton 
                                        text="Reject"
                                        onClick={() => handleReject(selectedPayment.id)}
                                        className="flex-1"
                                    />
                                    <ModernButton 
                                        text="Verify"
                                        onClick={() => handleVerify(selectedPayment.id)}
                                        className="flex-1"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default PaymentsManagement;