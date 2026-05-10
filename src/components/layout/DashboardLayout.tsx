import { Link, useLocation } from "wouter";
import { useAuth } from "@/store/auth";
import { useLogout } from "@/lib/hooks";
import { LayoutDashboard, Compass, BarChart3, User, Settings, LogOut, Menu, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const logoutMutation = useLogout();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync({});
    } catch (e) {}
    logout();
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/roadmap", label: "Roadmap", icon: Compass },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
            K
          </div>
          <span className="font-bold text-xl tracking-tight text-sidebar-foreground">Kwado AI</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <span
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
        <div className="bg-sidebar-accent rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.fullName}</p>
              <p className="text-xs text-sidebar-foreground/70 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive border-sidebar-border"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden lg:block w-72 h-screen sticky top-0 shrink-0">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden h-16 border-b border-border flex items-center justify-between px-4 bg-background sticky top-0 z-40">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
              K
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">Kwado AI</span>
          </Link>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
