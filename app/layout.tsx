import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Quoex — Enterprise B2B Software Solutions",
  description:
    "We build world-class B2B platforms, marketplaces, and SaaS products. Custom full-stack development, AI integration, and enterprise-grade software for ambitious companies.",
  keywords: [
    "B2B software development",
    "enterprise marketplace",
    "SaaS development",
    "full-stack developer Kenya",
    "custom software Africa",
    "AI integration",
    "Next.js developer",
    "Supabase",
  ],
  authors: [{ name: "Quoex Technologies" }],
  creator: "Quoex Technologies",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://quoex.vercel.app",
    title: "Quoex — Enterprise B2B Software Solutions",
    description:
      "We build world-class B2B platforms, marketplaces, and SaaS products for ambitious companies.",
    siteName: "Quoex",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Quoex Technologies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quoex — Enterprise B2B Software Solutions",
    description: "Custom full-stack B2B platforms, AI-powered marketplaces, and enterprise SaaS.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en" className="dark">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Quoex Technologies",
                url: "https://quoex.vercel.app",
                description: "Enterprise B2B software development company",
                areaServed: "Worldwide",
                serviceType: [
                  "B2B Marketplace Development",
                  "SaaS Platform Development",
                  "AI Integration",
                  "Full-Stack Development",
                ],
              }),
            }}
          />
        </head>
        <body className="min-h-screen bg-[#05060F] text-[#F0F0FF]">{children}</body>
      </html>
    </ClerkProvider>
  );
}
