"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Utensils,
  Car,
  Gamepad2,
  BookOpen,
  Heart,
  ShoppingBag,
  Smartphone,
  Gift,
  Package,
  Briefcase,
  Laptop,
  TrendingUp,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useDashboard } from "@/context/DashboardContext";
import { formatCurrency, formatShortDate } from "@/lib/calculations";
import { CATEGORY_ICONS } from "@/types";

// Map category icons dynamically
const getCategoryIcon = (category: string) => {
  const iconName = CATEGORY_ICONS[category] || "Package";
  const icons: Record<string, any> = {
    Utensils,
    Car,
    Gamepad2,
    BookOpen,
    Heart,
    ShoppingBag,
    Smartphone,
    Gift,
    Package,
    Briefcase,
    Laptop,
    TrendingUp,
  };
  return icons[iconName] || Package;
};

interface TransactionItemProps {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
  date: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function TransactionItem({ id, type, category, amount, description, date, onEdit, onDelete }: TransactionItemProps) {
  const [showActions, setShowActions] = useState(false);
  const IconComponent = getCategoryIcon(category);
  const isIncome = type === "income";

  const categoryNames: Record<string, string> = {
    makanan: "Makanan",
    transportasi: "Transportasi",
    hiburan: "Hiburan",
    pendidikan: "Pendidikan",
    kesehatan: "Kesehatan",
    belanja: "Belanja",
    pulsa: "Pulsa & Internet",
    hadiah: "Hadiah",
    lainnya: "Lainnya",
    gaji: "Gaji",
    uang_saku: "Uang Saku",
    freelance: "Freelance",
    investasi: "Investasi",
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors group">
      {/* Left side - Icon and info */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <IconComponent className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-black dark:text-white">
            {categoryNames[category] || category}
          </p>
          <p className="text-sm text-neutral-500 dark:text-white/40">
            {formatShortDate(date)} - {description}
          </p>
        </div>
      </div>

      {/* Right side - Amount and actions */}
      <div className="flex items-center gap-3">
        <p className={`text-base md:text-lg font-semibold ${
          isIncome ? "text-income" : "text-expense"
        }`}>
          {isIncome ? "+" : "-"}
          {formatCurrency(amount)}
        </p>

        {/* Actions dropdown */}
        <div className="relative">
          <button
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-neutral-600 dark:text-white/50 opacity-0 group-hover:opacity-100"
            onClick={() => setShowActions(!showActions)}
            aria-label="Transaction actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showActions && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowActions(false)}
              />
              <motion.div
                className="absolute right-0 mt-1 w-36 bg-white dark:bg-neutral-900 rounded-xl border border-black/10 dark:border-white/10 shadow-xl z-20 overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.15 }}
              >
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left text-black dark:text-white"
                  onClick={() => {
                    onEdit(id);
                    setShowActions(false);
                  }}
                >
                  <Pencil className="w-4 h-4 text-neutral-500" />
                  Edit
                </button>
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left text-expense"
                  onClick={() => {
                    onDelete(id);
                    setShowActions(false);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus
                </button>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface RecentTransactionsProps {
  onEdit?: (id: string) => void;
  className?: string;
}

export default function RecentTransactions({ onEdit, className = "" }: RecentTransactionsProps) {
  const { recentTransactions, deleteTransaction } = useDashboard();
  const [showAll, setShowAll] = useState(false);

  const displayedTransactions = showAll ? recentTransactions : recentTransactions.slice(0, 5);

  const handleDelete = (id: string) => {
    if (confirm("Yakin ingin menghapus transaksi ini?")) {
      deleteTransaction(id);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.4,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="rounded-2xl border-black/5 dark:border-white/5 overflow-hidden" padding="none">
        {/* Header */}
        <div className="p-6 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-black dark:text-white">
              Transaksi Terbaru
            </h3>
            <button
              className="text-sm text-primary hover:text-primary-dark transition-colors"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Tutup" : "Lihat Semua"}
            </button>
          </div>
        </div>

        {/* Transaction list */}
        <motion.div
          className="divide-y divide-black/5 dark:divide-white/10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {displayedTransactions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-neutral-500 dark:text-white/50">
                Belum ada transaksi
              </p>
            </div>
          ) : (
            displayedTransactions.map((transaction) => (
              <motion.div key={transaction.id} variants={itemVariants}>
                <TransactionItem
                  {...transaction}
                  onEdit={onEdit || (() => {})}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))
          )}
        </motion.div>
      </Card>
    </motion.div>
  );
}