"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface App {
  name: string;
  description: string;
  logoUrl: string;
}

export default function BrandingPage() {
  const [appData, setAppData] = useState<App>({
    name: "",
    description: "",
    logoUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const res = await fetch("/api/branding");
        if (!res.ok) throw new Error("Failed to fetch branding");
        const data: App = await res.json();
        setAppData(data);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchBranding();
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/branding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appData),
      });

      if (!res.ok) throw new Error("Failed to update settings");
      // Show success message or redirect
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 text-gray-600"
      >
        <div>
          <h1 className="text-3xl font-bold">Brand Settings</h1>
          <p className="text-gray-600 mt-2">
            Customize your waitlist landing page
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Website Name
            </label>
            <input
              type="text"
              value={appData.name}
              onChange={(e) =>
                setAppData({ ...appData, name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={appData.description}
              onChange={(e) =>
                setAppData({ ...appData, description: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Logo URL
            </label>
            <input
              type="url"
              value={appData.logoUrl}
              onChange={(e) =>
                setAppData({ ...appData, logoUrl: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="https://example.com/logo.png"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
