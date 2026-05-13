"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { DashboardProvider, useDashboard } from "@/context/DashboardContext";
import Sidebar from "@/components/dashboard/Sidebar/Sidebar";
import TopBar from "@/components/dashboard/TopBar/TopBar";
import {
  BudgetHeader,
  BudgetOverviewCards,
  BudgetList,
  BudgetEditModal,
  BudgetData,
  getBudgetStatus,
} from "@/components/budget";
import { EXPENSE_CATEGORIES } from "@/types";

function BudgetContent() {
  const { transactions, settings, updateSettings } = useDashboard();

  // State
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Get start of month
  const getStartOfMonth = useCallback((date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }, []);

  // Calculate budget data for all categories
  const budgets = useMemo(() => {
    const startOfMonth = getStartOfMonth(currentMonth);
    const budgetData: BudgetData[] = [];

    EXPENSE_CATEGORIES.forEach((category) => {
      const limit = settings.monthlyBudget[category.id as keyof typeof settings.monthlyBudget] || 0;

      // Skip if no budget set for this category
      if (limit <= 0) return;

      const spent = transactions
        .filter(
          (t) =>
            t.type === "expense" &&
            t.category === category.id &&
            new Date(t.date) >= startOfMonth
        )
        .reduce((sum, t) => sum + t.amount, 0);

      const percentage = limit > 0 ? (spent / limit) * 100 : 0;
      const remaining = limit - spent;

      budgetData.push({
        category: category.id,
        limit,
        spent,
        percentage,
        remaining,
      });
    });

    return budgetData;
  }, [transactions, settings.monthlyBudget, currentMonth, getStartOfMonth]);

  // Calculate overall stats
  const overallStats = useMemo(() => {
    const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const totalRemaining = totalBudget - totalSpent;
    const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return {
      totalBudget,
      totalSpent,
      totalRemaining,
      overallPercentage,
    };
  }, [budgets]);

  // Get existing budget categories
  const existingCategories = useMemo(() => {
    return budgets.map((b) => b.category);
  }, [budgets]);

  // Month navigation
  const handleMonthChange = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Handle save budget
  const handleSaveBudget = (category: string, amount: number) => {
    updateSettings({
      monthlyBudget: {
        ...settings.monthlyBudget,
        [category]: amount,
      },
    });
  };

  // Handle edit budget
  const handleEditBudget = (category: string) => {
    setEditingCategory(category);
  };

  // Handle add budget
  const handleAddBudget = () => {
    setIsAddModalOpen(true);
  };

  // Get current budget for editing
  const editingBudget = editingCategory
    ? budgets.find((b) => b.category === editingCategory)
    : null;

  const hasBudgets = budgets.length > 0;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar
        currentPage="budget"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Bar */}
        <TopBar
          onMenuClick={() => setIsSidebarOpen(true)}
          currentPage="budget"
        />

        {/* Page Content */}
        <main className="p-4 lg:p-6 xl:p-8">
          {/* Page Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-black dark:text-white">
                Budget Management
              </h1>
              <p className="text-neutral-600 dark:text-white/50 mt-1">
                Kelola budget bulanan kamu per kategori
              </p>
            </div>
          </motion.div>

          {/* Budget Header with Month Selector */}
          <BudgetHeader
            currentMonth={currentMonth}
            onMonthChange={handleMonthChange}
            totalBudget={overallStats.totalBudget}
            totalSpent={overallStats.totalSpent}
            totalRemaining={overallStats.totalRemaining}
            overallPercentage={overallStats.overallPercentage}
          />

          {/* Overview Cards */}
          {hasBudgets && (
            <BudgetOverviewCards
              totalBudget={overallStats.totalBudget}
              totalSpent={overallStats.totalSpent}
              totalRemaining={overallStats.totalRemaining}
            />
          )}

          {/* Budget List */}
          <BudgetList
            budgets={budgets}
            onEditBudget={handleEditBudget}
            onAddBudget={handleAddBudget}
            hasBudgets={hasBudgets}
          />

          {/* Bottom Spacing */}
          <div className="h-16" />
        </main>
      </div>

      {/* Edit Budget Modal */}
      <BudgetEditModal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        onSave={handleSaveBudget}
        category={editingCategory || undefined}
        currentLimit={editingBudget?.limit || 0}
        mode="edit"
        existingCategories={existingCategories}
      />

      {/* Add Budget Modal */}
      <BudgetEditModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveBudget}
        mode="add"
        existingCategories={existingCategories}
      />
    </div>
  );
}

export default function BudgetPage() {
  return (
    <DashboardProvider>
      <BudgetContent />
    </DashboardProvider>
  );
}