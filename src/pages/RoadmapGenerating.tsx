import { useEffect } from "react";
import { useLocation } from "wouter";
import { useGenerateRoadmap } from "@/lib/hooks";
import { BrainCircuit, Sparkles, Database, Compass } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function RoadmapGenerating() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const generateMutation = useGenerateRoadmap();

  useEffect(() => {
    const generate = async () => {
      try {
        await generateMutation.mutateAsync({});
        setTimeout(() => {
          setLocation("/dashboard");
        }, 3000);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Generation failed",
          description: "There was a problem generating your roadmap.",
        });
        setLocation("/quiz/result");
      }
    };

    generate();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

      <div className="z-10 text-center max-w-md w-full">
        <div className="relative w-32 h-32 mx-auto mb-12">
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border-4 border-primary/30"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.2, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className="absolute inset-0 rounded-full border-4 border-primary/50"
          />
          <div className="absolute inset-0 bg-primary/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary/30">
            <BrainCircuit className="w-12 h-12 text-primary animate-pulse" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-4">Building Your Path</h1>

        <div className="space-y-6 text-left bg-card p-6 rounded-2xl border border-border shadow-lg">
          <LoadingStep icon={<Database className="w-5 h-5" />} text="Analyzing diagnostic results..." delay={0} />
          <LoadingStep icon={<Sparkles className="w-5 h-5" />} text="Identifying weak topics..." delay={0.8} />
          <LoadingStep icon={<Compass className="w-5 h-5" />} text="Scheduling daily milestones..." delay={1.6} />
        </div>
      </div>
    </div>
  );
}

function LoadingStep({ icon, text, delay }: { icon: React.ReactNode; text: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex items-center gap-4 text-muted-foreground"
    >
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <span className="font-medium text-foreground">{text}</span>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.5 }}
        className="ml-auto"
      >
        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-primary" />
        </div>
      </motion.div>
    </motion.div>
  );
}
