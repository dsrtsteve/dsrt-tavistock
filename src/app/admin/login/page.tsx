import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getAdmin } from "@/lib/auth";
import { supabaseConfig } from "@/lib/supabase/config";

export const metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");
  return (
    <section className="admin-login site-container">
      <div className="login-story">
        <Image
          src="/images/team-training.webp"
          alt="AI illustration of rescue volunteers planning a route on Dartmoor"
          fill
          loading="eager"
          sizes="(max-width: 767px) 100vw, 45vw"
        />
        <div className="login-story-overlay" />
        <div className="login-story-copy">
          <span className="eyebrow">THE PEOPLE BEHIND THE STORIES</span>
          <h2>
            Every call.
            <br />A story worth
            <br />
            sharing.
          </h2>
          <p>
            Your space to share the rescues, training and community that keep
            our team moving.
          </p>
        </div>
        <span className="login-image-caption">AI-generated illustration</span>
      </div>
      <div className="login-panel">
        <Link href="/blog" className="admin-back">
          <ArrowLeft size={16} /> Back to the journal
        </Link>
        <Image
          src="/images/dsrt-tavistock-official.png"
          alt="DSRT Tavistock official logo"
          width={69}
          height={80}
          className="login-logo"
        />
        <span className="eyebrow">TEAM WORKSPACE</span>
        <h1>Welcome back.</h1>
        <p className="login-intro">
          Sign in to write and publish your team’s stories.
        </p>
        <LoginForm configured={!!supabaseConfig()} />
        <div className="login-security">
          <ShieldCheck size={17} /> Secure admin access with Supabase
        </div>
      </div>
    </section>
  );
}
