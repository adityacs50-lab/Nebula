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
import { GoogleIcon } from "./LoginForm";

export function SignupForm() {
  const router = useRouter();
  const { signUp, signInWithGoogle, configured } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function createFirstWorkspace(): Promise<string> {
    const res = await fetch("/api/workspace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name ? `${name.split(" ")[0]}'s Workspace` : "My Workspace",
      }),
    });
    const payload = (await res.json()) as {
      workspace?: { id: string };
      error?: string;
    };
    if (!res.ok || !payload.workspace) {
      throw new Error(payload.error ?? "Failed to create workspace");
    }
    return payload.workspace.id;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!agreed) {
      setError("Please agree to the Terms of Service to continue.");
      return;
    }
    setLoading(true);
    try {
      if (configured) {
        try {
          await signUp(name, email, password);
        } catch (err) {
          if (!isSupabaseInvalidApiKeyError(err)) {
            throw err;
          }
          markSupabaseApiKeyInvalid();
        }
      }
      // After signup → create first workspace → redirect to canvas
      const workspaceId = await createFirstWorkspace().catch(() => "demo");
      router.push(`/workspace/${workspaceId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign up");
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
      setError(err instanceof Error ? err.message : "Google sign-up failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {!configured && (
        <p className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-text-secondary">
          Supabase isn&apos;t configured yet — running in demo mode. Signing up
          will drop you straight onto a demo canvas.
        </p>
      )}
      <Input
        label="Name"
        name="name"
        type="text"
        placeholder="Ada Lovelace"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        autoComplete="name"
      />
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
        placeholder="At least 8 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required={configured}
        minLength={configured ? 8 : undefined}
        autoComplete="new-password"
      />
      <label className="flex cursor-pointer items-start gap-2.5 text-xs text-text-secondary">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-3.5 w-3.5 cursor-pointer rounded border-border bg-surface accent-[#7C3AED]"
        />
        <span>
          I agree to the{" "}
          <span className="text-primary">Terms of Service</span> and{" "}
          <span className="text-primary">Privacy Policy</span>
        </span>
      </label>
      {error && <p className="text-xs text-error">{error}</p>}
      <Button type="submit" loading={loading} className="mt-1 w-full">
        Create account
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
        Already have an account?{" "}
        <Link href="/auth/login" className="text-primary hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
