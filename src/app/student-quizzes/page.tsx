"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlarmClockCheck,
  BadgeCheck,
  BookOpenText,
  BrainCircuit,
  Flower2,
  PartyPopper,
  Sparkles,
  Stars,
  Trophy,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getDemoUser } from "@/lib/auth";
import {
  QUIZZES_UPDATED_EVENT,
  calculateQuizScore,
  getAllQuizzes,
  getStudentAttemptForQuiz,
  saveStudentQuizAttempt,
  type Quiz,
} from "@/lib/quizStore";

type QuizMode = "list" | "playing" | "result";

export default function StudentQuizzesPage() {
  const router = useRouter();
  const user = typeof window === "undefined" ? null : getDemoUser();
  const canRender = user?.role === "student";
  const [mode, setMode] = useState<QuizMode>("list");
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>(() => getAllQuizzes());
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "student") {
      router.push("/teacher-dashboard");
    }
  }, [router, user]);

  useEffect(() => {
    const sync = () => setAllQuizzes(getAllQuizzes());
    sync();
    window.addEventListener(QUIZZES_UPDATED_EVENT, sync);
    return () => window.removeEventListener(QUIZZES_UPDATED_EVENT, sync);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const availableQuizzes = useMemo(() => {
    return allQuizzes.filter((quiz) => {
      const start = new Date(quiz.startAt).getTime();
      const end = new Date(quiz.endAt).getTime();
      return nowMs >= start && nowMs <= end;
    });
  }, [allQuizzes, nowMs]);

  const activeQuestion = activeQuiz?.questions[currentQuestionIndex] ?? null;

  const finishQuiz = useCallback(
    (finalAnswers: number[]) => {
      if (!activeQuiz) {
        return;
      }

      const nextResult = calculateQuizScore(activeQuiz, finalAnswers);
      setResult(nextResult);
      saveStudentQuizAttempt({
        quizId: activeQuiz.id,
        answers: finalAnswers,
        score: nextResult.score,
        total: nextResult.total,
        email: user?.email,
      });
      setMode("result");
    },
    [activeQuiz, user?.email],
  );

  const nextQuestion = useCallback(() => {
    if (!activeQuiz) {
      return;
    }

    if (currentQuestionIndex >= activeQuiz.questions.length - 1) {
      finishQuiz(answers);
      return;
    }

    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    setTimeLeft(activeQuiz.questions[nextIndex].timerSeconds);
  }, [activeQuiz, answers, currentQuestionIndex, finishQuiz]);

  useEffect(() => {
    if (mode !== "playing" || !activeQuiz) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          window.setTimeout(() => nextQuestion(), 0);
          return 0;
        }

        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [mode, activeQuiz, currentQuestionIndex, nextQuestion]);

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setAnswers(Array.from({ length: quiz.questions.length }, () => -1));
    setCurrentQuestionIndex(0);
    setTimeLeft(quiz.questions[0]?.timerSeconds ?? 30);
    setResult(null);
    setMode("playing");
  };

  if (!canRender) {
    return <main className="grid min-h-screen place-items-center text-[#7b6e63]">Loading quizzes...</main>;
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_14%,_rgba(255,199,138,0.52),_transparent_28%),radial-gradient(circle_at_88%_18%,_rgba(175,231,208,0.5),_transparent_30%),radial-gradient(circle_at_82%_85%,_rgba(255,237,177,0.5),_transparent_35%)]" />
      <PartyPopper className="animate-floaty pointer-events-none absolute left-[6%] top-[16%] h-9 w-9 text-[#da8b37]/70" />
      <Flower2 className="animate-drift pointer-events-none absolute left-[20%] top-[10%] h-8 w-8 text-[#3f8e66]/65" />
      <Stars className="animate-slowbounce pointer-events-none absolute right-[11%] top-[13%] h-8 w-8 text-[#e1963f]/65" />
      <Sparkles className="animate-floaty pointer-events-none absolute right-[14%] bottom-[15%] h-9 w-9 text-[#4d976e]/65" />
      <BrainCircuit className="animate-drift pointer-events-none absolute left-[13%] bottom-[16%] h-8 w-8 text-[#d38a34]/65" />

      <div className="relative mx-auto max-w-5xl">
        {mode === "list" ? (
          <section className="space-y-5">
            <header className="soft-card rounded-[2.4rem] p-7 sm:p-9">
              <span className="soft-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em]">
                <BookOpenText className="h-4 w-4" />
                Explore Quiz
              </span>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#2d241f] sm:text-4xl">
                Pick a quiz and start playing
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6f6258] sm:text-base">
                Quizzes appear only during their active time window. Each question has a timer, so answer before the clock runs out.
              </p>
            </header>

            <div className="grid gap-4 md:grid-cols-2">
              {availableQuizzes.length === 0 ? (
                <div className="soft-panel col-span-full rounded-[2rem] p-8 text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#fff3dd]">
                    <AlarmClockCheck className="h-7 w-7 text-[#ba6b31]" />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-[#2d241f]">No active quizzes right now</h2>
                  <p className="mt-2 text-sm text-[#6f6258]">
                    Check back later during the quiz schedule set by your teacher.
                  </p>
                </div>
              ) : (
                availableQuizzes.map((quiz) => {
                  const previousAttempt = getStudentAttemptForQuiz(quiz.id, user?.email);

                  return (
                    <article key={quiz.id} className="soft-panel rounded-[2rem] p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-2xl font-semibold tracking-tight text-[#2d241f]">{quiz.title}</h2>
                        <span className="rounded-full bg-[#eef8ef] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#3f7f5e]">
                          {quiz.questions.length} Qs
                        </span>
                      </div>
                      <div className="mt-3 text-sm text-[#6f6258]">
                        Open until {new Date(quiz.endAt).toLocaleString()}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#fff3e2] px-3 py-1 text-xs font-semibold text-[#8a4f21]">
                          {quiz.questions[0]?.timerSeconds ?? 30}s / question
                        </span>
                        {previousAttempt ? (
                          <span className="rounded-full bg-[#edf8ff] px-3 py-1 text-xs font-semibold text-[#2f6687]">
                            Last score: {previousAttempt.score}/{previousAttempt.total}
                          </span>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => startQuiz(quiz)}
                        className="mt-5 w-full rounded-2xl bg-[linear-gradient(180deg,#fdbe67_0%,#ef9f3a_100%)] px-5 py-3 text-base font-semibold text-[#4a2f1b] shadow-[0_14px_28px_rgba(216,134,48,0.28)] hover:translate-y-[-1px]"
                      >
                        Start Quiz
                      </button>
                    </article>
                  );
                })
              )}
            </div>
          </section>
        ) : null}

        {mode === "playing" && activeQuiz && activeQuestion ? (
          <section key={activeQuestion.id} className="animate-toast-in space-y-5">
            <header className="soft-card rounded-[2.3rem] p-6 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold text-[#2d241f]">{activeQuiz.title}</h2>
                <span className="rounded-full bg-[#fff4e0] px-4 py-1.5 text-sm font-semibold text-[#8a4f21]">
                  Question {currentQuestionIndex + 1}/{activeQuiz.questions.length}
                </span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="h-3 overflow-hidden rounded-full bg-[#f0e3d2]">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#79c49a_0%,#f1b35f_100%)] transition-all duration-500"
                    style={{
                      width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%`,
                    }}
                  />
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#ebf8f0] px-4 py-2 text-sm font-semibold text-[#2f6f52]">
                  <AlarmClockCheck className="h-4 w-4" />
                  {timeLeft}s left
                </div>
              </div>
            </header>

            <article className="soft-panel rounded-[2.3rem] p-6 sm:p-8">
              <h3 className="text-2xl font-semibold leading-tight text-[#2d241f]">{activeQuestion.text}</h3>

              <div className="mt-6 grid gap-3">
                {activeQuestion.options.map((option, optionIndex) => {
                  const selected = answers[currentQuestionIndex] === optionIndex;

                  return (
                    <button
                      key={`${activeQuestion.id}-opt-${optionIndex}`}
                      type="button"
                      onClick={() =>
                        setAnswers((current) => {
                          const next = [...current];
                          next[currentQuestionIndex] = optionIndex;
                          return next;
                        })
                      }
                      className={`w-full rounded-2xl border px-5 py-4 text-left text-base font-semibold transition ${
                        selected
                          ? "border-[#63b68a] bg-[#e8f9ef] text-[#23553d] shadow-[0_14px_24px_rgba(88,180,132,0.2)]"
                          : "border-[#e8d7c7] bg-white/95 text-[#4b3a2f] hover:bg-[#fff7ec]"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={nextQuestion}
                className="mt-6 w-full rounded-2xl bg-[linear-gradient(180deg,#7bc9a0_0%,#53a97e_100%)] px-6 py-4 text-lg font-semibold text-white shadow-[0_14px_26px_rgba(83,169,126,0.28)] hover:translate-y-[-1px]"
              >
                {currentQuestionIndex === activeQuiz.questions.length - 1 ? "Finish Quiz" : "Next Question"}
              </button>
            </article>
          </section>
        ) : null}

        {mode === "result" && activeQuiz && result ? (
          <section className="space-y-5">
            <header className="soft-card rounded-[2.3rem] p-7 text-center sm:p-9">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#fff3dd]">
                <Trophy className="h-8 w-8 text-[#c47a2f]" />
              </div>
              <h2 className="mt-4 text-3xl font-semibold text-[#2d241f]">Quiz Complete!</h2>
              <p className="mt-2 text-base text-[#6f6258]">Your score is</p>
              <div className="mt-3 text-5xl font-semibold tracking-tight text-[#2f7f5c]">
                {result.score}/{result.total}
              </div>
            </header>

            <section className="soft-panel rounded-[2.3rem] p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-[#2d241f]">Correct answers</h3>
              <div className="mt-4 space-y-3">
                {activeQuiz.questions.map((question, index) => {
                  const userAnswer = answers[index];
                  const isCorrect = userAnswer === question.correctOptionIndex;

                  return (
                    <article key={question.id} className="rounded-2xl border border-[#ead7c5] bg-white/95 p-4">
                      <div className="text-sm font-semibold text-[#8f715a]">Question {index + 1}</div>
                      <div className="mt-1 text-base font-semibold text-[#2d241f]">{question.text}</div>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                        <span className="rounded-full bg-[#eef8ef] px-3 py-1 text-[#2f6f52]">
                          Correct: {question.options[question.correctOptionIndex]}
                        </span>
                        <span className="rounded-full bg-[#fff3e2] px-3 py-1 text-[#8a4f21]">
                          Your answer: {userAnswer >= 0 ? question.options[userAnswer] : "No answer"}
                        </span>
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#ecf9f0] px-3 py-1 text-[#2c7a56]">
                            <BadgeCheck className="h-4 w-4" />
                            Correct
                          </span>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (activeQuiz) {
                      startQuiz(activeQuiz);
                    }
                  }}
                  className="rounded-full bg-[linear-gradient(180deg,#7bc9a0_0%,#53a97e_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(83,169,126,0.28)]"
                >
                  Play Again
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("list");
                    setActiveQuiz(null);
                    setResult(null);
                    setAnswers([]);
                    setCurrentQuestionIndex(0);
                  }}
                  className="rounded-full border border-[#d8b898] bg-[#fff4e4] px-5 py-3 text-sm font-semibold text-[#8a4f21]"
                >
                  Back To Quiz List
                </button>
              </div>
            </section>
          </section>
        ) : null}
      </div>
    </main>
  );
}
