import { ReactNode } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../store/auth";
import { useGetSubscriptionStatus } from "@/lib/hooks";

export function ProtectedRoute({ children, requireAdmin = false }: { children: ReactNode; requireAdmin?: boolean }) {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { data: subscriptionStatus, isLoading, isError } = useGetSubscriptionStatus({ query: { enabled: !!user && user.onboardingComplete } });

  if (!isAuthenticated || !user) {
    setLocation("/login");
    return null;
  }

  if (requireAdmin) {
    if (user.role !== "admin") {
      setLocation("/dashboard");
      return null;
    }
    return <>{children}</>;
  }

  if (!user.emailVerified) {
    if (location !== "/verify-email") setLocation("/verify-email");
    return null;
  }

  if (!user.onboardingComplete) {
    if (location !== "/onboarding") setLocation("/onboarding");
    return null;
  }

  if (isLoading) {
    return null;
  }

  if (isError || !subscriptionStatus?.active) {
    if (location !== "/subscribe") setLocation("/subscribe");
    return null;
  }

  return <>{children}</>;
}
