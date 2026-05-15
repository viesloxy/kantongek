"use client";

import { motion } from "framer-motion";
import { Flame, Plus, Check, Snowflake } from "lucide-react";
import { StreakData } from "@/types";

interface StreakHeaderProps {
  streakData: StreakData;
  hasCheckedInToday: boolean;
  onCheckIn: () => void;
  targetDays?: number;
}

const MILESTONE_MESSAGES: Record<number, string> = {
  3: "Ayo mulai kebiasaan baru!",
  7: "Mantap! 1 minggu konsisten!",
  14: "Dua minggu! You're on fire!",
  30: "Sebulan penuh! Incredible!",
  90: "3 bulan! Kamu luar biasa!",
  180: "6 bulan! Legendary!",
  365: "Setahun! GOAT!",
};

function formatLastCheckIn(lastCheckIn: string): string {
  const date = new Date(lastCheckIn);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayStr = today.toISOString().split("T")[0];
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (lastCheckIn === todayStr) {
    return "Hari ini";
  } else if (lastCheckIn === yesterdayStr) {
    return "Kemarin";
  } else {
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  }
}

function getNextMilestone(currentStreak: number): { days: number; message: string } {
  const milestones = [3, 7, 14, 30, 90, 180, 365];
  for (const milestone of milestones) {
    if (currentStreak < milestone) {
      return { days: milestone, message: MILESTONE_MESSAGES[milestone] || "" };
    }
  }
  return { days: 365, message: "Max streak!" };
}

export default function StreakHeader({
  streakData,
  hasCheckedInToday,
  onCheckIn,
  targetDays = 30,
}: StreakHeaderProps) {
  const { current, lastCheckIn, longest, streakFreezeAvailable } = streakData;
  const nextMilestone = getNextMilestone(current);
  const progress = Math.min((current / nextMilestone.days) * 100, 100);

  return (
    <motion.div
      className="bg-white dark:bg-neutral-900 rounded-2xl border border-black/10 dark:border-white/10 p-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
          <Flame className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Ngek Streak!
          </h2>
          <p className="text-sm text-neutral-500 dark:text-white/50">
            Konsisten ngek setiap hari
          </p>
        </div>
      </div>

      {/* Streak Counter */}
      <div className="text-center mb-6">
        <motion.span
          className="text-6xl font-bold text-primary"
          key={current}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {current}
        </motion.span>
        <p className="text-lg text-neutral-500 dark:text-white/50">Hari</p>
      </div>

      {/* Next Milestone Message */}
      {nextMilestone.message && current < 365 && (
        <p className="text-center text-sm text-primary font-medium mb-4">
          {nextMilestone.message}
        </p>
      )}

      {/* Progress to Next Milestone */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-neutral-500 dark:text-white/50">
            Target: {nextMilestone.days} hari
          </span>
          <span className="text-primary font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-green-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex justify-between text-sm text-neutral-500 dark:text-white/50 mb-4 pb-4 border-b border-black/5 dark:border-white/5">
        <div>
          <span>Terakhir ngek:</span>
          <span className="font-medium text-black dark:text-white ml-1">
            {formatLastCheckIn(lastCheckIn)}
          </span>
        </div>
        <div>
          <span>Rekor:</span>
          <span className="font-medium text-primary ml-1">{longest} hari</span>
        </div>
      </div>

      {/* Streak Freeze Indicator */}
      {streakFreezeAvailable && !hasCheckedInToday && (
        <div className="flex items-center justify-center gap-2 text-sm text-blue-500 mb-4">
          <Snowflake className="w-4 h-4" />
          <span>Freeze tersedia!</span>
        </div>
      )}

      {/* Check-in Button */}
      <motion.button
        onClick={onCheckIn}
        disabled={hasCheckedInToday}
        className={`w-full rounded-full py-3 font-semibold flex items-center justify-center gap-2 transition-all ${
          hasCheckedInToday
            ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
            : "bg-primary text-neutral-900 hover:shadow-lg hover:shadow-primary/30"
        }`}
        whileHover={hasCheckedInToday ? {} : { scale: 1.02 }}
        whileTap={hasCheckedInToday ? {} : { scale: 0.98 }}
      >
        {hasCheckedInToday ? (
          <>
            <Check className="w-5 h-5" />
            Sudah ngek hari ini!
          </>
        ) : (
          <>
            <Plus className="w-5 h-5" />
            Check-in hari ini!
          </>
        )}
      </motion.button>
    </motion.div>
  );
}