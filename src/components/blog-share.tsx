"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check, Copy, Facebook, Linkedin, Share2, Twitter } from "lucide-react";

// Original implementation of the interaction shown at shadcn.io/blocks/blog-share.
const subscribeUrl = (notify: () => void) => {
  window.addEventListener("popstate", notify);
  return () => window.removeEventListener("popstate", notify);
};
const currentUrl = () => `${window.location.origin}${window.location.pathname}`;
const serverUrl = () => "";

export function BlogShare({ title }: { title: string }) {
  const url = useSyncExternalStore(subscribeUrl, currentUrl, serverUrl);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setCopyError(false);
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyError(true);
    }
  }
  const encoded = encodeURIComponent(url);
  return (
    <section className="blog-share" aria-label="Share this article">
      <div className="share-heading">
        <Share2 size={20} aria-hidden="true" />
        <h2>Share this story</h2>
      </div>
      <p>{title}</p>
      <div className="share-buttons">
        {[
          {
            label: "Twitter / X",
            Icon: Twitter,
            href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodeURIComponent(title)}`,
          },
          {
            label: "LinkedIn",
            Icon: Linkedin,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
          },
          {
            label: "Facebook",
            Icon: Facebook,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
          },
        ].map(({ label, Icon, href }) => (
          <a
            key={label}
            href={url ? href : undefined}
            aria-disabled={!url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${label} (opens in a new tab)`}
          >
            <Icon size={16} aria-hidden="true" />
            {label}
          </a>
        ))}
        <button type="button" onClick={copyLink} disabled={!url}>
          {copied ? <Check size={16} /> : <Copy size={16} />}{" "}
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
      <span className="sr-only" role="status">
        {copied ? "Article link copied to clipboard." : ""}
      </span>
      {copyError && (
        <label className="copy-fallback">
          Copy this address manually
          <input readOnly value={url} onFocus={(e) => e.target.select()} />
        </label>
      )}
    </section>
  );
}
