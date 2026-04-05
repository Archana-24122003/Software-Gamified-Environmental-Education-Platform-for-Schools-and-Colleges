"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BackButton from "@/components/learning/BackButton";
import TrackedActivityGame from "@/components/learning/TrackedActivityGame";
import { getDemoUser } from "@/lib/auth";
import { getGameDefinition } from "@/lib/gameCatalog";
import { getLearningPath, getMilestone, getMilestoneGame } from "@/lib/learningPaths";
import { getTeacherControls, isActivityLocked } from "@/lib/teacherControls";

export default function GamePage() {
  const params = useParams<{ subject: string; milestone: string; game: string }>();
  const router = useRouter();
  const path = getLearningPath(params.subject);
  const selectedMilestone = getMilestone(params.subject, params.milestone);
  const selectedGame = getMilestoneGame(params.subject, params.milestone, params.game);
  const gameDefinition = getGameDefinition(params.game);
  const user = typeof window === "undefined" ? null : getDemoUser();
  const [controls, setControls] = useState(() => getTeacherControls());
  const locked =
    path && selectedMilestone && selectedGame && controls
      ? isActivityLocked(path.slug, selectedMilestone.slug, selectedGame.slug, controls)
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

    if (!path || !selectedMilestone || !selectedGame || !gameDefinition) {
      router.push("/student-course-selection");
      return;
    }

    if (locked) {
      router.push(`/learning-path/${path.slug}/${selectedMilestone.slug}`);
    }
  }, [gameDefinition, locked, path, router, selectedGame, selectedMilestone, user]);

  if (!path || !selectedMilestone || !selectedGame || !gameDefinition || !user || user.role !== "student") {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7fbf5] text-[#5f5144]">
        Loading activity...
      </main>
    );
  }

  if (locked) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7fbf5] px-4 text-[#28412e]">
        <section className="max-w-xl rounded-[2rem] border border-[#d7e6d1] bg-white/90 p-8 text-center shadow-[0_24px_60px_rgba(100,133,89,0.14)]">
          <h1 className="text-3xl font-semibold">Activity locked</h1>
          <p className="mt-3 text-sm leading-7 text-[#617662]">
            Your teacher has locked this activity for now. Please go back and try another unlocked
            game.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7fbf5_0%,#e7f3e5_100%)] px-4 py-10 text-[#223426] sm:px-6">
      <section className="mx-auto max-w-6xl rounded-[2rem] border border-[#d7e6d1] bg-white/90 p-6 shadow-[0_24px_60px_rgba(100,133,89,0.14)] backdrop-blur sm:p-8">
        <div className="flex justify-start">
          <BackButton label="Back" />
        </div>

        <div
          className="mt-6 rounded-[1.8rem] p-6 text-center"
          style={{
            background: `linear-gradient(145deg, ${path.accent}33, #ffffff 72%)`,
          }}
        >
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#5a7651]">
            {path.label} game
          </div>
          <h1 className="mt-3 text-3xl font-semibold text-[#1f3425] sm:text-4xl">
            {selectedGame.title}
          </h1>
          <p className="mt-3 text-sm font-medium text-[#5f745d]">From: {selectedMilestone.title}</p>
        </div>

        <div className="mt-10">
          <TrackedActivityGame
            game={gameDefinition}
            subject={path.slug}
            milestone={selectedMilestone.slug}
            activity={selectedGame.slug}
          />
        </div>
      </section>
    </main>
  );
}
