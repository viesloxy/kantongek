"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Target,
  Zap,
  Coins,
  Banknote,
  Flame,
  Shield,
  Gem,
  PartyPopper,
} from "lucide-react";
import { Badge } from "@/types";

interface BadgeUnlockAnimationProps {
  isOpen: boolean;
  badge: Badge | null;
  onClose: () => void;
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
};

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
}

const confettiColors = ["#A4D624", "#4CAF50", "#FF9800", "#FFD700", "#FF5252"];

export default function BadgeUnlockAnimation({
  isOpen,
  badge,
  onClose,
}: BadgeUnlockAnimationProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Generate confetti pieces
      const pieces: ConfettiPiece[] = [];
      for (let i = 0; i < 60; i++) {
        pieces.push({
          id: i,
          x: Math.random() * 100,
          color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
          delay: Math.random() * 0.5,
          size: Math.random() * 8 + 4,
        });
      }
      setConfetti(pieces);
    }
  }, [isOpen]);

  if (!badge) return null;

  const IconComponent = iconMap[badge.icon] || Star;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Confetti */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confetti.map((piece) => (
              <motion.div
                key={piece.id}
                className="absolute rounded-full"
                style={{
                  left: `${piece.x}%`,
                  top: -20,
                  backgroundColor: piece.color,
                  width: piece.size,
                  height: piece.size,
                }}
                initial={{ y: -20, opacity: 1, rotate: 0 }}
                animate={{
                  y: typeof window !== "undefined" ? window.innerHeight + 20 : 800,
                  opacity: [1, 1, 0],
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: 3,
                  delay: piece.delay,
                  ease: "easeIn",
                }}
              />
            ))}
          </div>

          {/* Badge Card */}
          <motion.div
            className="bg-white dark:bg-neutral-900 rounded-3xl p-8 text-center max-w-sm mx-4 shadow-2xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {/* Glowing Badge */}
            <motion.div
              className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-green-400 flex items-center justify-center mx-auto mb-6 shadow-xl"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(164, 214, 36, 0.5)",
                  "0 0 40px rgba(164, 214, 36, 0.8)",
                  "0 0 60px rgba(164, 214, 36, 0.5)",
                  "0 0 20px rgba(164, 214, 36, 0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <IconComponent className="w-16 h-16 text-white" />
            </motion.div>

            {/* Text */}
            <motion.h2
              className="text-2xl font-bold mb-2 text-black dark:text-white"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Badge Unlocked!
            </motion.h2>

            <motion.p
              className="text-xl font-semibold text-primary mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {badge.name}
            </motion.p>

            <motion.p
              className="text-neutral-500 dark:text-white/50 mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {badge.description}
            </motion.p>

            {/* Action */}
            <motion.button
              onClick={onClose}
              className="w-full bg-primary text-neutral-900 rounded-full py-3 font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <PartyPopper className="w-5 h-5" />
              Awesome!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}