"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
        <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-[1.4rem] border border-[#f0cda9] bg-[#fff3e2] shadow-sm">
          <Image src="/learnbee-logo.svg" alt="LearnBee logo" fill className="object-cover p-1.5" />
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

        <div className="mt-5 flex justify-center gap-5 text-xl font-medium text-[#7b6e63]">
          <span className="animate-bounce">🧭</span>
          <span className="animate-bounce [animation-delay:120ms]">🚀</span>
          <span className="animate-bounce [animation-delay:240ms]">✏️</span>
        </div>
      </div>
    </main>
  );
}
