import { useGetDashboardAnalytics, useGetDashboardPerformance, getGetDashboardAnalyticsQueryKey, getGetDashboardPerformanceQueryKey } from "@/lib/hooks";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { Activity, Brain, Target, Zap } from "lucide-react";

export default function Analytics() {
  const { data: analytics, isLoading: analyticsLoading } = useGetDashboardAnalytics({
    query: { queryKey: getGetDashboardAnalyticsQueryKey() }
  });

  const { data: performance, isLoading: perfLoading } = useGetDashboardPerformance({
    query: { queryKey: getGetDashboardPerformanceQueryKey() }
  });

  const isLoading = analyticsLoading || perfLoading;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 md:p-10 space-y-6">
          <div className="h-8 w-64 bg-muted rounded animate-pulse mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-muted rounded-xl animate-pulse"></div>)}
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-80 bg-muted rounded-xl animate-pulse"></div>
            <div className="h-80 bg-muted rounded-xl animate-pulse"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const historyData = performance?.quizHistory?.map(q => ({
    name: new Date(q.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: q.score,
    subject: q.subject
  })) || [];

  const masteryData = performance?.subjectMastery?.map(s => ({
    name: s.subject,
    mastery: s.score
  })) || [];

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Performance Analytics</h1>
          <p className="text-muted-foreground">Deep dive into your mastery and consistency.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <Card className="p-6 border-border shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 text-muted-foreground mb-4 text-sm font-medium">
              <Activity className="w-4 h-4 text-blue-500" /> Avg Score
            </div>
            <div className="text-3xl font-bold text-foreground">{performance?.averageScore || 0}%</div>
          </Card>
          <Card className="p-6 border-border shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 text-muted-foreground mb-4 text-sm font-medium">
              <Target className="w-4 h-4 text-primary" /> Completion Rate
            </div>
            <div className="text-3xl font-bold text-foreground">{analytics?.completionRate || 0}%</div>
          </Card>
          <Card className="p-6 border-border shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 text-muted-foreground mb-4 text-sm font-medium">
              <Zap className="w-4 h-4 text-yellow-500" /> Quizzes Taken
            </div>
            <div className="text-3xl font-bold text-foreground">{performance?.totalQuizzesTaken || 0}</div>
          </Card>
          <Card className="p-6 border-border shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 text-muted-foreground mb-4 text-sm font-medium">
              <Brain className="w-4 h-4 text-purple-500" /> Weak Topics
            </div>
            <div className="text-3xl font-bold text-foreground">{analytics?.weakTopics?.length || 0}</div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 border-border shadow-sm">
            <h3 className="font-bold text-lg text-foreground mb-6">Score Trend</h3>
            <div className="h-72">
              {historyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historyData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                      itemStyle={{ color: 'var(--foreground)' }}
                    />
                    <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary)' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  Not enough data to display trend.
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 border-border shadow-sm">
            <h3 className="font-bold text-lg text-foreground mb-6">Subject Mastery</h3>
            <div className="h-72">
              {masteryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={masteryData} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--foreground)' }} width={80} />
                    <RechartsTooltip
                      cursor={{ fill: 'var(--muted)' }}
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                    />
                    <Bar dataKey="mastery" radius={[0, 4, 4, 0]} barSize={24}>
                      {masteryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.mastery > 70 ? 'var(--primary)' : entry.mastery > 40 ? '#eab308' : 'var(--destructive)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  Not enough data to display mastery.
                </div>
              )}
            </div>
          </Card>
        </div>

        <Card className="p-6 border-border shadow-sm">
          <h3 className="font-bold text-lg text-foreground mb-6">High-Priority Weak Topics</h3>
          {analytics?.weakTopics && analytics.weakTopics.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {analytics.weakTopics.map((topic, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-muted/50 rounded-xl border border-border">
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">{topic.subject}</span>
                    <span className="font-medium text-foreground">{topic.topic}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground block mb-1">Mastery</span>
                    <span className="font-bold text-destructive">{topic.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No weak topics identified yet. Keep up the good work!</p>
          )}
        </Card>

      </div>
    </DashboardLayout>
  );
}
