import { useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function PaymentCallback() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        // const success = urlParams.get("completed");
        const status = urlParams.get("status");
        if (status === "completed") {
            toast({
                title: "Payment Successful",
                description: "Your subscription has been activated.",
            });
            setLocation("/dashboard");
        } else {
            toast({
                title: "Payment Failed",
                description: "There was an issue with your payment. Please try again.",
                variant: "destructive",
            });
            setLocation("/subscribe");
        }
    }, [setLocation, toast]);

  return null;
}
