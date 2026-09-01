import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Newsreader } from "next/font/google";
import Link from "next/link";
import "./globals.css";

import { SiteHeader } from "@/components/navigation/SiteHeader";

const display = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const SITE_DESCRIPTION =
  "Summit Socials runs Prompt to Product — a hands-on workshop where you go from an idea to a working AI-powered app in one afternoon.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: "Summit Socials — Prompt to Product",
  description: SITE_DESCRIPTION,
  openGraph: {
    title: "Summit Socials — Prompt to Product",
    description: SITE_DESCRIPTION,
    siteName: "Summit Socials",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Summit Socials — Prompt to Product",
    description: "Connecting builders, shipping tomorrow's tech.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="min-h-dvh bg-cream text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-rule-strong focus:bg-surface focus:px-3 focus:py-2 focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

function SiteFooter() {
  const cols: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: "Event",
      links: [
        { label: "What's on", href: "/#whats-on" },
        { label: "Inside the day", href: "/#inside" },
        { label: "Reserve a seat", href: "/register" },
      ],
    },
    {
      title: "Account",
      links: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Sign in", href: "/login" },
      ],
    },
  ];

  return (
    <footer className="border-t border-rule bg-cream">
      <div className="wrap grid gap-10 py-16 md:grid-cols-[1.6fr_1fr_1fr]">
        <div className="max-w-xs">
          <span className="font-display text-xl font-medium text-ink">
            Summit Socials
          </span>
          <p className="mt-3 font-display text-lg italic leading-snug text-ink-soft">
            Connecting builders, shipping tomorrow&rsquo;s tech.
          </p>
          <p className="meta mt-4">SRMIST, Kattankulathur</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="font-mono text-xs uppercase tracking-wider text-ink-faint">
              {c.title}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-ink-soft underline-offset-2 hover:text-ink hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="wrap border-t border-rule py-6">
        <p className="meta">Built by Summit Socials.</p>
      </div>
    </footer>
  );
}
