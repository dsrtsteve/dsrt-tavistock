"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal, SlidersHorizontal, X, Eye, Pencil, Trash2 } from "lucide-react";
import { deleteUserAccount, updateUserProfile } from "@/app/admin/(workspace)/users/actions";
import type { AdminUser, AppRole } from "@/lib/admin-users/types";

const ROLE_OPTIONS: readonly AppRole[] = ["admin", "staff", "user"];
const STATUS_OPTIONS = ["active", "inactive", "pending"] as const;
const PAGE_SIZE = 10;

type Props = { users: AdminUser[]; canManage: boolean };
type DialogState = { mode: "preview" | "edit" | "delete"; user: AdminUser } | null;

function initials(name: string | null, email: string) {
  const source = name?.trim() || email;
  return source.split(/[\s@._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export function UsersAdminTable({ users, canManage }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<AppRole | "all">("all");
  const [sort, setSort] = useState<{ key: "name" | "email" | "role" | "createdAt"; desc: boolean }>({ key: "createdAt", desc: true });
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [visible, setVisible] = useState({ email: true, role: true, status: true, createdAt: true });
  const [dialog, setDialog] = useState<DialogState>(null);
  const [feedback, setFeedback] = useState("");
  const [isPending, startTransition] = useTransition();

  // Close any open row action menu when the user clicks elsewhere or presses Escape.
  useEffect(() => {
    function closeMenus(event: MouseEvent) {
      if (event.target instanceof Element && event.target.closest(".users-actions")) return;
      document.querySelectorAll<HTMLDetailsElement>(".users-actions[open]").forEach((menu) => {
        menu.open = false;
      });
    }
    function closeMenusOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      document.querySelectorAll<HTMLDetailsElement>(".users-actions[open]").forEach((menu) => {
        menu.open = false;
      });
    }
    document.addEventListener("click", closeMenus);
    document.addEventListener("keydown", closeMenusOnEscape);
    return () => {
      document.removeEventListener("click", closeMenus);
      document.removeEventListener("keydown", closeMenusOnEscape);
    };
  }, []);

  const filtered = useMemo(() => users.filter((user) => {
    const term = search.trim().toLowerCase();
    return (role === "all" || user.role === role) &&
      (!term || `${user.name ?? ""} ${user.email}`.toLowerCase().includes(term));
  }).sort((a, b) => {
    const left = String(a[sort.key] ?? "").toLowerCase();
    const right = String(b[sort.key] ?? "").toLowerCase();
    return left.localeCompare(right) * (sort.desc ? -1 : 1);
  }), [users, search, role, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const allSelected = pageRows.length > 0 && pageRows.every((user) => selected.includes(user.id));

  function changeSort(key: typeof sort.key) {
    setSort((current) => ({ key, desc: current.key === key ? !current.desc : false }));
  }
  function togglePage() {
    setSelected((current) => allSelected
      ? current.filter((id) => !pageRows.some((user) => user.id === id))
      : Array.from(new Set([...current, ...pageRows.map((user) => user.id)])));
  }
  function closeDialog() {
    if (!isPending) { setDialog(null); setFeedback(""); }
  }
  function handleEdit(form: FormData) {
    if (!dialog || dialog.mode !== "edit") return;
    form.set("id", dialog.user.id);
    setFeedback("");
    startTransition(async () => {
      const result = await updateUserProfile(form);
      if (result.error) setFeedback(result.error);
      else { setDialog(null); setFeedback(result.success ?? "Saved."); router.refresh(); }
    });
  }
  function handleDelete() {
    if (!dialog || dialog.mode !== "delete") return;
    setFeedback("");
    startTransition(async () => {
      const result = await deleteUserAccount(dialog.user.id);
      if (result.error) setFeedback(result.error);
      else { setDialog(null); setFeedback(result.success ?? "Deleted."); setSelected((current) => current.filter((id) => id !== dialog.user.id)); router.refresh(); }
    });
  }
  function sortButton(key: typeof sort.key, label: string) {
    return <button className="users-sort" onClick={() => changeSort(key)}>{label}{sort.key === key ? (sort.desc ? " ↓" : " ↑") : ""}</button>;
  }

  return (
    <>
      {feedback && !dialog && <p className="users-feedback" role="status">{feedback}</p>}
      <section className="users-table-card" aria-label="User directory">
        <div className="users-toolbar">
          <label className="users-search"><Search size={17} aria-hidden="true" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(0); }} placeholder="Search by name or email" aria-label="Search users" /></label>
          <label className="users-role-filter"><SlidersHorizontal size={16} aria-hidden="true" /><select value={role} onChange={(event) => { setRole(event.target.value as AppRole | "all"); setPage(0); }} aria-label="Filter by role"><option value="all">All roles</option>{ROLE_OPTIONS.map((option) => <option key={option} value={option}>{option[0].toUpperCase() + option.slice(1)}</option>)}</select></label>
          <details className="users-columns"><summary>Columns <ChevronDown size={14} /></summary><div className="users-columns-menu">{Object.entries(visible).map(([key, checked]) => <label key={key}><input type="checkbox" checked={checked} onChange={(event) => setVisible((current) => ({ ...current, [key]: event.target.checked }))} /> {key === "createdAt" ? "Joined" : key[0].toUpperCase() + key.slice(1)}</label>)}</div></details>
        </div>
        {selected.length > 0 && <div className="users-selection">{selected.length} selected <button onClick={() => setSelected([])}>Clear selection</button></div>}
        <div className="users-table-scroll"><table className="users-table">
          <thead><tr><th><input type="checkbox" aria-label="Select current page" checked={allSelected} onChange={togglePage} /></th><th>{sortButton("name", "Name")}</th>{visible.email && <th>{sortButton("email", "Email")}</th>}{visible.role && <th>{sortButton("role", "Role")}</th>}{visible.status && <th>Status</th>}{visible.createdAt && <th>{sortButton("createdAt", "Joined")}</th>}{canManage && <th><span className="sr-only">Actions</span></th>}</tr></thead>
          <tbody>{pageRows.length === 0 ? <tr><td colSpan={2 + Object.values(visible).filter(Boolean).length + (canManage ? 1 : 0)} className="users-empty">No users match your search or filters.</td></tr> : pageRows.map((user) => <tr key={user.id}>
            <td><input type="checkbox" aria-label={`Select ${user.name ?? user.email}`} checked={selected.includes(user.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, user.id] : current.filter((id) => id !== user.id))} /></td>
            <td><div className="users-person">{user.image ? <img src={user.image} alt="" /> : <span className="users-avatar">{initials(user.name, user.email)}</span>}<span><strong>{user.name ?? "Name not provided"}</strong><small>{user.name ? user.email : " "}</small></span></div></td>
            {visible.email && <td className="users-muted">{user.email}</td>}{visible.role && <td><span className={`users-role-badge role-${user.role}`}>{user.role}</span></td>}{visible.status && <td><span className={`users-status status-${user.status}`}>{user.status}</span></td>}{visible.createdAt && <td className="users-muted">{new Date(user.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>}
            {canManage && <td><details className="users-actions"><summary aria-label={`Actions for ${user.email}`}><MoreHorizontal size={18} /></summary><div><button type="button" onClick={() => { setFeedback(""); setDialog({ mode: "preview", user }); }}><Eye size={15} /> Preview</button><button type="button" onClick={() => { setFeedback(""); setDialog({ mode: "edit", user }); }}><Pencil size={15} /> Edit</button><button type="button" className="danger" onClick={() => { setFeedback(""); setDialog({ mode: "delete", user }); }}><Trash2 size={15} /> Delete</button></div></details></td>}
          </tr>)}</tbody>
        </table></div>
        <footer className="users-pagination"><span>{filtered.length ? `${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, filtered.length)} of ${filtered.length} users` : "0 users"}</span><div><button aria-label="Previous page" disabled={page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}><ChevronLeft size={17} /></button><span>Page {page + 1} of {pageCount}</span><button aria-label="Next page" disabled={page + 1 >= pageCount} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}><ChevronRight size={17} /></button></div></footer>
      </section>

      {dialog && <div className="users-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog(); }}>
        <section className="users-dialog" role="dialog" aria-modal="true" aria-labelledby="users-dialog-title">
          <header><h2 id="users-dialog-title">{dialog.mode === "preview" ? "User details" : dialog.mode === "edit" ? "Edit user" : "Delete user"}</h2><button type="button" aria-label="Close dialog" onClick={closeDialog} disabled={isPending}><X size={19} /></button></header>
          {dialog.mode === "preview" && <div className="users-preview">
            <div className="users-preview-person">{dialog.user.image ? <img src={dialog.user.image} alt="" /> : <span className="users-avatar">{initials(dialog.user.name, dialog.user.email)}</span>}<div><strong>{dialog.user.name || "Name not provided"}</strong><span>{dialog.user.email}</span></div></div>
            <dl><div><dt>Role</dt><dd><span className={`users-role-badge role-${dialog.user.role}`}>{dialog.user.role}</span></dd></div><div><dt>Status</dt><dd><span className={`users-status status-${dialog.user.status}`}>{dialog.user.status}</span></dd></div><div><dt>Joined</dt><dd>{new Date(dialog.user.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</dd></div><div><dt>User ID</dt><dd className="users-id">{dialog.user.id}</dd></div></dl>
            <footer><button type="button" className="button button-red" onClick={() => setDialog({ mode: "edit", user: dialog.user })}>Edit user</button><button type="button" className="users-secondary-button" onClick={closeDialog}>Close</button></footer>
          </div>}
          {dialog.mode === "edit" && <form action={handleEdit} className="users-edit-form">
            <label>Name<input name="name" defaultValue={dialog.user.name ?? ""} maxLength={100} placeholder="Full name" /></label>
            <label>Email<input value={dialog.user.email} disabled readOnly /><small>Email address changes are managed through Supabase Auth and are not editable here.</small></label>
            <label>Role<select name="role" defaultValue={dialog.user.role}>{ROLE_OPTIONS.map((value) => <option key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</option>)}</select></label>
            <label>Directory status<select name="status" defaultValue={dialog.user.status}>{STATUS_OPTIONS.map((value) => <option key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</option>)}</select></label>
            {feedback && <p className="users-dialog-error" role="alert">{feedback}</p>}
            <footer><button type="button" className="users-secondary-button" onClick={closeDialog} disabled={isPending}>Cancel</button><button type="submit" className="button button-red" disabled={isPending}>{isPending ? "Saving…" : "Save changes"}</button></footer>
          </form>}
          {dialog.mode === "delete" && <div className="users-delete-confirm"><p>This permanently deletes <strong>{dialog.user.name || dialog.user.email}</strong> and their Supabase Auth account. This action cannot be undone.</p><p className="users-delete-warning">Any content or records owned by this account may also be affected by database relationships.</p>{feedback && <p className="users-dialog-error" role="alert">{feedback}</p>}<footer><button type="button" className="users-secondary-button" onClick={closeDialog} disabled={isPending}>Cancel</button><button type="button" className="users-delete-button" onClick={handleDelete} disabled={isPending}>{isPending ? "Deleting…" : "Permanently delete"}</button></footer></div>}
        </section>
      </div>}
    </>
  );
}
