import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/context/ThemeContext";
import { ForecastProvider } from "@/lib/context/ForecastContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { CookieBanner } from "@/components/ui/CookieBanner";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Thai Stock AI",
  description: "Thai stock market analysis, technical indicators, and AI-assisted forecasting",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  // Explicit charset ensures Thai characters render correctly across all browsers/CDNs
  other: { charset: "utf-8" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={ibmPlexMono.variable}>
        <ThemeProvider>
          <AuthProvider>
            <ForecastProvider>
              {children}
              <CookieBanner />
            </ForecastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
