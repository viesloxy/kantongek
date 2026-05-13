"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

interface DashboardHeaderProps {
  className?: string;
}

export default function DashboardHeader({ className = "" }: DashboardHeaderProps) {
  const { settings } = useDashboard();

  // Get current date in Indonesian format
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const formattedDate = today.toLocaleDateString("id-ID", dateOptions);

  return (
    <motion.div
      className={`mb-8 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Greeting */}
      <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-2 text-black dark:text-white">
        Selamat Datang, <span className="text-primary">{settings.name}</span>
      </h1>

      {/* Current date with icon */}
      <div className="flex items-center gap-2 text-neutral-600 dark:text-white/50">
        <Calendar className="w-4 h-4" />
        <p className="text-sm md:text-base">{formattedDate}</p>
      </div>

      {/* Quick summary subtitle */}
      <p className="mt-3 text-sm text-neutral-500 dark:text-white/40">
        Ini ringkasan keuangan kamu bulan ini
      </p>
    </motion.div>
  );
}