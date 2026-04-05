export default function StatsCard({
  title,
  value,
  sub,
  tone = "green",
}: {
  title: string;
  value: string;
  sub?: string;
  tone?: "green" | "orange" | "cream";
}) {
  const accentStyles =
    tone === "orange"
      ? {
          badge: "bg-[#fff1de] text-[#b46a33]",
          panel: "bg-[linear-gradient(180deg,#fff7ec_0%,#fff1de_100%)]",
        }
      : tone === "cream"
        ? {
            badge: "bg-[#f7efe4] text-[#7b6e63]",
            panel: "bg-[linear-gradient(180deg,#fffaf4_0%,#f7efe4_100%)]",
          }
        : {
            badge: "bg-[#eef7ea] text-[#4c7a4d]",
            panel: "bg-[linear-gradient(180deg,#f8fcf5_0%,#eef7ea_100%)]",
          };

  return (
    <div className={`soft-panel rounded-[1.75rem] p-5 ${accentStyles.panel}`}>
      <div className="flex items-start justify-between gap-3">
        <div className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${accentStyles.badge}`}>
          LearnBee
        </div>
        <div className="h-2.5 w-2.5 rounded-full bg-[#d7863d]/55" />
      </div>
      <div className="mt-4 text-sm font-medium text-[#7b6e63]">{title}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-[#2d241f]">{value}</div>
      {sub ? <div className="mt-2 text-xs leading-5 text-[#9b8d81]">{sub}</div> : null}
    </div>
  );
}
