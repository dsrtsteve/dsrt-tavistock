import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/site";

export default function NotFound() {
  return (
    <section className="site-container not-found">
      <Eyebrow>404 · A LITTLE OFF THE PATH</Eyebrow>
      <h1>
        Let’s get you
        <br />
        back on track.
      </h1>
      <p>
        We couldn’t find that page.
        <br />
        Head home to explore the team and our work.
      </p>
      <Link href="/" className="button button-red">
        Back to home <ArrowRight size={17} />
      </Link>
    </section>
  );
}
