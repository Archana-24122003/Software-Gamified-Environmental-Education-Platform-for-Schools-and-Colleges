"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDemoUser } from "@/lib/auth";
import { formatActivityLabel } from "@/lib/activityHistory";
import { learningPaths, type SubjectKey } from "@/lib/learningPaths";
import { getAllStudentSnapshots } from "@/lib/studentRecords";
import {
  getTeacherControls,
  setLockState,
  type LockTarget,
  type TeacherControlsState,
} from "@/lib/teacherControls";

function LockToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        checked
          ? "bg-[#244b35] text-white shadow-[0_10px_22px_rgba(36,75,53,0.18)]"
          : "border border-[#d9bca2]/40 bg-white/80 text-[#6f6258]"
      }`}
      aria-pressed={checked}
    >
      {label}
    </button>
  );
}

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [controls, setControls] = useState<TeacherControlsState>(() => getTeacherControls());
  const [snapshots, setSnapshots] = useState(() => getAllStudentSnapshots());
  const user = typeof window === "undefined" ? null : getDemoUser();
  const canRender = user?.role === "teacher";

  useEffect(() => {
    if (!user) {
      router.push("/login?role=teacher");
      return;
    }

    if (user.role !== "teacher") {
      router.push("/student-dashboard");
    }
  }, [router, user]);

  useEffect(() => {
    const sync = () => {
      setControls(getTeacherControls());
      setSnapshots(getAllStudentSnapshots());
    };

    window.addEventListener("teacherControlsUpdated", sync);
    window.addEventListener("activityHistoryUpdated", sync);
    window.addEventListener("progressUpdated", sync);

    return () => {
      window.removeEventListener("teacherControlsUpdated", sync);
      window.removeEventListener("activityHistoryUpdated", sync);
      window.removeEventListener("progressUpdated", sync);
    };
  }, []);

  const totalXP = snapshots.reduce((sum, snapshot) => sum + snapshot.progress.xp, 0);
  const totalActivities = snapshots.reduce((sum, snapshot) => sum + snapshot.activities.length, 0);

  const updateLock = (target: LockTarget, locked: boolean) => {
    const next = setLockState(target, locked);
    setControls(next);
  };

  if (!canRender) {
    return (
      <main className="grid min-h-screen place-items-center text-[#7b6e63]">
        Loading teacher dashboard...
      </main>
    );
  }

  return (
    <main className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="soft-card rounded-[2.4rem] p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="soft-pill inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em]">
                Teacher Workspace
              </div>
              <h1 className="mt-5 text-3xl font-semibold text-[#2d241f] sm:text-4xl">
                Monitor game-based learning progress
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6f6258] sm:text-base">
                Teachers now see only subject-based learning game progress, along with access
                controls for subjects, milestones, and activities.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <SummaryCard label="Students" value={`${snapshots.length}`} />
              <SummaryCard label="Class XP" value={`${totalXP}`} />
              <SummaryCard label="Game Plays" value={`${totalActivities}`} />
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="soft-panel rounded-[2rem] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-[#2d241f]">Student Roster</h2>
                <p className="mt-2 text-sm text-[#6f6258]">
                  Each student shows game score, XP, streak, and their latest saved activity.
                </p>
              </div>
              <div className="rounded-full bg-[#f7efe4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a4f21]">
                Local demo data
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {snapshots.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-[#dec9b2] bg-[#fffaf4] px-4 py-6 text-sm text-[#7b6e63]">
                  No student accounts found yet. Create student signups to populate the class list.
                </div>
              ) : (
                snapshots
                  .sort((left, right) => right.progress.points - left.progress.points)
                  .map((snapshot, index) => {
                    const recentActivity = snapshot.activities[0];

                    return (
                      <article
                        key={snapshot.user.email}
                        className="rounded-[1.6rem] border border-[#ead9c8] bg-white/85 p-5 shadow-[0_12px_28px_rgba(122,88,55,0.06)]"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-[#eef7ea] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#4c7a4d]">
                                Rank {index + 1}
                              </span>
                              <span className="text-lg font-semibold text-[#2d241f]">
                                {snapshot.user.name}
                              </span>
                            </div>
                            <div className="mt-2 text-sm text-[#7b6e63]">{snapshot.user.email}</div>
                          </div>

                          <div className="grid gap-2 sm:grid-cols-3">
                            <MiniStat label="Score" value={`${snapshot.progress.points}`} />
                            <MiniStat label="XP" value={`${snapshot.progress.xp}`} />
                            <MiniStat label="Streak" value={`${snapshot.progress.streak || 0} days`} />
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2 text-xs">
                          <span className="rounded-full bg-[#eef7ea] px-3 py-1 text-[#4c7a4d]">
                            {snapshot.activities.length} activities
                          </span>
                          <span className="rounded-full bg-[#fff3e2] px-3 py-1 text-[#8a4f21]">
                            {snapshot.progress.badges.length} badges
                          </span>
                          <span className="rounded-full bg-[#f7efe4] px-3 py-1 text-[#7b6e63]">
                            Class points contribution: {snapshot.progress.points}
                          </span>
                        </div>

                        <div className="mt-4 rounded-[1.2rem] bg-[#fbf6ef] px-4 py-3 text-sm text-[#5f5144]">
                          {recentActivity ? (
                            <>
                              Latest activity: {formatActivityLabel(recentActivity.activity)} in{" "}
                              {formatActivityLabel(recentActivity.subject)} with score{" "}
                              {recentActivity.score} and XP {recentActivity.xp}.
                            </>
                          ) : (
                            "No saved game activity yet for this student."
                          )}
                        </div>
                      </article>
                    );
                  })
              )}
            </div>
          </section>

          <section className="soft-panel rounded-[2rem] p-6">
            <div>
              <h2 className="text-2xl font-semibold text-[#2d241f]">Access Controls</h2>
              <p className="mt-2 text-sm text-[#6f6258]">
                Lock or unlock subjects, milestones, and activities to guide the learning flow.
              </p>
            </div>

            <div className="mt-6 space-y-5">
              {learningPaths.map((path) => {
                const subjectState = controls.subjects[path.slug];

                return (
                  <section
                    key={path.slug}
                    className="rounded-[1.7rem] border border-[#ead9c8] bg-white/85 p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8d7f73]">
                          Course
                        </div>
                        <h3 className="mt-1 text-xl font-semibold text-[#2d241f]">{path.label}</h3>
                        <p className="mt-2 text-sm text-[#6f6258]">{path.description}</p>
                      </div>

                      <LockToggle
                        checked={subjectState.locked}
                        onChange={(locked) =>
                          updateLock({ type: "subject", subject: path.slug as SubjectKey }, locked)
                        }
                        label={subjectState.locked ? "Course Locked" : "Course Open"}
                      />
                    </div>

                    <div className="mt-5 space-y-3">
                      {path.milestones.map((milestone) => {
                        const milestoneState = subjectState.milestones[milestone.slug];

                        return (
                          <div
                            key={milestone.slug}
                            className="rounded-[1.3rem] border border-[#f0e2d2] bg-[#fffaf4] p-4"
                          >
                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                              <div>
                                <div className="text-sm font-semibold text-[#2d241f]">
                                  {milestone.title}
                                </div>
                                <div className="mt-1 text-sm text-[#7b6e63]">
                                  {milestone.activity}
                                </div>
                              </div>

                              <LockToggle
                                checked={milestoneState.locked}
                                onChange={(locked) =>
                                  updateLock(
                                    {
                                      type: "milestone",
                                      subject: path.slug as SubjectKey,
                                      milestone: milestone.slug,
                                    },
                                    locked,
                                  )
                                }
                                label={milestoneState.locked ? "Milestone Locked" : "Milestone Open"}
                              />
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                              {milestone.activities.map((activity) => {
                                const activityState = milestoneState.activities[activity.slug];

                                return (
                                  <LockToggle
                                    key={activity.slug}
                                    checked={activityState.locked}
                                    onChange={(locked) =>
                                      updateLock(
                                        {
                                          type: "activity",
                                          subject: path.slug as SubjectKey,
                                          milestone: milestone.slug,
                                          activity: activity.slug,
                                        },
                                        locked,
                                      )
                                    }
                                    label={
                                      activityState.locked
                                        ? `${activity.title} Locked`
                                        : `${activity.title} Open`
                                    }
                                  />
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="soft-panel rounded-[1.5rem] px-4 py-4">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8d7f73]">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-[#244b35]">{value}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-[#f0e2d2] bg-[#fffaf4] px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8d7f73]">{label}</div>
      <div className="mt-1 text-lg font-semibold text-[#2d241f]">{value}</div>
    </div>
  );
}
