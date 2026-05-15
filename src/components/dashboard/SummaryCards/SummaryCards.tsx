"use client";

import { motion } from "framer-motion";
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useDashboard } from "@/context/DashboardContext";
import { formatCurrency } from "@/lib/calculations";

interface SummaryCardsProps {
  className?: string;
}

interface CardData {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
  bgColor: string;
}

export default function SummaryCards({ className = "" }: SummaryCardsProps) {
  const { monthlyIncome, monthlyExpense, balance, transactions } = useDashboard();

  // Calculate trend (compare with last month)
  const calculateTrend = (current: number, transactions: any[]) => {
    // Simple trend calculation - in real app, compare with last month data
    if (current > 0) {
      return { value: 15, isPositive: true };
    }
    return undefined;
  };

  const cards: CardData[] = [
    {
      icon: <Wallet className="w-6 h-6" />,
      label: "Saldo Tersisa",
      value: formatCurrency(balance),
      trend: calculateTrend(balance, transactions),
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: "Total Income Bulan Ini",
      value: formatCurrency(monthlyIncome),
      trend: calculateTrend(monthlyIncome, transactions),
      color: "text-income",
      bgColor: "bg-income/10",
    },
    {
      icon: <TrendingDown className="w-6 h-6" />,
      label: "Total Expense Bulan Ini",
      value: formatCurrency(monthlyExpense),
      trend: { value: 8, isPositive: false },
      color: "text-expense",
      bgColor: "bg-expense/10",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {cards.map((card, index) => (
        <motion.div key={card.label} variants={itemVariants}>
          <Card
            className="p-6 rounded-2xl border-black/5 dark:border-white/5 hover:border-primary/30 transition-all duration-300"
            padding="none"
          >
            <div className="p-6">
              {/* Icon and trend */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center`}>
                  <div className={card.color}>
                    {card.icon}
                  </div>
                </div>
                {card.trend && (
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    card.trend.isPositive ? "text-income" : "text-expense"
                  }`}>
                    {card.trend.isPositive ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {card.trend.value}%
                  </div>
                )}
              </div>

              {/* Label and value */}
              <p className="text-sm text-neutral-600 dark:text-white/50 mb-1 truncate">
                {card.label}
              </p>
              <p className={`text-xl md:text-2xl lg:text-3xl font-bold ${card.color} truncate`}>
                {card.value}
              </p>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}