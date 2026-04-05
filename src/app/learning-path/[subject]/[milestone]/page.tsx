"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BackButton from "@/components/learning/BackButton";
import GameButton from "@/components/learning/GameButton";
import { getDemoUser } from "@/lib/auth";
import { getLearningPath, getMilestone } from "@/lib/learningPaths";
import { getTeacherControls, isActivityLocked, isMilestoneLocked } from "@/lib/teacherControls";

export default function MilestoneDetailPage() {
  const params = useParams<{ subject: string; milestone: string }>();
  const router = useRouter();
  const path = getLearningPath(params.subject);
  const selectedMilestone = getMilestone(params.subject, params.milestone);
  const user = typeof window === "undefined" ? null : getDemoUser();
  const [controls, setControls] = useState(() => getTeacherControls());
  const milestoneLocked =
    path && selectedMilestone && controls
      ? isMilestoneLocked(path.slug, selectedMilestone.slug, controls)
      : false;

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

    if (!path || !selectedMilestone) {
      router.push("/student-course-selection");
      return;
    }

    if (milestoneLocked) {
      router.push(`/learning-path/${path.slug}`);
    }
  }, [milestoneLocked, path, router, selectedMilestone, user]);

  if (!path || !selectedMilestone || !user || user.role !== "student" || milestoneLocked) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f8fbf4] text-[#5f5144]">
        Loading milestone...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fbf4_0%,#eef6ea_100%)] px-4 py-10 text-[#223426] sm:px-6">
      <section className="mx-auto max-w-4xl rounded-[2rem] border border-[#d7e6d1] bg-white/90 p-6 shadow-[0_24px_60px_rgba(100,133,89,0.14)] backdrop-blur sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <BackButton label="Back" />
          <Link
            href={`/learning-path/${path.slug}`}
            className="inline-flex items-center justify-center rounded-full border border-[#d8e5d4] bg-[#f7fbf4] px-4 py-2 text-sm font-semibold text-[#45613f] transition hover:bg-white"
          >
            Back to learning path
          </Link>
        </div>

        <div
          className="mt-6 rounded-[1.8rem] p-6"
          style={{
            background: `linear-gradient(145deg, ${path.accent}33, #ffffff 70%)`,
          }}
        >
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#5a7651]">
            {path.label} milestone
          </div>
          <h1 className="mt-3 text-3xl font-semibold text-[#1f3425] sm:text-4xl">
            {selectedMilestone.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#58705e]">
            {selectedMilestone.summary}
          </p>
          <div className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-[#56704b] shadow-sm">
            {selectedMilestone.duration}
          </div>
        </div>

        <div className="mt-10 text-center">
          <h2 className="text-2xl font-semibold text-[#244029]">Choose an activity</h2>
          <p className="mt-2 text-sm leading-6 text-[#617662]">
            Locked activities stay unavailable until your teacher unlocks them again.
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-2xl gap-4">
          {selectedMilestone.activities.map((activity) => {
            const locked = controls
              ? isActivityLocked(path.slug, selectedMilestone.slug, activity.slug, controls)
              : false;

            return (
              <GameButton
                key={activity.slug}
                href={`/learning-path/${path.slug}/${selectedMilestone.slug}/${activity.slug}`}
                title={activity.title}
                disabled={locked}
                caption={locked ? "Locked by teacher" : "Ready to play"}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}
