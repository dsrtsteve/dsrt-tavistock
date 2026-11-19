"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { ArrowRight } from "lucide-react";
import { supabaseConfig } from "@/lib/supabase/config";

export function SetPasswordForm() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const config = supabaseConfig();
    if (!config) {
      setError("Account setup is unavailable. Please try again later.");
      setChecking(false);
      return;
    }

    // Handle the callback explicitly so the invitation token is exchanged
    // before getUser() checks the session. The default URL detector is
    // disabled to avoid racing this exchange.
    const supabase = createBrowserClient(config.url, config.key, {
      auth: { detectSessionInUrl: false },
    });

    void (async () => {
      const url = new URL(window.location.href);
      const hash = new URLSearchParams(url.hash.replace(/^#/, ""));
      const callbackError =
        url.searchParams.get("error_description") ??
        url.searchParams.get("error") ??
        hash.get("error_description") ??
        hash.get("error");

      if (callbackError) {
        setError(
          "This invitation link could not be verified. Please ask your team administrator to send a new invitation.",
        );
        setChecking(false);
        return;
      }

      let callbackHandled = false;
      let callbackErrorMessage = "";

      const code = url.searchParams.get("code");
      const tokenHash = url.searchParams.get("token_hash");
      const rawType = url.searchParams.get("type");
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");

      if (code) {
        callbackHandled = true;
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);
        callbackErrorMessage = exchangeError?.message ?? "";
      } else if (tokenHash) {
        callbackHandled = true;
        const allowedTypes = [
          "invite",
          "recovery",
          "signup",
          "magiclink",
          "email_change",
          "email",
        ] as const;
        const type = allowedTypes.includes(rawType as (typeof allowedTypes)[number])
          ? (rawType as (typeof allowedTypes)[number])
          : "invite";
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type,
        });
        callbackErrorMessage = verifyError?.message ?? "";
      } else if (accessToken && refreshToken) {
        callbackHandled = true;
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        callbackErrorMessage = sessionError?.message ?? "";
      }

      if (callbackErrorMessage) {
        setError(
          "This invitation link is invalid or has expired. Please ask your team administrator to send a new invitation.",
        );
        setChecking(false);
        return;
      }

      if (callbackHandled) {
        // Remove one-time credentials from the address bar after exchanging
        // them successfully; the session is now stored by Supabase.
        window.history.replaceState({}, document.title, url.pathname);
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!user || userError) {
        setError(
          "This invitation link is invalid or has expired. Please ask your team administrator to send a new invitation.",
        );
        setChecking(false);
        return;
      }

      const { data, error: adminError } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      setAuthorized(!!data && !adminError);
      if (!data || adminError) {
        setError(
          "Your account has been verified, but it does not have administrator access. Please contact your team administrator.",
        );
      }
      setChecking(false);
    })();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmation = String(form.get("confirmation") ?? "");
    if (password.length < 12 || password.length > 1000) {
      setError("Use a password with at least 12 characters.");
      return;
    }
    if (password !== confirmation) {
      setError("The passwords do not match.");
      return;
    }
    const config = supabaseConfig();
    if (!config) {
      setError("Account setup is unavailable. Please try again later.");
      return;
    }
    setPending(true);
    const supabase = createBrowserClient(config.url, config.key);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError("The password could not be saved. Please request a new password recovery email.");
      setPending(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  if (checking) return <p className="form-message">Checking your secure account link…</p>;
  if (!authorized) return (
    <p className="form-message form-error" role="alert">
      {error || "This link is invalid or has expired. Please request a new password recovery email."}
    </p>
  );

  return (
    <form onSubmit={submit} className="admin-form">
      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={12}
        maxLength={1000}
        required
      />
      <label htmlFor="confirmation">Confirm password</label>
      <input
        id="confirmation"
        name="confirmation"
        type="password"
        autoComplete="new-password"
        minLength={12}
        maxLength={1000}
        required
      />
      {error && (
        <p className="form-message form-error" role="alert">
          {error}
        </p>
      )}
      <button className="button button-red login-submit" disabled={pending}>
        {pending ? "Saving password…" : "Save password and continue"}
        <ArrowRight size={17} />
      </button>
    </form>
  );
}
