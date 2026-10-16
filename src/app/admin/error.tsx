"use client";
export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <section className="site-container section-space empty-state">
      <h1>The workspace is temporarily unavailable.</h1>
      <p>
        We couldn’t load the workspace. Please check the connection and try
        again.
      </p>
      <button onClick={reset} className="button button-red">
        Try again
      </button>
    </section>
  );
}
