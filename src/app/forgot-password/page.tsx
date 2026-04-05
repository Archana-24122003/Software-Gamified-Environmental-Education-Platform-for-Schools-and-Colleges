"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import AuthSplitLayout from "@/components/AuthSplitLayout";
import { resetPassword } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") === "teacher" ? "teacher" : "student";

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const copy = useMemo(() => {
    if (role === "teacher") {
      return {
        eyebrow: "Teacher Recovery",
        title: "Recover your account without leaving the same polished teacher access flow.",
        description:
          "If a teacher forgets their password, this page lets them reset it and jump back to login with the same warm, card-based layout.",
        formTitle: "Reset Password",
        formDescription: "Create a new password for your teacher account.",
        sideNote:
          "After the reset succeeds, the page sends you back to teacher login automatically.",
        accentLabel: "Password recovery is built into the teacher auth path.",
      };
    }

    return {
      eyebrow: "Student Recovery",
      title: "Reset your password and get back to learning with minimal friction.",
      description:
        "Students can update their password here and return to login right after, while keeping the same design language as the other auth pages.",
      formTitle: "Reset Password",
      formDescription: "Choose a fresh password for your student account.",
      sideNote:
        "The reset works with the same local demo account system used by signup and login.",
      accentLabel: "Same visual system, dedicated recovery screen.",
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
        { href: role === "teacher" ? "/login?role=teacher" : "/login", label: "Back to login" },
        { href: role === "teacher" ? "/signup?role=teacher" : "/signup", label: "Create account" },
      ]}
    >
      {error ? (
        <div className="mb-5 rounded-[1.5rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mb-5 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
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
          label="New Password"
          placeholder="At least 6 characters"
          type="password"
          value={newPassword}
          onChange={setNewPassword}
        />
      </div>

      <div className="mt-4 text-sm text-[#6f6258]">
        Remembered it?{" "}
        <Link
          href={role === "teacher" ? "/login?role=teacher" : "/login"}
          className="font-medium text-[#8a4f21] hover:text-[#6c3d18]"
        >
          Back to login
        </Link>
      </div>

      <button
        type="button"
        onClick={() => {
          setError(null);
          setSuccess(null);

          const res = resetPassword({ email, newPassword, role });
          if (!res.ok) {
            setError(res.error);
            return;
          }

          setSuccess("Password changed successfully. Redirecting to login...");
          setTimeout(() => {
            router.push(role === "teacher" ? "/login?role=teacher" : "/login");
          }, 1200);
        }}
        className="mt-7 w-full rounded-full bg-[#244b35] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#1d3c2b]"
      >
        Update password
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
