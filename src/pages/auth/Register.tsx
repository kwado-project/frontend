import { Link, useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister, getGetMeQueryKey } from "@/lib/hooks";
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
import { GraduationCap } from "lucide-react";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const registerMutation = useRegister();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      const response = await registerMutation.mutateAsync({ data: values });

      queryClient.setQueryData(getGetMeQueryKey(), response.user);

      toast({
        title: "Account created",
        description: "Welcome to Kwado AI!",
      });

      setLocation("/verify-email");
    } catch (error: any) {
      const errorMessage = error?.message || "An error occurred. Please try again.";
      form.setError("root", { message: errorMessage });
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                K
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">Kwado AI</span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Create an account</h1>
            <p className="text-muted-foreground mt-2">Start your journey to a 300+ JAMB score.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Chinedu Okafor" {...field} data-testid="input-fullname" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} data-testid="input-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-12 text-lg"
                disabled={registerMutation.isPending}
                data-testid="button-submit-register"
              >
                {registerMutation.isPending ? "Creating account..." : "Sign up"}
              </Button>
              {form.formState.errors.root && (
                <p className="text-sm text-red-500 mt-2">{form.formState.errors.root.message}</p>
              )}
            </form>
          </Form>

          <p className="text-center text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline" data-testid="link-login">
              Log in
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:flex bg-muted items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-muted to-muted"></div>
        <div className="max-w-md space-y-6 relative z-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 border border-primary/20">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-foreground leading-tight">Join 10,000+ students preparing smarter.</h2>
          <p className="text-lg text-muted-foreground">Kwado AI uses adaptive learning to identify your weak spots and focus your study time where it matters most.</p>
        </div>
      </div>
    </div>
  );
}
