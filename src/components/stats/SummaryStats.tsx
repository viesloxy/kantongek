"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, BarChart3 } from "lucide-react";
import { formatCurrency } from "@/lib/calculations";

interface SummaryStatsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  averageSpending: number;
}

export default function SummaryStats({
  totalIncome,
  totalExpense,
  balance,
  averageSpending,
}: SummaryStatsProps) {
  const stats = [
    {
      label: "Total Income",
      value: totalIncome,
      icon: TrendingUp,
      color: "text-income",
      bgColor: "bg-income/10",
      format: true,
    },
    {
      label: "Total Expense",
      value: totalExpense,
      icon: TrendingDown,
      color: "text-expense",
      bgColor: "bg-expense/10",
      format: true,
    },
    {
      label: "Balance",
      value: balance,
      icon: Wallet,
      color: balance >= 0 ? "text-income" : "text-expense",
      bgColor: balance >= 0 ? "bg-income/10" : "bg-expense/10",
      format: true,
    },
    {
      label: "Rata-rata",
      value: averageSpending,
      icon: BarChart3,
      color: "text-primary",
      bgColor: "bg-primary/10",
      format: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            className="bg-white dark:bg-neutral-900 rounded-xl border border-black/10 dark:border-white/10 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <span className="text-xs text-neutral-500 dark:text-white/50">
                {stat.label}
              </span>
            </div>
            <p className={`text-lg font-bold ${stat.color}`}>
              {stat.format ? formatCurrency(Math.abs(stat.value)) : stat.value}
              {stat.label === "Balance" && stat.value < 0 && " (-)"}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}