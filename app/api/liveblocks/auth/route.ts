import { Liveblocks } from "@liveblocks/node";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { colorForId } from "@/types/canvas";
import { isConfigured } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Liveblocks auth endpoint. Verifies the Supabase session and mints a
 * Liveblocks access token carrying the user's identity (name + cursor
 * color). Falls back to a guest identity when no session exists so the
 * canvas is usable before Supabase is wired up.
 */
export async function POST(req: Request): Promise<Response> {
  const secret = process.env.LIVEBLOCKS_SECRET_KEY;
  if (!isConfigured(secret)) {
    return NextResponse.json(
      {
        error:
          "LIVEBLOCKS_SECRET_KEY is not configured. Add it to .env.local — see README.md.",
      },
      { status: 503 },
    );
  }

  let room = "";
  try {
    const body = (await req.json()) as { room?: string };
    room = body.room ?? "";
  } catch {
    // Some Liveblocks client versions post form-encoded bodies; wildcard
    // access below covers that case.
  }

  // Verify the Supabase session (if Supabase is configured)
  let userId = `guest-${Math.random().toString(36).slice(2, 10)}`;
  let name = "Guest";
  let email = "";
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      userId = user.id;
      email = user.email ?? "";
      const meta = user.user_metadata as Record<string, unknown>;
      const fullName =
        typeof meta.full_name === "string" ? meta.full_name : undefined;
      name = fullName ?? email.split("@")[0] ?? "Teammate";
    }
  } catch {
    // Supabase not configured — continue as guest.
  }

  const liveblocks = new Liveblocks({ secret: secret! });
  const session = liveblocks.prepareSession(userId, {
    userInfo: {
      name,
      color: colorForId(userId),
      email,
    },
  });

  if (room) {
    session.allow(room, session.FULL_ACCESS);
  } else {
    session.allow("nebula-workspace-*", session.FULL_ACCESS);
  }

  const { status, body } = await session.authorize();
  return new Response(body, {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
