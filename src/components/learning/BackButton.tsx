"use client";

import { useRouter } from "next/navigation";

type BackButtonProps = {
  label?: string;
  className?: string;
};

export default function BackButton({
  label = "Back",
  className = "",
}: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={`inline-flex items-center justify-center rounded-full border border-[#d8e5d4] bg-white px-4 py-2 text-sm font-semibold text-[#45613f] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#f4fbf1] ${className}`.trim()}
    >
      {label}
    </button>
  );
}
