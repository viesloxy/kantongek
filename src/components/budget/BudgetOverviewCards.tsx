"use client";

import { motion } from "framer-motion";
import { Wallet, TrendingDown, PiggyBank } from "lucide-react";
import { formatCurrency } from "@/lib/calculations";

interface BudgetOverviewCardsProps {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
}

export default function BudgetOverviewCards({
  totalBudget,
  totalSpent,
  totalRemaining,
}: BudgetOverviewCardsProps) {
  const cards = [
    {
      label: "Total Budget",
      value: totalBudget,
      icon: Wallet,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Sudah Digunakan",
      value: totalSpent,
      icon: TrendingDown,
      color: "text-expense",
      bgColor: "bg-expense/10",
    },
    {
      label: "Sisa Budget",
      value: totalRemaining,
      icon: PiggyBank,
      color: totalRemaining >= 0 ? "text-budget-safe" : "text-budget-exceeded",
      bgColor: totalRemaining >= 0 ? "bg-budget-safe/10" : "bg-budget-exceeded/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            className="bg-white dark:bg-neutral-900 rounded-2xl border border-black/10 dark:border-white/10 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <span className="text-sm text-neutral-600 dark:text-white/50">
                {card.label}
              </span>
            </div>
            <p className={`text-2xl font-bold ${card.color}`}>
              {formatCurrency(Math.abs(card.value))}
              {card.label === "Sisa Budget" && card.value < 0 && " (-)"}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}