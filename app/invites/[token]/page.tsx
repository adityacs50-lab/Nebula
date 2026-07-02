"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

export default function RedeemInvitePage({
  params,
}: {
  params: { token: string };
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function redeemInvite() {
      try {
        const response = await fetch(
          `/api/invites/redeem?token=${encodeURIComponent(params.token)}`
        );

        if (!response.ok) {
          const text = await response.text();
          setStatus("error");
          setMessage(text || "Failed to redeem invite");
          return;
        }

        setStatus("success");
        setMessage("Redirecting to workspace...");
        // The API route already redirects, but just in case:
        setTimeout(() => router.push("/dashboard"), 1500);
      } catch (err) {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Something went wrong");
      }
    }

    redeemInvite();
  }, [params.token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2 text-lg font-semibold">
          <Sparkles size={20} className="text-primary" />
          Nebula
        </div>
        <div className="rounded-xl border border-border bg-surface p-8 shadow-card text-center">
          {status === "loading" && (
            <>
              <div className="mb-4 flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
              <h1 className="text-lg font-semibold">Joining workspace...</h1>
              <p className="mt-2 text-sm text-text-secondary">
                Setting up your access
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-lg font-semibold">Welcome!</h1>
              <p className="mt-2 text-sm text-text-secondary">{message}</p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-error/10 p-3">
                  <svg
                    className="h-6 w-6 text-error"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-lg font-semibold">Invite invalid</h1>
              <p className="mt-2 text-sm text-text-secondary">{message}</p>
              <button
                onClick={() => router.push("/dashboard")}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
              >
                Back to dashboard
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
