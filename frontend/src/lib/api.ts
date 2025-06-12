const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface SiteSettings {
  name: string;
  description: string;
  logoUrl: string;
}

export interface Analytics {
  totalSignups: number;
  totalReferrals: number;
  signupsToday: number;
  referralsToday: number;
  conversionRate: number;
  dailyGrowth: Array<{
    date: string;
    signups: number;
    referrals: number;
  }>;
  referralSources: Array<{
    source: string;
    count: number;
  }>;
}

export async function getSiteSettings(appName?: string): Promise<SiteSettings> {
  const url = appName
    ? `${API_URL}/api/settings/${appName}`
    : `${API_URL}/api/settings`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch site settings");
  return res.json();
}

export async function updateSiteSettings(
  settings: SiteSettings
): Promise<SiteSettings> {
  const res = await fetch(`${API_URL}/api/settings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error("Failed to update site settings");
  return res.json();
}

export async function signup(
  email: string,
  referralCode?: string,
  appName?: string
) {
  const res = await fetch(`${API_URL}/api/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, referralCode, appName }),
  });
  if (!res.ok) throw new Error("Failed to sign up");
  return res.json();
}

export async function getAnalytics(): Promise<Analytics> {
  const res = await fetch(`${API_URL}/api/analytics`);
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
}
