"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import AuthSplitLayout from "@/components/AuthSplitLayout";
import { loginWithEmail } from "@/lib/auth";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") === "teacher" ? "teacher" : "student";
  const signupMessage = searchParams.get("message");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const copy = useMemo(() => {
    if (role === "teacher") {
      return {
        eyebrow: "Teacher Login",
        title: "Return to your teaching dashboard with a focused, calm sign-in space.",
        description:
          "Teachers can log back in here, move to account creation if needed, or jump to password recovery from the same connected flow.",
        formTitle: "Welcome Back",
        formDescription: "Log in to continue managing your classes.",
        sideNote:
          "Use the same email and password you created during signup. Recovery stays one click away.",
        accentLabel: "Built for repeated teacher access after signup.",
      };
    }

    return {
      eyebrow: "Student Login",
      title: "Jump back into your learning games and keep your sustainability streak alive.",
      description:
        "Students can sign in quickly, recover their password, or create an account from this shared auth experience.",
      formTitle: "Welcome Back",
      formDescription: "Log in and continue your learning progress.",
      sideNote:
        "If you're a teacher instead, switch back to role selection and use the teacher onboarding flow.",
      accentLabel: "A matching login page for the same visual system.",
    };
  }, [role]);

  return (
    <AuthSplitLayout
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      formTitle={copy.formTitle}
      formDescription={copy.formDescription}
      sideNote={copy.sideNote}
      accentLabel={copy.accentLabel}
      footerLinks={[
        { href: role === "teacher" ? "/signup?role=teacher" : "/signup", label: "Create account" },
        { href: role === "teacher" ? "/forgot-password?role=teacher" : "/forgot-password", label: "Forgot password" },
      ]}
    >
      {signupMessage ? (
        <div className="mb-5 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {signupMessage}
        </div>
      ) : null}

      {error ? (
        <div className="mb-5 rounded-[1.5rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4">
        <Field
          label="Email Address"
          placeholder={role === "teacher" ? "teacher@school.edu" : "student@email.com"}
          type="email"
          value={email}
          onChange={setEmail}
        />
        <Field
          label="Password"
          placeholder="Enter your password"
          type="password"
          value={password}
          onChange={setPassword}
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <Link
          href={role === "teacher" ? "/forgot-password?role=teacher" : "/forgot-password"}
          className="font-medium text-[#8a4f21] hover:text-[#6c3d18]"
        >
          Forgot password?
        </Link>
        <Link
          href={role === "teacher" ? "/signup?role=teacher" : "/signup"}
          className="text-[#6f6258] hover:text-[#2d241f]"
        >
          Need an account?
        </Link>
      </div>

      <button
        type="button"
        onClick={() => {
          setError(null);
          const res = loginWithEmail({ email, password, role });
          if (!res.ok) {
            setError(res.error);
            return;
          }
          router.push(res.role === "teacher" ? "/teacher-dashboard" : "/student-course-selection");
        }}
        className="mt-7 w-full rounded-full bg-[#244b35] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#1d3c2b]"
      >
        Login
      </button>
    </AuthSplitLayout>
  );
}

type FieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
};

function Field({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#4f4137]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[1.25rem] border border-[#3f2c1d]/12 bg-[#fcfaf7] px-4 py-4 text-sm text-[#2d241f] outline-none transition placeholder:text-[#a4988d] focus:border-[#b66a2e] focus:ring-4 focus:ring-[#d7863d]/15"
      />
    </label>
  );
}
