"use client";

import { getDemoUser } from "@/lib/auth";
import { createScopedStorageKey } from "@/lib/storageScope";

const QUIZZES_KEY = "learnbee_quizzes";
const QUIZ_ATTEMPTS_KEY = "learnbee_quiz_attempts";

export const QUIZZES_UPDATED_EVENT = "learnbeeQuizzesUpdated";
export const QUIZ_ATTEMPTS_UPDATED_EVENT = "learnbeeQuizAttemptsUpdated";

export type QuizQuestion = {
  id: string;
  text: string;
  options: [string, string, string, string];
  correctOptionIndex: number;
  timerSeconds: number;
};

export type Quiz = {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  createdAt: string;
  createdBy: string;
  questions: QuizQuestion[];
};

export type QuizAttempt = {
  quizId: string;
  submittedAt: string;
  answers: number[];
  score: number;
  total: number;
};

function readQuizzes() {
  if (typeof window === "undefined") {
    return [] as Quiz[];
  }

  const raw = localStorage.getItem(QUIZZES_KEY);

  if (!raw) {
    return [] as Quiz[];
  }

  try {
    const parsed = JSON.parse(raw) as Quiz[];
    return Array.isArray(parsed) ? parsed : ([] as Quiz[]);
  } catch {
    return [] as Quiz[];
  }
}

function saveQuizzes(quizzes: Quiz[]) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes));
  window.dispatchEvent(new Event(QUIZZES_UPDATED_EVENT));
}

function getAttemptStorageKey(email?: string | null) {
  const normalizedEmail = email?.trim().toLowerCase();
  return createScopedStorageKey(QUIZ_ATTEMPTS_KEY, normalizedEmail);
}

function readAttempts(email?: string | null) {
  if (typeof window === "undefined") {
    return [] as QuizAttempt[];
  }

  const raw = localStorage.getItem(getAttemptStorageKey(email));

  if (!raw) {
    return [] as QuizAttempt[];
  }

  try {
    const parsed = JSON.parse(raw) as QuizAttempt[];
    return Array.isArray(parsed) ? parsed : ([] as QuizAttempt[]);
  } catch {
    return [] as QuizAttempt[];
  }
}

function saveAttempts(attempts: QuizAttempt[], email?: string | null) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(getAttemptStorageKey(email), JSON.stringify(attempts));
  window.dispatchEvent(new Event(QUIZ_ATTEMPTS_UPDATED_EVENT));
}

export function getAllQuizzes() {
  return readQuizzes().sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

export function getAvailableQuizzes(now = Date.now()) {
  return getAllQuizzes().filter((quiz) => {
    const start = new Date(quiz.startAt).getTime();
    const end = new Date(quiz.endAt).getTime();
    return Number.isFinite(start) && Number.isFinite(end) && now >= start && now <= end;
  });
}

export function getQuizById(quizId: string) {
  return getAllQuizzes().find((quiz) => quiz.id === quizId) ?? null;
}

export function publishQuiz(input: {
  title: string;
  startAt: string;
  endAt: string;
  questions: QuizQuestion[];
}) {
  const user = getDemoUser();
  const createdBy = user?.email ?? "teacher@learnbee.local";
  const nowIso = new Date().toISOString();
  const nextQuiz: Quiz = {
    id: `quiz-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: input.title.trim(),
    startAt: input.startAt,
    endAt: input.endAt,
    createdAt: nowIso,
    createdBy,
    questions: input.questions,
  };

  const quizzes = getAllQuizzes();
  saveQuizzes([nextQuiz, ...quizzes]);
  return nextQuiz;
}

export function getStudentQuizAttempts(email?: string | null) {
  return readAttempts(email).sort(
    (left, right) => new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime(),
  );
}

export function saveStudentQuizAttempt(input: {
  quizId: string;
  answers: number[];
  score: number;
  total: number;
  email?: string | null;
}) {
  const attempts = getStudentQuizAttempts(input.email);
  const nextAttempt: QuizAttempt = {
    quizId: input.quizId,
    answers: input.answers,
    score: input.score,
    total: input.total,
    submittedAt: new Date().toISOString(),
  };

  const withoutCurrent = attempts.filter((attempt) => attempt.quizId !== input.quizId);
  saveAttempts([nextAttempt, ...withoutCurrent], input.email);
  return nextAttempt;
}

export function getStudentAttemptForQuiz(quizId: string, email?: string | null) {
  return getStudentQuizAttempts(email).find((attempt) => attempt.quizId === quizId) ?? null;
}

export function calculateQuizScore(quiz: Quiz, answers: number[]) {
  const total = quiz.questions.length;
  const score = quiz.questions.reduce((sum, question, index) => {
    return sum + (answers[index] === question.correctOptionIndex ? 1 : 0);
  }, 0);

  return { score, total };
}
