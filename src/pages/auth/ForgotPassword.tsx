import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForgotPassword } from "@/lib/hooks";
import { Link } from "wouter";

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
import { KeyRound } from "lucide-react";
import { useState } from "react";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPassword() {
  const { toast } = useToast();
  const forgotMutation = useForgotPassword();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof forgotSchema>) {
    try {
      await forgotMutation.mutateAsync({ data: values });
      setSubmitted(true);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Request failed",
        description: error?.message || "An error occurred.",
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md p-8 bg-card border border-border rounded-3xl shadow-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6 border border-primary/20">
            <KeyRound className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Reset Password</h1>
          <p className="text-muted-foreground mt-2">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {submitted ? (
          <div className="text-center space-y-6">
            <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
              We've sent a password reset link to <span className="font-medium text-foreground">{form.getValues("email")}</span>. Please check your inbox.
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login">Return to login</Link>
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} data-testid="input-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-12 text-lg"
                disabled={forgotMutation.isPending}
                data-testid="button-submit-forgot"
              >
                {forgotMutation.isPending ? "Sending..." : "Send Reset Link"}
              </Button>
              <div className="text-center">
                <Link href="/login" className="text-sm font-medium text-primary hover:underline">
                  Back to login
                </Link>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
