import Link from "next/link";

type GameButtonProps = {
  href: string;
  title: string;
  disabled?: boolean;
  caption?: string;
};

export default function GameButton({ href, title, disabled = false, caption }: GameButtonProps) {
  const classes = disabled
    ? "flex min-h-16 items-center justify-center rounded-2xl border border-[#e2dfd5] bg-[linear-gradient(135deg,#faf8f2_0%,#efede6_100%)] px-6 py-4 text-center text-base font-semibold text-[#82786d]"
    : "flex min-h-16 items-center justify-center rounded-2xl border border-[#d5e4cf] bg-[linear-gradient(135deg,#f9fff5_0%,#eaf8e2_100%)] px-6 py-4 text-center text-base font-semibold text-[#28472f] shadow-[0_14px_28px_rgba(91,128,74,0.12)] transition duration-200 hover:-translate-y-1 hover:border-[#a6d690] hover:shadow-[0_18px_36px_rgba(91,128,74,0.18)]";

  return (
    <Link
      href={disabled ? "#" : href}
      aria-disabled={disabled}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
        }
      }}
      className={classes}
    >
      <span>
        <span className="block">{title}</span>
        {caption ? <span className="mt-1 block text-xs font-medium">{caption}</span> : null}
      </span>
    </Link>
  );
}
