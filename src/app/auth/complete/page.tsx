import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { SetPasswordForm } from "@/components/admin/set-password-form";

export const metadata = {
  title: "Set your password",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default function CompleteInvitePage() {
  return (
    <section className="admin-login site-container">
      <div className="login-story">
        <Image
          src="/images/team-training.webp"
          alt="Rescue volunteers planning a route on Dartmoor"
          fill
          loading="eager"
          sizes="(max-width: 767px) 100vw, 45vw"
        />
        <div className="login-story-overlay" />
        <div className="login-story-copy">
          <span className="eyebrow">TEAM WORKSPACE</span>
          <h2>One last step.</h2>
          <p>Choose a password to finish setting up your team account.</p>
        </div>
      </div>
      <div className="login-panel">
        <Link href="/admin/login" className="admin-back">
          <ArrowLeft size={16} /> Admin sign in
        </Link>
        <Image
          src="/images/dsrt-tavistock-official.png"
          alt="DSRT Tavistock official logo"
          width={69}
          height={80}
          className="login-logo"
        />
        <span className="eyebrow">ACCOUNT SETUP</span>
        <h1>Set your password.</h1>
        <p className="login-intro">
          Use at least 12 characters. You’ll use this password to sign in to the
          team workspace.
        </p>
        <SetPasswordForm />
        <div className="login-security">
          <ShieldCheck size={17} /> Secure admin access with Supabase
        </div>
      </div>
    </section>
  );
}
