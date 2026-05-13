"use client";

import { motion } from "framer-motion";

export type BudgetStatus = "safe" | "warning" | "danger" | "exceeded";

interface BudgetProgressBarProps {
  percentage: number;
  status: BudgetStatus;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

const statusColors: Record<BudgetStatus, string> = {
  safe: "bg-budget-safe",
  warning: "bg-budget-warning",
  danger: "bg-budget-danger",
  exceeded: "bg-budget-exceeded",
};

const statusLabels: Record<BudgetStatus, string> = {
  safe: "Aman",
  warning: "Hati-hati",
  danger: "Bahaya",
  exceeded: "Melebihi",
};

const sizeClasses = {
  sm: "h-1.5",
  md: "h-3",
  lg: "h-4",
};

export function getBudgetStatus(percentage: number): BudgetStatus {
  if (percentage >= 100) return "exceeded";
  if (percentage >= 90) return "danger";
  if (percentage >= 70) return "warning";
  return "safe";
}

export default function BudgetProgressBar({
  percentage,
  status,
  showLabel = false,
  size = "md",
  animated = true,
}: BudgetProgressBarProps) {
  const displayPercentage = Math.min(percentage, 100);
  const colorClass = statusColors[status];

  return (
    <div className="w-full">
      <div
        className={`w-full ${sizeClasses[size]} bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden`}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${percentage}% digunakan`}
      >
        {animated ? (
          <motion.div
            className={`h-full rounded-full ${colorClass}`}
            initial={{ width: 0 }}
            animate={{ width: `${displayPercentage}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        ) : (
          <div
            className={`h-full rounded-full ${colorClass}`}
            style={{ width: `${displayPercentage}%` }}
          />
        )}
      </div>

      {showLabel && (
        <div className="flex justify-between items-center mt-1.5">
          <span className={`text-xs font-medium ${
            status === "exceeded" ? "text-budget-exceeded" :
            status === "danger" ? "text-budget-danger" :
            status === "warning" ? "text-budget-warning" :
            "text-budget-safe"
          }`}>
            {statusLabels[status]}
          </span>
          <span className="text-xs text-neutral-500 dark:text-white/50">
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  );
}
