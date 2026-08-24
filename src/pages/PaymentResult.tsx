import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useVerifySubscription } from "@/lib/hooks";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const verifyMutation = useVerifySubscription();
  const hasVerified = useRef(false);

  const searchParams = new URLSearchParams(window.location.search);
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  useEffect(() => {
    if (!reference) {
      setLocation("/dashboard");
      return;
    }

    if (!hasVerified.current) {
      hasVerified.current = true;
      verifyMutation.mutate({ data: { reference } }, {
        onSuccess: () => {
          toast({
            title: "Payment Successful",
            description: "Your subscription is now active.",
          });
          setTimeout(() => setLocation("/quiz"), 2000);
        },
        onError: (err: any) => {
          toast({
            variant: "destructive",
            title: "Verification Failed",
            description: err?.message || "Could not verify payment.",
          });
          setLocation("/payment/failed");
        }
      });
    }
  }, [reference, verifyMutation, setLocation, toast]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto animate-in zoom-in duration-500">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Payment Successful!</h1>
        <p className="text-muted-foreground max-w-sm mx-auto">
          We're verifying your transaction and setting up your account...
        </p>
        <div className="flex justify-center mt-8">
          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      </div>
    </div>
  );
}

export function PaymentFailed() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center text-destructive mx-auto">
          <XCircle className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Payment Failed</h1>
        <p className="text-muted-foreground">
          We couldn't process your payment. Your account has not been charged.
        </p>
        <div className="pt-8">
          <Button asChild size="lg" className="w-full">
            <Link href="/subscribe">Try Again</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
