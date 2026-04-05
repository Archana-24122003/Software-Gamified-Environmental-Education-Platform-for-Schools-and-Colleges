"use client";

import { useEffect, useMemo, useState } from "react";

export default function ProgressBar({
  value,
  max,
}: {
  value: number;
  max: number;
}) {
  const targetPct = useMemo(() => {
    if (max <= 0) return 0;
    return Math.min(100, Math.round((value / max) * 100));
  }, [value, max]);

  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = pct;
    const end = targetPct;
    const duration = 600;
    const t0 = performance.now();

    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      const next = Math.round(start + (end - start) * eased);
      setPct(next);
      if (k < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pct, targetPct]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs font-medium text-[#7b6e63]">
        <span>XP</span>
        <span>
          {value}/{max} • {pct}%
        </span>
      </div>

      <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-[#efe3d3]">
        <div
          className="h-3 rounded-full bg-[linear-gradient(90deg,#d7863d_0%,#91c58d_100%)] transition-[width] duration-700 ease-out"
          style={{ width: `${targetPct}%` }}
        />
      </div>
    </div>
  );
}
