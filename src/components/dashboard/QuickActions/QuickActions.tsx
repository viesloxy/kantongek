"use client";

import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";

interface QuickActionsProps {
  onAddIncome?: () => void;
  onAddExpense?: () => void;
  className?: string;
}

export default function QuickActions({ onAddIncome, onAddExpense, className = "" }: QuickActionsProps) {
  return (
    <motion.div
      className={`flex flex-col sm:flex-row gap-4 mb-8 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Add Income Button */}
      <button
        onClick={onAddIncome}
        className="flex-1 bg-primary text-neutral-900 rounded-full px-6 py-3 font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 active:scale-95"
      >
        <Plus className="w-5 h-5" />
        Tambah Income
      </button>

      {/* Add Expense Button */}
      <button
        onClick={onAddExpense}
        className="flex-1 bg-transparent border-2 border-primary text-primary rounded-full px-6 py-3 font-semibold hover:bg-primary/10 transition-all flex items-center justify-center gap-2 active:scale-95"
      >
        <Minus className="w-5 h-5" />
        Tambah Expense
      </button>
    </motion.div>
  );
}