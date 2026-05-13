"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  TrendingUp,
  BarChart3,
  Settings,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

interface SidebarProps {
  currentPage: string;
  isOpen: boolean;
  onClose: () => void;
}

const mainNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transaksi", href: "/dashboard/transactions", icon: Receipt },
  { label: "Budget", href: "/dashboard/budget", icon: PiggyBank },
  { label: "Tabungan", href: "/dashboard/savings", icon: TrendingUp },
  { label: "Statistik", href: "/dashboard/stats", icon: BarChart3 },
];

const bottomNavItems = [
  { label: "Pengaturan", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar({ currentPage, isOpen, onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { settings } = useDashboard();

  // Handle responsive collapse
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(false); // Mobile mode: always expanded when open
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`
          fixed top-0 left-0 h-screen z-50 flex flex-col
          bg-white dark:bg-neutral-950
          border-r border-black/10 dark:border-white/10
          transition-all duration-300 ease-in-out
          ${isCollapsed && !isMobile ? "w-[72px]" : "w-64 md:w-72"}
          ${isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"}
          lg:translate-x-0
        `}
        initial={false}
        animate={{
          x: 0,
          width: isCollapsed && !isMobile ? 72 : undefined,
        }}
      >
        {/* Logo Section */}
        <div className={`
          flex items-center justify-between
          ${isCollapsed && !isMobile ? "justify-center px-2" : "px-4"}
          h-16 border-b border-black/10 dark:border-white/10
        `}>
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="relative w-9 h-9 flex-shrink-0">
              <Image
                src="/images/Logo.svg"
                alt="KANTONGEK"
                fill
                className="object-contain"
              />
            </div>
            <AnimatePresence>
              {(!isCollapsed || isMobile) && (
                <motion.span
                  className="font-bold text-lg tracking-tight text-black dark:text-white whitespace-nowrap"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  KANTONGEK
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Mobile Close Button */}
          {isMobile && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-neutral-600 dark:text-white/60" />
            </button>
          )}

          {/* Desktop Collapse Toggle */}
          {!isMobile && !isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="hidden lg:block p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4 text-neutral-600 dark:text-white/60" />
            </button>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const isActive = currentPage === item.label.toLowerCase();
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => isMobile && onClose()}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-xl
                    transition-all duration-300
                    ${isCollapsed && !isMobile ? "justify-center" : ""}
                    ${isActive
                      ? "bg-primary/10 text-primary"
                      : "text-neutral-600 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary"
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-primary" : ""}`} />
                  <AnimatePresence>
                    {(!isCollapsed || isMobile) && (
                      <motion.span
                        className={`font-medium whitespace-nowrap ${isCollapsed ? "hidden" : ""}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                      layoutId="activeIndicator"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-black/10 dark:border-white/10 py-4 px-3">
          <div className="space-y-1">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => isMobile && onClose()}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-xl
                    text-neutral-600 dark:text-white/60
                    hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary
                    transition-all duration-300
                    ${isCollapsed && !isMobile ? "justify-center" : ""}
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <AnimatePresence>
                    {(!isCollapsed || isMobile) && (
                      <motion.span
                        className="font-medium whitespace-nowrap"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}

            {/* Logout */}
            <button
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-xl
                text-neutral-600 dark:text-white/60
                hover:bg-expense/10 hover:text-expense
                transition-all duration-300
                ${isCollapsed && !isMobile ? "justify-center" : ""}
              `}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {(!isCollapsed || isMobile) && (
                  <motion.span
                    className="font-medium whitespace-nowrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    Keluar
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* User Info */}
          <AnimatePresence>
            {(!isCollapsed || isMobile) && (
              <motion.div
                className="mt-4 p-3 rounded-xl bg-black/5 dark:bg-white/5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">
                      {settings.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-black dark:text-white truncate">
                      {settings.name}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-white/40">
                      Gen-Z User
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expand Button (when collapsed) */}
          {!isMobile && isCollapsed && (
            <button
              onClick={() => setIsCollapsed(false)}
              className="hidden lg:flex w-full mt-2 items-center justify-center gap-2 px-3 py-2 rounded-xl text-neutral-600 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.aside>
    </>
  );
}