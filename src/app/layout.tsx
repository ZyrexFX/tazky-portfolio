import type { Metadata, Viewport } from "next";
import { DM_Sans, Newsreader } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/data/site";
import "./globals.css";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const serif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} | Portfolio`,
    template: `%s | ${site.name}`,
  },
  description:
    "Tazky Ferliansyah is learning UI/UX and software engineering in Indonesia, building small projects for the web with JavaScript, Python, MySQL, and MongoDB.",
  applicationName: `${site.name} Portfolio`,
  authors: [{ name: site.name, url: site.githubUrl }],
  keywords: [
    "Tazky Ferliansyah",
    "Tazky",
    "ZyrexFX",
    "portfolio",
    "UI/UX",
    "software engineering",
    "web developer",
    "JavaScript",
    "Python",
    "flagmint",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: `${site.name} | Portfolio`,
    description:
      "Learning UI/UX and software engineering in Indonesia, building for the web with JavaScript and Python, then keeping the data tidy in MySQL or MongoDB.",
    siteName: site.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#131b2b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent-solid focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-paper"
        >
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
