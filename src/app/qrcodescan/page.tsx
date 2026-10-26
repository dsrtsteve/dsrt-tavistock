import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Heart, MapPin, Radio } from "lucide-react";
import { donationUrl } from "@/lib/content";
import { Eyebrow } from "@/components/site";

export const metadata: Metadata = {
  title: "Support the team",
  description:
    "Meet the volunteers of Dartmoor Search and Rescue Team Tavistock and find out how your support helps us be there when people need us.",
  robots: { index: false, follow: false },
};

const links = [
  { href: "/about", label: "Meet the team", detail: "Who we are and why we do it" },
  { href: "/team-skills", label: "What we do", detail: "The skills behind every rescue" },
  { href: "/call-outs", label: "Recent call-outs", detail: "See the team in action" },
  { href: "/support-us", label: "Get involved", detail: "More ways to support us" },
  { href: "/contact", label: "Get in touch", detail: "Questions, events and enquiries" },
];

export default function QrCodeScanPage() {
  return (
    <div className="qr-landing">
      <section className="qr-hero">
        <Image
          src="/images/team-on-leathertor.jpg"
          alt="Dartmoor Search and Rescue Tavistock volunteers out on the moor"
          fill
          priority
          sizes="100vw"
          className="qr-hero-image"
        />
        <div className="qr-hero-shade" />
        <div className="site-container qr-hero-content">
          <Eyebrow light>YOUR LOCAL VOLUNTEER RESCUE TEAM</Eyebrow>
          <h1>Here for you.<br /><span>Because you’re there for us.</span></h1>
          <p>We’re the volunteers of Dartmoor Search &amp; Rescue Team Tavistock. When someone is lost or injured on the moor, we’re ready to respond — day or night.</p>
          <a className="button button-red qr-donate" href={donationUrl} target="_blank" rel="noreferrer">
            <Heart size={19} /> Support your rescue team <ArrowUpRight size={18} />
          </a>
          <span className="qr-donate-note">Your donation helps fund our training, equipment and vehicles.</span>
        </div>
        <div className="site-container qr-hero-foot"><span><Radio size={15} /> Volunteer powered, on call 24/7</span><span><MapPin size={15} /> Tavistock, Dartmoor</span></div>
      </section>

      <section className="site-container qr-about">
        <div>
          <Eyebrow>ORDINARY PEOPLE. EXTRAORDINARY COMMITMENT.</Eyebrow>
          <h2>We’re your neighbours, colleagues and friends.</h2>
        </div>
        <p>Our team brings together people from across the community, united by a love of Dartmoor and a simple purpose: helping people get home safely. We give our time freely, and rely on the community to help keep us rescue-ready.</p>
      </section>

      <nav className="qr-links site-container" aria-label="Explore the DSRT Tavistock website">
        <div className="qr-links-heading"><Eyebrow>EXPLORE THE TEAM</Eyebrow><h2>More about us</h2></div>
        <div className="qr-link-grid">
          {links.map((item) => (
            <Link className="qr-link-card" href={item.href} key={item.href}>
              <span><strong>{item.label}</strong><small>{item.detail}</small></span>
              <ArrowRight size={19} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </nav>
      <section className="site-container qr-return">
        <p>
          If you have found an ID badge, we would be grateful if you could return it to us at:
          <br />
          <strong>The Rescue Centre, Abbey Rise, Tavistock, PL19 9FD</strong>
        </p>
      </section>
    </div>
  );
}
