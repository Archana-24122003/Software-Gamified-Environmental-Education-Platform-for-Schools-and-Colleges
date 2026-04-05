"use client";

import { Leaf, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AUTH_STATE_EVENT, DemoUser, getDashboardRoute, getDemoUser, logoutDemo } from "@/lib/auth";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        active
          ? "border border-[#d9bca2]/40 bg-[#fff3e2] text-[#8a4f21] shadow-sm"
          : "text-[#6f6258] hover:bg-white/60 hover:text-[#2d241f]"
      }`}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<DemoUser | null>(() =>
    typeof window === "undefined" ? null : getDemoUser(),
  );
  const [openExplore, setOpenExplore] = useState(false);
  const dashboardHref = getDashboardRoute(user?.role);
  const isTeacher = user?.role === "teacher";

  useEffect(() => {
    const syncUser = () => setUser(getDemoUser());

    syncUser();

    window.addEventListener(AUTH_STATE_EVENT, syncUser);
    window.addEventListener("storage", syncUser);

    function onDocClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-explore]")) {
        setOpenExplore(false);
      }
    }

    document.addEventListener("click", onDocClick);
    return () => {
      window.removeEventListener(AUTH_STATE_EVENT, syncUser);
      window.removeEventListener("storage", syncUser);
      document.removeEventListener("click", onDocClick);
    };
  }, []);

  return (
    <div className="sticky top-0 z-40 border-b border-[#3f2c1d]/8 bg-[linear-gradient(180deg,rgba(255,250,244,0.96),rgba(249,244,235,0.82))] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/home" className="group flex items-center gap-3">
          <div className="relative grid h-11 w-11 place-items-center rounded-[1.1rem] border border-[#d9bca2]/40 bg-[linear-gradient(180deg,#fff8ed_0%,#ffeccc_100%)] text-[#8a4f21] shadow-[0_10px_22px_rgba(122,88,55,0.09)]">
            <Leaf className="h-5 w-5" />
            <Sparkles className="absolute -right-1 -top-1 h-3.5 w-3.5 text-[#d7863d] opacity-75" />
          </div>
          <div className="leading-tight">
            <div className="font-semibold tracking-tight text-[#2d241f]">LearnBee</div>
            <div className="text-xs text-[#7b6e63]">Learn • Play • Grow</div>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <NavLink href="/home" label="Home" />
          <NavLink href={dashboardHref} label="Dashboard" />

          {!isTeacher && (
            <div className="relative" data-explore>
              <button
                type="button"
                onClick={() => setOpenExplore((value) => !value)}
                className="rounded-full px-4 py-2 text-sm font-medium text-[#6f6258] transition hover:bg-white/60 hover:text-[#2d241f]"
              >
                Explore ▾
              </button>

              {openExplore && (
                <div className="absolute left-0 mt-2 w-52 rounded-[1.5rem] border border-[#3f2c1d]/10 bg-[#fffaf4]/95 p-2 shadow-[0_18px_45px_rgba(122,88,55,0.12)] backdrop-blur">
                  <Link
                    href="/student-course-selection"
                    className="block rounded-xl px-3 py-2 text-sm text-[#5f5144] hover:bg-[#f7f1e8]"
                    onClick={() => setOpenExplore(false)}
                  >
                    Game Library
                  </Link>
                </div>
              )}
            </div>
          )}

          {!isTeacher && <NavLink href="/analytics" label="Analytics" />}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden text-sm text-[#6f6258] sm:inline">
                Hi, <span className="text-[#2d241f]">{user.name}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  logoutDemo();
                  setUser(null);
                  router.push("/home");
                }}
                className="soft-button-secondary rounded-full px-4 py-2 text-sm font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="soft-button-primary rounded-full px-4 py-2 text-sm font-semibold"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
