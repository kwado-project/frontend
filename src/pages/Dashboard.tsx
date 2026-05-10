import { useGetDashboardSummary, getGetDashboardSummaryQueryKey } from "@/lib/hooks";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Flame, Target, BookOpen, Clock, PlayCircle, BrainCircuit } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/store/auth";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: summary, isLoading } = useGetDashboardSummary({
    query: {
      queryKey: getGetDashboardSummaryQueryKey()
    }
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 md:p-10 space-y-6">
          <div className="h-8 w-64 bg-muted rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted rounded-2xl animate-pulse"></div>)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.fullName?.split(' ')[0]}</h1>
            <p className="text-muted-foreground">Here is your study overview for today.</p>
          </div>
          <div className="flex items-center gap-3 bg-card px-4 py-2 rounded-full border border-border shadow-sm w-max">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
            <span className="font-bold text-foreground">{summary?.studyStreak || 0} Day Streak</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border-border shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Roadmap Progress</p>
                <p className="text-2xl font-bold text-foreground">{summary?.roadmapProgress || 0}%</p>
              </div>
            </div>
            <Progress value={summary?.roadmapProgress || 0} className="h-2" />
          </Card>

          <Card className="p-6 border-border shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recent Score</p>
                <p className="text-2xl font-bold text-foreground">{summary?.recentQuizScore || 0}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Based on your latest assessment.</p>
          </Card>

          <Card className="p-6 border-border shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subscription</p>
                <p className="text-2xl font-bold text-foreground">{summary?.subscriptionActive ? "Active" : "Inactive"}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {summary?.subscriptionExpiresAt
                ? `Renews ${new Date(summary.subscriptionExpiresAt).toLocaleDateString()}`
                : "Please subscribe to continue."}
            </p>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Card className="p-8 border-primary/20 bg-primary/5 shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-1/3 -translate-y-1/4">
                <BrainCircuit className="w-64 h-64" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Up Next on Your Roadmap</h2>
              {summary?.nextTask ? (
                <>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    You have <span className="font-bold text-foreground">{summary.nextTask.durationMinutes} mins</span> of <span className="font-bold text-foreground">{summary.nextTask.subject}</span> scheduled today.
                  </p>
                  <div className="bg-card p-4 rounded-xl border border-border mb-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider mb-1 block">{summary.nextTask.subject}</span>
                        <span className="font-medium text-foreground">{summary.nextTask.topic}</span>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {summary.nextTask.durationMinutes}m
                      </span>
                    </div>
                  </div>
                  <Button asChild size="lg" className="rounded-xl">
                    <Link href={`/quiz?task=${summary.nextTask.id}`}>
                      <PlayCircle className="w-5 h-5 mr-2" /> Start Session
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground mb-6">You're all caught up for today! Feel free to practice extra questions.</p>
                  <Button asChild size="lg" className="rounded-xl">
                    <Link href="/quiz">
                      <PlayCircle className="w-5 h-5 mr-2" /> Take Practice Quiz
                    </Link>
                  </Button>
                </>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 border-border shadow-sm">
              <h3 className="font-bold text-foreground mb-4">Focus Areas</h3>
              <p className="text-sm text-muted-foreground mb-4">Topics that need your attention the most right now.</p>

              <div className="space-y-3">
                {summary?.weakSubjects?.length ? (
                  summary.weakSubjects.map((subject, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border/50">
                      <span className="font-medium text-sm text-foreground">{subject}</span>
                      <span className="px-2 py-1 rounded bg-destructive/10 text-destructive text-xs font-bold">Needs Work</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">No weak areas identified yet. Keep practicing!</p>
                )}
              </div>

              <Button asChild variant="outline" className="w-full mt-6">
                <Link href="/analytics">View Full Analysis</Link>
              </Button>
            </Card>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
