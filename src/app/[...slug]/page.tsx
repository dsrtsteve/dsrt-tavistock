import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Heart,
  Mail,
  MapPin,
  Mountain,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  EmergencyPanel,
  Eyebrow,
  Mission,
  PageIntro,
  SkillIcon,
  SkillsSection,
  Stats,
  SupportBanner,
  TextLink,
} from "@/components/site";
import { FindWalkerGame } from "@/components/find-walker-game";
import { SkillGallery } from "@/components/skill-gallery";
import {
  aboutContent,
  donationUrl,
  joinUsContent,
  skills,
  sourceUrl,
  supportersTeamContent,
} from "@/lib/content";

const titles: Record<string, string> = {
  about: "Our team",
  "team-skills": "What we do",
  "support-us": "Get involved",
  "support-us/donate": "Donate",
  "support-us/join-us": "Join the team",
  "support-us/supporters-team": "Supporters team",
  contact: "Contact",
  "11tors": "11 Tors Challenge",
  books: "Books for the team",
  privacy: "Privacy & image credits",
};

type Props = { params: Promise<{ slug: string[] }> };

const skillPhotos: Record<string, { src: string; alt: string; width: number; height: number }[]> = {
  "medical-team": [
    { src: "/images/rrmt/cas-care.jpg", alt: "Remote rescue medical team caring for a casualty", width: 4000, height: 3000 },
    { src: "/images/rrmt/cas-site.jpg", alt: "Remote rescue medical team caring for a casualty", width: 2522, height: 1989 },
    { src: "/images/rrmt/packaging.jpg", alt: "Casualty being prepared for evacuation", width: 2756, height: 2067 },
    { src: "/images/rrmt/inside-kisu.jpg", alt: "Casualty inside the team's KISU shelter", width: 3000, height: 4000 },
  ],
  "search-dogs": [
    { src: "/images/sarda/dog-find.JPG", alt: "Search dog locating a missing person", width: 4000, height: 3000 },
    { src: "/images/sarda/dog-handler.jpg", alt: "Search dog handler working with their dog", width: 4032, height: 3024 },
    { src: "/images/sarda/dog-in-team.jpg", alt: "Search dog working alongside the rescue team", width: 4080, height: 3072 },
    { src: "/images/sarda/dog-pose.jpg", alt: "Mountain rescue search dog", width: 3024, height: 4032 },
    { src: "/images/sarda/dog-reward.jpg", alt: "Search dog receiving a reward during training", width: 4032, height: 3024 },
  ],
  "ropes-team": [
    { src: "/images/ropes/abseil.jpg", alt: "A team member practices ropes skills", width: 3024, height: 4032 },
    { src: "/images/ropes/anchor-vehicle.jpg", alt: "Rescue rope system anchored to a vehicle", width: 4000, height: 3000 },
    { src: "/images/ropes/bridge.jpg", alt: "Rope rescue training on a bridge", width: 924, height: 2000 },
    { src: "/images/ropes/lowering.jpg", alt: "Lowering a casualty during a rope rescue", width: 1536, height: 2048 },
    { src: "/images/ropes/ropes-1.jpg", alt: "Team members during a technical rope rescue", width: 3000, height: 4000 },
    { src: "/images/ropes/stretcher-rope.jpg", alt: "Stretcher being moved using a rope system", width: 4032, height: 3024 },
  ],
  "swift-water-rescue": [
    { src: "/images/water/boat-cas.jpg", alt: "Rescue team moving a casualty by boat", width: 3024, height: 4032 },
    { src: "/images/water/boat-right.JPG", alt: "Capsize drills being practiced on the water", width: 2508, height: 1672 },
    { src: "/images/water/live-bait.jpg", alt: "Swift water rescue live bait technique", width: 4032, height: 2688 },
    { src: "/images/water/rescue.jpg", alt: "Rescuers practicing in open water", width: 2801, height: 2025 },
    { src: "/images/water/tether-raft.jpg", alt: "Rescue team using a tethered raft", width: 3797, height: 2539 },
    { src: "/images/water/training-dive.jpg", alt: "Water rescue training in the Tavy river", width: 3360, height: 2240 },
  ],
  hasties: [
    { src: "/images/hasty/hastys.jpg", alt: "Hasty team members running into action", width: 2362, height: 1772 },
  ],
  "4x4-drivers": [
    { src: "/images/vehicles/53-old-63.jpg", alt: "Landrover 53 and the former Landrover 63", width: 4000, height: 3000 },
    { src: "/images/vehicles/53-sunset.jpg", alt: "Landrover 53 on Dartmoor at sunset", width: 4032, height: 3024 },
    { src: "/images/vehicles/63-points.jpg", alt: "Hilux off-road rescue vehicle", width: 4032, height: 2268 },
    { src: "/images/vehicles/63-merlin.jpg", alt: "63 beside a Navy Merlin helicopter", width: 4000, height: 3000 },
    { src: "/images/vehicles/old-63.jpg", alt: "Former 63 off-road rescue vehicle", width: 3024, height: 4032 },
  ],
};

export function generateStaticParams() {
  return [
    ...Object.keys(titles),
    ...skills.map((s) => `team-skills/${s.slug}`),
  ].map((route) => ({ slug: route.split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const path = slug.join("/");
  const title = titles[path] ?? skills.find((s) => s.slug === slug[1])?.title;
  return { title: title ?? "Page not found" };
}

export default async function ContentPage({ params }: Props) {
  const { slug } = await params;
  const path = slug.join("/");

  if (path === "about")
    return (
      <>
        <PageIntro
          eyebrow="Our team"
          title={"Your local Mountain\nRescue Team."}
          description="A shared love of Dartmoor. A commitment to be there when someone needs us. Explore the story behind the people in red."
          image
        />
        <Stats />
        <Mission extended />
        <section className="site-container content-grid pb-20">
          <div className="prose">
            {aboutContent.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
          <aside className="panel">
            <Eyebrow>EVERY MEMBER A VOLUNTEER</Eyebrow>
            <h2>A team worth being part of.</h2>
            <p>
              From training on the hill to supporting a community event, there
              are many ways to give your time.
            </p>
            <Link href="/support-us" className="button button-red">
              Find your way to help <ArrowUpRight size={17} />
            </Link>
          </aside>
        </section>
        <SupportBanner />
      </>
    );

  if (path === "team-skills")
    return (
      <>
        <PageIntro
          eyebrow="What we do"
          title="Prepared for more."
          description="Rescue takes a whole team. Our volunteers train in navigation, communications and search, with specialists ready for the challenges beyond."
        />
        <SkillsSection full />
        <FindWalkerGame />
        <SupportBanner />
      </>
    );

  if (slug[0] === "team-skills" && slug.length === 2) {
    const skill = skills.find((s) => s.slug === slug[1]);
    if (!skill) notFound();
    return (
      <>
        <PageIntro
          eyebrow="Team skills"
          title={skill.title}
          description={skill.short}
          image
        />
        <section className="site-container section-space content-grid">
          <div className="prose">
            <div className="skill-detail-icon">
              <SkillIcon name={skill.icon} size={48} />
            </div>
            <h2>Specialist skills. Shared purpose.</h2>
            {skill.description.map((block, index) =>
              block.type === "heading" ? (
                <h3 key={index}>{block.text}</h3>
              ) : block.type === "paragraph" ? (
                <p key={index}>{block.text}</p>
              ) : block.type === "list" ? (
                <ul key={index}>
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p key={index}>
                  {block.text}{" "}
                  <a href={block.href} target="_blank" rel="noreferrer">
                    {block.label}
                  </a>
                </p>
              ),
            )}
            <p>
              Every specialist is part of the wider rescue team. Regular
              training helps volunteers bring their skills together when a
              call-out takes them into challenging terrain.
            </p>
            <TextLink href="/team-skills">Explore all team skills</TextLink>
            {skillPhotos[skill.slug] ? (
              <SkillGallery
                photos={skillPhotos[skill.slug]}
                label={`${skill.title} photos`}
              />
            ) : null}
          </div>
          <aside className="panel">
            <Eyebrow>HELP US STAY READY</Eyebrow>
            <h2>Training makes the difference.</h2>
            <p>
              Your support helps our volunteers prepare and equips them for the
              next call.
            </p>
            <Link href="/support-us/donate" className="button button-red">
              Support the team <Heart size={17} />
            </Link>
          </aside>
        </section>
        <SupportBanner />
      </>
    );
  }

  if (path === "support-us")
    return (
      <>
        <PageIntro
          eyebrow="Get involved"
          title={"Good people.\nGreat things."}
          description="Every volunteer, fundraiser and supporter is part of the rescue. Find your way to make a difference."
          image
        />
        <section className="site-container section-space">
          <div className="support-options">
            {[
              {
                icon: Heart,
                title: "Give a little. Help a lot.",
                text: "Your donation supports the equipment, vehicles and training that help keep our team ready.",
                href: "/support-us/donate",
                link: "Make a donation",
              },
              {
                icon: Mountain,
                title: "Join us on the hill.",
                text: "Bring your love of Dartmoor, outdoor experience and commitment to helping others.",
                href: "/support-us/join-us",
                link: "Become a rescuer",
              },
              {
                icon: Users,
                title: "The team behind the team.",
                text: "Help at events, raise funds and support our operational volunteers through the Supporters Team.",
                href: "/support-us/supporters-team",
                link: "Become a supporter",
              },
            ].map(({ icon: Icon, ...item }) => (
              <article className="support-card" key={item.href}>
                <Icon size={35} strokeWidth={1.5} />
                <h2>{item.title}</h2>
                <p>{item.text}</p>
                <TextLink href={item.href}>{item.link}</TextLink>
              </article>
            ))}
          </div>
          <div className="mt-14 flex flex-wrap gap-8">
            <TextLink href="/11tors">Discover the 11 Tors Challenge</TextLink>
            <TextLink href="/books">
              Books that support the team
            </TextLink>
          </div>
        </section>
      </>
    );

  if (path === "support-us/donate")
    return (
      <>
        <PageIntro
          eyebrow="Donate"
          title={"Help us be there.\nEvery time."}
          description="No government funding. Every member a volunteer. Your generosity helps put our team on the moor when someone needs us."
        />
        <section className="site-container section-space content-grid">
          <div className="prose">
            <h2>Small acts. Real impact.</h2>
            <p>
              From a radio battery to a rescue vehicle, every part of a response
              needs support. Donations help keep equipment ready and training
              going.
            </p>
            <div className="info-list">
              <div>
                <Heart size={21} />
                <div>
                  <h3>Give online</h3>
                  <p>
                    Make a donation through the team’s official JustGiving
                    charity page. Choose your amount and any available giving
                    options there.
                  </p>
                </div>
              </div>
              <div>
                <Users size={21} />
                <div>
                  <h3>Fundraise your way</h3>
                  <p>
                    A personal challenge, a community event or support from your
                    business — contact the fundraising team to get started.
                  </p>
                  <a href="mailto:fundraising@dsrt-tavistock.org.uk">
                    fundraising@dsrt-tavistock.org.uk
                  </a>
                </div>
              </div>
              <div>
                <Mail size={21} />
                <div>
                  <h3>Other ways to give</h3>
                  <p>
                    For bank transfer details, contact the treasurer. You can
                    also send a cheque payable to DSRT Tavistock to the Rescue
                    Centre.
                  </p>
                  <a href="mailto:treasurer@dsrt-tavistock.org.uk">
                    treasurer@dsrt-tavistock.org.uk
                  </a>
                </div>
              </div>
            </div>
          </div>
          <aside className="panel donation-panel">
            <ShieldCheck size={34} strokeWidth={1.5} className="text-forest" />
            <h2>Make your support count.</h2>
            <p>
              Donate to Dartmoor Search and Rescue Team (Tavistock), registered
              charity 1201527.
            </p>
            <a
              href={donationUrl}
              target="_blank"
              rel="noreferrer"
              className="button button-red"
            >
              Donate on JustGiving <ArrowUpRight size={17} />
            </a>
            <p className="panel-note">
              Opens JustGiving in a new tab. Donations are completed securely on
              their website.
            </p>
          </aside>
        </section>
      </>
    );

  if (path === "support-us/join-us")
    return (
      <>
        <PageIntro
          {...joinUsContent.intro}
          image
        />
        <section className="site-container section-space content-grid">
          <div className="prose">
            <h2>{joinUsContent.heading}</h2>
            <p>{joinUsContent.introduction}</p>
            <ul>
              {joinUsContent.criteria.map((criterion) => (
                <li key={criterion}>{criterion}</li>
              ))}
            </ul>
            <p>{joinUsContent.training}</p>
            <h2>{joinUsContent.recruitmentHeading}</h2>
            <p>{joinUsContent.recruitment}</p>
            <p>{joinUsContent.recruitmentDay}</p>
            <TextLink href="/support-us/supporters-team">
              {joinUsContent.supportersLink}
            </TextLink>
          </div>
          <aside className="panel">
            <Eyebrow>{joinUsContent.application.eyebrow}</Eyebrow>
            <h2>{joinUsContent.application.heading}</h2>
            <p>{joinUsContent.application.description}</p>
            <a
              href={joinUsContent.application.href}
              target="_blank"
              rel="noreferrer"
              className="button button-red"
            >
              {joinUsContent.application.label} <ArrowUpRight size={17} />
            </a>
            <p className="panel-note">{joinUsContent.application.note}</p>
          </aside>
        </section>
      </>
    );

  if (path === "support-us/supporters-team")
    return (
      <>
        <PageIntro
          {...supportersTeamContent.intro}
        />
        <section className="site-container section-space content-grid">
          <div className="prose">
            <h2>{supportersTeamContent.heading}</h2>
            <p>{supportersTeamContent.introduction}</p>
            <ul>
              {supportersTeamContent.activities.map((activity) => (
                <li key={activity}>{activity}</li>
              ))}
            </ul>
            <h2>{supportersTeamContent.suitabilityHeading}</h2>
            <p>{supportersTeamContent.suitabilityIntroduction}</p>
            <ul>
              {supportersTeamContent.suitability.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>{supportersTeamContent.welcome}</p>
            <p>{supportersTeamContent.invitation}</p>
          </div>
          <aside className="panel">
            <Users size={34} strokeWidth={1.5} />
            <h2>{supportersTeamContent.contact.heading}</h2>
            <p>{supportersTeamContent.contact.description}</p>
            <a
              href={supportersTeamContent.contact.href}
              className="button button-red"
            >
              {supportersTeamContent.contact.label} <ArrowUpRight size={17} />
            </a>
          </aside>
        </section>
        <SupportBanner />
      </>
    );

  if (path === "contact")
    return (
      <>
        <PageIntro
          eyebrow="Contact"
          title="Let’s talk."
          description="Want to help, join the team or ask about an event? Here’s how to reach the right people."
        />
        <section className="site-container section-space">
          <EmergencyPanel />
          <div className="content-grid">
            <div className="prose">
              <h2>Find the right contact.</h2>
              <div className="info-list">
                {[
                  {
                    icon: Mountain,
                    title: "Recruitment & training",
                    email: "trainingofficer@dsrt-tavistock.org.uk",
                  },
                  {
                    icon: Heart,
                    title: "Fundraising & supporters",
                    email: "fundraising@dsrt-tavistock.org.uk",
                  },
                  {
                    icon: CalendarDays,
                    title: "11 Tors Challenge",
                    email: "11tors@dsrt-tavistock.org.uk",
                  },
                  {
                    icon: BookOpen,
                    title: "Book enquiries",
                    email: "Books@dsrt-tavistock.org.uk",
                  },
                ].map(({ icon: Icon, ...item }) => (
                  <div key={item.email}>
                    <Icon size={20} />
                    <div>
                      <h3>{item.title}</h3>
                      <a href={`mailto:${item.email}`}>{item.email}</a>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-7">
                For other enquiries, email our secretary at{" "}
                <a
                  href="mailto:secretary@dsrt-tavistock.org.uk"
                >
                  secretary@dsrt-tavistock.org.uk
                </a>{" "}
                or write to the Rescue Centre.
              </p>
            </div>
            <aside className="panel">
              <MapPin size={31} strokeWidth={1.5} />
              <h2>The Rescue Centre</h2>
              <p>
                DSRT Tavistock
                <br />
                Abbey Rise
                <br />
                Tavistock, Devon
                <br />
                PL19 9FD
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Dartmoor+Search+and+Rescue+Tavistock+Abbey+Rise+PL19+9FD"
                target="_blank"
                rel="noreferrer"
                className="button button-outline"
              >
                Open in Google Maps <ArrowUpRight size={17} />
              </a>
              <p className="panel-note">
                Please contact the team before visiting. The rescue centre is
                not an emergency walk-in service.
              </p>
            </aside>
          </div>
        </section>
      </>
    );

  if (path === "11tors")
    return (
      <>
        <PageIntro
          eyebrow="11 Tors Challenge"
          title={"Walk somewhere wild.\nDo something good."}
          description="A community walking challenge across Dartmoor, organised by the volunteers who help keep people safe here."
          image
        />
        <section className="site-container section-space content-grid">
          <div className="prose">
            <h2>One moor. A shared adventure.</h2>
            <p>
              The 11 Tors Challenge brings walkers together to explore Dartmoor
              and raise funds for the team.
            </p>
            <p>
              The 2026 event on 19 September, was a great success raising vital 
              funds for the team. 
            </p>
            <p>
              For information about future events, contact the organisers. We’ll
              only list a new date once it has been confirmed by the team.
            </p>
          </div>
          <aside className="panel">
            <CalendarDays size={32} strokeWidth={1.5} />
            <h2>See you on the moor.</h2>
            <p>
              Ask the 11 Tors team about future challenges and ways to get
              involved.
            </p>
            <a
              href="mailto:11tors@dsrt-tavistock.org.uk?subject=Future%2011%20Tors%20Challenge%20enquiry"
              className="button button-red"
            >
              Contact the event team <ArrowUpRight size={17} />
            </a>
            <p className="panel-note">
              2026 event date has passed. No future registration is offered on
              this site.
            </p>
          </aside>
        </section>
        <SupportBanner />
      </>
    );

  if (path === "books")
    return (
      <>
        <PageIntro
          eyebrow="Books for the team"
          title="Stories from the moor."
          description="Explore Dartmoor and the people who care for it. Books by team members, with proceeds supporting our work."
        />
        <section className="site-container section-space">
          <div className="content-grid">
            <article className="prose">
              <BookOpen
                size={34}
                strokeWidth={1.5}
                className="mb-6 text-rescue"
              />
              <h2>Moor Rescue</h2>
              <Eyebrow>BY HENRY GULY</Eyebrow>
              <p className="mt-5">
                A history of the Tavistock team, from its beginnings in 1968,
                written by a life member with 36 years of service.
              </p>
              <p>
                The published price is £10. Contact the team to confirm
                availability and arrange a purchase.
              </p>
              <a
                href="mailto:Books@dsrt-tavistock.org.uk?subject=Moor%20Rescue%20book%20enquiry"
                className="button button-red"
              >
                Enquire about Moor Rescue <ArrowUpRight size={16} />
              </a>
            </article>
            <article className="prose">
              <BookOpen
                size={34}
                strokeWidth={1.5}
                className="mb-6 text-rescue"
              />
              <h2>The Meavy Book</h2>
              <Eyebrow>BY PETER SWAINE</Eyebrow>
              <p className="mt-5">
                Eight circular walks, local history and over 200 photographs
                explore the Meavy Valley in a 130-page hardback.
              </p>
              <p>
                The published price is £25 including UK postage. Contact the
                team to confirm availability and arrange a purchase.
              </p>
              <a
                href="mailto:Books@dsrt-tavistock.org.uk?subject=Meavy%20Book%20enquiry"
                className="button button-red"
              >
                Enquire about Meavy Book <ArrowUpRight size={16} />
              </a>
            </article>
          </div>
        </section>
      </>
    );

  if (path === "privacy")
    return (
      <>
        <PageIntro
          eyebrow="Privacy & image credits"
          title="A little transparency."
          description="About this website, its content and the images used in the redesign."
        />
        <section className="site-container section-space privacy-content prose">
          <h2>About this preview</h2>
          <p>
            This is a local website built to showcase the DSRT
            Tavistock Team. Content was reviewed on 13 October 2026.
          </p>
          <h3>Your information</h3>
          <p>
            The journal stores stories and photographs in Supabase. Team
            administrators sign in using Supabase Auth; necessary session
            cookies keep them signed in. Draft stories and draft photos are
            restricted to authorised admins. This preview uses no analytics or
            marketing cookies. Searches run in your browser. Email links open
            your email application; donation and sharing links take you to the
            relevant provider, where their privacy policies apply.
          </p>
          <h3>Images and brand</h3>
          <p>
            The Dartmoor landscape and team training images are all images owned
            by the team, taken during training or on live callouts.
          </p>
          <p>
            The official Mountain Rescue England and Wales — DSRT Tavistock logo
            was supplied for this website and is used in its original colours
            and proportions. It remains the property of its rights holder.
          </p>
          <h3>Content and links</h3>
          <p>
            Recruitment and event details reflect the reviewed source
            information; please contact the team for current availability.
          </p>
          <h3>Emergency help</h3>
          <p>
            Call 999 and ask for the Police, then Mountain Rescue. Never use
            this preview, email or website contact forms to request a rescue.
          </p>
          <figure className="photo-wide">
            <Image
              src="/images/team-on-leathertor.jpg"
              alt="AI-generated illustration of Dartmoor moorland and rescue volunteers"
              fill
              sizes="(max-width: 767px) 100vw, 740px"
            />
            <figcaption>The team on Leather tor</figcaption>
          </figure>
        </section>
      </>
    );

  notFound();
}
