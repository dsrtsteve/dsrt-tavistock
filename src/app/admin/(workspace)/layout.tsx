import Link from "next/link";
import { ArrowUpRight, LogOut, PenLine } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../actions";

export const metadata = {
  title: "Team workspace",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAdmin();
  return (
    <div className="admin-workspace">
      <div className="workspace-nav">
        <div className="site-container workspace-nav-inner">
          <Link href="/admin" className="workspace-brand">
            <PenLine size={20} /> Team workspace
          </Link>
          <div className="workspace-links">
            <Link href="/blog">
              View journal <ArrowUpRight size={14} />
            </Link>
            <span>{user.email}</span>
            <form action={logout}>
              <button>
                <LogOut size={16} /> Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="site-container admin-content">{children}</div>
    </div>
  );
}
