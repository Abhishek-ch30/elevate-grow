import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { api, PaymentSession, PaymentStatusResponse } from "@/lib/api";
import {
  Clock,
  IndianRupee,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Copy,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentQRComponentProps {
  isOpen: boolean;
  onClose: () => void;
  paymentSession: PaymentSession;
  onRetryPayment?: (enrollmentId: string) => Promise<void>;
}

const PaymentQRComponent = ({ isOpen, onClose, paymentSession, onRetryPayment }: PaymentQRComponentProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(paymentSession.timer_duration);
  const [isExpired, setIsExpired] = useState(false);
  const [transactionRef, setTransactionRef] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusResponse | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [userHasConfirmed, setUserHasConfirmed] = useState(false);
  const { toast } = useToast();

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Check payment status periodically
  useEffect(() => {
    if (isExpired || paymentStatus?.status === 'verified') return;

    const statusCheck = setInterval(async () => {
      try {
        const response = await api.user.getPaymentStatus(paymentSession.payment_id);
        if (response.status === 'success' && response.data) {
          setPaymentStatus(response.data.payment_status);
          
          if (response.data.payment_status.status === 'verified') {
            toast({
              title: "Payment Verified!",
              description: "Your enrollment has been confirmed.",
            });
          } else if (response.data.payment_status.is_expired) {
            setIsExpired(true);
          }
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(statusCheck);
  }, [paymentSession.payment_id, isExpired, paymentStatus?.status, toast]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfirmPayment = async () => {
    try {
      setIsConfirming(true);
      const response = await api.user.confirmPayment(paymentSession.payment_id, transactionRef);
      
      if (response.status === 'success') {
        toast({
          title: "Payment Confirmation Recorded",
          description: "Your payment is under verification. You will be notified once confirmed.",
        });
        
        // Close the modal after successful confirmation
        onClose();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to confirm payment",
        variant: "destructive",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const checkPaymentStatus = async () => {
    try {
      setIsCheckingStatus(true);
      const response = await api.user.getPaymentStatus(paymentSession.payment_id);
      if (response.status === 'success' && response.data) {
        setPaymentStatus(response.data.payment_status);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to check payment status",
        variant: "destructive",
      });
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Payment reference copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const openUPIApp = () => {
    window.open(paymentSession.upi_link, '_blank');
  };

  const getStatusDisplay = () => {
    if (paymentStatus?.status === 'verified') {
      return (
        <div className="text-center p-6 bg-green-500/10 rounded-lg border border-green-500/20">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-600 mb-2">Payment Verified!</h3>
          <p className="text-green-600/80">Your enrollment has been confirmed. You can now access the training program.</p>
        </div>
      );
    }

    if (paymentStatus?.status === 'failed' || isExpired) {
      return (
        <div className="text-center p-6 bg-red-500/10 rounded-lg border border-red-500/20">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-600 mb-2">Payment Session Expired</h3>
          <p className="text-red-600/80 mb-4">Please retry the payment process.</p>
          <Button
            onClick={async () => {
              if (onRetryPayment) {
                try {
                  await onRetryPayment(paymentSession.enrollment_id);
                  onClose();
                } catch (error) {
                  console.error('Retry payment failed:', error);
                }
              } else {
                onClose();
              }
            }}
            className="bg-red-500 hover:bg-red-600"
          >
            Retry Payment
          </Button>
        </div>
      );
    }

    if (paymentStatus?.status === 'pending_verification' && userHasConfirmed) {
      return (
        <div className="text-center p-6 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <Clock className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-blue-600 mb-2">Payment Under Verification</h3>
          <p className="text-blue-600/80">Your payment confirmation has been received and is being verified by our team.</p>
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] bg-white/5 backdrop-blur-xl border border-white/15 flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-white">Complete Payment</DialogTitle>
          <DialogDescription className="text-white/70">
            Scan the QR code or use the UPI link to complete your payment for {paymentSession.training_title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4 overflow-y-auto flex-1 pr-2">
          {/* Payment Amount */}
          <div className="text-center p-4 bg-black/40 rounded-lg border border-cyan-500/30">
            <p className="text-white/60 text-sm mb-1">Amount to Pay</p>
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-white">
              <IndianRupee className="w-6 h-6 text-cyan-400" />
              {paymentSession.amount.toLocaleString("en-IN")}
            </div>
          </div>

          {/* Timer */}
          {!isExpired && paymentStatus?.status !== 'verified' && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-lg">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 font-mono text-lg font-bold">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <p className="text-white/60 text-sm mt-2">Time remaining to complete payment</p>
            </div>
          )}

          {/* Status Display */}
          {getStatusDisplay()}

          {/* QR Code and Payment Options (only show if not expired and not verified and user hasn't confirmed) */}
          {!isExpired && paymentStatus?.status !== 'verified' && (!userHasConfirmed || paymentStatus?.status !== 'pending_verification') && (
            <>
              {/* QR Code */}
              <div className="text-center">
                <div className="inline-block p-4 bg-white rounded-lg">
                  <img 
                    src={paymentSession.qr_code} 
                    alt="Payment QR Code"
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                <p className="text-white/60 text-sm mt-2">
                  Scan with any UPI app to pay
                </p>
              </div>

              {/* Payment Reference */}
              <div className="space-y-2">
                <Label className="text-white/80 text-sm">Payment Reference</Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 bg-black/40 border border-cyan-500/30 rounded-lg">
                    <span className="text-white font-mono text-sm">{paymentSession.payment_reference}</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(paymentSession.payment_reference)}
                    className="bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Payment Confirmation Form */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h4 className="text-white font-medium">Payment Completed?</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="transactionRef" className="text-white/80 text-sm">
                    Transaction Reference (Optional)
                  </Label>
                  <Input
                    id="transactionRef"
                    placeholder="Enter transaction ID from your UPI app"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="bg-black/40 border-cyan-500/30 text-white placeholder:text-white/60"
                  />
                </div>

                <Button
                  onClick={handleConfirmPayment}
                  disabled={isConfirming}
                  className="w-full bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30"
                >
                  {isConfirming ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      I have completed the payment
                    </>
                  )}
                </Button>
              </div>

              {/* Status Check Button */}
              <Button
                onClick={checkPaymentStatus}
                disabled={isCheckingStatus}
                variant="outline"
                className="w-full bg-white/5 border-white/20 text-white/80 hover:bg-white/10"
              >
                {isCheckingStatus ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Checking Status...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Check Payment Status
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentQRComponent;