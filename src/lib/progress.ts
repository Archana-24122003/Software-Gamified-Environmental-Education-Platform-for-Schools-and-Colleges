import {
  createScopedStorageKey,
  getScopedStorageKey,
  getStorageScopeUserEmail,
  migrateLegacyStorageKey,
} from "@/lib/storageScope";

export type Progress = {
  xp: number;
  points: number;
  completedActivities: string[];
  badges: string[];
  streak: number;
  lastActiveDate: string | null;
};

type LegacyProgress = {
  xp?: number;
  points?: number;
  completedMissions?: string[];
  completedActivities?: string[];
  badges?: string[];
  streak?: number;
  lastActiveDate?: string | null;
};

type ActivitySnapshot = {
  id: string;
  score: number;
  xp: number;
  timestamp: number;
};

const KEY = "learnbee_progress";
const ACTIVITY_HISTORY_KEY = "learnbee_activity_history";
const QUIZ_HISTORY_KEY = "learnbee_quiz_history";

function getDefaultProgress(): Progress {
  return {
    xp: 0,
    points: 0,
    completedActivities: [],
    badges: [],
    streak: 0,
    lastActiveDate: null,
  };
}

function readActivityHistory(email?: string | null) {
  if (typeof window === "undefined") {
    return [] as ActivitySnapshot[];
  }

  const scopedEmail = email ?? getStorageScopeUserEmail();
  migrateLegacyStorageKey(ACTIVITY_HISTORY_KEY, scopedEmail);
  const raw = localStorage.getItem(getScopedStorageKey(ACTIVITY_HISTORY_KEY, scopedEmail));

  if (!raw) {
    return [] as ActivitySnapshot[];
  }

  try {
    const parsed = JSON.parse(raw) as ActivitySnapshot[];
    return Array.isArray(parsed) ? parsed : ([] as ActivitySnapshot[]);
  } catch {
    return [] as ActivitySnapshot[];
  }
}

function cleanupDeprecatedTrackingData(email?: string | null) {
  if (typeof window === "undefined") {
    return;
  }

  const scopedEmail = email ?? getStorageScopeUserEmail();
  localStorage.removeItem(QUIZ_HISTORY_KEY);
  localStorage.removeItem(createScopedStorageKey(QUIZ_HISTORY_KEY, scopedEmail));
}

function deriveProgressFromActivities(
  input: LegacyProgress | null | undefined,
  activities: ActivitySnapshot[],
) {
  const points = activities.reduce((sum, activity) => sum + activity.score, 0);
  const xp = activities.reduce((sum, activity) => sum + activity.xp, 0);
  const completedActivities = activities.map((activity) => `activity:${activity.id}`);

  const progress: Progress = {
    xp,
    points,
    completedActivities,
    badges: [],
    streak: input?.streak ?? 0,
    lastActiveDate: input?.lastActiveDate ?? null,
  };

  if (activities.length > 0) {
    updateStreak(progress, activities[0].timestamp);
  }

  progress.badges = computeBadges(progress);
  return progress;
}

export function getProgress(email?: string | null): Progress {
  if (typeof window === "undefined") return getDefaultProgress();

  const scopedEmail = email ?? getStorageScopeUserEmail();
  migrateLegacyStorageKey(KEY, scopedEmail);
  cleanupDeprecatedTrackingData(scopedEmail);

  const activities = readActivityHistory(scopedEmail);
  const raw = localStorage.getItem(getScopedStorageKey(KEY, scopedEmail));

  if (!raw) {
    return deriveProgressFromActivities(undefined, activities);
  }

  try {
    return deriveProgressFromActivities(JSON.parse(raw) as LegacyProgress, activities);
  } catch {
    return deriveProgressFromActivities(undefined, activities);
  }
}

export function saveProgress(progress: Progress, email?: string | null) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    getScopedStorageKey(KEY, email ?? getStorageScopeUserEmail()),
    JSON.stringify(progress),
  );
}

export function calculateLevel(xp: number) {
  return Math.floor(xp / 100) + 1;
}

export function computeBadges(progress: Progress) {
  const totalCompletions = progress.completedActivities.length;
  const badges = new Set<string>(progress.badges ?? []);

  if (totalCompletions >= 1) badges.add("starter");
  if (progress.xp >= 100) badges.add("level_up");
  if (totalCompletions >= 5) badges.add("activity_spark");
  if (totalCompletions >= 10) badges.add("eco_warrior");
  if (progress.xp >= 300) badges.add("spark_impact");
  if (progress.streak >= 7) badges.add("streak_fire");

  return Array.from(badges);
}

function dateKeyFromTimestamp(timestamp: number) {
  const date = new Date(timestamp);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function todayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function daysBetween(a: string, b: string) {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  const diff = db.getTime() - da.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

export function updateStreak(progress: Progress, lastActivityTimestamp?: number) {
  const today = lastActivityTimestamp ? dateKeyFromTimestamp(lastActivityTimestamp) : todayKey();
  const last = progress.lastActiveDate;

  if (!last) {
    progress.streak = 1;
    progress.lastActiveDate = today;
    return progress;
  }

  const diff = daysBetween(last, today);

  if (diff === 0) {
    return progress;
  }

  if (diff === 1) {
    progress.streak = (progress.streak || 0) + 1;
    progress.lastActiveDate = today;
    return progress;
  }

  progress.streak = 1;
  progress.lastActiveDate = today;
  return progress;
}
