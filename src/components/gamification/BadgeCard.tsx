"use client";

import { motion } from "framer-motion";
import {
  Star,
  Target,
  Zap,
  Coins,
  Banknote,
  Flame,
  Shield,
  Gem,
  Check,
  Lock,
} from "lucide-react";
import { Badge } from "@/types";
import * as LucideIcons from "lucide-react";

interface BadgeCardProps {
  badge: Badge;
  isUnlocked: boolean;
  progress: number;
  onClick?: () => void;
}

// Map icon names to components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Star,
  Target,
  Zap,
  Coins,
  Banknote,
  Flame,
  Shield,
  Gem,
  Lock,
};

export default function BadgeCard({
  badge,
  isUnlocked,
  progress,
  onClick,
}: BadgeCardProps) {
  const IconComponent = iconMap[badge.icon] || Star;

  return (
    <motion.div
      className={`relative p-4 rounded-2xl border transition-all cursor-pointer ${
        isUnlocked
          ? "bg-primary/10 border-primary/30 hover:border-primary/50"
          : "bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
      }`}
      whileHover={{ scale: isUnlocked ? 1.05 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Badge Icon */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
          isUnlocked ? "bg-primary/20" : "bg-neutral-200 dark:bg-neutral-700"
        }`}
      >
        <IconComponent
          className={`w-6 h-6 ${
            isUnlocked
              ? "text-primary"
              : "text-neutral-400 dark:text-neutral-500"
          }`}
        />
      </div>

      {/* Badge Name */}
      <h3
        className={`text-center font-semibold mb-1 text-sm ${
          isUnlocked ? "text-primary" : "text-neutral-500 dark:text-neutral-400"
        }`}
      >
        {badge.name}
      </h3>

      {/* Description */}
      <p className="text-xs text-center text-neutral-500 dark:text-white/50 mb-3 line-clamp-2">
        {badge.description}
      </p>

      {/* Status */}
      {isUnlocked ? (
        <div className="flex items-center justify-center gap-1 text-xs text-income font-medium">
          <Check className="w-4 h-4" />
          <span>Tercapai!</span>
        </div>
      ) : (
        <div>
          <div className="flex justify-between text-xs text-neutral-500 mb-1">
            <span>Progress</span>
            <span className={progress >= 100 ? "text-primary" : ""}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Lock Overlay for hover effect on locked badges */}
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100/80 dark:bg-neutral-800/80 rounded-2xl opacity-0 hover:opacity-100 transition-opacity">
          <Lock className="w-6 h-6 text-neutral-400" />
        </div>
      )}
    </motion.div>
  );
}