import type { Metadata } from "next";
import { Space_Grotesk, Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

// Force dynamic rendering for all pages (no static generation)
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "CyberAcademy - Master Cybersecurity from Zero to Hero",
  description: "Industry-leading cybersecurity courses taught by certified ethical hackers and security experts. Join 10,000+ students learning penetration testing, ethical hacking, and network security.",
  keywords: ["cybersecurity", "ethical hacking", "penetration testing", "security courses", "CEH", "OSCP"],
  authors: [{ name: "CyberAcademy" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cyberacademy.com",
    title: "CyberAcademy - Master Cybersecurity from Zero to Hero",
    description: "Industry-leading cybersecurity courses taught by certified ethical hackers and security experts.",
    siteName: "CyberAcademy",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${firaCode.variable} font-body bg-gradient-dark text-text-primary antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
