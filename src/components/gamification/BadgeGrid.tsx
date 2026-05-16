"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { Badge, BADGES, BadgeCategory } from "@/types";
import BadgeCard from "./BadgeCard";

interface BadgeGridProps {
  isBadgeUnlocked: (badgeId: string) => boolean;
  getBadgeProgress: (badgeId: string) => number;
}

const CATEGORY_INFO: Record<BadgeCategory, { name: string; icon: string }> = {
  transaction: { name: "Transaksi", icon: "📝" },
  savings: { name: "Tabungan", icon: "💰" },
  streak: { name: "Streak", icon: "🔥" },
  budget: { name: "Budget", icon: "🎯" },
  goal: { name: "Goal", icon: "🎯" },
};

export default function BadgeGrid({
  isBadgeUnlocked,
  getBadgeProgress,
}: BadgeGridProps) {
  // Group badges by category
  const badgesByCategory = BADGES.reduce((acc, badge) => {
    if (!acc[badge.category]) {
      acc[badge.category] = [];
    }
    acc[badge.category].push(badge);
    return acc;
  }, {} as Record<BadgeCategory, Badge[]>);

  const categories = Object.keys(badgesByCategory) as BadgeCategory[];
  const unlockedCount = BADGES.filter((b) => isBadgeUnlocked(b.id)).length;
  const totalCount = BADGES.length;

  return (
    <div className="space-y-6">
      {/* Unlocked Summary */}
      <motion.div
        className="bg-white dark:bg-neutral-900 rounded-2xl border border-black/10 dark:border-white/10 p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-black dark:text-white">
              Achievement
            </h3>
            <p className="text-sm text-neutral-500 dark:text-white/50">
              {unlockedCount}/{totalCount} Badge unlocked
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-neutral-500 dark:text-white/50">
              Progress Keseluruhan
            </span>
            <span className="text-primary font-medium">
              {Math.round((unlockedCount / totalCount) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Badge Categories */}
      {categories.map((category, categoryIndex) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-black dark:text-white capitalize">
            {CATEGORY_INFO[category].name}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {badgesByCategory[category].map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: categoryIndex * 0.1 + index * 0.05,
                }}
              >
                <BadgeCard
                  badge={badge}
                  isUnlocked={isBadgeUnlocked(badge.id)}
                  progress={getBadgeProgress(badge.id)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}