import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useVerifySubscription } from "@/lib/hooks";
import { useToast } from "@/hooks/use-toast";

export default function PaymentCallback() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const verifyMutation = useVerifySubscription();
  const hasVerified = useRef(false);

  const searchParams = new URLSearchParams(window.location.search);
  const status = searchParams.get("status");
  const txRef = searchParams.get("tx_ref");

  useEffect(() => {
    if (status !== "successful" && status !== "completed") {
      toast({
        title: "Payment Failed",
        description: "There was an issue with your payment. Please try again.",
        variant: "destructive",
      });
      setLocation("/subscribe");
      return;
    }

    if (!txRef) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: "Missing payment reference.",
      });
      setLocation("/subscribe");
      return;
    }

    if (!hasVerified.current) {
      hasVerified.current = true;
      verifyMutation.mutate(
        { data: { reference: txRef } },
        {
          onSuccess: () => {
            toast({
              title: "Payment Successful",
              description: "Your subscription has been activated.",
            });
            setLocation("/dashboard");
          },
          onError: (err: any) => {
            toast({
              variant: "destructive",
              title: "Verification Failed",
              description: err?.message || "Could not verify payment.",
            });
            setLocation("/subscribe");
          },
        }
      );
    }
  }, [status, txRef, verifyMutation, setLocation, toast]);

  return null;
}
