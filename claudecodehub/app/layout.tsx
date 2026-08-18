import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Script from "next/script";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

// Runs before hydration so the page never paints in the wrong theme: applies
// the user's saved choice, or the OS preference if they haven't chosen yet.
const THEME_INIT_SCRIPT = `
  document.documentElement.classList.toggle(
    "dark",
    localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
  );
`;

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const SITE_URL = "https://claudecodehub.vercel.app";
const SITE_DESCRIPTION =
  "Discover open-source hooks, plugins, RAG, agents, workflows, commands, and more tools for Claude Code.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "ClaudeCodeHub",
  description: SITE_DESCRIPTION,
  openGraph: {
    title: "ClaudeCodeHub",
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: "ClaudeCodeHub",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ClaudeCodeHub",
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
