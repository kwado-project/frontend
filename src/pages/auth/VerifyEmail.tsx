import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useVerifyEmail, useResendVerification, getGetMeQueryKey } from "@/lib/hooks";
import { useAuth } from "@/store/auth";
import { useQueryClient } from "@tanstack/react-query";

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
import { MailCheck, ClipboardCopy, Check } from "lucide-react";

const verifySchema = z.object({
  token: z.string().min(1, "Verification code is required"),
});

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, setUser } = useAuth();
  const verifyMutation = useVerifyEmail();
  const resendMutation = useResendVerification();
  const queryClient = useQueryClient();
  const [devToken, setDevToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("devVerificationToken");
    if (stored) setDevToken(stored);
  }, []);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: { token: "" },
  });

  function fillToken() {
    if (devToken) {
      form.setValue("token", devToken);
    }
  }

  function copyToken() {
    if (devToken) {
      navigator.clipboard.writeText(devToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function onSubmit(values: z.infer<typeof verifySchema>) {
    try {
      await verifyMutation.mutateAsync({ data: values });

      if (user) {
        const updatedUser = { ...user, emailVerified: true };
        setUser(updatedUser);
        queryClient.setQueryData(getGetMeQueryKey(), updatedUser);
      }

      localStorage.removeItem("devVerificationToken");

      toast({
        title: "Email verified",
        description: "Your email has been successfully verified.",
      });

      setLocation("/onboarding");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: error?.message || "Invalid or expired code.",
      });
    }
  }

  async function handleResend() {
    if (!user?.email) return;

    try {
      const res: any = await resendMutation.mutateAsync({ data: { email: user.email } });
      if (res?.devVerificationToken) {
        setDevToken(res.devVerificationToken);
        localStorage.setItem("devVerificationToken", res.devVerificationToken);
      }
      toast({
        title: "Code sent",
        description: "A new verification code has been generated.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to resend",
        description: error?.message || "An error occurred.",
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4">

        {devToken && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 rounded-2xl p-4">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2">
              Development Mode — No email service configured
            </p>
            <p className="text-sm text-amber-800 dark:text-amber-300 mb-3">
              Your verification code is shown here instead of being sent by email:
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-white dark:bg-amber-900/40 border border-amber-200 dark:border-amber-700 rounded-lg px-3 py-2 text-sm font-mono text-amber-900 dark:text-amber-200 break-all">
                {devToken}
              </code>
              <button
                onClick={copyToken}
                className="shrink-0 p-2 rounded-lg bg-amber-100 dark:bg-amber-800 hover:bg-amber-200 dark:hover:bg-amber-700 text-amber-700 dark:text-amber-300 transition-colors"
                title="Copy code"
              >
                {copied ? <Check className="w-4 h-4" /> : <ClipboardCopy className="w-4 h-4" />}
              </button>
            </div>
            <button
              onClick={fillToken}
              className="mt-3 text-xs text-amber-700 dark:text-amber-400 underline underline-offset-2 hover:text-amber-900 dark:hover:text-amber-200"
            >
              Click to auto-fill the code below
            </button>
          </div>
        )}

        <div className="p-8 bg-card border border-border rounded-3xl shadow-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6 border border-primary/20">
              <MailCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Verify your email</h1>
            <p className="text-muted-foreground mt-2">
              Enter the verification code for{" "}
              <span className="font-medium text-foreground">{user?.email}</span>
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Paste your verification code"
                        {...field}
                        data-testid="input-token"
                        className="text-center font-mono"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-12 text-lg"
                disabled={verifyMutation.isPending}
                data-testid="button-submit-verify"
              >
                {verifyMutation.isPending ? "Verifying..." : "Verify Email"}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-muted-foreground">Didn't receive the code?</p>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResend}
              disabled={resendMutation.isPending}
              data-testid="button-resend-code"
            >
              {resendMutation.isPending ? "Sending..." : "Resend Code"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
