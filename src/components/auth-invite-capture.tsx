"use client";

import { useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { supabaseConfig } from "@/lib/supabase/config";

export function AuthInviteCapture() {
  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const type = fragment.get("type");
    if (type !== "invite" && type !== "recovery") return;

    const config = supabaseConfig();
    if (!config) return;

    let cancelled = false;
    const supabase = createBrowserClient(config.url, config.key);
    void supabase.auth.getSession().then(({ data, error }) => {
      if (cancelled) return;
      window.history.replaceState(null, document.title, window.location.pathname);
      window.location.replace(
        error || !data.session
          ? "/admin/login?invite=invalid"
          : "/auth/complete",
      );
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
