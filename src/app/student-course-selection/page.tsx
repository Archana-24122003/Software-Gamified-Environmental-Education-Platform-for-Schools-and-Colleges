"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDemoUser } from "@/lib/auth";
import { learningPaths } from "@/lib/learningPaths";
import { getTeacherControls, isSubjectLocked } from "@/lib/teacherControls";

export default function StudentCourseSelectionPage() {
  const router = useRouter();
  const [activeSubject, setActiveSubject] = useState<(typeof learningPaths)[number]["key"] | null>(null);
  const [controls, setControls] = useState(() => getTeacherControls());
  const user = typeof window === "undefined" ? null : getDemoUser();
  const canRender = user?.role === "student";

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
    }
  }, [router, user]);

  if (!canRender) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#fff8ef] text-[#5f5144]">
        Loading your learning space...
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fff8ef] px-4 py-10 text-[#3e3127] sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,194,137,0.45),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(160,224,184,0.4),_transparent_32%),linear-gradient(180deg,_#fff8ef_0%,_#fff2e7_100%)]" />
      <div className="pointer-events-none absolute left-[-3rem] top-24 h-40 w-40 rounded-full bg-[#ffd9af]/60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-[-2rem] h-44 w-44 rounded-full bg-[#c9efda]/70 blur-3xl" />

      <section className="relative mx-auto max-w-5xl rounded-[2.5rem] border border-[#d9bca2]/35 bg-white/70 p-6 shadow-[0_24px_70px_rgba(186,137,88,0.16)] backdrop-blur sm:p-8 lg:p-12">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-[#f0cda9] bg-[#fff3e2] px-5 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#b7763b]">
            Pick A Course
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-[#3d2d24] sm:text-5xl">
            What do you want to learn today?
          </h1>
          <p className="mt-4 text-base leading-7 text-[#6c5a4d] sm:text-lg">
            Choose a subject and step into a playful learning journey made to feel soft,
            bright, and welcoming for kids.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {learningPaths.map((subject) => {
            const locked = isSubjectLocked(subject.slug, controls);

            return (
              <button
                key={subject.key}
                type="button"
                disabled={locked}
                className={`subject-gooey-button group ${locked ? "cursor-not-allowed opacity-65" : ""}`}
                style={
                  {
                    "--subject-accent": subject.accent,
                    "--x": "50",
                    "--y": "50",
                  } as CSSProperties
                }
                onPointerMove={(event) => {
                  if (locked) {
                    return;
                  }

                  const rect = event.currentTarget.getBoundingClientRect();
                  const x = ((event.clientX - rect.left) / rect.width) * 100;
                  const y = ((event.clientY - rect.top) / rect.height) * 100;
                  event.currentTarget.style.setProperty("--x", `${x}`);
                  event.currentTarget.style.setProperty("--y", `${y}`);
                }}
                onPointerEnter={(event) => {
                  if (!locked) {
                    event.currentTarget.style.setProperty("--a", "100%");
                  }
                }}
                onPointerLeave={(event) => {
                  event.currentTarget.style.removeProperty("--a");
                }}
                onClick={() => {
                  if (locked) {
                    return;
                  }

                  setActiveSubject(subject.key);
                  localStorage.setItem("learnbee_subject", subject.label);
                  router.push(`/learning-path/${subject.slug}`);
                }}
              >
                <span className="subject-gooey-inner">
                  <span className="subject-gooey-label">{subject.label}</span>
                  <span className="subject-gooey-description">{subject.description}</span>
                  <span className="subject-gooey-cta">
                    {locked
                      ? "Locked by teacher"
                      : activeSubject === subject.key
                        ? "Opening..."
                        : "Start learning"}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true" focusable="false">
        <filter id="student-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </svg>
    </main>
  );
}
