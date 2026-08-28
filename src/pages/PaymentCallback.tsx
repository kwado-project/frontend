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
    // Don't gate on the exact wording of Flutterwave's client-visible
    // "status" param - if there's a tx_ref, ask the backend to verify the
    // transaction with Flutterwave directly and trust that result instead.
    // Only skip straight to failure when there's no tx_ref to verify at all
    // (e.g. the user cancelled before a transaction was created).
    if (!txRef) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: status ? `Missing payment reference (status: ${status}).` : "Missing payment reference.",
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
