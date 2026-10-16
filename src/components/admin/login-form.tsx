"use client";
import { useActionState, useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { login } from "@/app/admin/actions";

export function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(login, {});
  const [visible, setVisible] = useState(false);
  return (
    <form action={action} className="admin-form">
      <label htmlFor="email">
        Email address
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="you@example.org"
          required
          disabled={!configured}
        />
      </label>
      <label htmlFor="password">Password</label>
      <div className="password-field">
        <input
          id="password"
          name="password"
          type={visible ? "text" : "password"}
          autoComplete="current-password"
          required
          disabled={!configured}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {state.error && (
        <p className="form-message form-error" role="alert">
          {state.error}
        </p>
      )}
      {!configured && (
        <p className="form-message form-error">
          Admin access will be available once Supabase is connected.
        </p>
      )}
      <button
        className="button button-red login-submit"
        disabled={pending || !configured}
      >
        {pending ? "Signing in…" : "Sign in to your workspace"}
        <ArrowRight size={17} />
      </button>
      <p className="login-note">
        <LockKeyhole size={14} /> Access is by invitation. Contact your team
        administrator for an account or a password reset.
      </p>
    </form>
  );
}
