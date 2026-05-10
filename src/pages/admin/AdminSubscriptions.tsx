import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetAdminSubscriptions, getGetAdminSubscriptionsQueryKey } from "@/lib/hooks";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, XCircle } from "lucide-react";

export default function AdminSubscriptions() {
  const { data: subs, isLoading } = useGetAdminSubscriptions({
    query: { queryKey: getGetAdminSubscriptionsQueryKey() }
  });

  const formatCurrency = (val: number) => `₦${val.toLocaleString()}`;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Subscriptions</h1>
          <p className="text-slate-500">Monitor active and expired student subscriptions.</p>
        </div>

        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Purchased</TableHead>
                  <TableHead>Expires</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><div className="h-10 bg-slate-100 rounded animate-pulse w-48"></div></TableCell>
                      <TableCell><div className="h-6 bg-slate-100 rounded animate-pulse w-16"></div></TableCell>
                      <TableCell><div className="h-6 bg-slate-100 rounded animate-pulse w-20"></div></TableCell>
                      <TableCell><div className="h-6 bg-slate-100 rounded animate-pulse w-24"></div></TableCell>
                      <TableCell><div className="h-6 bg-slate-100 rounded animate-pulse w-24"></div></TableCell>
                    </TableRow>
                  ))
                ) : subs?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">No subscriptions found.</TableCell>
                  </TableRow>
                ) : (
                  subs?.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell>
                        <div className="font-medium text-slate-900">{sub.userName}</div>
                        <div className="text-sm text-slate-500">{sub.userEmail}</div>
                      </TableCell>
                      <TableCell>
                        {sub.active ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 text-sm font-medium">
                            <CheckCircle2 className="w-4 h-4" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 text-sm font-medium">
                            <XCircle className="w-4 h-4" /> Inactive
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">
                        {formatCurrency(sub.amount)}
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString() : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
