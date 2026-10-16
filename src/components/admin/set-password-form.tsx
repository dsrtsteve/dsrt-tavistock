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
      setChecking(false);
      return;
    }
    const supabase = createBrowserClient(config.url, config.key);
    void (async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!user || userError) {
        setChecking(false);
        return;
      }
      const { data, error: adminError } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();
      setAuthorized(!!data && !adminError);
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
      This link is invalid or has expired. Please request a new password recovery email.
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
