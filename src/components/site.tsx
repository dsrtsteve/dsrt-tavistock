import Link from "next/link";
import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Compass,
  Dog,
  Heart,
  HeartPulse,
  Instagram,
  MapPin,
  Mountain,
  Phone,
  Radio,
  Truck,
  Users,
  Waves,
} from "lucide-react";
import { charityNumber, navigation, skills } from "@/lib/content";
import type { ReactNode } from "react";

export function TextLink({
  href,
  children,
  light = false,
}: {
  href: string;
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <Link href={href} className={`text-link ${light ? "text-link-light" : ""}`}>
      {children}
      <ArrowUpRight size={19} aria-hidden="true" />
    </Link>
  );
}

export function Eyebrow({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <span className={`eyebrow ${light ? "eyebrow-light" : ""}`}>
      <span className="eyebrow-line" />
      {children}
    </span>
  );
}

export function Stats() {
  return (
    <section className="stats site-container" aria-label="Our commitment">
      {[
        { value: "24/7", label: "Ready to respond", icon: Radio },
        { value: "100%", label: "Volunteer powered", icon: Users },
        { value: "1968", label: "Our story began", icon: Mountain },
        { value: "365", label: "Days a year", icon: Compass },
      ].map(({ value, label, icon: Icon }) => (
        <div className="stat" key={value}>
          <Icon size={25} strokeWidth={1.4} aria-hidden="true" />
          <div>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        </div>
      ))}
    </section>
  );
}

export function Mission({ extended = false }: { extended?: boolean }) {
  return (
    <section className="site-container section-space mission" id="our-story">
      <div className="mission-copy">
        <Eyebrow>ORDINARY PEOPLE. EXTRAORDINARY COMMITMENT.</Eyebrow>
        <h2>
          Our spare time.
          <br />
          Someone’s lifeline.
        </h2>
        <p>
          We’re your neighbours, colleagues and friends. Brought together by a
          love of Dartmoor and a simple purpose: to help when it matters most.
        </p>
        <p>
          From a missing walker to a difficult rescue, our volunteers bring the
          skills, care and determination to get people home safely.
        </p>
        {extended ? (
          <p>
            Our story began in Tavistock in April 1968. Today we work with our
            sister teams in Ashburton, Okehampton and Plymouth, supporting the
            police and other emergency services across Devon and Cornwall.
          </p>
        ) : null}
        <TextLink href={extended ? "/support-us/join-us" : "/about"}>
          {extended
            ? "Find your place in the team"
            : "Meet the team behind the rescue"}
        </TextLink>
      </div>
      <figure className="mission-image">
        <Image
          src="/images/team-on-leathertor.jpg"
          alt="AI illustration of four rescue volunteers planning a route together on Dartmoor"
          fill
          sizes="(max-width: 767px) 100vw, 50vw"
        />
        <figcaption>
          <span>
            <span className="live-dot" /> UNITED BY PURPOSE
          </span>
          <span>The Team on Leather tor</span>
        </figcaption>
        <div className="image-stamp">
          <Image
            src="/images/dsrt-tavistock-official.png"
            alt="Official DSRT Tavistock logo"
            width={1028}
            height={1196}
            sizes="(max-width: 767px) 83px, 102px"
          />
        </div>
      </figure>
    </section>
  );
}

export function SkillIcon({
  name,
  size = 32,
}: {
  name: string;
  size?: number;
}) {
  const Icon =
    (
      {
        medical: HeartPulse,
        dog: Dog,
        rope: Mountain,
        water: Waves,
        search: Compass,
        vehicle: Truck,
      } as const
    )[name as "medical"] ?? Compass;
  return <Icon size={size} strokeWidth={1.5} aria-hidden="true" />;
}

export function SkillsSection({ full = false }: { full?: boolean }) {
  return (
    <section className="skills-section">
      <div className="site-container section-space">
        <div className="section-heading">
          <div>
            <Eyebrow light>TRAINED FOR THE UNEXPECTED</Eyebrow>
            <h2>
              Many skills.
              <br />
              One team.
            </h2>
          </div>
          <p>
            When the call comes, we’re ready.
            <br /> Specialist training. Shared commitment.
            <br /> Whatever the terrain.
          </p>
        </div>
        <div className={`skills-grid ${full ? "skills-grid-full" : ""}`}>
          {(full ? skills : skills.slice(0, 4)).map((skill, i) => (
            <Link
              href={`/team-skills/${skill.slug}`}
              key={skill.slug}
              className="skill-card"
            >
              <div className="skill-card-top">
                <SkillIcon name={skill.icon} />
                <span>0{i + 1}</span>
              </div>
              <div>
                <h3>{skill.title}</h3>
                <p>{skill.short}</p>
              </div>
              <span className="skill-arrow">
                <ArrowUpRight size={20} />
              </span>
            </Link>
          ))}
        </div>
        {!full && (
          <div className="skills-bottom">
            <span>Equipped for the moor. Prepared for more.</span>
            <TextLink href="/team-skills" light>
              Explore all our skills
            </TextLink>
          </div>
        )}
      </div>
    </section>
  );
}

export function SupportBanner() {
  return (
    <section className="support-banner">
      <div className="site-container support-inner">
        <div>
          <Eyebrow light>YOUR SUPPORT GETS US THERE</Eyebrow>
          <h2>
            Every rescue starts
            <br />
            with people like you.
          </h2>
        </div>
        <div className="support-banner-copy">
          <p>
            Our time is given freely. Our equipment, training and vehicles
            depend on your generosity. Help keep the team ready for the next
            call.
          </p>
          <Link href="/support-us/donate" className="button button-cream">
            <Heart size={18} /> Support your rescue team{" "}
            <ArrowUpRight size={18} />
          </Link>
          <Link href="/support-us" className="support-other">
            Discover other ways to help <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function EmergencyPanel() {
  return (
    <section className="emergency-panel">
      <div className="emergency-icon">
        <Phone size={25} />
      </div>
      <div>
        <span className="eyebrow">NEED HELP ON THE MOOR?</span>
        <h2>
          Call 999. Ask for Police,
          <br />
          then Mountain Rescue.
        </h2>
        <p>
          For emergencies, always use 999. Website messages and email are not
          monitored for rescue requests.
        </p>
      </div>
      <a href="tel:999" className="button button-red">
        Call 999 <Phone size={16} />
      </a>
    </section>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
  image = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  image?: boolean;
}) {
  return (
    <section className={`page-intro ${image ? "page-intro-image" : ""}`}>
      {image && (
        <>
          <Image
            src="/images/wide_dartmoor.jpg"
            alt="The rescue team on Dartmoor"
            fill
            sizes="100vw"
            preload
          />
          <div className="page-intro-overlay" />
        </>
      )}
      <div className="site-container relative">
        <Link href="/" className="breadcrumb">
          Home <ArrowRight size={12} /> {eyebrow}
        </Link>
        <Eyebrow light={image}>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {image && (
        <span className="intro-image-credit">The team out on Dartmoor</span>
      )}
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-top">
          <div>
            <Link href="/" className="brand footer-brand">
              <Image
                src="/images/dsrt-tavistock-official.png"
                alt="Official Mountain Rescue England and Wales — DSRT Tavistock logo"
                width={1028}
                height={1196}
                sizes="68px"
                className="brand-badge footer-badge"
              />
              <span className="brand-type">
                <strong>DARTMOOR</strong>
                <span>SEARCH & RESCUE</span>
                <small>TAVISTOCK</small>
              </span>
            </Link>
            <p>
              Local people. Lifesaving work.
              <br />
              Here when you need us.
            </p>
            <div className="social-links">
              <a
                href="https://www.facebook.com/DartmoorSRTTavistock/"
                target="_blank"
                rel="noreferrer"
                aria-label="Visit the team on Facebook (opens in new tab)"
              >
                <span aria-hidden="true" className="social-letter">
                  f
                </span>
              </a>
              <a
                href="https://www.instagram.com/dartmoorrescuetavistock/"
                target="_blank"
                rel="noreferrer"
                aria-label="Visit the team on Instagram (opens in new tab)"
              >
                <Instagram size={19} />
              </a>
            </div>
          </div>
          <div className="footer-links">
            <h3>Explore</h3>
            {navigation.slice(0, 3).map((n) => (
              <Link href={n.href} key={n.href}>
                {n.label}
              </Link>
            ))}
            <Link href="/blog">The team journal</Link>
            <Link href="/contact">Contact us</Link>
          </div>
          <div className="footer-links">
            <h3>Make a difference</h3>
            <Link href="/support-us/donate">Donate</Link>
            <Link href="/support-us/join-us">Join the team</Link>
            <Link href="/support-us/supporters-team">Become a supporter</Link>
            <Link href="/11tors">11 Tors Challenge</Link>
            <Link href="/books">
              Books for the team
            </Link>
          </div>
          <div className="footer-address">
            <h3>Find us</h3>
            <p>
              The Rescue Centre
              <br />
              Abbey Rise, Tavistock
              <br />
              Devon, PL19 9FD
            </p>
            <span>
              <MapPin size={14} /> Dartmoor, Devon
            </span>
            <a href="#main-content" className="back-top">
              Back to top <ArrowDown className="rotate-180" size={15} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} DSRT Tavistock · Registered charity{" "}
            {charityNumber}
          </span>
          <span>Independent. Voluntary. Here for you.</span>
          <Link href="/privacy">Privacy & image credits</Link>
          <Link href="/admin">Admin sign in</Link>
        </div>
      </div>
    </footer>
  );
}
