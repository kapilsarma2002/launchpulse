"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  IconUsers,
  IconArrowsShuffle,
  IconChartBar,
  IconCalendar,
  IconLoader2,
} from "@tabler/icons-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { getAnalytics } from "@/lib/api";
import type { Analytics } from "@/lib/api";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics();
        setAnalytics(data);
        setError("");
      } catch (err) {
        setError("Failed to load analytics");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <IconLoader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-600">Analytics Dashboard</h1>
          <p className="text-gray-400 mt-2">
            Track your waitlist growth and referrals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-gray-500">
          <StatCard
            title="Total Signups"
            value={analytics?.totalSignups || 0}
            icon={IconUsers}
            change={analytics?.signupsToday || 0}
            changeLabel="today"
          />
          <StatCard
            title="Total Referrals"
            value={analytics?.totalReferrals || 0}
            icon={IconArrowsShuffle}
            change={analytics?.referralsToday || 0}
            changeLabel="today"
          />
          <StatCard
            title="Conversion Rate"
            value={`${(analytics?.conversionRate || 0).toFixed(1)}%`}
            icon={IconChartBar}
          />
          <StatCard
            title="Today's Growth"
            value={analytics?.signupsToday || 0}
            icon={IconCalendar}
            change={analytics?.referralsToday || 0}
            changeLabel="from referrals"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-medium mb-4 text-gray-500">Growth Over Time</h3>
            <div className="h-64">
              <GrowthChart data={analytics?.dailyGrowth || []} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-medium mb-4 text-gray-500">Referral Sources</h3>
            <div className="h-64">
              <ReferralChart data={analytics?.referralSources || []} />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function GrowthChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="signups"
          name="Total Signups"
          stroke="#4F46E5"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="referrals"
          name="Referrals"
          stroke="#10B981"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function ReferralChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="source" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="count"
          name="Number of Signups"
          fill="#4F46E5"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeLabel,
}: {
  title: string;
  value: number | string;
  icon: (props: { size: number; className: string }) => JSX.Element;
  change?: number;
  changeLabel?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 bg-white rounded-xl shadow-sm border border-gray-100"
    >
      <div className="flex justify-between items-start mb-2">
        <Icon size={24} className="text-blue-600" />
        <div className="text-xs text-gray-500 flex items-center">
          {change !== undefined && (
            <>
              <span className={change > 0 ? "text-green-600" : "text-gray-600"}>
                +{change}
              </span>
              <span className="ml-1">{changeLabel}</span>
            </>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </motion.div>
  );
}
