"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Fitur", href: "#fitur" },
  { label: "Preview", href: "#preview" },
  { label: "Testimoni", href: "#testimoni" },
  { label: "Kontak", href: "#kontak" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Floating Navbar Container */}
      <div className="fixed top-0 left-0 right-0 z-50 py-3 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="rounded-2xl bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-lg">
            <div className="flex items-center justify-between px-4 py-3">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <div className="relative w-8 h-8">
                  <Image
                    src="/images/Logo.svg"
                    alt="Kantongek"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-bold text-base text-black dark:text-white">Kantongek</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center">
                <div className="flex gap-8 font-medium text-sm tracking-wide">
                  {navLinks.map((link) => (
                    <Link
                      href={link.href}
                      key={link.label}
                      className="text-black/60 dark:text-white/60 hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </nav>

              {/* Right Actions */}
              <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 bg-black/5 dark:bg-white/10"
                  aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                >
                  <div className="relative w-5 h-5">
                    <Sun
                      className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                        theme === "light"
                          ? "opacity-100 rotate-0 scale-100"
                          : "opacity-0 rotate-90 scale-0"
                      } text-black`}
                    />
                    <Moon
                      className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                        theme === "dark"
                          ? "opacity-100 rotate-0 scale-100"
                          : "opacity-0 -rotate-90 scale-0"
                      } text-white`}
                    />
                  </div>
                </button>

                {/* Desktop Buttons */}
                <div className="hidden lg:flex items-center gap-3">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-semibold rounded-full text-neutral-700 dark:text-white/70 hover:text-primary dark:hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-semibold rounded-full bg-primary text-neutral-900 hover:shadow-lg hover:shadow-primary/30 transition-all"
                  >
                    Daftar
                  </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                  className="lg:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label="Toggle menu"
                >
                  {isOpen ? (
                    <X className="w-5 h-5 text-black dark:text-white" />
                  ) : (
                    <Menu className="w-5 h-5 text-black dark:text-white" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  className="lg:hidden overflow-hidden border-t border-black/10 dark:border-white/10"
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col items-center gap-4 py-6 px-4">
                    {navLinks.map((link) => (
                      <Link
                        href={link.href}
                        key={link.label}
                        className="text-black/60 dark:text-white/60 hover:text-primary transition-colors py-1 text-sm w-full text-center"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <div className="flex gap-3 pt-2">
                      <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 text-sm font-semibold rounded-full text-neutral-700 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      >
                        Masuk
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 text-sm font-semibold rounded-full bg-primary text-neutral-900 hover:shadow-lg hover:shadow-primary/30 transition-all"
                      >
                        Daftar
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>
        </div>
      </div>
      {/* Spacer for fixed navbar */}
      <div className="h-[72px]" />
    </>
  );
}