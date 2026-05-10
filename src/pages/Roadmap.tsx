import { useGetDashboardRoadmap, getGetDashboardRoadmapQueryKey } from "@/lib/hooks";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Clock, Target, CalendarDays } from "lucide-react";

export default function Roadmap() {
  const { data: roadmap, isLoading } = useGetDashboardRoadmap({
    query: {
      queryKey: getGetDashboardRoadmapQueryKey()
    }
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 md:p-10 space-y-6">
          <div className="h-8 w-64 bg-muted rounded animate-pulse mb-8"></div>
          <div className="h-24 bg-muted rounded-xl animate-pulse mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted rounded-xl animate-pulse"></div>)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Study Roadmap</h1>
          <p className="text-muted-foreground">A day-by-day plan optimized for your JAMB success.</p>
        </div>

        <Card className="p-6 border-border shadow-sm bg-card">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 w-full">
              <div className="flex justify-between items-end mb-2">
                <span className="font-bold text-foreground">Overall Progress</span>
                <span className="text-xl font-bold text-primary">{roadmap?.overallProgress || 0}%</span>
              </div>
              <Progress value={roadmap?.overallProgress || 0} className="h-3" />
            </div>
            <div className="flex gap-8 text-center shrink-0">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Week</p>
                <p className="text-xl font-bold text-foreground">{roadmap?.currentWeek} <span className="text-sm font-normal text-muted-foreground">of {roadmap?.totalWeeks}</span></p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tasks Today</p>
                <p className="text-xl font-bold text-foreground">{roadmap?.todayTasks?.filter(t => t.completed).length || 0} <span className="text-sm font-normal text-muted-foreground">of {roadmap?.todayTasks?.length || 0}</span></p>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" /> Weekly Milestones
          </h2>

          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">

            {roadmap?.weeklyGoals?.map((goal, idx) => (
              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-muted shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 
                  data-[completed=true]:bg-primary data-[completed=true]:text-primary-foreground data-[current=true]:border-primary/30"
                  data-completed={goal.completed}
                  data-current={goal.week === roadmap.currentWeek}
                >
                  {goal.completed ? <CheckCircle2 className="w-5 h-5" /> : <Target className="w-4 h-4" />}
                </div>

                <Card className={`w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-6 border-border shadow-sm transition-shadow hover:shadow-md
                  ${goal.week === roadmap.currentWeek ? 'border-primary shadow-primary/5' : ''}
                `}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`text-xs font-bold uppercase tracking-wider mb-1 block ${goal.week === roadmap.currentWeek ? 'text-primary' : 'text-muted-foreground'}`}>
                        Week {goal.week}
                      </span>
                      <h3 className="font-bold text-lg text-foreground leading-tight">{goal.title}</h3>
                    </div>
                  </div>

                  <div className="space-y-3 mt-6 border-t border-border pt-4">
                    {goal.dailyTasks.slice(0, 3).map((task) => (
                      <div key={task.id} className="flex items-start gap-3">
                        <div className="mt-0.5 shrink-0">
                          {task.completed ?
                            <CheckCircle2 className="w-4 h-4 text-primary" /> :
                            <Circle className="w-4 h-4 text-muted-foreground" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                            {task.subject}: {task.topic}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <Clock className="w-3 h-3" /> {task.durationMinutes}m • {task.day}
                          </div>
                        </div>
                      </div>
                    ))}
                    {goal.dailyTasks.length > 3 && (
                      <p className="text-xs text-muted-foreground font-medium pl-7 pt-2">
                        +{goal.dailyTasks.length - 3} more tasks
                      </p>
                    )}
                  </div>
                </Card>
              </div>
            ))}

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
