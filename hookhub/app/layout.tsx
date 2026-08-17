import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const SITE_URL = "https://claudecodehub.vercel.app";
const SITE_DESCRIPTION = "Discover open-source hooks, plugins, and RAG tools for Claude Code.";

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
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
