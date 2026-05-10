import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/store/auth";
import {
  getUserByEmail, createUser, getUserById, updateUser, toPublicUser,
  getQuestions, createQuestion, updateQuestion, deleteQuestion,
  getUsers, getSubscriptions, getRoadmapByUserId, saveRoadmap,
} from "./db";
import {
  register as registerApi,
  login as loginApi,
  logout as logoutApi,
  verifyEmail as verifyEmailApi,
  resendVerification as resendVerificationApi,
  forgotPassword as forgotPasswordApi,
  resetPassword as resetPasswordApi,
  getCurrentUser,
  getSubjects,
  createExamProfile,
  initializeSubscription,
  verifySubscription,
  getSubscriptionStatus as getSubscriptionStatusApi,
  getSubscriptionHistory as getSubscriptionHistoryApi,
  startQuiz as startQuizApi,
  submitQuiz as submitQuizApi,
  submitDiagnostic as submitDiagnosticApi,
  getLatestRoadmap as getLatestRoadmapApi,
  generateRoadmap as generateRoadmapApi,
  getCurrentExamProfile,
  getDashboardData,
} from "./api";
import type { StoredUser } from "./types";

// ---- Enum ----
export const QuestionDifficulty = {
  easy: "easy",
  medium: "medium",
  hard: "hard",
} as const;

// ---- Query key factories ----
export const getGetMeQueryKey = () => ["getMe"] as const;
export const getGetSubscriptionStatusQueryKey = () => ["getSubscriptionStatus"] as const;
export const getGetSubscriptionHistoryQueryKey = () => ["getSubscriptionHistory"] as const;
export const getGetDashboardSummaryQueryKey = () => ["getDashboardSummary"] as const;
export const getGetDashboardRoadmapQueryKey = () => ["getDashboardRoadmap"] as const;
export const getGetDashboardAnalyticsQueryKey = () => ["getDashboardAnalytics"] as const;
export const getGetDashboardPerformanceQueryKey = () => ["getDashboardPerformance"] as const;
export const getGetAdminAnalyticsQueryKey = () => ["getAdminAnalytics"] as const;
export const getGetAdminUsersQueryKey = (params?: object) => ["getAdminUsers", params] as const;
export const getGetAdminQuestionsQueryKey = (params?: object) => ["getAdminQuestions", params] as const;
export const getGetAdminSubscriptionsQueryKey = () => ["getAdminSubscriptions"] as const;
export const getGetSubjectsQueryKey = () => ["getSubjects"] as const;
export const getGetCurrentExamProfileQueryKey = () => ["getCurrentExamProfile"] as const;

// ---- Auth Mutations ----

export function useRegister() {
  const { setAuth } = useAuth();
  return useMutation({
    mutationFn: async ({ data }: { data: { fullName: string; email: string; password: string } }) => {
      const result = await registerApi(data.email, data.password, data.fullName);
      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("refreshToken", result.refreshToken);
      const role = result.user.role === "student" ? "user" : (result.user.role as "user" | "admin");
      setAuth({ user: {
        id: String(result.user.id),
        email: result.user.email,
        fullName: result.user.username,
        emailVerified: result.user.is_email_verified,
        onboardingComplete: result.user.onboarded,
        role,
        createdAt: result.user.created_at,
        state: result.user.state,
      }, accessToken: result.accessToken, refreshToken: result.refreshToken });
      return {
        user: {
          id: String(result.user.id),
          email: result.user.email,
          fullName: result.user.username,
          emailVerified: result.user.is_email_verified,
          onboardingComplete: result.user.onboarded,
          role,
          createdAt: result.user.created_at,
          state: result.user.state,
        },
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      };
    },
  });
}

export function useLogin() {
  const { setAuth } = useAuth();
  return useMutation({
    mutationFn: async ({ data }: { data: { email: string; password: string } }) => {
      const result = await loginApi(data.email, data.password);
      const user = result.user;
      const role = user.role === "student" ? "user" : (user.role as "user" | "admin");
      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("refreshToken", result.refreshToken);
      setAuth({ user: {
        id: String(user.id),
        email: user.email,
        fullName: user.username,
        emailVerified: user.is_email_verified,
        onboardingComplete: user.onboarded,
        role,
        createdAt: user.created_at,
        state: user.state,
      }, accessToken: result.accessToken, refreshToken: result.refreshToken });
      return {
        user: {
          id: String(user.id),
          email: user.email,
          fullName: user.username,
          emailVerified: user.is_email_verified,
          onboardingComplete: user.onboarded,
          role,
          createdAt: user.created_at,
          state: user.state,
        },
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      };
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async (_args: object) => {
      const refreshToken = localStorage.getItem("refreshToken") || "";
      await logoutApi(refreshToken).catch(() => null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  });
}

export function useVerifyEmail() {
  const { user, setAuth } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }: { data: { token: string } }) => {
      if (!user) throw new Error("Not authenticated");
      await verifyEmailApi(user.email, data.token);
      const freshUser = await getCurrentUser();
      const role = freshUser.role === "student" ? "user" : (freshUser.role as "user" | "admin");
      const pub = {
        id: String(freshUser.id),
        email: freshUser.email,
        fullName: freshUser.username,
        emailVerified: freshUser.is_email_verified,
        onboardingComplete: freshUser.onboarded,
        role,
        createdAt: freshUser.created_at,
      };
      const accessToken = localStorage.getItem("accessToken") || "";
      const refreshToken = localStorage.getItem("refreshToken") || "";
      setAuth({ user: pub, accessToken, refreshToken });
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      return { message: "Email verified" };
    },
  });
}

export function useResendVerification() {
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ data: _data }: { data: { email: string } }) => {
      if (!user) throw new Error("Not authenticated");
      await resendVerificationApi(user.email);
      return { message: "Verification email sent" };
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async ({ data }: { data: { email: string } }) => {
      await forgotPasswordApi(data.email);
      return { message: "If this email exists, a reset link has been sent." };
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async ({ data }: { data: { token: string; password: string } }) => {
      await resetPasswordApi(data.token, data.password);
      return { message: "Password reset successful" };
    },
  });
}

export function useGetMe(options?: { query?: object }) {
  const { user } = useAuth();
  return useQuery({
    queryKey: getGetMeQueryKey(),
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      const freshUser = await getCurrentUser();
      const role = freshUser.role === "student" ? "user" : (freshUser.role as "user" | "admin");
      return {
        id: String(freshUser.id),
        email: freshUser.email,
        fullName: freshUser.username,
        emailVerified: freshUser.is_email_verified,
        onboardingComplete: freshUser.onboarded,
        role,
        createdAt: freshUser.created_at,
      };
    },
    enabled: !!user,
    ...(options?.query || {}),
  });
}

export function useGetSubjects(options?: { query?: object }) {
  return useQuery({
    queryKey: getGetSubjectsQueryKey(),
    queryFn: async () => {
      return getSubjects();
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...(options?.query || {}),
  });
}

export function useCurrentExamProfile(options?: { query?: object }) {
  const { user } = useAuth();
  return useQuery({
    queryKey: getGetCurrentExamProfileQueryKey(),
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");
      return getCurrentExamProfile();
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...(options?.query || {}),
  });
}

// ---- Onboarding ----

export function useSubmitOnboarding() {
  const { user, setAuth } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }: { data: { subjects: string[]; examDate: string; dailyStudyHours: number } }) => {
      if (!user) throw new Error("Not authenticated");
      await createExamProfile(data.subjects, data.examDate, data.dailyStudyHours);
      const freshUser = await getCurrentUser();
      const role = freshUser.role === "student" ? "user" : (freshUser.role as "user" | "admin");
      const pub = {
        id: String(freshUser.id),
        email: freshUser.email,
        fullName: freshUser.username,
        emailVerified: freshUser.is_email_verified,
        onboardingComplete: freshUser.onboarded,
        role,
        createdAt: freshUser.created_at,
      };
      const accessToken = localStorage.getItem("accessToken") || "";
      const refreshToken = localStorage.getItem("refreshToken") || "";
      setAuth({ user: pub, accessToken, refreshToken });
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      return { message: "Onboarding complete" };
    },
  });
}

// ---- Subscription ----

export function useInitializeSubscription() {
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (_args?: object) => {
      if (!user) throw new Error("Not authenticated");
      const result = await initializeSubscription();
      return { paymentLink: result.checkout_url, reference: result.tx_ref };
    },
  });
}

export function useVerifySubscription() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }: { data: { reference: string } }) => {
      if (!user) throw new Error("Not authenticated");
      await verifySubscription(data.reference);
      queryClient.invalidateQueries({ queryKey: getGetSubscriptionStatusQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetSubscriptionHistoryQueryKey() });
      return { active: true };
    },
  });
}

export function useGetSubscriptionStatus(options?: { query?: object }) {
  const { user } = useAuth();
  return useQuery({
    queryKey: getGetSubscriptionStatusQueryKey(),
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      const result = await getSubscriptionStatusApi();
      return {
        active: result.active,
        expirationDate: result.expires_at,
      };
    },
    enabled: !!user,
    ...(options?.query || {}),
  });
}

export function useGetSubscriptionHistory(options?: { query?: object }) {
  const { user } = useAuth();
  return useQuery({
    queryKey: getGetSubscriptionHistoryQueryKey(),
    queryFn: async () => {
      if (!user) return [];
      return getSubscriptionHistoryApi();
    },
    enabled: !!user,
    ...(options?.query || {}),
  });
}

// ---- Quiz ----

export function useStartQuiz(options?: { query?: object }) {
  const { user } = useAuth();
  const profileQuery = useCurrentExamProfile();

  return useQuery({
    queryKey: ["startQuiz", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");
      if (!profileQuery.data?.subjects?.length) {
        throw new Error("No exam profile found. Complete onboarding first.");
      }
      const response = await startQuizApi(profileQuery.data.subjects, 4);
      return {
        sessionId: String(response.attempt_id),
        questions: response.questions.map((question) => ({
          id: String(question.id),
          subject: question.subject,
          text: question.question_text,
          options: Object.values(question.options),
        })),
        timeLimit: 45,
      };
    },
    enabled: Boolean(user && profileQuery.data?.subjects?.length && ((options?.query as any)?.enabled ?? false)),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
    gcTime: 0,
    ...(options?.query || {}),
  });
}

// export function useSubmitQuiz() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async ({ data }: { data: { sessionId: string; answers: { questionId: string; selectedOption: number }[] } }) => {
//       const mappedAnswers = data.answers.map((answer) => ({
//         questionId: Number(answer.questionId),
//         selectedAnswer: String.fromCharCode(65 + answer.selectedOption),
//       }));
//       const attemptId = Number(data.sessionId);
//       const result = await submitQuizApi(attemptId, mappedAnswers);
//       queryClient.invalidateQueries({ queryKey: getGetDashboardPerformanceQueryKey() });
//       queryClient.invalidateQueries({ queryKey: getGetDashboardAnalyticsQueryKey() });
//       queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
//       return result;
//     },
//   });
// }
export function useSubmitQuiz() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      data,
    }: {
      data: {
        attempt_id: number;
        answers: {
          question_id: number;
          selected_answer: string;
        }[];
      };
    }) => {
      // Use diagnostic submit if user hasn't completed diagnostic yet
      const isDiagnostic = user?.state !== "DIAGNOSTIC_COMPLETED";
      const submitFn = isDiagnostic ? submitDiagnosticApi : submitQuizApi;
      
      const result = await submitFn(
        data.attempt_id,
        data.answers.map((a) => ({
          questionId: a.question_id,
          selectedAnswer: a.selected_answer,
        }))
      );

      // If diagnostic, save the roadmap from the response
      if (isDiagnostic && result?.roadmap && user) {
        const backendRoadmap = result.roadmap;
        const frontendRoadmap = {
          id: String(backendRoadmap.id),
          userId: String(user.id),
          currentWeek: 1,
          totalWeeks: 4,
          overallProgress: 0,
          weeklyGoals: [],
          todayTasks: [],
          createdAt: backendRoadmap.created_at || new Date().toISOString(),
          examDate: backendRoadmap.exam_date,
        };
        saveRoadmap(frontendRoadmap);
      }

      queryClient.invalidateQueries({
        queryKey: getGetDashboardPerformanceQueryKey(),
      });

      queryClient.invalidateQueries({
        queryKey: getGetDashboardAnalyticsQueryKey(),
      });

      queryClient.invalidateQueries({
        queryKey: getGetDashboardSummaryQueryKey(),
      });

      queryClient.invalidateQueries({
        queryKey: getGetDashboardRoadmapQueryKey(),
      });

      // Invalidate user data to refresh state
      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });

      return result;
    },
  });
}

// ---- User ----

export function useCurrentUser(options?: { query?: object }) {
  const { user, setUser } = useAuth();
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      const freshUser = await getCurrentUser();
      const role = freshUser.role === "student" ? "user" : (freshUser.role as "user" | "admin");
      const updatedUser = {
        id: String(freshUser.id),
        email: freshUser.email,
        fullName: freshUser.username,
        emailVerified: freshUser.is_email_verified,
        onboardingComplete: freshUser.onboarded,
        role,
        createdAt: freshUser.created_at || new Date().toISOString(),
        state: freshUser.state,
      };
      setUser(updatedUser);
      return updatedUser;
    },
    enabled: !!user && ((options?.query as any)?.enabled ?? true),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...(options?.query || {}),
  });
}

export function useGenerateRoadmap() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_args?: object) => {
      if (!user) throw new Error("Not authenticated");
      const profile = await getCurrentExamProfile();
      if (!profile?.subjects?.length) {
        throw new Error("No exam profile found. Complete onboarding first.");
      }
      const examDate = profile.exam_date || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      const dailyHours = profile.daily_hours || 4;
      const roadmap = await generateRoadmapApi(profile.subjects, examDate, dailyHours);
      queryClient.invalidateQueries({ queryKey: getGetDashboardRoadmapQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
      return roadmap;
    },
  });
}

function getLatestAttempt(attempts: { created_at?: string | null }[]) {
  return attempts
    .slice()
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())[0];
}

function getRoadmapProgress(roadmap: any) {
  if (!roadmap?.days?.length) return 0;
  const tasks = roadmap.days.flatMap((day: any) => day.tasks || []);
  if (!tasks.length) return 0;
  const completed = tasks.filter((task: any) => task.is_completed).length;
  return Math.round((completed / tasks.length) * 100);
}

function getRoadmapNextTask(roadmap: any) {
  if (!roadmap?.days?.length) return null;
  const tasks = roadmap.days.flatMap((day: any) => day.tasks || []);
  return tasks.find((task: any) => !task.is_completed) || null;
}

export function useGetDashboardRoadmap(options?: { query?: object }) {
  const { user } = useAuth();
  return useQuery({
    queryKey: getGetDashboardRoadmapQueryKey(),
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      try {
        return await getLatestRoadmapApi();
      } catch {
        return getRoadmapByUserId(user.id) || {
          id: "",
          userId: user.id,
          currentWeek: 1,
          totalWeeks: 4,
          overallProgress: 0,
          weeklyGoals: [],
          todayTasks: [],
          examDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
        };
      }
    },
    enabled: !!user,
    ...(options?.query || {}),
  });
}

// ---- Dashboard ----

export function useGetDashboardSummary(options?: { query?: object }) {
  const { user } = useAuth();
  return useQuery({
    queryKey: getGetDashboardSummaryQueryKey(),
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      const [dashboard, subscription, roadmap] = await Promise.all([
        getDashboardData(),
        getSubscriptionStatusApi().catch(() => ({ active: false, expires_at: undefined })),
        getLatestRoadmapApi().catch(() => undefined),
      ]);

      const sessions = dashboard.attempts || [];
      const latest = getLatestAttempt(sessions) as any;
      const subjectScores: Record<string, { correct: number; total: number }> = latest?.per_subject_score ?? {};
      const weakSubjects = Object.entries(subjectScores)
        .filter(([, v]) => v.total > 0 && (v.correct / v.total) < 0.6)
        .map(([s]) => s);

      const nextTask = getRoadmapNextTask(roadmap);
      const studyStreak = sessions.length > 0 ? Math.min(sessions.length, 7) : 0;

      return {
        studyStreak,
        roadmapProgress: getRoadmapProgress(roadmap),
        recentQuizScore: latest?.score ?? 0,
        subscriptionActive: subscription?.active ?? false,
        subscriptionExpiresAt: subscription?.expires_at,
        weakSubjects,
        nextTask,
      };
    },
    enabled: !!user,
    ...(options?.query || {}),
  });
}

export function useGetDashboardPerformance(options?: { query?: object }) {
  const { user } = useAuth();
  return useQuery({
    queryKey: getGetDashboardPerformanceQueryKey(),
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      const dashboard = await getDashboardData();
      const sessions = dashboard.attempts || [];

      const quizHistory = sessions.map((s) => ({
        date: s.created_at || new Date().toISOString(),
        score: s.score || 0,
        subject: "Mixed",
      }));

      const allSubjectScores: Record<string, { correct: number; total: number }> = {};
      for (const s of sessions) {
        const subjectScores = s.per_subject_score ?? {};
        for (const [subject, scores] of Object.entries(subjectScores)) {
          const scoreData = scores as { correct: number; total: number };
          if (!allSubjectScores[subject]) allSubjectScores[subject] = { correct: 0, total: 0 };
          allSubjectScores[subject].correct += scoreData.correct;
          allSubjectScores[subject].total += scoreData.total;
        }
      }

      const subjectMastery = Object.entries(allSubjectScores).map(([subject, v]) => ({
        subject,
        score: v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0,
      }));

      const averageScore = sessions.length > 0
        ? Math.round(sessions.reduce((acc, s) => acc + (s.score || 0), 0) / sessions.length)
        : 0;

      return { averageScore, totalQuizzesTaken: sessions.length, quizHistory, subjectMastery };
    },
    enabled: !!user,
    ...(options?.query || {}),
  });
}

export function useGetDashboardAnalytics(options?: { query?: object }) {
  const { user } = useAuth();
  return useQuery({
    queryKey: getGetDashboardAnalyticsQueryKey(),
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      const dashboard = await getDashboardData();
      const sessions = dashboard.attempts || [];

      const allSubjectScores: Record<string, { correct: number; total: number }> = {};
      for (const s of sessions) {
        const subjectScores = s.per_subject_score ?? {};
        for (const [subject, scores] of Object.entries(subjectScores)) {
          const scoreData = scores as { correct: number; total: number };
          if (!allSubjectScores[subject]) allSubjectScores[subject] = { correct: 0, total: 0 };
          allSubjectScores[subject].correct += scoreData.correct;
          allSubjectScores[subject].total += scoreData.total;
        }
      }

      const weakTopics = Object.entries(allSubjectScores)
        .filter(([, v]) => v.total > 0 && (v.correct / v.total) < 0.6)
        .map(([subject, v]) => ({
          subject,
          topic: subject + " Core Topics",
          score: Math.round((v.correct / v.total) * 100),
        }));

      const completionRate = sessions.length > 0
        ? Math.round(sessions.filter((s) => (s.score || 0) >= 50).length / sessions.length * 100)
        : 0;

      return { completionRate, weakTopics };
    },
    enabled: !!user,
    ...(options?.query || {}),
  });
}

// ---- Admin ----

export function useGetAdminUsers(
  params: { page: number; limit: number; search?: string },
  options?: { query?: object }
) {
  return useQuery({
    queryKey: getGetAdminUsersQueryKey(params),
    queryFn: () => {
      let users = getUsers().map(toPublicUser);
      if (params.search) {
        const s = params.search.toLowerCase();
        users = users.filter(u => u.fullName.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
      }
      const total = users.length;
      const limit = params.limit || 10;
      const page = params.page || 1;
      const data = users.slice((page - 1) * limit, page * limit);
      return { data, total, limit, page };
    },
    ...(options?.query || {}),
  });
}

export function useGetAdminQuestions(
  params: { page: number; subject?: string },
  options?: { query?: object }
) {
  return useQuery({
    queryKey: getGetAdminQuestionsQueryKey(params),
    queryFn: () => {
      let questions = getQuestions();
      if (params.subject) {
        questions = questions.filter(q => q.subject === params.subject);
      }
      const total = questions.length;
      const limit = 10;
      const page = params.page || 1;
      const data = questions.slice((page - 1) * limit, page * limit);
      return { data, total, limit, page };
    },
    ...(options?.query || {}),
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      const q = createQuestion(data);
      queryClient.invalidateQueries({ queryKey: ["getAdminQuestions"] });
      return q;
    },
  });
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const q = updateQuestion(id, data);
      queryClient.invalidateQueries({ queryKey: ["getAdminQuestions"] });
      return q;
    },
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      deleteQuestion(id);
      queryClient.invalidateQueries({ queryKey: ["getAdminQuestions"] });
      return { id };
    },
  });
}

export function useGetAdminSubscriptions(options?: { query?: object }) {
  return useQuery({
    queryKey: getGetAdminSubscriptionsQueryKey(),
    queryFn: () => getSubscriptions(),
    ...(options?.query || {}),
  });
}

export function useGetAdminAnalytics(options?: { query?: object }) {
  return useQuery({
    queryKey: getGetAdminAnalyticsQueryKey(),
    queryFn: () => {
      const users = getUsers();
      const subs = getSubscriptions().filter(s => s.status === "success");
      const activeSubs = subs.filter(s => new Date(s.expiresAt) > new Date());

      const monthlyMap: Record<string, number> = {};
      for (const sub of subs) {
        const month = new Date(sub.createdAt).toLocaleDateString("en", { month: "short", year: "2-digit" });
        monthlyMap[month] = (monthlyMap[month] || 0) + sub.amount;
      }
      const monthlyRevenue = Object.entries(monthlyMap).map(([month, revenue]) => ({ month, revenue }));

      return {
        totalUsers: users.length,
        activeSubscriptions: activeSubs.length,
        totalRevenue: subs.reduce((acc, s) => acc + s.amount, 0),
        monthlyRevenue,
      };
    },
    ...(options?.query || {}),
  });
}

export function useHealthCheck() {
  return useQuery({
    queryKey: ["healthCheck"],
    queryFn: () => ({ status: "ok" as const }),
    staleTime: Infinity,
  });
}
