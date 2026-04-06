"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import AuthSplitLayout from "@/components/AuthSplitLayout";
import { signupDemo } from "@/lib/auth";

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupContent />
    </Suspense>
  );
}

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "teacher" ? "teacher" : "student";
  const showRoleToggle = initialRole !== "teacher";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [institutionCode, setInstitutionCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<"student" | "teacher">(initialRole);

  const copy = useMemo(() => {
    if (role === "teacher") {
      return {
        eyebrow: "Teacher Access",
        title: "Open your classroom hub with a clean, guided onboarding flow.",
        description:
          "Create your teacher account with your institution details, then use the same experience to log in later or recover access if you forget your password.",
        formTitle: "Create Account",
        formDescription: "Sign up to start your teacher workspace.",
        sideNote:
          "Already registered? Head to login. If access slips your mind later, the forgot password screen is linked there too.",
        accentLabel: "Teacher sign up, login, and recovery in one flow.",
      };
    }

      return {
        eyebrow: "Student Access",
        title: "Start learning through interactive subject games and eco-friendly challenges.",
        description:
          "Create a student account and continue into your gamified sustainability dashboard with the same polished auth experience.",
      formTitle: "Create Account",
      formDescription: "Sign up and start your student journey.",
      sideNote:
        "Student accounts stay lightweight, while teacher accounts also collect institution details for class management.",
      accentLabel: "Switch to teacher mode anytime from role selection.",
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
        { href: role === "teacher" ? "/login?role=teacher" : "/login", label: "Already signed up? Login" },
        { href: role === "teacher" ? "/forgot-password?role=teacher" : "/forgot-password", label: "Forgot password" },
      ]}
    >
      {showRoleToggle ? (
        <div className="mb-6 flex rounded-full border border-[#3f2c1d]/10 bg-[#f7f1e8] p-1">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`flex-1 rounded-full px-4 py-3 text-sm font-medium transition ${
              role === "student"
                ? "bg-[#244b35] text-white shadow-sm"
                : "text-[#6f6258] hover:text-[#2d241f]"
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole("teacher")}
            className={`flex-1 rounded-full px-4 py-3 text-sm font-medium transition ${
              role === "teacher"
                ? "bg-[#244b35] text-white shadow-sm"
                : "text-[#6f6258] hover:text-[#2d241f]"
            }`}
          >
            Teacher
          </button>
        </div>
      ) : null}

      {error ? (
        <div className="mb-5 rounded-[1.5rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4">
        <Field
          label="Full Name"
          placeholder="Enter your full name"
          value={name}
          onChange={setName}
        />
        <Field
          label="Email Address"
          placeholder="teacher@school.edu"
          type="email"
          value={email}
          onChange={setEmail}
        />

        {role === "teacher" ? (
          <>
            <Field
              label="Institution Name"
              placeholder="Green Valley School"
              value={institutionName}
              onChange={setInstitutionName}
            />
            <Field
              label="Institution Code"
              placeholder="ENV-2048"
              value={institutionCode}
              onChange={setInstitutionCode}
            />
          </>
        ) : null}

        <Field
          label="Password"
          placeholder="At least 6 characters"
          type="password"
          value={password}
          onChange={setPassword}
        />
      </div>

      <button
        type="button"
        onClick={() => {
          setError(null);
          const res = signupDemo({
            name,
            email,
            password,
            role,
            institutionName: role === "teacher" ? institutionName : undefined,
            institutionCode: role === "teacher" ? institutionCode : undefined,
          });
          if (!res.ok) {
            setError(res.error);
            return;
          }

          const loginParams = new URLSearchParams({
            role,
            message: res.message,
          });
          router.push(`/login?${loginParams.toString()}`);
        }}
        className="mt-7 w-full rounded-full bg-[#244b35] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#1d3c2b]"
      >
        Create account
      </button>

      <p className="mt-5 text-center text-sm text-[#6f6258]">
        Already have an account?{" "}
        <Link
          href={role === "teacher" ? "/login?role=teacher" : "/login"}
          className="font-semibold text-[#8a4f21] hover:text-[#6c3d18]"
        >
          Login
        </Link>
      </p>
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
