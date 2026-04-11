"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlarmClock,
  BookHeart,
  CircleHelp,
  Lightbulb,
  PartyPopper,
  PencilRuler,
  Sparkles,
  Stars,
  Trophy,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getDemoUser } from "@/lib/auth";
import { publishQuiz, type QuizQuestion } from "@/lib/quizStore";

type DraftQuestion = {
  id: string;
  text: string;
  options: [string, string, string, string];
  correctOptionIndex: number;
};

function createQuestionDraft(index = 1): DraftQuestion {
  return {
    id: `question-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`,
    text: "",
    options: ["", "", "", ""],
    correctOptionIndex: 0,
  };
}

function toDateTimeLocalValue(timestampMs: number) {
  const local = new Date(timestampMs - new Date().getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

export default function CreateQuizPage() {
  const router = useRouter();
  const user = typeof window === "undefined" ? null : getDemoUser();
  const canRender = user?.role === "teacher";
  const [title, setTitle] = useState("");
  const [timerPerQuestionSeconds, setTimerPerQuestionSeconds] = useState(30);
  const [startAt, setStartAt] = useState(() => toDateTimeLocalValue(Date.now() + 5 * 60 * 1000));
  const [endAt, setEndAt] = useState(() => toDateTimeLocalValue(Date.now() + 24 * 60 * 60 * 1000));
  const [questions, setQuestions] = useState<DraftQuestion[]>([createQuestionDraft()]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login?role=teacher");
      return;
    }

    if (user.role !== "teacher") {
      router.push("/student-dashboard");
    }
  }, [router, user]);

  const questionCountLabel = useMemo(() => {
    return `${questions.length} ${questions.length === 1 ? "question" : "questions"}`;
  }, [questions.length]);

  const updateQuestion = (questionId: string, updater: (question: DraftQuestion) => DraftQuestion) => {
    setQuestions((current) => current.map((question) => (question.id === questionId ? updater(question) : question)));
  };

  const validateForm = () => {
    if (!title.trim()) {
      return "Please add a quiz title.";
    }

    const start = new Date(startAt).getTime();
    const end = new Date(endAt).getTime();

    if (!Number.isFinite(start) || !Number.isFinite(end)) {
      return "Please enter a valid start and end date/time.";
    }

    if (end <= start) {
      return "End date/time must be later than start date/time.";
    }

    if (!Number.isFinite(timerPerQuestionSeconds) || timerPerQuestionSeconds < 5) {
      return "Timer per question should be at least 5 seconds.";
    }

    for (let index = 0; index < questions.length; index += 1) {
      const question = questions[index];
      if (!question.text.trim()) {
        return `Question ${index + 1} needs question text.`;
      }

      const missingOption = question.options.findIndex((option) => !option.trim());
      if (missingOption >= 0) {
        return `Question ${index + 1} has an empty option.`;
      }
    }

    return null;
  };

  const onPublish = () => {
    setError(null);
    setMessage(null);
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const preparedQuestions: QuizQuestion[] = questions.map((question) => ({
      id: question.id,
      text: question.text.trim(),
      options: question.options.map((option) => option.trim()) as [string, string, string, string],
      correctOptionIndex: question.correctOptionIndex,
      timerSeconds: timerPerQuestionSeconds,
    }));

    publishQuiz({
      title: title.trim(),
      startAt: new Date(startAt).toISOString(),
      endAt: new Date(endAt).toISOString(),
      questions: preparedQuestions,
    });

    setMessage("Quiz published successfully. Students can now see it in Explore > Quiz.");
    setTitle("");
    setTimerPerQuestionSeconds(30);
    setStartAt(toDateTimeLocalValue(Date.now() + 5 * 60 * 1000));
    setEndAt(toDateTimeLocalValue(Date.now() + 24 * 60 * 60 * 1000));
    setQuestions([createQuestionDraft()]);
  };

  if (!canRender) {
    return <main className="grid min-h-screen place-items-center text-[#7b6e63]">Loading quiz builder...</main>;
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,_rgba(255,187,127,0.5),_transparent_28%),radial-gradient(circle_at_85%_20%,_rgba(166,224,205,0.5),_transparent_30%),radial-gradient(circle_at_82%_83%,_rgba(255,231,169,0.48),_transparent_32%)]" />
      <PartyPopper className="animate-floaty pointer-events-none absolute left-[7%] top-[14%] h-8 w-8 text-[#da8b37]/70" />
      <Stars className="animate-drift pointer-events-none absolute left-[23%] top-[9%] h-7 w-7 text-[#d98029]/65" />
      <BookHeart className="animate-slowbounce pointer-events-none absolute right-[8%] top-[18%] h-8 w-8 text-[#4f8a67]/65" />
      <Lightbulb className="animate-floaty pointer-events-none absolute right-[14%] bottom-[14%] h-7 w-7 text-[#de9f45]/70" />
      <Sparkles className="animate-drift pointer-events-none absolute left-[14%] bottom-[18%] h-8 w-8 text-[#4d976e]/60" />

      <div className="relative mx-auto max-w-5xl space-y-6">
        <section className="soft-card rounded-[2.5rem] p-7 sm:p-9">
          <div className="flex flex-wrap items-center gap-3">
            <span className="soft-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em]">
              <PencilRuler className="h-4 w-4" />
              Teacher Creator Zone
            </span>
            <span className="rounded-full bg-[#f6f0e4]/95 px-3 py-1 text-xs font-semibold text-[#8b5a34]">
              {questionCountLabel}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#2d241f] sm:text-4xl">
            Create Quiz
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6f6258] sm:text-base">
            Build a playful quiz with multiple questions, a timer, and a publish window. Everything is saved to local demo storage for now.
          </p>
        </section>

        <section className="soft-panel rounded-[2rem] p-6 sm:p-7">
          <label className="text-sm font-semibold text-[#4c3b30]" htmlFor="quiz-title">
            Quiz title
          </label>
          <input
            id="quiz-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Example: Planet Protectors Challenge"
            className="mt-2 w-full rounded-2xl border border-[#d8c0a7] bg-white/95 px-4 py-3 text-sm text-[#2d241f] shadow-[0_10px_24px_rgba(122,88,55,0.08)] outline-none focus:border-[#c18a54] focus:ring-2 focus:ring-[#f3d1ab]"
          />

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <label className="rounded-2xl border border-[#e7d6c5] bg-[#fff9f2] p-4">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#4c3b30]">
                <AlarmClock className="h-4 w-4 text-[#ba6b31]" />
                Timer per question (seconds)
              </span>
              <input
                type="number"
                min={5}
                max={300}
                value={timerPerQuestionSeconds}
                onChange={(event) => setTimerPerQuestionSeconds(Number(event.target.value))}
                className="mt-2 w-full rounded-xl border border-[#dac2aa] bg-white px-3 py-2 text-sm outline-none focus:border-[#c18a54]"
              />
            </label>

            <label className="rounded-2xl border border-[#e7d6c5] bg-[#fff9f2] p-4">
              <span className="text-sm font-semibold text-[#4c3b30]">Start date & time</span>
              <input
                type="datetime-local"
                value={startAt}
                onChange={(event) => setStartAt(event.target.value)}
                className="mt-2 w-full rounded-xl border border-[#dac2aa] bg-white px-3 py-2 text-sm outline-none focus:border-[#c18a54]"
              />
            </label>

            <label className="rounded-2xl border border-[#e7d6c5] bg-[#fff9f2] p-4">
              <span className="text-sm font-semibold text-[#4c3b30]">End date & time</span>
              <input
                type="datetime-local"
                value={endAt}
                onChange={(event) => setEndAt(event.target.value)}
                className="mt-2 w-full rounded-xl border border-[#dac2aa] bg-white px-3 py-2 text-sm outline-none focus:border-[#c18a54]"
              />
            </label>
          </div>
        </section>

        <section className="space-y-4">
          {questions.map((question, index) => (
            <article key={question.id} className="soft-panel rounded-[2rem] p-6 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#fff1de] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#b16a35]">
                  <CircleHelp className="h-4 w-4" />
                  Question {index + 1}
                </div>
                {questions.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => setQuestions((current) => current.filter((item) => item.id !== question.id))}
                    className="rounded-full border border-[#dcb9a4] bg-white/90 px-4 py-2 text-sm font-semibold text-[#7d4b2a] hover:bg-[#ffeede]"
                  >
                    Remove
                  </button>
                ) : null}
              </div>

              <textarea
                value={question.text}
                onChange={(event) =>
                  updateQuestion(question.id, (value) => ({ ...value, text: event.target.value }))
                }
                placeholder="Type your question here..."
                rows={3}
                className="mt-4 w-full resize-none rounded-2xl border border-[#d8c0a7] bg-white/95 px-4 py-3 text-sm text-[#2d241f] outline-none focus:border-[#c18a54] focus:ring-2 focus:ring-[#f3d1ab]"
              />

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {question.options.map((option, optionIndex) => (
                  <label
                    key={`${question.id}-option-${optionIndex}`}
                    className="rounded-2xl border border-[#e8d8c8] bg-[#fffbf6] p-3"
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8f725d]">
                      Option {optionIndex + 1}
                    </span>
                    <input
                      value={option}
                      onChange={(event) =>
                        updateQuestion(question.id, (value) => {
                          const nextOptions = [...value.options] as DraftQuestion["options"];
                          nextOptions[optionIndex] = event.target.value;
                          return { ...value, options: nextOptions };
                        })
                      }
                      placeholder={`Answer option ${optionIndex + 1}`}
                      className="mt-2 w-full rounded-xl border border-[#d8c0a7] bg-white px-3 py-2 text-sm outline-none focus:border-[#c18a54]"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-4">
                <label className="text-sm font-semibold text-[#4c3b30]" htmlFor={`correct-${question.id}`}>
                  Correct answer
                </label>
                <select
                  id={`correct-${question.id}`}
                  value={question.correctOptionIndex}
                  onChange={(event) =>
                    updateQuestion(question.id, (value) => ({
                      ...value,
                      correctOptionIndex: Number(event.target.value),
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-[#d8c0a7] bg-white px-3 py-2 text-sm outline-none focus:border-[#c18a54] sm:w-72"
                >
                  <option value={0}>Option 1</option>
                  <option value={1}>Option 2</option>
                  <option value={2}>Option 3</option>
                  <option value={3}>Option 4</option>
                </select>
              </div>
            </article>
          ))}
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setQuestions((current) => [...current, createQuestionDraft(current.length + 1)])}
            className="rounded-full border border-[#d8b796] bg-[#fff4e3] px-5 py-3 text-sm font-semibold text-[#8a4f21] hover:bg-[#ffe8cb]"
          >
            + Add Another Question
          </button>

          <button
            type="button"
            onClick={onPublish}
            className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(180deg,#34966e_0%,#2d7d5d_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_28px_rgba(45,125,93,0.28)] hover:translate-y-[-1px]"
          >
            <Trophy className="h-4 w-4" />
            Publish Quiz
          </button>
        </div>

        {error ? (
          <div className="rounded-2xl border border-[#efc5bd] bg-[#fff1ed] px-4 py-3 text-sm font-medium text-[#9b3f2f]">
            {error}
          </div>
        ) : null}
        {message ? (
          <div className="rounded-2xl border border-[#b7ddc2] bg-[#eefaf1] px-4 py-3 text-sm font-medium text-[#2d7d5d]">
            {message}
          </div>
        ) : null}
      </div>
    </main>
  );
}
