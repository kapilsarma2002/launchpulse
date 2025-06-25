export interface DailySignup {
  date: string;
  count: number;
}

export interface TopReferrer {
  email: string;
  refCount: number;
}

export interface Analytics {
  totalSignups: number;
  totalReferrals: number;
  signupsToday: number;
  referralsToday: number;
  conversionRate: number;
  dailyGrowth: { date: string; signups: number; referrals: number }[];
  referralSources: { source: string; count: number }[];
}

export interface SiteSettings {
  waitlistOpen: boolean;
  appName: string;
  description: string;
}

export async function getAnalytics(
  siteSettingsId?: string
): Promise<Analytics> {
  const url = siteSettingsId
    ? `/api/analytics?siteSettingsId=${siteSettingsId}`
    : "/api/analytics";
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch analytics");
  }
  return res.json();
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const res = await fetch(`/api/settings`);

  if (!res.ok) {
    throw new Error("Failed to fetch site settings");
  }

  return res.json();
}

export async function updateSiteSettings(
  settings: Partial<SiteSettings>
): Promise<SiteSettings> {
  const res = await fetch(`/api/settings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  });

  if (!res.ok) {
    throw new Error("Failed to update site settings");
  }

  return res.json();
}

export async function signup(
  email: string,
  referralCode?: string,
  appName?: string
) {
  const res = await fetch(`localhost:3000/api/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, referralCode, appName }),
  });
  if (!res.ok) throw new Error("Failed to sign up");
  return res.json();
}
