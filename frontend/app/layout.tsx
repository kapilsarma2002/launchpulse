import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

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
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1">
            <div className="min-h-[calc(100vh-4rem)] bg-gradient-light dark:bg-gradient-dark">
              {children}
            </div>
          </main>
          <footer className="glass glass-border mt-auto py-6">
            <div className="container text-center text-sm text-muted-foreground">
              <p>
                © {new Date().getFullYear()} LaunchPulse. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
