"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2;

        if (next >= 100) {
          clearInterval(interval);
          router.push("/home");
          return 100;
        }

        return next;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="soft-card w-full max-w-md rounded-[2rem] p-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-[1.4rem] border border-[#f0cda9] bg-[#fff3e2] text-sm font-semibold uppercase tracking-[0.18em] text-[#8a4f21] shadow-sm">
          Eco
        </div>

        <h1 className="mt-4 text-2xl font-semibold text-[#2d241f]">LearnBee</h1>
        <p className="mt-2 text-sm text-[#6f6258]">Preparing your learning games...</p>

        <div className="mt-6 overflow-hidden rounded-full bg-[#efe3d3]">
          <div
            className="h-3 rounded-full bg-[linear-gradient(90deg,#d7863d_0%,#91c58d_100%)] transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-3 text-xs text-[#8d7f73]">{progress}%</p>

        <div className="mt-5 flex justify-center gap-3 text-sm font-medium text-[#7b6e63]">
          <span className="animate-bounce">Leaf</span>
          <span className="animate-bounce [animation-delay:120ms]">Water</span>
          <span className="animate-bounce [animation-delay:240ms]">Planet</span>
        </div>
      </div>
    </main>
  );
}
