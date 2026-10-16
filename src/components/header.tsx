"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Heart, Menu, Phone, X } from "lucide-react";
import { navigation } from "@/lib/content";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuButton = useRef<HTMLButtonElement>(null);
  const mobileNav = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
      if (event.key === "Tab") {
        const items = [
          menuButton.current,
          ...Array.from(
            mobileNav.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [],
          ),
        ].filter(Boolean) as HTMLElement[];
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const media = window.matchMedia("(min-width: 1100px)");
    const onResize = () => {
      if (media.matches) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    media.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      media.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="emergency-strip">
        <div className="site-container flex items-center justify-between gap-4">
          <span className="emergency-message">
            <Phone size={12} aria-hidden="true" />
            <span>
              In an emergency, call <a href="tel:999">999</a>. Ask for{" "}
              <strong>Police</strong>, then <strong>Mountain Rescue.</strong>
            </span>
          </span>
          <span className="strip-note">VOLUNTEERS. ON CALL. ALWAYS.</span>
        </div>
      </div>
      <header className="site-header">
        <div className="site-container header-inner">
          <Link
            href="/"
            className="brand"
            aria-label="Dartmoor Search and Rescue Tavistock home"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/images/dsrt-tavistock-official.png"
              alt=""
              width={1028}
              height={1196}
              sizes="(max-width: 767px) 44px, 60px"
              className="brand-badge"
              preload
            />
            <span className="brand-type">
              <strong>DARTMOOR</strong>
              <span>SEARCH & RESCUE</span>
              <small>TAVISTOCK</small>
            </span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={
                  pathname.startsWith(item.href) ? "page" : undefined
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/support-us/donate"
              className="button button-red header-donate"
              onClick={() => setOpen(false)}
            >
              <Heart size={16} /> <span>Donate</span>
              <ArrowUpRight size={16} />
            </Link>
            <button
              className="menu-toggle"
              ref={menuButton}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {open && (
          <nav
            ref={mobileNav}
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Mobile navigation"
          >
            <span className="eyebrow">EXPLORE THE TEAM</span>
            {[
              { href: "/", label: "Home" },
              ...navigation,
              { href: "/latest-news", label: "Latest news" },
              { href: "/11tors", label: "11 Tors Challenge" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
              >
                {item.label}
                <ArrowUpRight size={22} />
              </Link>
            ))}
            <p>
              Here for Dartmoor.
              <br />
              Here for you.
            </p>
          </nav>
        )}
      </header>
    </>
  );
}
