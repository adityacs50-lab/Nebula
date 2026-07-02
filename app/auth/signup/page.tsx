import Link from "next/link";
import { Sparkles } from "lucide-react";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = {
  title: "Sign up — Nebula",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 text-lg font-semibold"
        >
          <Sparkles size={20} className="text-primary" />
          Nebula
        </Link>
        <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
          <h1 className="mb-1 text-xl font-semibold">Create your workspace</h1>
          <p className="mb-6 text-sm text-text-secondary">
            Get your founding team on one shared AI canvas.
          </p>
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
