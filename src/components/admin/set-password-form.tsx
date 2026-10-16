"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { setInitialPassword } from "@/app/auth/actions";

export function SetPasswordForm() {
  const [state, action, pending] = useActionState(setInitialPassword, {});

  return (
    <form action={action} className="admin-form">
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
      {state.error && (
        <p className="form-message form-error" role="alert">
          {state.error}
        </p>
      )}
      <button className="button button-red login-submit" disabled={pending}>
        {pending ? "Saving password…" : "Save password and continue"}
        <ArrowRight size={17} />
      </button>
    </form>
  );
}
