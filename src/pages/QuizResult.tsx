import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, ChevronRight, BrainCircuit, Activity } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
// For a real app, QuizResult would be fetched or passed via state.
// We'll mock the recent result if not available from a global store.

export default function QuizResult() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  
  // In a real app we'd fetch the latest quiz result. Let's mock a good looking result screen.
  const mockResult = {
    score: 245,
    totalQuestions: 60,
    correctAnswers: 42,
    subjectBreakdown: [
      { subject: "English", score: 65, total: 100, correct: 15 },
      { subject: "Physics", score: 45, total: 100, correct: 9 },
      { subject: "Mathematics", score: 85, total: 100, correct: 12 },
      { subject: "Chemistry", score: 50, total: 100, correct: 6 },
    ],
    weakAreas: ["Optics", "Organic Chemistry", "Calculus Integration"]
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 py-12">
      <div className="w-full max-w-3xl space-y-8">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Assessment Complete!</h1>
          <p className="text-xl text-muted-foreground">Great job, {user?.fullName?.split(' ')[0]}. Here is your baseline performance.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-8 flex flex-col items-center justify-center text-center border-primary/20 shadow-sm md:col-span-1 bg-primary/5">
            <span className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Estimated Score</span>
            <div className="text-6xl font-bold text-primary mb-2">{mockResult.score}</div>
            <span className="text-sm text-muted-foreground">out of 400</span>
          </Card>
          
          <Card className="p-8 md:col-span-2 border-border shadow-sm">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Subject Breakdown
            </h3>
            <div className="space-y-6">
              {mockResult.subjectBreakdown.map((sub, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-foreground">{sub.subject}</span>
                    <span className="text-muted-foreground">{sub.score}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${sub.score < 50 ? 'bg-destructive' : sub.score < 70 ? 'bg-yellow-500' : 'bg-primary'}`}
                      style={{ width: `${sub.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-8 border-border shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary" /> Target Areas for Improvement
          </h3>
          <div className="flex flex-wrap gap-2">
            {mockResult.weakAreas.map((area, i) => (
              <span key={i} className="px-4 py-2 bg-destructive/10 text-destructive text-sm font-medium rounded-lg border border-destructive/20">
                {area}
              </span>
            ))}
          </div>
          <p className="text-muted-foreground mt-6 text-sm">
            Our AI has identified these topics as your biggest opportunities for score growth. We will prioritize them in your roadmap.
          </p>
        </Card>

        <div className="pt-8 text-center">
          <Button asChild size="lg" className="h-16 px-10 text-lg rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 w-full md:w-auto">
            <Link href="/roadmap/generating">
              Generate My Custom Roadmap <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}
