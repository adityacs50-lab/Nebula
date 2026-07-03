import Link from "next/link";
import { Sparkles } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Log in — Nebula",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirect_to?: string };
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 text-lg font-semibold"
        >
          <Sparkles size={20} className="text-primary" />
          Nebula
        </Link>
        <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
          <h1 className="mb-1 text-xl font-semibold">Welcome back</h1>
          <p className="mb-6 text-sm text-text-secondary">
            Log in to your team&apos;s shared AI workspace.
          </p>
          <LoginForm redirectTo={searchParams.redirect_to} />
        </div>
      </div>
    </div>
  );
}
