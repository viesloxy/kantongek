"use client";

import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { formatCurrency } from "@/lib/calculations";
import { PeriodType } from "../StatsHeader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartCardProps {
  labels: string[];
  incomeData: number[];
  expenseData: number[];
  period: PeriodType;
  totalIncome: number;
  totalExpense: number;
}

const periodLabels: Record<PeriodType, string> = {
  weekly: "Perbandingan Mingguan",
  monthly: "Perbandingan Bulanan",
  yearly: "Perbandingan Tahunan",
};

export default function BarChartCard({
  labels,
  incomeData,
  expenseData,
  period,
  totalIncome,
  totalExpense,
}: BarChartCardProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        backgroundColor: "rgba(76, 175, 80, 0.8)",
        borderRadius: 6,
        barThickness: 20,
      },
      {
        label: "Expense",
        data: expenseData,
        backgroundColor: "rgba(255, 82, 82, 0.8)",
        borderRadius: 6,
        barThickness: 20,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label;
            const value = context.parsed.y;
            return `${label}: ${formatCurrency(value)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 11 },
        },
      },
      y: {
        grid: { color: "rgba(0, 0, 0, 0.05)" },
        ticks: {
          callback: (value: any) => formatCurrency(value),
          font: { size: 11 },
        },
      },
    },
  };

  const hasData = incomeData.some((v) => v > 0) || expenseData.some((v) => v > 0);

  if (!hasData) {
    return (
      <motion.div
        className="bg-white dark:bg-neutral-900 rounded-2xl border border-black/10 dark:border-white/10 p-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
          {periodLabels[period]}
        </h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-neutral-500 dark:text-white/50">
            Belum ada data transaksi
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white dark:bg-neutral-900 rounded-2xl border border-black/10 dark:border-white/10 p-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
        {periodLabels[period]}
      </h3>

      <div className="h-64">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Summary */}
      <div className="flex justify-between mt-4 pt-4 border-t border-black/5 dark:border-white/5">
        <div>
          <p className="text-sm text-neutral-500 dark:text-white/50">Total Income</p>
          <p className="text-lg font-bold text-income">{formatCurrency(totalIncome)}</p>
        </div>
        <div>
          <p className="text-sm text-neutral-500 dark:text-white/50">Total Expense</p>
          <p className="text-lg font-bold text-expense">{formatCurrency(totalExpense)}</p>
        </div>
      </div>
    </motion.div>
  );
}