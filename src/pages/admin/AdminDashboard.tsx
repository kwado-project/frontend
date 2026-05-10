import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetAdminAnalytics, getGetAdminAnalyticsQueryKey } from "@/lib/hooks";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, CreditCard, DollarSign, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { data: analytics, isLoading } = useGetAdminAnalytics({
    query: { queryKey: getGetAdminAnalyticsQueryKey() }
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="h-8 w-64 bg-slate-200 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl animate-pulse"></div>)}
          </div>
          <div className="h-96 bg-slate-200 rounded-xl animate-pulse"></div>
        </div>
      </AdminLayout>
    );
  }

  const revenueData = analytics?.monthlyRevenue?.map(r => ({
    name: r.month,
    revenue: r.revenue,
  })) || [];

  const formatCurrency = (val: number) => `₦${val.toLocaleString()}`;

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Overview</h1>
          <p className="text-slate-500">Platform performance and revenue metrics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-slate-900">{analytics?.totalUsers?.toLocaleString() || 0}</p>
            </div>
          </Card>

          <Card className="p-6 border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Active Subscriptions</p>
              <p className="text-3xl font-bold text-slate-900">{analytics?.activeSubscriptions?.toLocaleString() || 0}</p>
            </div>
          </Card>

          <Card className="p-6 border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-slate-900">{formatCurrency(analytics?.totalRevenue || 0)}</p>
            </div>
          </Card>

          <Card className="p-6 border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Conversion Rate</p>
              <p className="text-3xl font-bold text-slate-900">
                {analytics?.totalUsers ? Math.round((analytics.activeSubscriptions / analytics.totalUsers) * 100) : 0}%
              </p>
            </div>
          </Card>
        </div>

        <Card className="p-6 border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 mb-6">Revenue Growth</h3>
          <div className="h-80">
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                  <YAxis tickFormatter={(val) => `₦${val/1000}k`} axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">No revenue data available.</div>
            )}
          </div>
        </Card>

      </div>
    </AdminLayout>
  );
}
