"use client";

import { useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { supabaseConfig } from "@/lib/supabase/config";

export function AuthInviteCapture() {
  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const type = fragment.get("type");
    const accessToken = fragment.get("access_token");
    const refreshToken = fragment.get("refresh_token");
    // Supabase's implicit flow returns type in the fragment; PKCE returns a
    // one-time code in the query string. Handle both callback shapes.
    const query = new URLSearchParams(window.location.search);
    const hasAuthCode = query.has("code");
    const hasAuthError =
      query.has("error") || query.has("error_code") ||
      fragment.has("error") || fragment.has("error_code");
    const hasImplicitSession =
      (type === "invite" || type === "recovery") && !!accessToken && !!refreshToken;
    if (
      type !== "invite" && type !== "recovery" &&
      !hasAuthCode && !hasAuthError
    )
      return;

    const config = supabaseConfig();
    if (!config) return;

    let cancelled = false;
    const supabase = createBrowserClient(config.url, config.key);
    // createBrowserClient uses PKCE by default, while recovery links issued
    // directly from Supabase Auth can return an implicit token pair. Store
    // that verified session explicitly so the server can read its cookies.
    const sessionResult = hasImplicitSession
      ? supabase.auth.setSession({
          access_token: accessToken!,
          refresh_token: refreshToken!,
        })
      : supabase.auth.getSession();
    void sessionResult.then(({ data, error }) => {
      if (cancelled) return;
      window.history.replaceState(null, document.title, window.location.pathname);
      window.location.replace(
        hasAuthError || error || !data.session
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
