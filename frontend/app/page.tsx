"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  IconRocket,
  IconArrowRight,
  IconBrandGithub,
} from "@tabler/icons-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <motion.div
        className="container mx-auto px-4 py-16 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <div className="text-center space-y-12">
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex justify-center">
              <motion.div
                className="p-4 bg-blue-600 rounded-full inline-block"
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                <IconRocket size={48} className="text-white" />
              </motion.div>
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
              Launch Your Next
              <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Big Idea
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              Create viral waitlists, track referrals, and build momentum before
              you launch. Perfect for startups, products, and side projects.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/admin/login">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Get Started
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <IconArrowRight size={20} />
                </motion.div>
              </motion.button>
            </Link>
            <Link
              href="https://github.com/yourusername/launchpulse"
              target="_blank"
            >
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-100 dark:bg-gray-800 rounded-full text-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <IconBrandGithub size={20} />
                Star on GitHub
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={itemVariants}
          className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {[
            {
              title: "Beautiful Waitlist Pages",
              description:
                "Customize your landing page with your branding, logo, and messaging.",
            },
            {
              title: "Viral Referrals",
              description:
                "Turn signups into advocates with built-in referral tracking.",
            },
            {
              title: "Real-time Analytics",
              description:
                "Track growth, referral sources, and conversion rates.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl"
            >
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
