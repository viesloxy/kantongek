"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BudgetProgressBar, { getBudgetStatus } from "./BudgetProgressBar";
import { formatCurrency } from "@/lib/calculations";

interface BudgetHeaderProps {
  currentMonth: Date;
  onMonthChange: (direction: "prev" | "next") => void;
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  overallPercentage: number;
}

const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export default function BudgetHeader({
  currentMonth,
  onMonthChange,
  totalBudget,
  totalSpent,
  totalRemaining,
  overallPercentage,
}: BudgetHeaderProps) {
  const monthName = monthNames[currentMonth.getMonth()];
  const year = currentMonth.getFullYear();
  const status = getBudgetStatus(overallPercentage);

  return (
    <motion.div
      className="mb-8 p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-black/10 dark:border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with Month Selector */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-black dark:text-white">
            Budget {monthName} {year}
          </h1>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMonthChange("prev")}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Bulan sebelumnya"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-600 dark:text-white/60" />
          </button>
          <button
            onClick={() => onMonthChange("next")}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Bulan selanjutnya"
          >
            <ChevronRight className="w-5 h-5 text-neutral-600 dark:text-white/60" />
          </button>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="space-y-4">
        <BudgetProgressBar
          percentage={overallPercentage}
          status={status}
          showLabel
          size="lg"
        />

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center">
            <p className="text-xs text-neutral-500 dark:text-white/50 mb-1">
              Total Budget
            </p>
            <p className="text-lg font-bold text-black dark:text-white">
              {formatCurrency(totalBudget)}
            </p>
          </div>
          <div className="text-center border-x border-black/5 dark:border-white/5">
            <p className="text-xs text-neutral-500 dark:text-white/50 mb-1">
              Digunakan
            </p>
            <p className="text-lg font-bold text-expense">
              {formatCurrency(totalSpent)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-neutral-500 dark:text-white/50 mb-1">
              Tersisa
            </p>
            <p className={`text-lg font-bold ${
              totalRemaining < 0 ? "text-budget-exceeded" : "text-budget-safe"
            }`}>
              {formatCurrency(Math.abs(totalRemaining))}
              {totalRemaining < 0 && " (-)"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
