"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PiggyBank, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useDashboard } from "@/context/DashboardContext";
import { useBudgetOverview } from "@/hooks/useDashboard";
import { formatCurrency } from "@/lib/calculations";

interface BudgetOverviewProps {
  className?: string;
}

interface BudgetItemProps {
  category: string;
  name: string;
  used: number;
  percentage: number;
  remaining: number;
  formattedUsed: string;
  formattedRemaining: string;
  formattedLimit: string;
  isOverBudget: boolean;
  isWarning: boolean;
  isSafe: boolean;
}

function BudgetItem({
  category,
  name,
  used,
  percentage,
  remaining,
  formattedUsed,
  formattedRemaining,
  formattedLimit,
  isOverBudget,
  isWarning,
  isSafe,
}: BudgetItemProps) {
  // Determine progress bar color
  const getProgressColor = () => {
    if (isOverBudget) return "bg-expense";
    if (isWarning) return "bg-warning";
    if (isSafe) return "bg-primary";
    return "bg-primary";
  };

  // Calculate actual percentage for display (cap at 100%)
  const displayPercentage = Math.min(percentage, 100);
  const actualSpent = percentage > 100 ? used : used;
  const actualFormatted = formatCurrency(actualSpent);

  return (
    <div className="space-y-2">
      {/* Category name and percentage */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-black dark:text-white">{name}</span>
        <span className={`text-sm font-medium ${
          isOverBudget ? "text-expense" : isWarning ? "text-warning" : "text-neutral-600 dark:text-white/50"
        }`}>
          {Math.round(percentage)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${getProgressColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${displayPercentage}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </div>

      {/* Budget details */}
      <div className="flex justify-between items-center text-xs text-neutral-500 dark:text-white/40">
        <span>{actualFormatted} / {formattedLimit}</span>
        <span className={isOverBudget ? "text-expense" : "text-income"}>
          {isOverBudget ? "Melebihi budget" : `Tersisa: ${formattedRemaining}`}
        </span>
      </div>
    </div>
  );
}

export default function BudgetOverview({ className = "" }: BudgetOverviewProps) {
  const { settings, transactions } = useDashboard();
  const budgetData = useBudgetOverview(transactions, settings.monthlyBudget);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="rounded-2xl border-black/5 dark:border-white/5" padding="none">
        {/* Header */}
        <div className="p-6 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <PiggyBank className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-black dark:text-white">
                  Budget Bulan Ini
                </h3>
                <p className="text-xs text-neutral-500 dark:text-white/40">
                  {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/budget"
              className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors"
            >
              Kelola
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Budget items */}
        <div className="p-6 space-y-6">
          <motion.div
            className="space-y-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {budgetData.map((budget) => (
              <motion.div key={budget.category} variants={itemVariants}>
                <BudgetItem
                  category={budget.category}
                  name={budget.name}
                  used={budget.used}
                  percentage={budget.percentage}
                  remaining={budget.remaining}
                  formattedUsed={budget.formattedUsed}
                  formattedRemaining={budget.formattedRemaining}
                  formattedLimit={budget.formattedLimit}
                  isOverBudget={budget.isOverBudget}
                  isWarning={budget.isWarning}
                  isSafe={budget.isSafe}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}