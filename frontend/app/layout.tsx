import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LaunchPulse - Turn Your Waitlist into a Growth Engine",
  description: "Create viral waitlists with built-in referral tracking, analytics, and automated emails",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased bg-background text-foreground`}
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <main className="flex-1">
              <div className="h-[calc(100vh-4rem)] bg-white">
                {children}
              </div>
            </main>
            <footer className="glass glass-border mt-auto py-6 bg-black">
              <div className="container text-center text-sm text-muted-foreground">
                <p>
                  © {new Date().getFullYear()} LaunchPulse. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
