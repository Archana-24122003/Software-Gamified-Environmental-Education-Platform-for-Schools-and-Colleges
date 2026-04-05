"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDemoUser } from "@/lib/auth";
import { getLearningPath } from "@/lib/learningPaths";
import { getTeacherControls, isMilestoneLocked, isSubjectLocked } from "@/lib/teacherControls";

const nodeIcons = ["S1", "S2", "S3", "S4", "S5", "S6"];
const floatingLabels = ["Play", "Grow", "Learn", "Build", "Shine"];

export default function LearningPathPage() {
  const params = useParams<{ subject: string }>();
  const router = useRouter();
  const path = useMemo(() => getLearningPath(params.subject), [params.subject]);
  const user = typeof window === "undefined" ? null : getDemoUser();
  const canRender = user?.role === "student" && !!path;
  const [controls, setControls] = useState(() => getTeacherControls());

  useEffect(() => {
    const syncControls = () => setControls(getTeacherControls());
    window.addEventListener("teacherControlsUpdated", syncControls);
    return () => window.removeEventListener("teacherControlsUpdated", syncControls);
  }, []);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "student") {
      router.push("/teacher-dashboard");
      return;
    }
    if (!path) {
      router.push("/student-course-selection");
      return;
    }
    if (controls && isSubjectLocked(path.slug, controls)) {
      router.push("/student-course-selection");
      return;
    }

    localStorage.setItem("learnbee_subject", path.label);
  }, [controls, path, router, user]);

  if (!canRender || !path) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f5ef] text-[#5f5144]">
        Loading your learning path...
      </main>
    );
  }

  const completion = Math.round((1 / path.milestones.length) * 100);
  const handleMilestoneClick = (milestoneSlug: string) => {
    router.push(`/learning-path/${path.slug}/${milestoneSlug}`);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f4ec] text-[#243126]">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background: `radial-gradient(circle at top left, ${path.accent}33 0%, transparent 28%),
          radial-gradient(circle at bottom right, ${path.accent}24 0%, transparent 24%),
          linear-gradient(180deg, #f8f6ee 0%, #eef6ef 100%)`,
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:px-6">
        <aside className="rounded-[2rem] border border-[#dfe7d8] bg-white/85 p-5 shadow-[0_20px_45px_rgba(97,122,89,0.12)] backdrop-blur lg:sticky lg:top-6 lg:h-fit lg:w-[280px]">
          <Link
            href="/student-course-selection"
            className="inline-flex rounded-full border border-[#dde5d3] bg-[#f8fbf4] px-4 py-2 text-sm font-medium text-[#56704b] transition hover:bg-white"
          >
            Back to subjects
          </Link>

          <div
            className="mt-5 rounded-[1.6rem] p-5 text-[#21412b]"
            style={{
              background: `linear-gradient(160deg, ${path.accent}55, #ffffff 82%)`,
            }}
          >
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#56704b]">
              {path.label}
            </div>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-[#1f3425]">
              Learning Path
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#48604d]">{path.tagline}</p>
          </div>

          <div className="mt-5 space-y-3">
            <div className="rounded-[1.4rem] border border-[#e2eadb] bg-[#fbfdf8] p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#77906f]">
                Progress
              </div>
              <div className="mt-2 text-2xl font-semibold text-[#25442d]">{completion}%</div>
              <div className="mt-3 h-3 rounded-full bg-[#e5edde]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${completion}%`,
                    background: `linear-gradient(90deg, ${path.accent}, #59c36a)`,
                  }}
                />
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-[#e2eadb] bg-[#fbfdf8] p-4">
              <div className="text-sm font-semibold text-[#28472f]">Today&apos;s focus</div>
              <div className="mt-2 text-sm leading-6 text-[#607761]">{path.heroMetric}</div>
            </div>

            <div className="rounded-[1.4rem] border border-[#e2eadb] bg-[#fbfdf8] p-4">
              <div className="text-sm font-semibold text-[#28472f]">Duration</div>
              <div className="mt-2 text-sm leading-6 text-[#607761]">
                {path.duration} across {path.totalLessons} milestone stops
              </div>
            </div>
          </div>
        </aside>

        <section className="relative flex-1 overflow-hidden rounded-[2.2rem] border border-[#dfe7d8] bg-white/78 px-4 py-6 shadow-[0_28px_60px_rgba(103,127,94,0.12)] backdrop-blur sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 border-b border-[#e5ecdf] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#78906f]">
                Path map
              </div>
              <h2 className="mt-2 text-3xl font-semibold text-[#223426] sm:text-4xl">
                Start learning and follow the trail
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#627662] sm:text-base">
                A playful step-by-step roadmap for {path.label}, inspired by game progression
                paths with checkpoints, rewards, and a clear next lesson.
              </p>
            </div>

            <div className="rounded-full border border-[#deead8] bg-[#f7fbf4] px-4 py-2 text-sm font-medium text-[#56704b]">
              Click any milestone to open its games
            </div>
          </div>

          <div className="relative mx-auto mt-8 max-w-4xl pb-10 pt-4">
            <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-[8px] -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,#bae28f_0%,#d7e6cf_100%)] lg:block" />

            {floatingLabels.map((label, index) => (
              <div
                key={`${label}-${index}`}
                className="pointer-events-none absolute hidden rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-[#648259] opacity-80 shadow-sm lg:block"
                style={{
                  left: `${index % 2 === 0 ? 16 : 72}%`,
                  top: `${12 + index * 18}%`,
                }}
              >
                {label}
              </div>
            ))}

            <div className="relative">
              <div className="mx-auto mb-8 flex w-full max-w-[220px] flex-col items-center text-center">
                <div
                  className="grid h-[5.5rem] w-[5.5rem] place-items-center rounded-full border-[6px] text-lg font-bold shadow-[0_18px_35px_rgba(104,152,84,0.26)]"
                  style={{
                    borderColor: path.accent,
                    background: `radial-gradient(circle at top, #ffffff, ${path.accent}88)`,
                  }}
                >
                  GO
                </div>
                <div className="mt-3 rounded-full bg-[#f2f8eb] px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#628253]">
                  Start
                </div>
              </div>

              <div className="space-y-8 lg:space-y-2">
                {path.milestones.map((milestone, index) => {
                  const isActive = index === 0;
                  const isLocked = controls ? isMilestoneLocked(path.slug, milestone.slug, controls) : false;
                  const alignRight = index % 2 === 1;

                  return (
                    <div
                      key={milestone.slug}
                      className={`relative flex items-center ${
                        alignRight ? "lg:justify-end" : "lg:justify-start"
                      }`}
                    >
                      <div className="absolute left-1/2 top-1/2 hidden h-0.5 w-20 -translate-y-1/2 bg-[#dce8d7] lg:block" />

                      <div
                        className={`relative z-10 mx-auto flex w-full max-w-[540px] items-center gap-4 lg:mx-0 lg:w-[46%] ${
                          alignRight ? "lg:flex-row-reverse" : ""
                        }`}
                      >
                        <div className="relative flex shrink-0 flex-col items-center">
                          <button
                            type="button"
                            onClick={() => {
                              if (!isLocked) {
                                handleMilestoneClick(milestone.slug);
                              }
                            }}
                            className="grid h-20 w-20 place-items-center rounded-full border-[5px] text-lg font-bold transition hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-[#dcefd3]"
                            style={{
                              borderColor: isActive ? "#6ac85c" : isLocked ? "#d9ddd6" : path.accent,
                              background: isActive
                                ? "linear-gradient(180deg, #97eb78 0%, #5fcf55 100%)"
                                : isLocked
                                  ? "linear-gradient(180deg, #f2f2ef 0%, #dddeda 100%)"
                                  : `linear-gradient(180deg, #ffffff 0%, ${path.accent}bb 100%)`,
                              boxShadow: isActive
                                ? "0 18px 30px rgba(92, 196, 86, 0.28)"
                                : "0 12px 22px rgba(120, 137, 110, 0.16)",
                            }}
                            aria-label={`Open ${milestone.title}`}
                          >
                            <span aria-hidden="true">
                              {isLocked ? "LOCK" : nodeIcons[index % nodeIcons.length]}
                            </span>
                          </button>
                          <span className="mt-2 rounded-full bg-[#eef6e8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6e8963]">
                            {isActive ? "Current" : isLocked ? "Locked" : "Up next"}
                          </span>
                        </div>

                        <article
                          className="flex-1 cursor-pointer rounded-[1.7rem] border border-[#e2eadb] bg-[linear-gradient(180deg,#ffffff_0%,#f9fcf7_100%)] p-5 shadow-[0_18px_32px_rgba(115,136,107,0.1)] transition hover:-translate-y-1 hover:shadow-[0_24px_38px_rgba(115,136,107,0.14)]"
                          onClick={() => {
                            if (!isLocked) {
                              handleMilestoneClick(milestone.slug);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(event) => {
                            if ((event.key === "Enter" || event.key === " ") && !isLocked) {
                              event.preventDefault();
                              handleMilestoneClick(milestone.slug);
                            }
                          }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7d9574]">
                                Step {index + 1}
                              </div>
                              <h3 className="mt-2 text-xl font-semibold text-[#244029]">
                                {milestone.title}
                              </h3>
                            </div>
                            <div
                              className="rounded-full px-3 py-1 text-xs font-semibold"
                              style={{
                                backgroundColor: `${path.accent}2e`,
                                color: "#4f6b44",
                              }}
                            >
                              {milestone.duration}
                            </div>
                          </div>

                          <p className="mt-3 text-sm leading-6 text-[#637763]">{milestone.summary}</p>

                          <div className="mt-4 rounded-[1.2rem] bg-[#f4f8ef] px-4 py-3 text-sm text-[#3f5945]">
                            <span className="font-semibold">Activities:</span> {milestone.activity}
                          </div>

                          <div className="mt-4 text-sm font-semibold text-[#5b7652]">
                            {isLocked ? "Locked by teacher" : "Open milestone"}
                          </div>
                        </article>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mx-auto mt-10 flex w-full max-w-[220px] flex-col items-center text-center">
                <div className="grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full border-[5px] border-[#d3e2cc] bg-[linear-gradient(180deg,#ffffff_0%,#eef4ea_100%)] text-sm font-bold shadow-[0_14px_28px_rgba(120,137,110,0.14)]">
                  END
                </div>
                <div className="mt-3 rounded-full bg-[#f4f8ef] px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#69805f]">
                  Finish line
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
