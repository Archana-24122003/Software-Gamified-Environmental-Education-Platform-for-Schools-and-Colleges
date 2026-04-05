"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import ProgressBar from "@/components/ProgressBar";
import StatsCard from "@/components/StatsCard";
import { getDemoUser } from "@/lib/auth";
import {
  formatActivityLabel,
  getActivityHistory,
  type ActivityEntry,
} from "@/lib/activityHistory";
import { getBadgeDef, rarityClasses } from "@/lib/badges";
import { calculateLevel, getProgress } from "@/lib/progress";

export default function DashboardPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(() => getProgress());
  const [activities, setActivities] = useState<ActivityEntry[]>(() => getActivityHistory());
  const [badgeToast, setBadgeToast] = useState<string[]>([]);
  const user = typeof window === "undefined" ? null : getDemoUser();
  const canRender = user?.role === "student";

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "student") {
      router.push("/teacher-dashboard");
    }
  }, [router, user]);

  useEffect(() => {
    const syncDashboard = () => {
      setProgress(getProgress());
      setActivities(getActivityHistory());
    };

    const onBadgesUnlocked = (event: Event) => {
      const customEvent = event as CustomEvent<{ newBadges?: string[] }>;
      const newBadges = customEvent.detail?.newBadges ?? [];

      if (newBadges.length === 0) {
        return;
      }

      setBadgeToast(newBadges);
      window.setTimeout(() => setBadgeToast([]), 3000);
    };

    window.addEventListener("progressUpdated", syncDashboard);
    window.addEventListener("activityHistoryUpdated", syncDashboard);
    window.addEventListener("badgesUnlocked", onBadgesUnlocked);

    return () => {
      window.removeEventListener("progressUpdated", syncDashboard);
      window.removeEventListener("activityHistoryUpdated", syncDashboard);
      window.removeEventListener("badgesUnlocked", onBadgesUnlocked);
    };
  }, []);

  const activitySummary = useMemo(
    () => ({
      totalScore: activities.reduce((sum, activity) => sum + activity.score, 0),
      totalXP: activities.reduce((sum, activity) => sum + activity.xp, 0),
      totalActivities: activities.length,
      recentActivity: activities[0] ?? null,
    }),
    [activities],
  );

  const level = calculateLevel(progress.xp);
  const xpGoal = Math.max(100, level * 100);
  const recentActivity = activitySummary.recentActivity;

  if (!canRender) {
    return (
      <main className="grid min-h-screen place-items-center text-[#7b6e63]">
        Loading dashboard...
      </main>
    );
  }

  return (
    <>
      {badgeToast.length > 0 && (
        <div className="fixed right-4 top-20 z-50 w-[320px] animate-toast-in">
          <div className="soft-card rounded-[1.8rem] p-4">
            <div className="text-sm font-semibold text-[#2d241f]">New badge unlocked</div>
            <div className="mt-3 space-y-2">
              {badgeToast.map((id) => {
                const badge = getBadgeDef(id);

                if (!badge) {
                  return null;
                }

                const Icon = badge.Icon;

                return (
                  <div
                    key={id}
                    className="rounded-[1.4rem] border border-[#ead9c8] bg-white/80 px-3 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-[1rem] bg-[#eef7ea]">
                        <Icon className="h-5 w-5 text-[#4c7a4d]" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#2d241f]">{badge.title}</div>
                        <div className="text-xs text-[#7b6e63]">{badge.description}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <main className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="soft-card relative overflow-hidden rounded-[2.4rem] p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,204,143,0.25),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(160,224,184,0.25),_transparent_26%)]" />
            <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="soft-pill inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em]">
                  Student Dashboard
                </div>
                <h1 className="mt-5 text-3xl font-semibold text-[#2d241f] sm:text-4xl">
                  Welcome back{user?.name ? `, ${user.name}` : ""}.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6f6258] sm:text-base">
                  This dashboard now tracks only your subject-based game activity, including score,
                  XP, streaks, and saved progress from learning levels.
                </p>
              </div>

              <div className="soft-panel rounded-[1.6rem] px-5 py-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8d7f73]">
                  Current Level
                </div>
                <div className="mt-2 text-3xl font-semibold text-[#244b35]">Lv {level}</div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-4">
            <StatsCard
              title="Total Score"
              value={`${activitySummary.totalScore}`}
              sub="Stars earned from saved games"
              tone="orange"
            />
            <StatsCard
              title="Total XP"
              value={`${activitySummary.totalXP}`}
              sub="Progress energy from game rewards"
              tone="green"
            />
            <StatsCard
              title="Streak"
              value={`${progress.streak} days`}
              sub="Little learning wins in a row"
              tone="cream"
            />
            <StatsCard
              title="Activities Played"
              value={`${activitySummary.totalActivities}`}
              sub="Game rounds saved in your journey"
              tone="green"
            />
          </section>

          <section className="soft-panel rounded-[2rem] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-[#2d241f]">Overall XP Progress</h2>
                <p className="mt-1 text-sm text-[#7b6e63]">Progress is based only on learning games.</p>
              </div>
              <div className="rounded-full bg-[#f7efe4] px-4 py-2 text-sm font-medium text-[#8a4f21]">
                Next goal: {xpGoal} XP
              </div>
            </div>
            <div className="mt-5">
              <ProgressBar value={progress.xp} max={xpGoal} />
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="soft-panel rounded-[2rem] p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-[#2d241f]">Game Activity</h2>
                  <p className="mt-1 text-sm text-[#7b6e63]">
                    Every saved subject game appears here with score and XP.
                  </p>
                </div>
                <div className="rounded-full bg-[#f7efe4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a4f21]">
                  {activities.length} saved
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {activities.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-[#dec9b2] bg-[#fffaf4] px-4 py-6 text-sm text-[#7b6e63]">
                    No game activity yet. Start a learning path and finish a game to populate your dashboard.
                  </div>
                ) : (
                  activities.map((activity) => (
                    <article
                      key={activity.id}
                      className="rounded-[1.5rem] border border-[#ead9c8] bg-white/85 px-4 py-4 shadow-[0_10px_24px_rgba(122,88,55,0.06)]"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="text-base font-semibold text-[#2d241f]">
                            {formatActivityLabel(activity.activity)}
                          </div>
                          <div className="mt-1 text-sm text-[#6f6258]">
                            {formatActivityLabel(activity.subject)} • {formatActivityLabel(activity.milestone)}
                          </div>
                        </div>

                        <div className="text-sm text-[#8d7f73]">
                          {new Date(activity.timestamp).toLocaleString()}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-[#eef7ea] px-3 py-1 text-[#4c7a4d]">
                          Score: {activity.score}
                        </span>
                        <span className="rounded-full bg-[#fff3e2] px-3 py-1 text-[#8a4f21]">
                          XP: {activity.xp}
                        </span>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>

            <div className="space-y-6">
              <section className="soft-panel rounded-[2rem] p-6">
                <h2 className="text-xl font-semibold text-[#2d241f]">Recent Activity</h2>
                {recentActivity ? (
                  <div className="mt-4 rounded-[1.6rem] bg-[linear-gradient(135deg,#fff6ea_0%,#eef7ea_100%)] p-5">
                    <div className="text-lg font-semibold text-[#2d241f]">
                      {formatActivityLabel(recentActivity.activity)}
                    </div>
                    <div className="mt-2 text-sm text-[#6f6258]">
                      {formatActivityLabel(recentActivity.subject)} • {formatActivityLabel(recentActivity.milestone)}
                    </div>
                    <div className="mt-3 text-sm text-[#5f5144]">
                      Score {recentActivity.score} • XP {recentActivity.xp}
                    </div>
                    <div className="mt-2 text-xs text-[#8d7f73]">
                      {new Date(recentActivity.timestamp).toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 rounded-[1.5rem] border border-dashed border-[#dec9b2] bg-[#fffaf4] px-4 py-6 text-sm text-[#7b6e63]">
                    Your latest game result will appear here after the first saved activity.
                  </div>
                )}
              </section>

              <section className="soft-panel rounded-[2rem] p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-[#2d241f]">Badges</div>
                  <div className="text-xs text-[#8d7f73]">Unlocked from game progress</div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {progress.badges.length ? (
                    progress.badges.map((id) => {
                      const badge = getBadgeDef(id);

                      if (!badge) {
                        return null;
                      }

                      const Icon = badge.Icon;

                      return (
                        <span
                          key={id}
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${rarityClasses(
                            badge.rarity,
                          )}`}
                          title={badge.description}
                        >
                          <Icon className="h-4 w-4" />
                          {badge.title}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-sm text-[#7b6e63]">
                      No badges yet. Play learning games to unlock them.
                    </span>
                  )}
                </div>
              </section>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
