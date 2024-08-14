import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Providers } from "@/providers";
import type { Metadata } from "next";
import { Courier_Prime as FontMono, Inter as FontSans } from "next/font/google";
import "./globals.css";

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Time Tracker",
  description: "Basic time tracking app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <Providers>
        <body
          className={cn([
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable,
            fontMono.variable,
          ])}
        >
          <Navbar />
          {children}
          <Toaster />
        </body>
      </Providers>
    </html>
  );
}
