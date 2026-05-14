"use client";

import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/calculations";
import { PeriodType } from "../StatsHeader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface LineChartCardProps {
  labels: string[];
  expenseData: number[];
  period: PeriodType;
  trend: number;
}

const periodLabels: Record<PeriodType, string> = {
  weekly: "Tren Pengeluaran Mingguan",
  monthly: "Tren Pengeluaran Bulanan",
  yearly: "Tren Pengeluaran Tahunan",
};

export default function LineChartCard({
  labels,
  expenseData,
  period,
  trend,
}: LineChartCardProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Pengeluaran",
        data: expenseData,
        borderColor: "#A4D624",
        backgroundColor: "rgba(164, 214, 36, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#A4D624",
        pointBorderColor: "#FFFFFF",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => {
            return formatCurrency(context.parsed.y);
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
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
  };

  const hasData = expenseData.some((v) => v > 0);

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
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Trend Indicator */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-black/5 dark:border-white/5">
        {trend > 0 ? (
          <TrendingUp className="w-5 h-5 text-expense" />
        ) : trend < 0 ? (
          <TrendingDown className="w-5 h-5 text-income" />
        ) : null}
        <span className="text-sm text-neutral-600 dark:text-white/60">
          {trend > 0
            ? `Peningkatan ${Math.abs(trend)}% dari periode sebelumnya`
            : trend < 0
            ? `Penurunan ${Math.abs(trend)}% dari periode sebelumnya`
            : "Tidak ada perubahan dari periode sebelumnya"}
        </span>
      </div>
    </motion.div>
  );
}