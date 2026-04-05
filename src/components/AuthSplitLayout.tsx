"use client";

import Link from "next/link";
import { ReactNode } from "react";

type AuthLink = {
  href: string;
  label: string;
};

type AuthSplitLayoutProps = {
  eyebrow: string;
  title: string;
  description: string;
  formTitle: string;
  formDescription: string;
  sideNote: string;
  accentLabel: string;
  footerLinks: AuthLink[];
  children: ReactNode;
};

export default function AuthSplitLayout({
  eyebrow,
  title,
  description,
  formTitle,
  formDescription,
  sideNote,
  accentLabel,
  footerLinks,
  children,
}: AuthSplitLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6efe6] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(248,180,88,0.28),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(20,83,45,0.18),_transparent_38%),linear-gradient(135deg,_#f8f1e8,_#efe4d3)]" />
      <div className="pointer-events-none absolute left-[-6rem] top-20 h-52 w-52 rounded-full bg-[#c96e2f]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-[-4rem] h-72 w-72 rounded-full bg-[#234b34]/15 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden rounded-[2.25rem] border border-[#3f2c1d]/10 bg-[#fbf7f1]/90 shadow-[0_30px_80px_rgba(63,44,29,0.18)] backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative flex flex-col justify-between overflow-hidden bg-[linear-gradient(160deg,#284f39_0%,#224530_38%,#d7863d_100%)] p-8 text-white sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.1),_transparent_26%)]" />
          <div className="pointer-events-none absolute -right-12 top-14 h-48 w-48 rounded-full border border-white/10 bg-white/10" />
          <div className="pointer-events-none absolute bottom-[-3rem] left-[-1rem] h-56 w-56 rounded-full border border-white/10 bg-white/10" />

          <div className="relative">
            <Link
              href="/role-selection"
              className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/15"
            >
              Back to roles
            </Link>

            <div className="mt-10 max-w-md">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/85">
                {eyebrow}
              </span>
              <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
                {title}
              </h1>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/82 sm:text-base">
                {description}
              </p>
            </div>
          </div>

          <div className="relative mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                Designed For
              </div>
              <p className="mt-3 text-lg font-medium text-white">
                Teachers and institutions leading climate learning.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-white/15 bg-[#f8e3c4] p-5 text-[#3f2c1d] shadow-lg">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a5a2b]">
                Quick Access
              </div>
              <p className="mt-3 text-lg font-medium">{accentLabel}</p>
              <p className="mt-2 text-sm leading-6 text-[#6b4b2c]">{sideNote}</p>
            </div>
          </div>
        </section>

        <section className="flex items-center bg-[#fbf7f1] p-5 sm:p-8 lg:p-10">
          <div className="w-full rounded-[2rem] border border-[#3f2c1d]/10 bg-white p-6 shadow-[0_18px_50px_rgba(63,44,29,0.08)] sm:p-8">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b66a2e]">
                {formTitle}
              </div>
              <h2 className="mt-3 text-3xl font-semibold text-[#2d241f]">
                {formDescription}
              </h2>
            </div>

            <div className="mt-8">{children}</div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-[#6f6258]">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-[#3f2c1d]/10 bg-[#f7f1e8] px-4 py-2 transition hover:border-[#b66a2e]/40 hover:text-[#8a4f21]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
