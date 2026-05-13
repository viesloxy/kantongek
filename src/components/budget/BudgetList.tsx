"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import BudgetCard from "./BudgetCard";

export interface BudgetData {
  category: string;
  limit: number;
  spent: number;
  percentage: number;
  remaining: number;
}

interface BudgetListProps {
  budgets: BudgetData[];
  onEditBudget: (category: string) => void;
  onAddBudget: () => void;
  hasBudgets: boolean;
}

export default function BudgetList({
  budgets,
  onEditBudget,
  onAddBudget,
  hasBudgets,
}: BudgetListProps) {
  if (!hasBudgets) {
    return (
      <motion.div
        className="bg-white dark:bg-neutral-900 rounded-2xl border border-black/10 dark:border-white/10 p-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-primary"
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
        <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
          Belum Ada Budget
        </h3>
        <p className="text-neutral-500 dark:text-white/50 mb-6 max-w-sm mx-auto">
          Mulai atur budget untuk setiap kategori pengeluaranmu agar bisa lebih bijak dalam mengelola keuangan
        </p>
        <button
          onClick={onAddBudget}
          className="bg-primary text-neutral-900 rounded-full px-6 py-3 font-semibold flex items-center gap-2 mx-auto hover:shadow-lg hover:shadow-primary/30 transition-all"
        >
          <Plus className="w-5 h-5" />
          Atur Budget Kategori
        </button>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Section Title */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-black dark:text-white">
          Budget per Kategori
        </h2>
        <button
          onClick={onAddBudget}
          className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Budget
        </button>
      </div>

      {/* Budget Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((budget, index) => (
          <BudgetCard
            key={budget.category}
            {...budget}
            onEdit={() => onEditBudget(budget.category)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}