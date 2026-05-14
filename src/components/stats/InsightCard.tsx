"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface InsightCardProps {
  insight: string;
}

export default function InsightCard({ insight }: InsightCardProps) {
  return (
    <motion.div
      className="bg-primary/10 rounded-2xl p-5 border border-primary/20"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-semibold text-black dark:text-white mb-1">
            Insight
          </h4>
          <p className="text-sm text-neutral-700 dark:text-white/70">
            {insight}
          </p>
        </div>
      </div>
    </motion.div>
  );
}