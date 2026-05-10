import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
              K
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">Kwado AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Log in
            </Link>
            <Button asChild className="rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/register">Start for Free</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Invest in your future.
          </h1>
          <p className="text-xl text-muted-foreground mb-16 max-w-2xl mx-auto">
            Get access to the most advanced JAMB preparation tool in Nigeria for less than the cost of a single textbook.
          </p>

          <div className="bg-card border border-primary/20 rounded-3xl p-8 md:p-12 shadow-xl shadow-primary/5 max-w-lg mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
              MOST POPULAR
            </div>
            
            <h2 className="text-2xl font-bold text-foreground mb-2">Premium Prep</h2>
            <div className="text-5xl font-bold text-foreground mb-2">₦1,550<span className="text-xl text-muted-foreground font-normal">/mo</span></div>
            <p className="text-muted-foreground mb-8 pb-8 border-b border-border">Everything you need to score 300+</p>
            
            <ul className="space-y-4 mb-8 text-left">
              {[
                "Full diagnostic assessment across 4 subjects",
                "Personalized daily AI-generated roadmap",
                "Unlimited practice questions & CBT simulation",
                "Detailed topic-level performance analytics",
                "Weekly progress reports & predicted scores",
                "Priority support"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button size="lg" className="w-full h-14 text-lg rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground mb-4" asChild>
              <Link href="/register">Get Started Now</Link>
            </Button>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="w-4 h-4" />
              <span>Secure payment via Paystack</span>
            </div>
          </div>

          <div className="mt-20">
            <h3 className="text-2xl font-bold text-foreground mb-8">Frequently Asked Questions</h3>
            <div className="grid md:grid-cols-2 gap-8 text-left max-w-3xl mx-auto">
              <div>
                <h4 className="font-bold text-foreground mb-2">Can I cancel anytime?</h4>
                <p className="text-muted-foreground text-sm">Yes, you can cancel your subscription at any time. You will retain access until the end of your current billing period.</p>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-2">Are all subjects available?</h4>
                <p className="text-muted-foreground text-sm">We currently support 14 major JAMB subjects including English, Mathematics, Sciences, and Commercial subjects.</p>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-2">Is the CBT simulator realistic?</h4>
                <p className="text-muted-foreground text-sm">Our CBT interface is designed to closely mimic the actual JAMB examination environment to build your familiarity and confidence.</p>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-2">How accurate are the predicted scores?</h4>
                <p className="text-muted-foreground text-sm">Our model is trained on historical data. Students who follow the roadmap consistently typically score within 10 points of their predicted score.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-muted py-8 border-t border-border text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Kwado AI. All rights reserved.
      </footer>
    </div>
  );
}
