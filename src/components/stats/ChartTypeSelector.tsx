"use client";

import { motion } from "framer-motion";
import { PieChart, BarChart3, TrendingUp } from "lucide-react";

export type ChartType = "pie" | "bar" | "line";

interface ChartTypeSelectorProps {
  selectedType: ChartType;
  onTypeChange: (type: ChartType) => void;
}

const chartTypes = [
  {
    id: "pie" as const,
    label: "Pie Chart",
    icon: PieChart,
    description: "Pengeluaran per kategori",
  },
  {
    id: "bar" as const,
    label: "Bar Chart",
    icon: BarChart3,
    description: "Perbandingan income vs expense",
  },
  {
    id: "line" as const,
    label: "Trend",
    icon: TrendingUp,
    description: "Tren pengeluaran over time",
  },
];

export default function ChartTypeSelector({
  selectedType,
  onTypeChange,
}: ChartTypeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {chartTypes.map((chart) => {
        const Icon = chart.icon;
        const isSelected = selectedType === chart.id;

        return (
          <motion.button
            key={chart.id}
            onClick={() => onTypeChange(chart.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
              isSelected
                ? "border-primary bg-primary/10 text-primary"
                : "border-black/10 dark:border-white/10 text-neutral-600 dark:text-white/60 hover:border-primary/30 hover:text-primary"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{chart.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}