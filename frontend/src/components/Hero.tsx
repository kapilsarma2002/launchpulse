"use client";

import { motion } from "framer-motion";
import { IconRocket, IconArrowsShuffle, IconUsers } from "@tabler/icons-react";
import Image from "next/image";
import type { Icon as TablerIcon } from "@tabler/icons-react";
import type { SiteSettings } from "@/lib/types";

interface HeroProps {
  settings: SiteSettings;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Hero({ settings }: HeroProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="text-center space-y-8 py-16"
    >
      <motion.div variants={item} className="flex justify-center space-x-4">
        {settings?.logoUrl ? (
          <div className="relative h-12 w-48">
            <Image
              src={settings.logoUrl}
              alt={`${settings.name} logo`}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <IconRocket size={48} className="text-blue-600" stroke={1.5} />
        )}
      </motion.div>

      <motion.h1
        variants={item}
        className="text-5xl font-bold tracking-tight text-gray-900"
      >
        {settings.name}{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Waitlist
        </span>
      </motion.h1>

      <motion.p
        variants={item}
        className="text-xl text-gray-600 max-w-2xl mx-auto"
      >
        {settings.description}
      </motion.p>

      <motion.div
        variants={item}
        className="pt-4 flex justify-center space-x-8"
      >
        <Stat icon={IconUsers} value="1,000+" label="Waitlist Signups" />
        <Stat icon={IconArrowsShuffle} value="24%" label="Referral Rate" />
      </motion.div>
    </motion.div>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: TablerIcon;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Icon size={20} className="text-blue-600" />
      <div className="text-left">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  );
}
