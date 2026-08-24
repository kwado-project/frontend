import { useState } from "react";
import { useLocation } from "wouter";
import { useInitializeSubscription } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, CheckCircle2, Lock } from "lucide-react";

export default function Subscribe() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const initSubMutation = useInitializeSubscription();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubscribe() {
    setIsLoading(true);
    try {
      const response = await initSubMutation.mutateAsync({});
      window.location.href = response.paymentLink;
    } catch (error: any) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Payment initialization failed",
        description: error?.message || "An error occurred while setting up payment.",
      });
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Activate Your Plan</h1>
          <p className="text-muted-foreground">Subscribe to access your personalized roadmap.</p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-bl-lg border-b border-l border-primary/20">
            ₦1,550 / MONTH
          </div>

          <h2 className="text-xl font-bold text-foreground mb-6 mt-2">Premium Prep</h2>

          <ul className="space-y-4 mb-8">
            {[
              "Full diagnostic assessment",
              "Personalized daily roadmap",
              "Unlimited CBT practice",
              "Performance analytics"
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-foreground">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="pt-6 border-t border-border">
            <div className="flex justify-between items-center mb-6">
              <span className="text-muted-foreground font-medium">Total due today</span>
              <span className="text-2xl font-bold text-foreground">₦1,550</span>
            </div>

            <Button
              size="lg"
              className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleSubscribe}
              disabled={isLoading || initSubMutation.isPending}
              data-testid="button-pay"
            >
              {isLoading || initSubMutation.isPending ? (
                "Initializing Payment..."
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Pay Securely
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="w-4 h-4" />
          <span>Secured by Paystack. Cancel anytime.</span>
        </div>
      </div>
    </div>
  );
}
