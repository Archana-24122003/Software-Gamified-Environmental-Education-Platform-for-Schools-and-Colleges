import { BookOpen, Globe2, Leaf, Sparkles, Star } from "lucide-react";

type FloatingIconsProps = {
  className?: string;
  dense?: boolean;
};

export default function FloatingIcons({
  className = "",
  dense = false,
}: FloatingIconsProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`.trim()}>
      <Leaf className="animate-floaty absolute left-8 top-10 h-5 w-5 text-[#86b88c]/35" />
      <Sparkles className="animate-drift absolute left-[16%] top-[20%] h-5 w-5 text-[#e2a964]/32" />
      <Star className="animate-slowbounce absolute right-[18%] top-12 h-5 w-5 text-[#f1c278]/34" />
      <BookOpen className="animate-floaty absolute right-10 top-[34%] h-5 w-5 text-[#9bbf9c]/28" />
      <Globe2 className="animate-drift absolute left-[12%] bottom-12 h-6 w-6 text-[#91c3b3]/28" />

      {dense ? (
        <>
          <Sparkles className="animate-slowbounce absolute left-[42%] top-[10%] h-4 w-4 text-[#f4c89d]/28" />
          <Leaf className="animate-drift absolute right-[32%] bottom-[18%] h-5 w-5 text-[#86b88c]/26" />
          <Star className="animate-floaty absolute right-14 bottom-12 h-4 w-4 text-[#efb36b]/28" />
        </>
      ) : null}
    </div>
  );
}
