"use client";

import Footer from "@/components/Footer";
import { getActivityHistory, getActivitySummary, formatActivityLabel } from "@/lib/activityHistory";
import { getProgress } from "@/lib/progress";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

export default function AnalyticsPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const progress = getProgress();
  const activityHistory = getActivityHistory();
  const summary = getActivitySummary();

  const totalXP = progress.xp;
  const totalPoints = progress.points;
  const totalActivities = summary.totalActivities;
  const streak = progress.streak ?? 0;
  const totalBadges = progress.badges.length;

  const timelineData = buildTimelineData(activityHistory);
  const subjectData = buildSubjectData(activityHistory);

  return (
    <>
      <main className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="soft-card rounded-[2.4rem] p-8">
            <div className="soft-pill inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em]">
              Analytics
            </div>
            <h1 className="mt-5 text-3xl font-semibold text-[#2d241f] sm:text-4xl">
              Game-based learning performance
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6f6258] sm:text-base">
              Analytics now focus only on subject games, showing score, XP growth, subject activity,
              and learning consistency across saved gameplay.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <Stat title="Total XP" value={`${totalXP}`} />
            <Stat title="Total Score" value={`${totalPoints}`} />
            <Stat title="Activities Played" value={`${totalActivities}`} />
            <Stat title="Current Streak" value={`${streak} days`} />
            <Stat title="Badges" value={`${totalBadges}`} />
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="soft-panel rounded-[2rem] p-6">
              <h2 className="text-xl font-semibold text-[#2d241f]">XP Growth</h2>
              <p className="mt-2 text-sm text-[#7b6e63]">
                This chart reflects only saved game sessions.
              </p>

              <div className="mt-6 h-[300px]">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ead9c8" />
                      <XAxis dataKey="label" stroke="#8d7f73" />
                      <YAxis stroke="#8d7f73" />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "18px",
                          border: "1px solid #ead9c8",
                          background: "#fffaf4",
                          color: "#2d241f",
                        }}
                      />
                      <Line type="monotone" dataKey="xp" stroke="#d7863d" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <ChartPlaceholder />
                )}
              </div>
            </div>

            <div className="soft-panel rounded-[2rem] p-6">
              <h2 className="text-xl font-semibold text-[#2d241f]">Subject Activity</h2>
              <p className="mt-2 text-sm text-[#7b6e63]">
                Compare which subjects are driving the most saved game activity.
              </p>

              <div className="mt-6 h-[300px]">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subjectData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ead9c8" />
                      <XAxis dataKey="subject" stroke="#8d7f73" />
                      <YAxis stroke="#8d7f73" />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "18px",
                          border: "1px solid #ead9c8",
                          background: "#fffaf4",
                          color: "#2d241f",
                        }}
                      />
                      <Bar dataKey="plays" fill="#91c58d" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ChartPlaceholder />
                )}
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="soft-panel rounded-[2rem] p-6">
              <h2 className="text-xl font-semibold text-[#2d241f]">Performance Snapshot</h2>
              <div className="mt-5 space-y-3">
                <InfoRow label="Recent score total" value={`${summary.totalScore}`} />
                <InfoRow label="Recent XP total" value={`${summary.totalXP}`} />
                <InfoRow label="Tracked game sessions" value={`${summary.totalActivities}`} />
                <InfoRow label="Streak health" value={streak > 0 ? `${streak} active day(s)` : "Not started"} />
              </div>
            </div>

            <div className="soft-panel rounded-[2rem] p-6">
              <h2 className="text-xl font-semibold text-[#2d241f]">Recent Saved Games</h2>
              <div className="mt-5 space-y-3">
                {activityHistory.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-[#dec9b2] bg-[#fffaf4] px-4 py-6 text-sm text-[#7b6e63]">
                    Play a subject game to start filling your analytics feed.
                  </div>
                ) : (
                  activityHistory.slice(0, 5).map((activity) => (
                    <div
                      key={activity.id}
                      className="rounded-[1.4rem] border border-[#ead9c8] bg-white/85 px-4 py-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="font-semibold text-[#2d241f]">
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
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

function buildTimelineData(
  activities: ReturnType<typeof getActivityHistory>,
) {
  let runningXP = 0;

  return activities
    .slice()
    .reverse()
    .map((activity, index) => {
      runningXP += activity.xp;
      return {
        label: `Game ${index + 1}`,
        xp: runningXP,
      };
    });
}

function buildSubjectData(
  activities: ReturnType<typeof getActivityHistory>,
) {
  const counts = new Map<string, number>();

  activities.forEach((activity) => {
    const label = formatActivityLabel(activity.subject);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  });

  return Array.from(counts.entries()).map(([subject, plays]) => ({
    subject,
    plays,
  }));
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="soft-panel rounded-[1.6rem] p-5">
      <div className="text-sm font-medium text-[#7b6e63]">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-[#2d241f]">{value}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[1.2rem] bg-[#fbf6ef] px-4 py-3">
      <span className="text-sm text-[#6f6258]">{label}</span>
      <span className="text-sm font-semibold text-[#2d241f]">{value}</span>
    </div>
  );
}

function ChartPlaceholder() {
  return <div className="h-full w-full animate-pulse rounded-[1.5rem] bg-[#f6ede2]" />;
}
