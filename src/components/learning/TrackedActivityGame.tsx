"use client";

import { useState } from "react";
import ActivityGamePlayer from "@/components/learning/ActivityGamePlayer";
import { saveActivity, type ActivitySubject } from "@/lib/activityHistory";
import type { GameDefinition } from "@/lib/gameCatalog";

type TrackedActivityGameProps = {
  game: GameDefinition;
  subject: ActivitySubject;
  milestone: string;
  activity: string;
};

export default function TrackedActivityGame({
  game,
  subject,
  milestone,
  activity,
}: TrackedActivityGameProps) {
  const [saveMessage, setSaveMessage] = useState("Finish the game to save your score and XP.");

  return (
    <div className="space-y-4">
      <ActivityGamePlayer
        game={game}
        onGameComplete={({ score, xp }) => {
          saveActivity({
            subject,
            milestone,
            activity,
            score,
            xp,
            timestamp: Date.now(),
          });

          setSaveMessage(`Saved progress: ${score} score and ${xp} XP added to your dashboard.`);
        }}
      />

      <div className="rounded-2xl border border-[#d7e6d1] bg-white/80 px-4 py-3 text-sm text-[#55705a] shadow-sm">
        {saveMessage}
      </div>
    </div>
  );
}
