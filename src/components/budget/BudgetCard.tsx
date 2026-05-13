"use client";

import { motion } from "framer-motion";
import { Pencil, AlertTriangle, AlertCircle } from "lucide-react";
import BudgetProgressBar, { getBudgetStatus, BudgetStatus } from "./BudgetProgressBar";
import { formatCurrency } from "@/lib/calculations";
import * as LucideIcons from "lucide-react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, CATEGORY_ICONS } from "@/types";

interface BudgetCardProps {
  category: string;
  limit: number;
  spent: number;
  percentage: number;
  remaining: number;
  onEdit: () => void;
  index?: number;
}

const getCategoryIcon = (category: string) => {
  const iconName = CATEGORY_ICONS[category] || "Package";
  const Icon = (LucideIcons as any)[iconName];
  return Icon || LucideIcons.Package;
};

const getCategoryName = (category: string): string => {
  const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
  const cat = allCategories.find((c) => c.id === category);
  return cat?.name || category;
};

const getStatusIcon = (status: BudgetStatus) => {
  if (status === "exceeded") {
    return { icon: AlertCircle, className: "text-budget-exceeded" };
  }
  if (status === "danger") {
    return { icon: AlertTriangle, className: "text-budget-danger" };
  }
  if (status === "warning") {
    return { icon: AlertTriangle, className: "text-budget-warning" };
  }
  return { icon: null, className: "" };
};

const getAlertMessage = (status: BudgetStatus, categoryName: string): string => {
  switch (status) {
    case "exceeded":
      return `Budget ${categoryName} sudah melebihi limit!`;
    case "danger":
      return `Budget ${categoryName} hampir habis!`;
    case "warning":
      return `Budget ${categoryName} sudah ${Math.round(status === "warning" ? 75 : 0)}% digunakan`;
    default:
      return "";
  }
};

export default function BudgetCard({
  category,
  limit,
  spent,
  percentage,
  remaining,
  onEdit,
  index = 0,
}: BudgetCardProps) {
  const status = getBudgetStatus(percentage);
  const categoryName = getCategoryName(category);
  const IconComponent = getCategoryIcon(category);
  const statusInfo = getStatusIcon(status);

  const iconBgClass = status === "exceeded"
    ? "bg-budget-exceeded/10"
    : status === "danger"
    ? "bg-budget-danger/10"
    : status === "warning"
    ? "bg-budget-warning/10"
    : "bg-primary/10";

  const iconColorClass = status === "exceeded"
    ? "text-budget-exceeded"
    : status === "danger"
    ? "text-budget-danger"
    : status === "warning"
    ? "text-budget-warning"
    : "text-primary";

  return (
    <motion.div
      className="bg-white dark:bg-neutral-900 rounded-2xl border border-black/5 dark:border-white/5 hover:border-primary/30 transition-all p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${iconBgClass} flex items-center justify-center`}>
            <IconComponent className={`w-6 h-6 ${iconColorClass}`} />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-black dark:text-white">
              {categoryName}
            </h3>
            <p className="text-sm text-neutral-500 dark:text-white/50">
              {percentage.toFixed(0)}% digunakan
            </p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label={`Edit budget ${categoryName}`}
        >
          <Pencil className="w-4 h-4 text-neutral-500" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <BudgetProgressBar
          percentage={percentage}
          status={status}
          size="md"
        />
      </div>

      {/* Stats */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500 dark:text-white/50">Digunakan</span>
          <span className="font-medium text-black dark:text-white">
            {formatCurrency(spent)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500 dark:text-white/50">Limit</span>
          <span className="font-medium text-black dark:text-white">
            {limit > 0 ? formatCurrency(limit) : "Belum diatur"}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500 dark:text-white/50">Tersisa</span>
          <span className={`font-medium ${
            remaining < 0 ? "text-budget-exceeded" : "text-budget-safe"
          }`}>
            {formatCurrency(Math.abs(remaining))}
            {remaining < 0 && " (-)"}
          </span>
        </div>
      </div>

      {/* Warning/Alert Message */}
      {status !== "safe" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-3 rounded-xl text-sm flex items-start gap-2 ${
            status === "exceeded"
              ? "bg-budget-exceeded/10 text-budget-exceeded"
              : status === "danger"
              ? "bg-budget-danger/10 text-budget-danger"
              : "bg-budget-warning/10 text-budget-warning"
          }`}
        >
          {statusInfo.icon && <statusInfo.icon className={`w-4 h-4 ${statusInfo.className} flex-shrink-0 mt-0.5`} />}
          <span>{getAlertMessage(status, categoryName)}</span>
        </motion.div>
      )}
    </motion.div>
  );
}
