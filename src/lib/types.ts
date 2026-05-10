export type UserRole = "user" | "admin";
export type Difficulty = "easy" | "medium" | "hard";

export interface StoredUser {
  id: string;
  email: string;
  fullName: string;
  password: string;
  emailVerified: boolean;
  emailVerificationToken: string;
  passwordResetToken?: string;
  onboardingComplete: boolean;
  role: UserRole;
  createdAt: string;
  subjects?: string[];
  examDate?: string;
  dailyStudyHours?: number;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  emailVerified: boolean;
  onboardingComplete: boolean;
  role: UserRole;
  createdAt: string;
  state?: string;
}

export interface Question {
  id: string;
  subject: string;
  text: string;
  options: string[];
  correctOption: number;
  explanation?: string;
  difficulty: Difficulty;
}

export interface QuizAnswer {
  questionId: string;
  selectedOption: number;
}

export interface QuizSession {
  id: string;
  userId: string;
  questionIds: string[];
  answers: QuizAnswer[];
  score?: number;
  subjectScores?: Record<string, { correct: number; total: number }>;
  completedAt?: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  active: boolean;
  amount: number;
  currency: string;
  reference: string;
  status: "success" | "failed";
  createdAt: string;
  expiresAt: string;
}

export interface RoadmapTask {
  id: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  day: string;
  completed: boolean;
}

export interface WeeklyGoal {
  week: number;
  title: string;
  completed: boolean;
  dailyTasks: RoadmapTask[];
}

export interface Roadmap {
  userId: string;
  overallProgress: number;
  currentWeek: number;
  totalWeeks: number;
  todayTasks: RoadmapTask[];
  weeklyGoals: WeeklyGoal[];
  createdAt: string;
}
