import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import SessionProviderWrapper from "@/components/session-provider-wrapper";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer/footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hixcode.vercel.app"),
  title: {
    default: "hixCode — Showcase your GitHub projects",
    template: "%s · hixCode",
  },
  description:
    "Present your GitHub repositories as a clean, structured, developer-friendly portfolio. Discover projects, connect with developers, and get inspired.",
  keywords: ["GitHub", "portfolio", "developer", "projects", "open source"],
  openGraph: {
    title: "hixCode — Showcase your GitHub projects",
    description:
      "Present your GitHub repositories as a clean, structured, developer-friendly portfolio.",
    url: "https://hixcode.vercel.app",
    siteName: "hixCode",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "hixCode — Showcase your GitHub projects",
    description:
      "Present your GitHub repositories as a clean, structured, developer-friendly portfolio.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          poppins.className
        )}
      >
        <ThemeProvider>
          <SessionProviderWrapper>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow container mx-auto px-4 py-8">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
          </SessionProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
