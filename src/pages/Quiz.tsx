import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useStartQuiz, useSubmitQuiz } from "@/lib/hooks";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BrainCircuit, Clock, ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Quiz() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const { data: session, isLoading: isLoadingSession, error: sessionError } = useStartQuiz({
    query: {
      enabled: started,
      refetchOnWindowFocus: false,
    }
  });

  const submitMutation = useSubmitQuiz();

  useEffect(() => {
    if (session && timeLeft === null) {
      setTimeLeft(session.timeLimit * 60);
    }
  }, [session, timeLeft]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev && prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev ? prev - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // const handleSubmit = async () => {
  //   if (!session) return;

  //   // const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
  //   //   questionId,
  //   //   selectedOption
  //   // }));
  //   const formattedAnswers = Object.entries(answers).map(
  //     ([questionId, selectedAnswer]) => ({
  //       question_id: Number(questionId),
  //       selected_answer: selectedAnswer,
  //     })
  //   );

  //   try {
  //     // await submitMutation.mutateAsync({
  //     //   data: {
  //     //     sessionId: session.sessionId,
  //     //     answers: formattedAnswers
  //     //   }
  //     // });
  //     await submitMutation.mutateAsync({
  //       data: {
  //         attempt_id: Number(session.sessionId),
  //         answers: formattedAnswers,
  //       },
  //     });
      
  //     setLocation("/quiz/result");
  //   } catch (error: any) {
  //     toast({
  //       variant: "destructive",
  //       title: "Submission failed",
  //       description: "Could not submit your quiz. Please try again.",
  //     });
  //   }
  // };

  const handleSubmit = async () => {
    if (!session) return;

    const formattedAnswers = Object.entries(answers).map(
      ([questionId, selectedAnswer]) => ({
        question_id: Number(questionId),
        selected_answer: String.fromCharCode(65 + Number(selectedAnswer)),
      })
    );

    try {
      await submitMutation.mutateAsync({
        data: {
          attempt_id: Number(session.sessionId),
          answers: formattedAnswers,
        },
      });

      setLocation("/quiz/result");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "Could not submit your quiz. Please try again.",
      });
    }
  };
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 md:p-12 text-center border-border shadow-lg">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-8 border border-primary/20">
            <BrainCircuit className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Diagnostic Assessment</h1>
          <p className="text-lg text-muted-foreground mb-8">
            This test determines your current proficiency across your chosen subjects.
            Do your best—the results will shape your personalized study roadmap.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-12 text-left bg-muted p-6 rounded-xl border border-border">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Duration</p>
              <p className="font-medium flex items-center gap-2"><Clock className="w-4 h-4 text-primary"/> ~45 minutes</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Format</p>
              <p className="font-medium">Multiple Choice</p>
            </div>
          </div>

          <Button size="lg" className="w-full h-14 text-lg rounded-xl" onClick={() => setStarted(true)}>
            Start Assessment
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoadingSession || !session) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
        <p className="text-muted-foreground font-medium">Preparing your assessment...</p>
      </div>
    );
  }

  if (sessionError) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Could not load quiz</h2>
        <p className="text-muted-foreground mb-6">There was a problem starting your assessment.</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const question = session.questions[currentIndex];
  const progress = ((currentIndex) / session.questions.length) * 100;
  const isLast = currentIndex === session.questions.length - 1;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 bg-background border-b border-border z-10 px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg text-foreground">Kwado Assessment</span>
          <span className="hidden md:inline-flex px-2 py-1 rounded bg-muted text-xs font-medium text-muted-foreground border border-border">
            {question.subject}
          </span>
        </div>
        <div className={`flex items-center gap-2 font-mono text-lg font-bold px-3 py-1 rounded-md ${timeLeft !== null && timeLeft < 300 ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
          <Clock className="w-5 h-5" />
          {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
        </div>
      </header>

      <div className="h-1 bg-muted w-full">
        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 md:p-8 flex flex-col">
        <div className="mb-6 flex justify-between items-center text-sm font-medium text-muted-foreground">
          <span>Question {currentIndex + 1} of {session.questions.length}</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            <h2 className="text-xl md:text-2xl font-medium text-foreground leading-relaxed mb-8">
              {question.text}
            </h2>

            <div className="space-y-3">
              {question.options.map((option: string, idx: number) => {
                const isSelected = answers[question.id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setAnswers(prev => ({ ...prev, [question.id]: idx }))}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border bg-card hover:border-primary/40 hover:bg-muted'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                      isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                    </div>
                    <span className={`text-base ${isSelected ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                      {option}
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex items-center justify-between pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex(p => Math.max(0, p - 1))}
            disabled={currentIndex === 0}
            className="w-32"
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Previous
          </Button>

          {isLast ? (
            <Button
              onClick={handleSubmit}
              disabled={submitMutation.isPending || Object.keys(answers).length < session.questions.length}
              className="w-32"
            >
              {submitMutation.isPending ? "Submitting..." : "Submit"}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentIndex(p => Math.min(session.questions.length - 1, p + 1))}
              className="w-32"
            >
              Next <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
