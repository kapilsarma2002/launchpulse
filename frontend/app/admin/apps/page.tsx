"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { IconUsers } from "@tabler/icons-react";
import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { getSiteSettings } from "@/lib/api";

export default function AppsPage() {
  const [apps, setApps] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await getSiteSettings();
        setApps(data);
      } catch (error) {
        console.error("Error fetching apps:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!apps) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">
          No apps found. Create your first app to get started.
        </div>
      </div>
    );
  }

  const appSlug = apps.name.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Apps</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white">
          <CardBody>
            <div className="flex flex-col space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{apps.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{apps.description}</p>
              </div>
              <div className="flex space-x-3">
                <Link href={`/admin/apps/${appSlug}/users`} className="flex-1">
                  <Button
                    className="w-full"
                    color="primary"
                    variant="flat"
                    startContent={<IconUsers size={20} />}
                  >
                    View Users
                  </Button>
                </Link>
                <Link href={`/app/${appSlug}`} className="flex-1">
                  <Button className="w-full" variant="bordered">
                    View Page
                  </Button>
                </Link>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
