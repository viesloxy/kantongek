"use client";

import { motion } from "framer-motion";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { EXPENSE_CATEGORIES } from "@/types";
import { formatCurrency } from "@/lib/calculations";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryData {
  category: string;
  label: string;
  amount: number;
  percentage: number;
  color: string;
}

interface PieChartCardProps {
  data: CategoryData[];
  totalAmount: number;
}

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

export default function PieChartCard({ data, totalAmount }: PieChartCardProps) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.amount),
        backgroundColor: data.map((d) => d.color),
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 14, weight: "bold" as const },
        bodyFont: { size: 13 },
        callbacks: {
          label: (context: any) => {
            const value = context.parsed;
            return formatCurrency(value);
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  if (data.length === 0) {
    return (
      <motion.div
        className="bg-white dark:bg-neutral-900 rounded-2xl border border-black/10 dark:border-white/10 p-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
          Pengeluaran per Kategori
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
        Pengeluaran per Kategori
      </h3>

      <div className="relative max-w-xs mx-auto">
        <Doughnut data={chartData} options={chartOptions} />
        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-2xl font-bold text-black dark:text-white">
              {formatCurrency(totalAmount)}
            </p>
            <p className="text-xs text-neutral-500 dark:text-white/50">Total</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-6">
        {data.map((item) => (
          <div
            key={item.category}
            className="flex items-center gap-2 text-sm"
          >
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-neutral-600 dark:text-white/60 truncate">
              {item.label}
            </span>
            <span className="text-sm font-medium text-black dark:text-white ml-auto">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}