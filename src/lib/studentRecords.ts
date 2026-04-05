"use client";

import { getAccounts, type DemoUser } from "@/lib/auth";
import { getActivityHistory, type ActivityEntry } from "@/lib/activityHistory";
import { getProgress, type Progress } from "@/lib/progress";

export type StudentSnapshot = {
  user: DemoUser;
  progress: Progress;
  activities: ActivityEntry[];
};

export function getStudentAccounts() {
  return getAccounts().filter((account) => account.role === "student");
}

export function getStudentSnapshot(email: string): StudentSnapshot | null {
  const student = getStudentAccounts().find((account) => account.email === email);

  if (!student) {
    return null;
  }

  return {
    user: student,
    progress: getProgress(student.email),
    activities: getActivityHistory(student.email),
  };
}

export function getAllStudentSnapshots() {
  return getStudentAccounts()
    .map((student) => getStudentSnapshot(student.email))
    .filter((snapshot): snapshot is StudentSnapshot => snapshot !== null);
}
