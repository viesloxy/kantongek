"use client";

import { motion } from "framer-motion";

export type PeriodType = "weekly" | "monthly" | "yearly";

interface StatsHeaderProps {
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
}

const periodLabels: Record<PeriodType, string> = {
  weekly: "Mingguan",
  monthly: "Bulanan",
  yearly: "Tahunan",
};

export default function StatsHeader({
  selectedPeriod,
  onPeriodChange,
}: StatsHeaderProps) {
  const periods: PeriodType[] = ["weekly", "monthly", "yearly"];

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-black dark:text-white">
        Statistik
      </h1>
      <p className="text-neutral-600 dark:text-white/50 mt-1">
        Visualisasi data keuangan kamu
      </p>

      {/* Period Selector */}
      <div className="flex gap-2 mt-4 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl w-fit">
        {periods.map((period) => (
          <button
            key={period}
            onClick={() => onPeriodChange(period)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedPeriod === period
                ? "bg-white dark:bg-neutral-900 text-primary shadow-sm"
                : "text-neutral-600 dark:text-white/50 hover:text-primary"
            }`}
          >
            {periodLabels[period]}
          </button>
        ))}
      </div>
    </motion.div>
  );
}