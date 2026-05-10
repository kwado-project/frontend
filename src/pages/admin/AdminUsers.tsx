import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetAdminUsers, getGetAdminUsersQueryKey } from "@/lib/hooks";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, ShieldCheck, User as UserIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const queryClient = useQueryClient();

  const { data, isLoading } = useGetAdminUsers({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
  }, {
    query: { queryKey: getGetAdminUsersQueryKey({ page, limit: 10, search: debouncedSearch }) }
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setTimeout(() => {
      setDebouncedSearch(e.target.value);
      setPage(1);
    }, 500);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Users</h1>
            <p className="text-slate-500">Manage student accounts.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={handleSearch}
              className="pl-9 bg-white"
            />
          </div>
        </div>

        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><div className="h-10 bg-slate-100 rounded animate-pulse w-48"></div></TableCell>
                      <TableCell><div className="h-6 bg-slate-100 rounded animate-pulse w-16"></div></TableCell>
                      <TableCell><div className="h-6 bg-slate-100 rounded animate-pulse w-24"></div></TableCell>
                      <TableCell><div className="h-6 bg-slate-100 rounded animate-pulse w-24"></div></TableCell>
                      <TableCell><div className="h-8 bg-slate-100 rounded animate-pulse w-16 ml-auto"></div></TableCell>
                    </TableRow>
                  ))
                ) : data?.data?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">No users found.</TableCell>
                  </TableRow>
                ) : (
                  data?.data?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-medium">
                            {user.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{user.fullName}</div>
                            <div className="text-sm text-slate-500">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {user.emailVerified ?
                            <span className="text-xs font-medium text-emerald-600">Email Verified</span> :
                            <span className="text-xs font-medium text-amber-600">Email Pending</span>
                          }
                          {user.onboardingComplete ?
                            <span className="text-xs font-medium text-emerald-600">Onboarded</span> :
                            <span className="text-xs font-medium text-slate-400">Not Onboarded</span>
                          }
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {data && data.total > data.limit && (
            <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm">
              <span className="text-slate-500">
                Showing {((page - 1) * data.limit) + 1} to {Math.min(page * data.limit, data.total)} of {data.total} users
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page * data.limit >= data.total}
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
