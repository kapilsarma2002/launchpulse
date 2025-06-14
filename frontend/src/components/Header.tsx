"use client";

import { IconRocket } from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <div className="flex items-center space-x-8">
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-900 hover:text-gray-600 transition-colors"
              >
                <IconRocket className="h-6 w-6" />
                <span className="font-semibold text-lg">LaunchPulse</span>
              </Link>
            </motion.div>

            <div className="hidden md:flex space-x-8">
              <Link
                href="/admin/analytics"
                className={`${
                  pathname === "/admin/analytics"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                } px-1 py-4 text-sm font-medium`}
              >
                Analytics
              </Link>
              <Link
                href="/admin/apps"
                className={`${
                  pathname === "/admin/apps"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                } px-1 py-4 text-sm font-medium`}
              >
                Apps
              </Link>
              <Link
                href="/admin/branding"
                className={`${
                  pathname === "/admin/branding"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                } px-1 py-4 text-sm font-medium`}
              >
                Branding
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
