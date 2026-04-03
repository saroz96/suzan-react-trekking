import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import Header from "@/app/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Nepal Trekking & Adventures",
    template: "%s | Nepal Trekking & Adventures",
  },
  description:
    "Experience the best trekking adventures in Nepal. Book Everest Base Camp, Annapurna Circuit, and more with expert guides.",
  keywords: [
    "nepal trekking",
    "everest base camp",
    "annapurna circuit",
    "himalayan trek",
    "adventure travel",
  ],
  authors: [{ name: "Nepal Trekking & Adventures" }],
  openGraph: {
    title: "Nepal Trekking & Adventures",
    description: "Experience the best trekking adventures in Nepal",
    url: "https://yourdomain.com",
    siteName: "Nepal Trekking & Adventures",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nepal Trekking Adventures",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepal Trekking & Adventures",
    description: "Experience the best trekking adventures in Nepal",
    images: ["/og-image.jpg"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers>
          <Header />
          <main className="flex-grow">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
