export default function AdminUsersLoading() {
  return (
    <section className="users-page" aria-busy="true" aria-label="Loading users">
      <div className="users-page-heading">
        <div><span className="eyebrow">TEAM WORKSPACE</span><h1>Users</h1><p>Loading the team directory…</p></div>
      </div>
      <div className="users-table-card" role="status">
        <div className="users-toolbar"><span>Loading user records</span></div>
        <div className="users-empty">Please wait while the directory is loaded.</div>
      </div>
    </section>
  );
}
