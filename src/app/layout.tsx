import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/site";
import { AuthInviteCapture } from "@/components/auth-invite-capture";
import "./globals.css";
import "./journal.css";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dartmoor Search & Rescue Tavistock | Here for you",
    template: "%s | DSRT Tavistock",
  },
  description:
    "Volunteer search and rescue on Dartmoor. Discover our team, read call-out reports and help keep us ready, 24 hours a day, 365 days a year.",
  icons: {
    icon: { url: "/images/dsrt-tavistock-official.png", type: "image/png" },
    apple: "/images/dsrt-tavistock-official.png",
  },
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" data-scroll-behavior="smooth">
      <body className={`${sans.variable} ${display.variable}`}>
        <AuthInviteCapture />
        <Header />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
