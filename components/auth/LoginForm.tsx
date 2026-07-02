"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import {
  isSupabaseInvalidApiKeyError,
  markSupabaseApiKeyInvalid,
} from "@/lib/supabase/config";

export function LoginForm() {
  const router = useRouter();
  const { signIn, signInWithGoogle, configured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!configured) {
      // Demo mode: Supabase isn't wired up yet, go straight to the app
      router.push("/workspace/demo");
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      router.push("/dashboard");
    } catch (err) {
      if (isSupabaseInvalidApiKeyError(err)) {
        markSupabaseApiKeyInvalid();
        router.push("/workspace/demo");
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    if (!configured) {
      router.push("/workspace/demo");
      return;
    }
    try {
      await signInWithGoogle();
    } catch (err) {
      if (isSupabaseInvalidApiKeyError(err)) {
        markSupabaseApiKeyInvalid();
        router.push("/workspace/demo");
        return;
      }
      setError(err instanceof Error ? err.message : "Google sign-in failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {!configured && (
        <p className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-text-secondary">
          Supabase isn&apos;t configured yet — running in demo mode. Any
          credentials will take you straight to the dashboard.
        </p>
      )}
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required={configured}
        autoComplete="email"
      />
      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="Your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required={configured}
        autoComplete="current-password"
      />
      {error && <p className="text-xs text-error">{error}</p>}
      <Button type="submit" loading={loading} className="mt-1 w-full">
        Log in
      </Button>
      <div className="relative my-1 text-center">
        <span className="relative z-10 bg-surface px-3 text-xs text-text-secondary">
          or
        </span>
        <div className="absolute left-0 top-1/2 h-px w-full bg-border" />
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogle}
      >
        <GoogleIcon />
        Continue with Google
      </Button>
      <p className="mt-2 text-center text-xs text-text-secondary">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}

export function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52Z"
      />
    </svg>
  );
}
