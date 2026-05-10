import { useAuth } from "@/store/auth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Calendar, ShieldCheck, CreditCard, Clock } from "lucide-react";
import { useGetSubscriptionStatus, getGetSubscriptionStatusQueryKey, useGetSubscriptionHistory, getGetSubscriptionHistoryQueryKey } from "@/lib/hooks";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Profile() {
  const { user } = useAuth();

  const { data: subStatus } = useGetSubscriptionStatus({
    query: { queryKey: getGetSubscriptionStatusQueryKey() }
  });

  const { data: history } = useGetSubscriptionHistory({
    query: { queryKey: getGetSubscriptionHistoryQueryKey() }
  });

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and subscription.</p>
        </div>

        <Card className="p-8 border-border shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <User className="w-48 h-48" />
          </div>

          <div className="flex items-center gap-6 mb-8 relative z-10">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold border-4 border-background shadow-sm shrink-0">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground truncate">{user?.fullName}</h2>
              <div className="flex items-center gap-2 text-muted-foreground mt-1 truncate">
                <Mail className="w-4 h-4 shrink-0" /> <span className="truncate">{user?.email}</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-6">
              <h3 className="font-bold text-lg text-foreground border-b border-border pb-2">Account Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    {user?.emailVerified ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-destructive/10 text-destructive text-xs font-bold">
                        Unverified
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Member Since</p>
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Role</p>
                  <p className="font-medium text-foreground capitalize">{user?.role}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="font-bold text-lg text-foreground border-b border-border pb-2">Subscription</h3>
              <div className="bg-muted p-5 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <span className="font-bold text-foreground">Premium Plan</span>
                  </div>
                  {subStatus?.active ? (
                    <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">Active</span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md bg-muted-foreground/20 text-muted-foreground text-xs font-bold uppercase tracking-wider">Inactive</span>
                  )}
                </div>
                {subStatus?.active && subStatus.expirationDate && (
                  <p className="text-sm text-muted-foreground mb-4">
                    Your plan auto-renews on {new Date(subStatus.expirationDate).toLocaleDateString()}.
                  </p>
                )}
                <Button variant="outline" className="w-full">Manage Subscription</Button>
              </div>
            </div>
          </div>
        </Card>

        {history && history.length > 0 && (
          <Card className="p-8 border-border shadow-sm">
            <h3 className="font-bold text-lg text-foreground border-b border-border pb-2 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" /> Payment History
            </h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{new Date(record.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{record.currency} {record.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium capitalize ${
                          record.status === 'success' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
                        }`}>
                          {record.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground font-mono text-xs">
                        {record.reference}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

      </div>
    </DashboardLayout>
  );
}
