const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ApiRequestOptions extends RequestInit {
  token?: string | null;
}

async function request<T>(path: string, options: ApiRequestOptions = {}, auth = true): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  const token = options.token ?? (auth ? localStorage.getItem("accessToken") : null);
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const errorMessage = body?.detail || body?.message || response?.statusText || "Request failed";
    throw Object.assign(new Error(errorMessage), { response: { data: body } });
  }

  return body;
}

export interface ApiUser {
  id: number;
  username: string;
  email: string;
  role: string;
  is_email_verified: boolean;
  onboarded: boolean;
  created_at: string;
  state?: string;
}

export interface ExamProfile {
  subjects: string[];
  exam_date: string;
  daily_hours: number;
}

export interface SubjectItem {
  id: number;
  name: string;
}

export interface QuizQuestionOut {
  id: number;
  subject: string;
  topic: string;
  question_text: string;
  options: Record<string, string>;
}

export interface QuizSessionResponse {
  attempt_id: number;
  questions: QuizQuestionOut[];
}

export async function register(email: string, password: string, fullName: string) {
  await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, username: fullName }),
  }, false);
  return login(email, password);
}

export async function login(email: string, password: string) {
  const data = await request<{ access: string; refresh: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }, false);

  const user = await getCurrentUser(data.access);
  return {
    accessToken: data.access,
    refreshToken: data.refresh,
    user,
  };
}

export async function logout(refreshToken: string) {
  return request("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refresh: refreshToken }),
  });
}

export async function verifyEmail(email: string, code: string) {
  return request("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

export async function resendVerification(email: string) {
  return request("/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function forgotPassword(email: string) {
  return request("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  }, false);
}

export async function resetPassword(token: string, password: string) {
  return request("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  }, false);
}

export async function getCurrentUser(token?: string) {
  const user = await request<ApiUser>("/api/accounts/current_user/", {
    token,
  });
  return user;
}

export interface DashboardApiAttempt {
  id: number;
  type: string;
  score: number;
  total_questions: number;
  per_subject_score: Record<string, { correct: number; total: number }>;
  weak_topics: Record<string, { incorrect: number; total: number }>;
  created_at: string | null;
}

export interface DashboardApiResponse {
  attempts: DashboardApiAttempt[];
  weak_topics: Record<string, { incorrect: number; total: number }>;
  roadmap: any | null;
}

export async function getDashboardData() {
  return request<DashboardApiResponse>("/api/v1/dashboard", {
    method: "GET",
  });
}

export async function getSubjects() {
  return request<SubjectItem[]>("/api/v1/subjects", {
    method: "GET",
  });
}

export async function createExamProfile(subjects: string[], examDate: string, dailyHours: number) {
  return request("/api/accounts/create-exam-profile/", {
    method: "POST",
    body: JSON.stringify({
      subjects,
      exam_date: examDate,
      daily_hours: dailyHours,
      personality: "balanced",
      learning_format: "mixed",
      voice_pref: "none",
    }),
  });
}

export async function initializeSubscription() {
  return request<{ checkout_url: string; tx_ref: string }>("/subscription/initialize", {
    method: "POST",
    body: JSON.stringify({ plan_id: 1 }),
  });
}

export async function verifySubscription(txRef: string) {
  return request(`/subscription/verify?tx_ref=${encodeURIComponent(txRef)}`, {
    method: "POST",
  });
}

export async function getSubscriptionStatus() {
  return request<{ active: boolean; expires_at?: string }>("/subscription/status", {
    method: "GET",
  });
}

export async function getSubscriptionHistory() {
  return request<any[]>("/subscription/history", {
    method: "GET",
  });
}

export async function startQuiz(subjects: string[], questionsPerSubject = 10) {
  return request<QuizSessionResponse>("/api/v1/quiz/start", {
    method: "POST",
    body: JSON.stringify({ subjects, questions_per_subject: questionsPerSubject, attempt_type: "diagnostic" }),
  });
}

export async function submitQuiz(
  attemptId: number,
  answers: {
    questionId: number;
    selectedAnswer: string;
  }[]
) {
  return request<{ roadmap?: any; [key: string]: any }>("/api/v1/quiz/submit", {
    method: "POST",
    body: JSON.stringify({
      attempt_id: attemptId,
      answers: answers.map((a) => ({
        question_id: a.questionId,
        selected_answer: a.selectedAnswer,
      })),
    }),
  });
}

export async function submitDiagnostic(
  attemptId: number,
  answers: {
    questionId: number;
    selectedAnswer: string;
  }[]
) {
  return request<{ roadmap?: any; [key: string]: any }>("/api/v1/diagnostic/submit", {
    method: "POST",
    body: JSON.stringify({
      attempt_id: attemptId,
      answers: answers.map((a) => ({
        question_id: a.questionId,
        selected_answer: a.selectedAnswer,
      })),
    }),
  });
}


export async function generateRoadmap(subjects: string[], examDate: string, dailyHours: number) {
  return request("/api/v1/roadmap/generate", {
    method: "POST",
    body: JSON.stringify({
      subjects,
      exam_date: examDate,
      daily_hours: dailyHours,
      goal: "Maximize JAMB performance",
      quiz_result: [],
    }),
  });
}

export async function getLatestRoadmap() {
  return request("/api/v1/roadmap/latest", {
    method: "GET",
  });
}

export async function getCurrentExamProfile() {
  return request<ExamProfile>("/api/accounts/current_exam_profile/", {
    method: "GET",
  });
}
