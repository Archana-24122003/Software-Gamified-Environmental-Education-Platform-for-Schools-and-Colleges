import {
  Sparkles,
  ShieldCheck,
  Leaf,
  Flame,
  Star,
  Gamepad2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type BadgeRarity = "common" | "rare" | "epic" | "legendary";

export type BadgeDef = {
  id: string;
  title: string;
  description: string;
  rarity: BadgeRarity;
  Icon: LucideIcon;
};

export const BADGES: BadgeDef[] = [
  {
    id: "starter",
    title: "Starter",
    description: "Complete your first activity.",
    rarity: "common",
    Icon: Leaf,
  },
  {
    id: "level_up",
    title: "Level Up",
    description: "Reach 100 XP.",
    rarity: "rare",
    Icon: Star,
  },
  {
    id: "activity_spark",
    title: "Activity Spark",
    description: "Complete 5 learning games.",
    rarity: "common",
    Icon: Gamepad2,
  },
  {
    id: "eco_warrior",
    title: "Eco Warrior",
    description: "Complete 10 activities.",
    rarity: "epic",
    Icon: ShieldCheck,
  },
  {
    id: "streak_fire",
    title: "Streak Fire",
    description: "Maintain a 7-day streak (coming next).",
    rarity: "legendary",
    Icon: Flame,
  },
  {
    id: "spark_impact",
    title: "Impact Spark",
    description: "Earn 300 XP.",
    rarity: "legendary",
    Icon: Sparkles,
  },
];

export function getBadgeDef(id: string) {
  return BADGES.find((b) => b.id === id);
}

export function rarityClasses(rarity: BadgeRarity) {
  switch (rarity) {
    case "common":
      return "border-white/10 bg-white/5 text-slate-200";
    case "rare":
      return "border-sky-400/20 bg-sky-500/10 text-sky-100";
    case "epic":
      return "border-fuchsia-400/20 bg-fuchsia-500/10 text-fuchsia-100";
    case "legendary":
      return "border-amber-400/25 bg-amber-500/10 text-amber-100";
  }
}
