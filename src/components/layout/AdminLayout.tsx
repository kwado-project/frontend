import { Link, useLocation } from "wouter";
import { useAuth } from "@/store/auth";
import { useLogout } from "@/lib/hooks";
import { LayoutDashboard, Users, BookOpen, CreditCard, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { logout } = useAuth();
  const logoutMutation = useLogout();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync({});
    } catch (e) {}
    logout();
  };

  const navItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/questions", label: "Question Bank", icon: BookOpen },
    { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  ];

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-slate-950 text-slate-50 border-r border-slate-800">
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-xl">
            K
          </div>
          <span className="font-bold text-xl tracking-tight">Admin Portal</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "/admin");
          return (
            <Link key={item.href} href={item.href}>
              <span
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-emerald-500 text-white font-medium shadow-sm"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <Button
          variant="outline"
          className="w-full justify-start text-slate-300 border-slate-700 bg-transparent hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="hidden lg:block w-72 h-screen sticky top-0 shrink-0">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden h-16 border-b border-border flex items-center justify-between px-4 bg-white sticky top-0 z-40">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-xl">
              A
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Admin</span>
          </Link>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 border-r-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 overflow-x-hidden p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
