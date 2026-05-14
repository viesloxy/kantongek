"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardProvider, useDashboard } from "@/context/DashboardContext";
import Sidebar from "@/components/dashboard/Sidebar/Sidebar";
import TopBar from "@/components/dashboard/TopBar/TopBar";
import {
  StatsHeader,
  ChartTypeSelector,
  SummaryStats,
  InsightCard,
  PieChartCard,
  BarChartCard,
  LineChartCard,
  PeriodType,
  ChartType,
} from "@/components/stats";
import { EXPENSE_CATEGORIES, Transaction } from "@/types";
import { formatCurrency } from "@/lib/calculations";

const categoryColors: Record<string, string> = {
  makanan: "#FF6B6B",
  transportasi: "#4ECDC4",
  hiburan: "#FFE66D",
  pendidikan: "#95E1D3",
  kesehatan: "#F38181",
  belanja: "#AA96DA",
  pulsa: "#FCBAD3",
  hadiah: "#A8D8EA",
  lainnya: "#C9B1FF",
};

const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
];

interface CategoryData {
  category: string;
  label: string;
  amount: number;
  percentage: number;
  color: string;
}

function StatsContent() {
  const { transactions } = useDashboard();

  // State
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("monthly");
  const [selectedChartType, setSelectedChartType] = useState<ChartType>("pie");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Get period date range
  const getPeriodRange = useMemo(() => {
    const today = new Date();
    let startDate: Date;
    let endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);

    switch (selectedPeriod) {
      case "weekly":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "monthly":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case "yearly":
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
    }

    return { startDate, endDate };
  }, [selectedPeriod]);

  // Filter transactions by period
  const filteredTransactions = useMemo(() => {
    const { startDate, endDate } = getPeriodRange;
    return transactions.filter((t) => {
      const date = new Date(t.date);
      return date >= startDate && date <= endDate;
    });
  }, [transactions, getPeriodRange]);

  // Calculate pie chart data (expense by category)
  const pieChartData = useMemo(() => {
    const expenses = filteredTransactions.filter((t) => t.type === "expense");
    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

    // Group by category
    const categoryMap = new Map<string, number>();
    expenses.forEach((t) => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    });

    // Create data array
    const data: CategoryData[] = [];
    categoryMap.forEach((amount, category) => {
      const catInfo = EXPENSE_CATEGORIES.find((c) => c.id === category);
      if (catInfo && amount > 0) {
        data.push({
          category,
          label: catInfo.name,
          amount,
          percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
          color: categoryColors[category] || "#C9B1FF",
        });
      }
    });

    // Sort by amount descending
    data.sort((a, b) => b.amount - a.amount);

    return { data, totalExpense };
  }, [filteredTransactions]);

  // Calculate bar chart data (income vs expense by period)
  const barChartData = useMemo(() => {
    const { startDate, endDate } = getPeriodRange;
    let labels: string[] = [];
    let incomeData: number[] = [];
    let expenseData: number[] = [];

    switch (selectedPeriod) {
      case "weekly":
        // 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split("T")[0];
          labels.push(dayNames[date.getDay()]);

          const dayTransactions = filteredTransactions.filter(
            (t) => t.date.split("T")[0] === dateStr
          );
          incomeData.push(
            dayTransactions
              .filter((t) => t.type === "income")
              .reduce((sum, t) => sum + t.amount, 0)
          );
          expenseData.push(
            dayTransactions
              .filter((t) => t.type === "expense")
              .reduce((sum, t) => sum + t.amount, 0)
          );
        }
        break;

      case "monthly":
        // 4 weeks
        const today = new Date();
        for (let week = 3; week >= 0; week--) {
          const weekStart = new Date(today.getFullYear(), today.getMonth(), week * 7 + 1);
          const weekEnd = new Date(today.getFullYear(), today.getMonth(), (week + 1) * 7);
          if (weekEnd > today) weekEnd.setTime(today.getTime());

          labels.push(`Minggu ${4 - week}`);

          const weekTransactions = filteredTransactions.filter((t) => {
            const date = new Date(t.date);
            return date >= weekStart && date <= weekEnd;
          });

          incomeData.push(
            weekTransactions
              .filter((t) => t.type === "income")
              .reduce((sum, t) => sum + t.amount, 0)
          );
          expenseData.push(
            weekTransactions
              .filter((t) => t.type === "expense")
              .reduce((sum, t) => sum + t.amount, 0)
          );
        }
        break;

      case "yearly":
        // 12 months
        const currentYear = new Date().getFullYear();
        for (let month = 0; month < 12; month++) {
          labels.push(monthNames[month]);

          const monthTransactions = filteredTransactions.filter((t) => {
            const date = new Date(t.date);
            return date.getFullYear() === currentYear && date.getMonth() === month;
          });

          incomeData.push(
            monthTransactions
              .filter((t) => t.type === "income")
              .reduce((sum, t) => sum + t.amount, 0)
          );
          expenseData.push(
            monthTransactions
              .filter((t) => t.type === "expense")
              .reduce((sum, t) => sum + t.amount, 0)
          );
        }
        break;
    }

    return { labels, incomeData, expenseData };
  }, [filteredTransactions, selectedPeriod, getPeriodRange]);

  // Calculate line chart data (expense trend)
  const lineChartData = useMemo(() => {
    return {
      labels: barChartData.labels,
      expenseData: barChartData.expenseData,
    };
  }, [barChartData]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    // Calculate average (based on number of periods with data)
    let periodCount = 0;
    switch (selectedPeriod) {
      case "weekly":
        periodCount = 7;
        break;
      case "monthly":
        periodCount = 4;
        break;
      case "yearly":
        periodCount = 12;
        break;
    }

    const averageSpending = periodCount > 0 ? totalExpense / periodCount : 0;

    return {
      totalIncome,
      totalExpense,
      balance,
      averageSpending,
    };
  }, [filteredTransactions, selectedPeriod]);

  // Calculate trend (percentage change)
  const trend = useMemo(() => {
    const data = barChartData.expenseData;
    if (data.length < 2) return 0;

    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    if (firstAvg === 0) return 0;
    return Math.round(((secondAvg - firstAvg) / firstAvg) * 100);
  }, [barChartData.expenseData]);

  // Generate insight
  const insight = useMemo(() => {
    const { data, totalExpense } = pieChartData;

    if (data.length === 0) {
      return "Belum ada data transaksi di periode ini. Mulai catat transaksi untuk melihat insight!";
    }

    const topCategory = data[0];
    const totalIncome = summaryStats.totalIncome;

    if (topCategory && topCategory.percentage > 40) {
      return `${topCategory.label} masih jadi pengeluaran terbesarmu! (${topCategory.percentage}%) Coba kurangi ${topCategory.label.toLowerCase()} ya~`;
    }

    if (totalExpense > 1000000 && totalIncome > 0) {
      const savingsRate = Math.round(((totalIncome - totalExpense) / totalIncome) * 100);
      if (savingsRate < 0) {
        return `Total pengeluaranmu sudah melampaui income. Tetap kontrol belanja ya!`;
      }
      return `Savings rate kamu ${savingsRate}% bulan ini. Tetap pertahankan ya!`;
    }

    if (data.length >= 3) {
      return `Pengeluaran kamu cukup seimbang antar kategori. Good job mengelola keuangan!`;
    }

    return `Kamu sudah spending ${formatCurrency(summaryStats.totalExpense)} di periode ini. Stay on track!`;
  }, [pieChartData, summaryStats]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar
        currentPage="statistik"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Bar */}
        <TopBar
          onMenuClick={() => setIsSidebarOpen(true)}
          currentPage="statistik"
        />

        {/* Page Content */}
        <main className="p-4 lg:p-6 xl:p-8">
          {/* Header */}
          <StatsHeader
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />

          {/* Summary Stats */}
          <SummaryStats
            totalIncome={summaryStats.totalIncome}
            totalExpense={summaryStats.totalExpense}
            balance={summaryStats.balance}
            averageSpending={summaryStats.averageSpending}
          />

          {/* Chart Type Selector */}
          <ChartTypeSelector
            selectedType={selectedChartType}
            onTypeChange={setSelectedChartType}
          />

          {/* Charts */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedChartType}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {selectedChartType === "pie" && (
                <PieChartCard
                  data={pieChartData.data}
                  totalAmount={pieChartData.totalExpense}
                />
              )}

              {selectedChartType === "bar" && (
                <BarChartCard
                  labels={barChartData.labels}
                  incomeData={barChartData.incomeData}
                  expenseData={barChartData.expenseData}
                  period={selectedPeriod}
                  totalIncome={summaryStats.totalIncome}
                  totalExpense={summaryStats.totalExpense}
                />
              )}

              {selectedChartType === "line" && (
                <LineChartCard
                  labels={lineChartData.labels}
                  expenseData={lineChartData.expenseData}
                  period={selectedPeriod}
                  trend={trend}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Insight Card */}
          <div className="mt-6">
            <InsightCard insight={insight} />
          </div>

          {/* Bottom Spacing */}
          <div className="h-16" />
        </main>
      </div>
    </div>
  );
}

export default function StatsPage() {
  return (
    <DashboardProvider>
      <StatsContent />
    </DashboardProvider>
  );
}