"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { IconMail, IconLoader2, IconCheck } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { signup } from "@/lib/api";

interface WaitlistFormProps {
  appName: string;
}

export default function WaitlistForm({ appName }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref") || undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      await signup(email, refCode, appName);
      setStatus("success");
      setEmail("");
    } catch (error) {
      console.error("Error:", error);
      setStatus("error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="max-w-md mx-auto"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <IconMail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-3 text-black placeholder:text-gray-400 rounded-lg border border-gray-300 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                     disabled:opacity-50 transition-colors"
          >
            {status === "loading" ? (
              <IconLoader2 className="animate-spin" size={20} />
            ) : status === "success" ? (
              <IconCheck size={20} />
            ) : (
              "Join Waitlist"
            )}
          </button>
        </div>

        {status === "success" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-sm text-green-600"
          >
            🎉 Thanks for joining! Check your email for your referral link.
          </motion.p>
        )}
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-sm text-red-600"
          >
            Something went wrong. Please try again.
          </motion.p>
        )}

        {refCode && (
          <p className="mt-2 text-sm text-gray-500">
            Joining via referral code: {refCode}
          </p>
        )}
      </form>
    </motion.div>
  );
}
