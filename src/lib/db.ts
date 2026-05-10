import type { StoredUser, Question, QuizSession, Subscription, Roadmap } from "./types";
import { SEED_QUESTIONS } from "./questions";

const KEYS = {
  users: "kw_users",
  questions: "kw_questions",
  sessions: "kw_quiz_sessions",
  subscriptions: "kw_subscriptions",
  roadmaps: "kw_roadmaps",
  initialized: "kw_initialized",
};

function load<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]") as T[];
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function uuid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function initDb(): void {
  if (localStorage.getItem(KEYS.initialized)) return;

  const adminUser: StoredUser = {
    id: "admin-1",
    email: "admin@kwado.ai",
    fullName: "Admin User",
    password: "admin123",
    emailVerified: true,
    emailVerificationToken: "",
    onboardingComplete: true,
    role: "admin",
    createdAt: new Date().toISOString(),
  };

  save(KEYS.users, [adminUser]);
  save(KEYS.questions, SEED_QUESTIONS);
  save(KEYS.sessions, []);
  save(KEYS.subscriptions, []);
  save(KEYS.roadmaps, []);
  localStorage.setItem(KEYS.initialized, "1");
}

// ---- Users ----
export function getUsers(): StoredUser[] {
  return load<StoredUser>(KEYS.users);
}

export function getUserById(id: string): StoredUser | undefined {
  return getUsers().find(u => u.id === id);
}

export function getUserByEmail(email: string): StoredUser | undefined {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(data: Omit<StoredUser, "id" | "createdAt">): StoredUser {
  const users = getUsers();
  const user: StoredUser = { ...data, id: uuid(), createdAt: new Date().toISOString() };
  save(KEYS.users, [...users, user]);
  return user;
}

export function updateUser(id: string, patch: Partial<StoredUser>): StoredUser | undefined {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return undefined;
  users[idx] = { ...users[idx], ...patch };
  save(KEYS.users, users);
  return users[idx];
}

export function toPublicUser(u: StoredUser) {
  return {
    id: u.id,
    email: u.email,
    fullName: u.fullName,
    emailVerified: u.emailVerified,
    onboardingComplete: u.onboardingComplete,
    role: u.role,
    createdAt: u.createdAt,
  };
}

// ---- Questions ----
export function getQuestions(): Question[] {
  return load<Question>(KEYS.questions);
}

export function getQuestionById(id: string): Question | undefined {
  return getQuestions().find(q => q.id === id);
}

export function createQuestion(data: Omit<Question, "id">): Question {
  const questions = getQuestions();
  const q: Question = { ...data, id: uuid() };
  save(KEYS.questions, [...questions, q]);
  return q;
}

export function updateQuestion(id: string, patch: Partial<Question>): Question | undefined {
  const questions = getQuestions();
  const idx = questions.findIndex(q => q.id === id);
  if (idx === -1) return undefined;
  questions[idx] = { ...questions[idx], ...patch };
  save(KEYS.questions, questions);
  return questions[idx];
}

export function deleteQuestion(id: string): boolean {
  const questions = getQuestions();
  const filtered = questions.filter(q => q.id !== id);
  if (filtered.length === questions.length) return false;
  save(KEYS.questions, filtered);
  return true;
}

// ---- Quiz Sessions ----
export function getQuizSessions(): QuizSession[] {
  return load<QuizSession>(KEYS.sessions);
}

export function getLatestSessionForUser(userId: string): QuizSession | undefined {
  return getQuizSessions()
    .filter(s => s.userId === userId && s.completedAt)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())[0];
}

export function createQuizSession(userId: string, questionIds: string[]): QuizSession {
  const sessions = getQuizSessions();
  const session: QuizSession = {
    id: uuid(),
    userId,
    questionIds,
    answers: [],
    createdAt: new Date().toISOString(),
  };
  save(KEYS.sessions, [...sessions, session]);
  return session;
}

export function completeQuizSession(
  sessionId: string,
  answers: QuizSession["answers"],
  score: number,
  subjectScores: Record<string, { correct: number; total: number }>
): QuizSession | undefined {
  const sessions = getQuizSessions();
  const idx = sessions.findIndex(s => s.id === sessionId);
  if (idx === -1) return undefined;
  sessions[idx] = { ...sessions[idx], answers, score, subjectScores, completedAt: new Date().toISOString() };
  save(KEYS.sessions, sessions);
  return sessions[idx];
}

// ---- Subscriptions ----
export function getSubscriptions(): Subscription[] {
  return load<Subscription>(KEYS.subscriptions);
}

export function getSubscriptionByUserId(userId: string): Subscription | undefined {
  return getSubscriptions()
    .filter(s => s.userId === userId && s.status === "success")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
}

export function getSubscriptionHistoryByUserId(userId: string): Subscription[] {
  return getSubscriptions()
    .filter(s => s.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createSubscription(data: Omit<Subscription, "id" | "createdAt">): Subscription {
  const subs = getSubscriptions();
  const sub: Subscription = { ...data, id: uuid(), createdAt: new Date().toISOString() };
  save(KEYS.subscriptions, [...subs, sub]);
  return sub;
}

export function isSubscriptionActive(userId: string): boolean {
  const sub = getSubscriptionByUserId(userId);
  if (!sub) return false;
  return new Date(sub.expiresAt) > new Date();
}

// ---- Roadmaps ----
export function getRoadmaps(): Roadmap[] {
  return load<Roadmap>(KEYS.roadmaps);
}

export function getRoadmapByUserId(userId: string): Roadmap | undefined {
  return getRoadmaps().find(r => r.userId === userId);
}

export function saveRoadmap(roadmap: Roadmap): void {
  const roadmaps = getRoadmaps().filter(r => r.userId !== roadmap.userId);
  save(KEYS.roadmaps, [...roadmaps, roadmap]);
}

// ---- Roadmap generation ----
export function generateRoadmap(userId: string): Roadmap {
  const user = getUserById(userId);
  const session = getLatestSessionForUser(userId);
  const subjects = user?.subjects || ["English", "Mathematics", "Physics", "Chemistry"];

  const weakSubjects = session?.subjectScores
    ? Object.entries(session.subjectScores)
        .filter(([, v]) => v.total > 0 && (v.correct / v.total) < 0.6)
        .map(([s]) => s)
    : subjects.slice(1);

  const examDate = user?.examDate ? new Date(user.examDate) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  const weeksToExam = Math.max(4, Math.ceil((examDate.getTime() - Date.now()) / (7 * 24 * 60 * 60 * 1000)));
  const totalWeeks = Math.min(weeksToExam, 12);

  const TOPICS: Record<string, string[]> = {
    Mathematics: ["Number & Numeration", "Algebra", "Geometry", "Statistics", "Calculus", "Trigonometry"],
    English: ["Comprehension", "Summary Writing", "Lexis & Structure", "Oral English"],
    Physics: ["Mechanics", "Waves & Optics", "Electricity", "Modern Physics", "Thermodynamics"],
    Chemistry: ["Atomic Structure", "Bonding", "Organic Chemistry", "Acids & Bases", "Electrochemistry"],
    Biology: ["Cell Biology", "Genetics", "Ecology", "Human Physiology", "Plant Biology"],
    Economics: ["Demand & Supply", "Production", "Market Structure", "National Income", "Finance"],
    Government: ["Constitutional Law", "Federalism", "Electoral System", "International Relations"],
    Literature: ["Poetry Analysis", "Prose Fiction", "Drama", "Literary Devices"],
    Geography: ["Map Reading", "Geomorphology", "Climate", "Population", "Economic Geography"],
  };

  const weeklyGoals = Array.from({ length: totalWeeks }, (_, wIdx) => {
    const week = wIdx + 1;
    const isWeak = weakSubjects.length > 0;
    const subjectPool = isWeak && wIdx < Math.ceil(totalWeeks * 0.6)
      ? [...weakSubjects, ...subjects.filter(s => !weakSubjects.includes(s))]
      : subjects;

    const dailyTasks = subjectPool.slice(0, 4).map((subject, i) => {
      const topics = TOPICS[subject] || ["Core Topics", "Practice Questions"];
      const topic = topics[(wIdx + i) % topics.length];
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return {
        id: uuid(),
        subject,
        topic,
        durationMinutes: (user?.dailyStudyHours || 4) * 15,
        day: days[i % 7],
        completed: wIdx === 0 && i === 0,
      };
    });

    return {
      week,
      title: week <= 2 ? "Foundation & Diagnostics" : week <= 5 ? "Core Concept Mastery" : week <= 9 ? "Practice & Application" : "Exam Simulation",
      completed: false,
      dailyTasks,
    };
  });

  const roadmap: Roadmap = {
    userId,
    overallProgress: session ? 5 : 0,
    currentWeek: 1,
    totalWeeks,
    todayTasks: weeklyGoals[0]?.dailyTasks || [],
    weeklyGoals,
    createdAt: new Date().toISOString(),
  };

  saveRoadmap(roadmap);
  return roadmap;
}

// ---- Quiz session creation ----
export function startQuizSession(userId: string): { sessionId: string; questions: any[]; timeLimit: number } {
  const user = getUserById(userId);
  const subjects = user?.subjects || ["English", "Mathematics", "Physics", "Chemistry"];
  const allQuestions = getQuestions();

  const selected: Question[] = [];
  for (const subject of subjects) {
    const subjectQs = allQuestions.filter(q => q.subject === subject);
    const shuffled = subjectQs.sort(() => Math.random() - 0.5).slice(0, 10);
    selected.push(...shuffled);
  }

  const shuffled = selected.sort(() => Math.random() - 0.5).slice(0, 40);
  const session = createQuizSession(userId, shuffled.map(q => q.id));

  return {
    sessionId: session.id,
    questions: shuffled.map(q => ({
      id: q.id,
      subject: q.subject,
      text: q.text,
      options: q.options,
    })),
    timeLimit: 45,
  };
}

export function scoreQuizSession(sessionId: string, answers: { questionId: string; selectedOption: number }[]) {
  const allQuestions = getQuestions();
  const questionMap = Object.fromEntries(allQuestions.map(q => [q.id, q]));

  const subjectScores: Record<string, { correct: number; total: number }> = {};
  let correct = 0;

  for (const ans of answers) {
    const q = questionMap[ans.questionId];
    if (!q) continue;
    if (!subjectScores[q.subject]) subjectScores[q.subject] = { correct: 0, total: 0 };
    subjectScores[q.subject].total++;
    if (ans.selectedOption === q.correctOption) {
      correct++;
      subjectScores[q.subject].correct++;
    }
  }

  const total = answers.length || 1;
  const score = Math.round((correct / total) * 100);

  completeQuizSession(sessionId, answers, score, subjectScores);
  return { score, subjectScores };
}
