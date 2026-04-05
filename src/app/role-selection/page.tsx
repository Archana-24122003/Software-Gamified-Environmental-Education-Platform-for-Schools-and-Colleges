import Link from "next/link";

const roleOptions = [
  {
    href: "/signup?role=teacher",
    label: "Teacher",
    description: "Create your teacher account and manage classes with the same calm soft-ui flow.",
    accent: "For guides and mentors",
  },
  {
    href: "/login",
    label: "Student",
    description: "Jump into playful subject games and guided learning with a student-friendly path.",
    accent: "For young eco explorers",
  },
];

export default function RoleSelectionPage() {
  return (
    <main className="px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center justify-center">
        <section className="soft-card w-full rounded-[2.4rem] p-6 sm:p-8 md:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <span className="soft-pill inline-flex rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em]">
              Role Selection
            </span>

            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-[#2d241f] sm:text-4xl md:text-5xl">
              Choose the path that fits you.
            </h1>

            <p className="mt-4 text-sm leading-7 text-[#6f6258] sm:text-base">
              The whole experience now keeps the same soft, welcoming look, so students and
              teachers both enter through a friendly first step.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {roleOptions.map((role) => (
              <Link
                key={role.href}
                href={role.href}
                className="group rounded-[2rem] border border-[#e6d4c1] bg-[linear-gradient(180deg,#ffffff_0%,#fbf4ea_100%)] p-6 shadow-[0_18px_40px_rgba(122,88,55,0.09)] transition duration-200 hover:-translate-y-1 hover:border-[#d9bca2] hover:shadow-[0_24px_44px_rgba(122,88,55,0.14)] focus:outline-none focus:ring-2 focus:ring-[#d7863d]/40 sm:p-8"
              >
                <div className="inline-flex rounded-full bg-[#eef7ea] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#4c7a4d]">
                  {role.accent}
                </div>
                <div className="mt-5 text-2xl font-semibold text-[#2d241f] sm:text-3xl">
                  {role.label}
                </div>
                <p className="mt-3 max-w-sm text-sm leading-7 text-[#6f6258] sm:text-base">
                  {role.description}
                </p>
                <div className="mt-6 text-sm font-semibold text-[#8a4f21] transition group-hover:text-[#6c3d18]">
                  Continue
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
