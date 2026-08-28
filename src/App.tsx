import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Public Pages
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Pricing from "./pages/Pricing";

// Protected Setup Flow
import Onboarding from "./pages/Onboarding";
import Subscribe from "./pages/Subscribe";
import { PaymentSuccess, PaymentFailed } from "./pages/PaymentResult";

// Quiz Flow
import Quiz from "./pages/Quiz";
import QuizResult from "./pages/QuizResult";
import RoadmapGenerating from "./pages/RoadmapGenerating";

// Dashboard App
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Roadmap from "./pages/Roadmap";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

// Admin App
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminQuestions from "./pages/admin/AdminQuestions";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import path from "node:path";
import PaymentCallback from "./pages/PaymentCallback";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/pricing" component={Pricing} />

      <Route path="/onboarding">
        <ProtectedRoute requireOnboarding={false}><Onboarding /></ProtectedRoute>
      </Route>

      <Route path="/subscribe">
        <ProtectedRoute><Subscribe /></ProtectedRoute>
      </Route>
      <Route path="/payment/success">
        <ProtectedRoute><PaymentSuccess /></ProtectedRoute>
      </Route>
      <Route path="/payment/failed">
        <ProtectedRoute><PaymentFailed /></ProtectedRoute>
      </Route>
      <Route path="/payment/callback">
        <ProtectedRoute><PaymentCallback /></ProtectedRoute>
      </Route>
      <Route path="/quiz">
        <ProtectedRoute><Quiz /></ProtectedRoute>
      </Route>
      <Route path="/quiz/result">
        <ProtectedRoute><QuizResult /></ProtectedRoute>
      </Route>
      <Route path="/roadmap/generating">
        <ProtectedRoute><RoadmapGenerating /></ProtectedRoute>
      </Route>
      
      <Route path="/dashboard">
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      </Route>
      <Route path="/analytics">
        <ProtectedRoute><Analytics /></ProtectedRoute>
      </Route>
      <Route path="/roadmap">
        <ProtectedRoute><Roadmap /></ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute><Profile /></ProtectedRoute>
      </Route>
      <Route path="/settings">
        <ProtectedRoute><Settings /></ProtectedRoute>
      </Route>

      <Route path="/admin">
        <ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>
      </Route>
      <Route path="/admin/users">
        <ProtectedRoute requireAdmin><AdminUsers /></ProtectedRoute>
      </Route>
      <Route path="/admin/questions">
        <ProtectedRoute requireAdmin><AdminQuestions /></ProtectedRoute>
      </Route>
      <Route path="/admin/subscriptions">
        <ProtectedRoute requireAdmin><AdminSubscriptions /></ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
