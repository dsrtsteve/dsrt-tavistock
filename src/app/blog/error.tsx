"use client";
export default function JournalError({ reset }: { reset: () => void }) {
  return (
    <section className="site-container section-space empty-state">
      <h1>The journal is temporarily unavailable.</h1>
      <p>We couldn’t load the latest stories. Please try again shortly.</p>
      <button onClick={reset} className="button button-red">
        Try again
      </button>
    </section>
  );
}
