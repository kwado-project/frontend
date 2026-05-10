import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, Bell, Shield, ActivitySquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useHealthCheck } from "@/lib/hooks";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const { data: healthData, isLoading: healthLoading } = useHealthCheck();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your app preferences and notifications.</p>
        </div>

        <div className="grid gap-8">
          <Card className="p-6 border-border shadow-sm">
            <h3 className="font-bold text-lg text-foreground mb-6 flex items-center gap-2">
              <Monitor className="w-5 h-5 text-primary" /> Appearance
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Theme</Label>
                  <p className="text-sm text-muted-foreground">Select your preferred color theme.</p>
                </div>
                <div className="flex bg-muted p-1 rounded-lg border border-border">
                  <Button
                    variant={theme === 'light' ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-md"
                    onClick={() => setTheme('light')}
                  >
                    <Sun className="w-4 h-4 mr-2" /> Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-md"
                    onClick={() => setTheme('dark')}
                  >
                    <Moon className="w-4 h-4 mr-2" /> Dark
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border shadow-sm">
            <h3 className="font-bold text-lg text-foreground mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" /> Notifications
            </h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Daily Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get reminded to complete your daily roadmap tasks.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Weekly Progress Report</Label>
                  <p className="text-sm text-muted-foreground">Receive a summary of your performance via email.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Product Updates</Label>
                  <p className="text-sm text-muted-foreground">Hear about new features and content additions.</p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border shadow-sm">
            <h3 className="font-bold text-lg text-foreground mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" /> Security & System
            </h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Change Password</Label>
                  <p className="text-sm text-muted-foreground">Update your account password securely.</p>
                </div>
                <Button variant="outline">Update</Button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="space-y-0.5">
                  <Label className="text-base flex items-center gap-2">
                    <ActivitySquare className="w-4 h-4 text-muted-foreground" /> System Status
                  </Label>
                  <p className="text-sm text-muted-foreground">Current status of the app services.</p>
                </div>
                <div>
                  {healthLoading ? (
                    <span className="text-sm text-muted-foreground animate-pulse">Checking...</span>
                  ) : healthData?.status === 'ok' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Online
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-destructive/10 text-destructive text-xs font-bold uppercase tracking-wider">
                      Offline
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} size="lg">Save Changes</Button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
