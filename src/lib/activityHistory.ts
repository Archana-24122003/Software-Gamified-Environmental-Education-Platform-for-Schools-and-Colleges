import { computeBadges, getProgress, saveProgress, updateStreak } from "@/lib/progress";
import { getStorageScopeUserEmail, getScopedStorageKey, migrateLegacyStorageKey } from "@/lib/storageScope";

export type ActivitySubject = "maths" | "english" | "evs";

export type ActivityEntry = {
  id: string;
  subject: ActivitySubject;
  milestone: string;
  activity: string;
  score: number;
  xp: number;
  timestamp: number;
};

export type SaveActivityInput = {
  subject: ActivitySubject;
  milestone: string;
  activity: string;
  score: number;
  xp: number;
  timestamp?: number;
};

const ACTIVITY_HISTORY_KEY = "learnbee_activity_history";

function getDefaultEntries() {
  return [] as ActivityEntry[];
}

export function getActivityHistory(email?: string | null) {
  if (typeof window === "undefined") {
    return getDefaultEntries();
  }

  const scopedEmail = email ?? getStorageScopeUserEmail();
  migrateLegacyStorageKey(ACTIVITY_HISTORY_KEY, scopedEmail);
  const raw = localStorage.getItem(getScopedStorageKey(ACTIVITY_HISTORY_KEY, scopedEmail));

  if (!raw) {
    return getDefaultEntries();
  }

  try {
    const parsed = JSON.parse(raw) as ActivityEntry[];
    return Array.isArray(parsed) ? parsed : getDefaultEntries();
  } catch {
    return getDefaultEntries();
  }
}

export function saveActivity(data: SaveActivityInput) {
  if (typeof window === "undefined") {
    return null;
  }

  const entry: ActivityEntry = {
    id: `${data.subject}-${data.milestone}-${data.activity}-${data.timestamp ?? Date.now()}`,
    subject: data.subject,
    milestone: data.milestone,
    activity: data.activity,
    score: data.score,
    xp: data.xp,
    timestamp: data.timestamp ?? Date.now(),
  };

  const previousEntries = getActivityHistory();
  const nextEntries = [entry, ...previousEntries].slice(0, 100);
  localStorage.setItem(
    getScopedStorageKey(ACTIVITY_HISTORY_KEY, getStorageScopeUserEmail()),
    JSON.stringify(nextEntries),
  );

  const progress = getProgress();
  progress.points += entry.score;
  progress.xp += entry.xp;
  progress.completedActivities.push(`activity:${entry.id}`);
  updateStreak(progress, entry.timestamp);

  const previousBadges = new Set(progress.badges ?? []);
  const updatedBadges = computeBadges(progress);
  progress.badges = updatedBadges;

  saveProgress(progress);

  window.dispatchEvent(new CustomEvent("activityHistoryUpdated", { detail: entry }));
  window.dispatchEvent(new CustomEvent("progressUpdated"));

  const newBadges = updatedBadges.filter((badgeId) => !previousBadges.has(badgeId));
  if (newBadges.length > 0) {
    window.dispatchEvent(new CustomEvent("badgesUnlocked", { detail: { newBadges } }));
  }

  return entry;
}

export function getActivitySummary() {
  const activities = getActivityHistory();

  return {
    totalScore: activities.reduce((sum, activity) => sum + activity.score, 0),
    totalXP: activities.reduce((sum, activity) => sum + activity.xp, 0),
    totalActivities: activities.length,
    recentActivity: activities[0] ?? null,
  };
}

export function formatActivityLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
