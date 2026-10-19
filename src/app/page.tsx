import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Heart,
  MapPin,
} from "lucide-react";
import {
  Eyebrow,
  Mission,
  SkillsSection,
  Stats,
  SupportBanner,
  TextLink,
} from "@/components/site";
import { getPublishedCallouts } from "@/lib/posts";
import { mediaUrl, postDate } from "@/lib/post-utils";
import { KitPackingGame } from "@/components/kit-packing-game";

export const dynamic = "force-dynamic";

export default async function Home() {
  const callouts = await getPublishedCallouts();
  return (
    <>
      <section className="hero">
        <Image
          src="/images/stretcher-at-sunset.jpg"
          alt="Volunteer rescuers walking across open Dartmoor towards a casualty"
          fill
          preload
          sizes="100vw"
          className="hero-image"
        />
        <div className="hero-shade" />
        <div className="hero-content">
          <span className="hero-eyebrow">
            <span className="live-dot" /> ON CALL 24 HOURS A DAY. EVERY DAY.
          </span>
          <h1>
            WHATEVER
            <br />
            THE WEATHER.
            <br />
            <span>WE’RE THERE.</span>
          </h1>
          <p>
            For the lost. For the injured. For anyone in need.
            <br />
            Your volunteer search and rescue team on Dartmoor.
          </p>
          <div className="hero-actions">
            <Link href="/support-us/donate" className="button button-red">
              <Heart size={17} /> Help us be there <ArrowUpRight size={17} />
            </Link>
            <Link href="/about" className="hero-secondary">
              Our story <ArrowRight size={17} />
            </Link>
          </div>
        </div>
        <div className="hero-bottom">
          <a href="#our-story" className="hero-explore">
            <span className="round-icon">
              <ArrowDown size={16} />
            </span>{" "}
            A SHARED LOVE OF THIS WILD PLACE
          </a>
          <div className="hero-location">
            <span>
              <MapPin size={13} /> DARTMOOR NATIONAL PARK, DEVON
            </span>
          </div>
        </div>
      </section>
      <Stats />
      <Mission />
      <SkillsSection />
      <KitPackingGame />
      <section className="site-container section-space callouts-home">
        <div className="section-heading">
          <div>
            <Eyebrow>WHEN THE CALL COMES</Eyebrow>
            <h2>
              Out on the moor.
              <br />
              There for our community.
            </h2>
          </div>
          <TextLink href="/call-outs">View all call-outs</TextLink>
        </div>
        <div className="callout-list">
          {callouts.slice(0, 3).map((item) => (
            <Link
              href={`/blog/${item.slug}`}
              className="callout-row"
              key={item.id}
            >
              <div className="callout-date">
                <time dateTime={item.event_date}>
                  {postDate(item.event_date)}
                </time>
                <span>
                  {item.incident_number
                    ? `INCIDENT ${item.incident_number}`
                    : "RESCUE REPORT"}
                </span>
              </div>
              <span className="callout-thumbnail">
                {item.cover_path ? (
                  <Image
                    unoptimized
                    src={mediaUrl(item.cover_path)}
                    alt={item.cover_alt ?? ""}
                    fill
                    sizes="(max-width: 767px) 56px, 112px"
                  />
                ) : (
                  <>
                    <Image
                      src="/images/dartmoor-rescue-hero.webp"
                      alt=""
                      fill
                      sizes="(max-width: 767px) 56px, 112px"
                    />
                    <span>Illustration</span>
                  </>
                )}
              </span>
              <div className="callout-row-content">
                <span className="callout-category">
                  {item.category}
                </span>
                <h3>{item.title}</h3>
                <span className="callout-place">
                  <MapPin size={13} /> {item.location}
                </span>
              </div>
              <span className="callout-read">
                Read report <ArrowUpRight size={20} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="involvement site-container">
        <div className="involvement-copy">
          <Eyebrow>FIND YOUR WAY TO HELP</Eyebrow>
          <h2>
            You don’t have to be on
            <br /> the hill to make a difference.
          </h2>
          <p>
            Give your time. Take on a challenge. Rally your community.
            <br /> There’s a place for everyone in our story.
          </p>
        </div>
        <div className="involvement-links">
          {[
            {
              href: "/support-us/join-us",
              number: "01",
              title: "Join the rescue team",
              sub: "Put your skills to work for others.",
            },
            {
              href: "/support-us/supporters-team",
              number: "02",
              title: "Be part of our support team",
              sub: "Big hearts make a big difference.",
            },
            {
              href: "/11tors",
              number: "03",
              title: "Take on the 11 Tors Challenge",
              sub: "Walk the moor. Support your team.",
            },
          ].map((item) => (
            <Link href={item.href} key={item.number}>
              <span className="involvement-number">{item.number}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.sub}</p>
              </div>
              <ArrowUpRight size={23} />
            </Link>
          ))}
        </div>
      </section>
      <SupportBanner />
    </>
  );
}
