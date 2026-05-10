import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResetPassword } from "@/lib/hooks";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LockKeyhole } from "lucide-react";

const resetSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const resetMutation = useResetPassword();

  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token") || "";

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof resetSchema>) {
    if (!token) {
      toast({
        variant: "destructive",
        title: "Missing token",
        description: "Password reset token is missing from the URL.",
      });
      return;
    }

    try {
      await resetMutation.mutateAsync({
        data: {
          token,
          password: values.password,
        },
      });

      toast({
        title: "Password reset successful",
        description: "You can now log in with your new password.",
      });

      setLocation("/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Reset failed",
        description: error.response?.data?.message || "An error occurred. The token may be expired.",
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md p-8 bg-card border border-border rounded-3xl shadow-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6 border border-primary/20">
            <LockKeyhole className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Create new password</h1>
          <p className="text-muted-foreground mt-2">
            Please enter your new password below.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} data-testid="input-password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} data-testid="input-confirm-password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full h-12 text-lg"
              disabled={resetMutation.isPending || !token}
              data-testid="button-submit-reset"
            >
              {resetMutation.isPending ? "Resetting..." : "Reset Password"}
            </Button>

            {!token && (
              <p className="text-sm text-destructive text-center mt-4">
                Invalid reset link. Please request a new one.
              </p>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
