import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/context/ThemeContext";
import { ForecastProvider } from "@/lib/context/ForecastContext";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Thai Stock AI",
  description: "Thai stock market analysis, technical indicators, and AI-assisted forecasting",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={ibmPlexMono.variable}>
        <ThemeProvider>
          <ForecastProvider>
            {children}
          </ForecastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
