import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Samadhan Bodkhe — AI & Machine Learning Engineer Portfolio",
  description:
    "Professional portfolio of Samadhan Bodkhe, AI & Machine Learning Engineer, Software Engineer, and Full Stack Developer. Discover machine learning architectures, blockchain smart contracts, and production-ready Next.js products.",
  keywords: [
    "Samadhan Bodkhe",
    "AI Engineer",
    "Machine Learning Engineer",
    "Software Engineer",
    "Full Stack Developer",
    "Blockchain Developer",
    "Solidity Smart Contracts",
    "TensorFlow CNN",
    "React Next.js",
  ],
  authors: [{ name: "Samadhan Bodkhe" }],
  openGraph: {
    title: "Samadhan Bodkhe — AI & Machine Learning Engineer Portfolio",
    description:
      "Discover Samadhan Bodkhe's AI model designs, blockchain systems, and full-stack solutions.",
    type: "profile",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Samadhan Bodkhe — AI & Machine Learning Engineer Portfolio",
    description:
      "Discover Samadhan Bodkhe's AI model designs, blockchain systems, and full-stack solutions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Inject structured JSON-LD data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Samadhan Bodkhe",
    "jobTitle": "AI & Machine Learning Engineer, Software Engineer",
    "email": "samadhanbodkhe222@gmail.com",
    "url": "https://samadhanbodkhe.dev",
    "sameAs": [
      "https://github.com/samadhannnn",
      "https://www.linkedin.com/in/samadhan-bodkhe-766308270/"
    ]
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Anti-flash inline script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'dark';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `
          }}
        />
        {/* Structured schema.org JSON-LD data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
