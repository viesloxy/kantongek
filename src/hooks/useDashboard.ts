"use client";

import { useMemo } from "react";
import { Transaction, Budget } from "@/types";
import {
  formatCurrency,
  formatDate,
  formatShortDate,
  getMonthIncome,
  getMonthExpense,
  getBalance,
  getRecentTransactions,
  getBudgetUsage,
  getExpenseByCategory,
  getWeeklyData,
  getCategoryPercentages,
} from "@/lib/calculations";

// Hook for formatted currency
export function useFormattedCurrency(amount: number) {
  return useMemo(() => formatCurrency(amount), [amount]);
}

// Hook for formatted date
export function useFormattedDate(dateString: string) {
  return useMemo(() => formatDate(dateString), [dateString]);
}

// Hook for summary data
export function useDashboardSummary(transactions: Transaction[]) {
  return useMemo(() => ({
    monthlyIncome: getMonthIncome(transactions),
    monthlyExpense: getMonthExpense(transactions),
    balance: getBalance(transactions),
    formattedIncome: formatCurrency(getMonthIncome(transactions)),
    formattedExpense: formatCurrency(getMonthExpense(transactions)),
    formattedBalance: formatCurrency(getBalance(transactions)),
  }), [transactions]);
}

// Hook for recent transactions with formatting
export function useRecentTransactionsFormatted(transactions: Transaction[], limit: number = 5) {
  return useMemo(() => {
    return getRecentTransactions(transactions, limit).map((t) => ({
      ...t,
      formattedAmount: formatCurrency(t.amount),
      formattedDate: formatShortDate(t.date),
      isIncome: t.type === "income",
      isExpense: t.type === "expense",
    }));
  }, [transactions, limit]);
}

// Hook for budget overview
export function useBudgetOverview(transactions: Transaction[], budget: Budget) {
  return useMemo(() => {
    const categories = ["makanan", "transportasi", "hiburan", "pendidikan", "kesehatan", "lainnya"];

    return categories.map((category) => {
      const usage = getBudgetUsage(category, transactions, budget);
      const categoryNames: Record<string, string> = {
        makanan: "Makanan",
        transportasi: "Transportasi",
        hiburan: "Hiburan",
        pendidikan: "Pendidikan",
        kesehatan: "Kesehatan",
        lainnya: "Lainnya",
      };

      return {
        category,
        name: categoryNames[category],
        ...usage,
        formattedUsed: formatCurrency(usage.used),
        formattedRemaining: formatCurrency(usage.remaining),
        formattedLimit: formatCurrency(budget[category as keyof Budget] || 0),
        isOverBudget: usage.percentage >= 100,
        isWarning: usage.percentage >= 70 && usage.percentage < 100,
        isSafe: usage.percentage < 70,
      };
    });
  }, [transactions, budget]);
}

// Hook for category statistics
export function useCategoryStats(transactions: Transaction[]) {
  return useMemo(() => {
    const byCategory = getExpenseByCategory(transactions);
    const total = byCategory.reduce((sum, c) => sum + c.amount, 0);

    return byCategory.map((c) => ({
      ...c,
      percentage: total > 0 ? Math.round((c.amount / total) * 100) : 0,
      formattedAmount: formatCurrency(c.amount),
    }));
  }, [transactions]);
}

// Hook for weekly chart data
export function useWeeklyChartData(transactions: Transaction[]) {
  return useMemo(() => getWeeklyData(transactions), [transactions]);
}

// Hook for category percentages for pie chart
export function useCategoryPercentages(transactions: Transaction[]) {
  return useMemo(() => getCategoryPercentages(transactions), [transactions]);
}