import Link from "next/link";
import Footer from "@/components/Footer";
import FloatingIcons from "@/components/FloatingIcons";

export default function HomePage() {
  return (
    <>
      <main className="px-4 py-10 sm:px-6">
        <section className="mx-auto max-w-6xl">
          <div className="soft-card relative overflow-hidden rounded-[2.7rem] px-8 py-10 sm:px-10 sm:py-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,204,143,0.34),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(160,224,184,0.26),_transparent_28%),linear-gradient(135deg,_rgba(255,251,245,0.98),_rgba(241,247,237,0.94))]" />
            <FloatingIcons dense />

            <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div className="max-w-3xl">
                <span className="soft-pill inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em]">
                  LearnBee playful learning world
                </span>

                <h1 className="mt-6 text-4xl font-semibold tracking-tight text-[#2d241f] md:text-6xl">
                  Turn learning into joyful little wins every day.
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-8 text-[#6c5a4d] sm:text-lg">
                  LearnBee helps children explore game-based lessons, collect progress, and build
                  confidence one friendly challenge at a time.
                </p>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-[#7b6e63] sm:text-base">
                  Turn learning into playful adventures where every small step unlocks a new idea,
                  a brighter badge, and a better path forward.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/role-selection"
                    className="soft-button-primary rounded-full px-6 py-3 text-sm font-semibold"
                  >
                    Start Playing
                  </Link>
                  <Link
                    href="/login"
                    className="soft-button-secondary rounded-full px-6 py-3 text-sm font-semibold"
                  >
                    Continue Learning
                  </Link>
                  <Link
                    href="/student-course-selection"
                    className="rounded-full border border-[#d9bca2]/35 bg-[#fff3e2] px-6 py-3 text-sm font-semibold text-[#8a4f21] shadow-sm hover:bg-[#ffe9cf]"
                  >
                    Explore Game Paths
                  </Link>
                </div>
              </div>

              <aside className="soft-panel relative rounded-[2rem] bg-[linear-gradient(180deg,#fffdf8_0%,#f5faef_100%)] p-7 sm:p-8">
                <div className="rounded-full bg-[#eef7ea] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#4c7a4d]">
                  Why kids enjoy it
                </div>
                <h2 className="mt-5 text-2xl font-semibold text-[#2d241f]">
                  Calm colors, clear goals, and games that feel safe to try.
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#6f6258]">
                  Children can focus on learning because the screens stay soft, readable, and full
                  of gentle encouragement instead of noisy distractions.
                </p>
                <div className="mt-6 grid gap-3">
                  <MiniNote title="Game-first lessons" desc="Short subject games keep attention steady." />
                  <MiniNote title="Friendly progress" desc="XP, streaks, and cards celebrate effort." />
                  <MiniNote title="Easy to follow" desc="Each screen guides the next small step." />
                </div>
              </aside>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <Stat value="10k+" label="Happy learners" />
            <Stat value="500+" label="Classrooms joined" />
            <Stat value="50+" label="Game pathways" />
            <Stat value="25+" label="Learning partners" />
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="soft-panel rounded-[2rem] bg-[linear-gradient(180deg,#fffdf9_0%,#f7fbf3_100%)] p-7 sm:p-8">
              <h2 className="text-2xl font-semibold text-[#2d241f] md:text-3xl">
                What children can do inside LearnBee
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6f6258] sm:text-base">
                Each activity is designed to feel playful, readable, and rewarding while still
                helping kids build real subject confidence.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <Feature
                  title="Play & Learn"
                  desc="Short game rounds turn maths, language, and EVS into easy daily practice."
                />
                <Feature
                  title="Track Progress"
                  desc="Children can see XP, scores, streaks, and learning growth without feeling pressure."
                />
                <Feature
                  title="Grow With Confidence"
                  desc="Every saved activity becomes a small success kids can build on tomorrow."
                />
              </div>
            </section>

            <aside className="soft-panel rounded-[2rem] bg-[linear-gradient(180deg,#fffaf4_0%,#eef7ea_100%)] p-7 sm:p-8">
              <div className="soft-pill inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em]">
                Learning promise
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-[#2d241f]">
                A softer kind of gamified learning.
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#6f6258]">
                LearnBee keeps the energy of a game platform while staying warm, gentle, and easy
                for children to understand from the very first click.
              </p>
              <div className="mt-6 rounded-[1.7rem] bg-[#fff8ef] p-5 text-sm leading-7 text-[#5f5144] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
                Turn lessons into playful journeys where children can explore, earn progress, and
                feel proud of each new thing they learn.
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="soft-panel rounded-[1.8rem] bg-[linear-gradient(180deg,#fffaf4_0%,#f5faef_100%)] p-5 text-center">
      <div className="text-3xl font-semibold tracking-tight text-[#244b35]">{value}</div>
      <div className="mt-2 text-sm text-[#6f6258]">{label}</div>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[1.7rem] border border-[#ead9c8] bg-[linear-gradient(180deg,#ffffff_0%,#fbf5ed_100%)] p-5 shadow-[0_14px_30px_rgba(122,88,55,0.08)]">
      <div className="rounded-full bg-[#fff3e2] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b46a33]">
        Playful step
      </div>
      <div className="mt-4 text-lg font-semibold text-[#2d241f]">{title}</div>
      <p className="mt-2 text-sm leading-6 text-[#6f6258]">{desc}</p>
    </div>
  );
}

function MiniNote({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[1.35rem] border border-[#e8dccd] bg-white/80 px-4 py-4">
      <div className="text-sm font-semibold text-[#2d241f]">{title}</div>
      <p className="mt-1 text-sm leading-6 text-[#6f6258]">{desc}</p>
    </div>
  );
}
