import { Users, UserPlus } from "lucide-react";
import { UsersAdminTable } from "@/components/admin/users-admin-table";
import { SupabaseUsersRepository } from "@/lib/admin-users/supabase-users-repository";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const admin = await requireAdmin();
  const repository = new SupabaseUsersRepository(admin.supabase);
  let users;
  try {
    users = await repository.listUsers();
  } catch {
    return (
      <section className="users-page">
        <span className="eyebrow">TEAM WORKSPACE</span>
        <h1>Users</h1>
        <div className="users-load-error" role="alert">Users could not be loaded. Please check the database setup and try again.</div>
      </section>
    );
  }

  return (
    <section className="users-page">
      <div className="users-page-heading">
        <div><span className="eyebrow">TEAM WORKSPACE</span><h1>Users</h1><p>People with access to the team workspace.</p></div>
        <span className="users-total"><Users size={17} /> {users.length} {users.length === 1 ? "user" : "users"}</span>
      </div>
      {users.length === 0 ? <div className="users-empty-state"><UserPlus size={28} /><h2>No users yet</h2><p>Profiles will appear here when accounts are provisioned.</p></div> :
        <UsersAdminTable users={users} canManage={true} />}
    </section>
  );
}
