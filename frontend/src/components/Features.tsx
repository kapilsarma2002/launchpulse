"use client";

import { motion } from "framer-motion";
import {
  IconGift,
  IconChartBar,
  IconMail,
  IconArrowRight,
} from "@tabler/icons-react";

const features = [
  {
    icon: IconGift,
    title: "Referral Tracking",
    description: "Automatically track and reward users who bring others",
  },
  {
    icon: IconChartBar,
    title: "Analytics Dashboard",
    description: "Monitor signups and viral growth in real-time",
  },
  {
    icon: IconMail,
    title: "Email Automation",
    description: "Send personalized welcome emails with referral links",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Features() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="py-16 grid grid-cols-1 md:grid-cols-3 gap-8"
    >
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          variants={item}
          className="group p-6 rounded-xl bg-white shadow-sm border border-gray-100 
                     hover:shadow-md transition-all hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <feature.icon size={32} className="text-blue-600" stroke={1.5} />
            <IconArrowRight
              size={20}
              className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
          <h3 className="text-gray-600 font-semibold text-lg mb-2">{feature.title}</h3>
          <p className="text-gray-400">{feature.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
