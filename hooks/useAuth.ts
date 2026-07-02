"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";

export type AuthState = {
  user: User | null;
  loading: boolean;
  configured: boolean;
};

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    configured: supabaseConfigured(),
  });

  useEffect(() => {
    if (!supabaseConfigured()) {
      setState({ user: null, loading: false, configured: false });
      return;
    }
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(({ data }) => {
        setState({ user: data.user, loading: false, configured: true });
      })
      .catch(() => {
        setState({ user: null, loading: false, configured: true });
      });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user ?? null,
        loading: false,
        configured: true,
      });
    });
    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) throw new Error(error.message);
    },
    [],
  );

  const signInWithGoogle = useCallback(async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin}/dashboard`,
      },
    });
    if (error) throw new Error(error.message);
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  }, []);

  return { ...state, signIn, signUp, signInWithGoogle, signOut };
}
