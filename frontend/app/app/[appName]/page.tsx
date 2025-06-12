"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import WaitlistForm from "@/components/WaitlistForm";
import Features from "@/components/Features";
import { getSiteSettings } from "@/lib/api";
import type { SiteSettings } from "@/lib/types";

export default function AppLandingPage({
  params,
}: {
  params: { appName: string };
}) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSiteSettings();
        // Only show the page if the app name matches
        if (data.name.toLowerCase().replace(/\s+/g, "-") !== params.appName) {
          notFound();
        }
        setSettings(data);
      } catch (error) {
        console.error("Error fetching settings:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [params.appName]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!settings) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 max-w-5xl">
      <Hero settings={settings} />
      <WaitlistForm appName={params.appName} />
      <Features />
    </div>
  );
}
