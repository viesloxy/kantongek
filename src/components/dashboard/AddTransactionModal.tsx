"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Check } from "lucide-react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, CATEGORY_ICONS } from "@/types";
import { useDashboard } from "@/context/DashboardContext";
import * as LucideIcons from "lucide-react";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: "income" | "expense";
}

export default function AddTransactionModal({ isOpen, onClose, defaultType = "expense" }: AddTransactionModalProps) {
  const { addTransaction } = useDashboard();
  const [type, setType] = useState<"income" | "expense">(defaultType);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  // Reset form when opening
  useEffect(() => {
    if (isOpen) {
      setType(defaultType);
      setCategory("");
      setAmount("");
      setDescription("");
    }
  }, [isOpen, defaultType]);

  // Get icon component dynamically
  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.Package;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !amount || !description) {
      alert("Mohon lengkapi semua field");
      return;
    }

    const amountNumber = parseInt(amount.replace(/[^0-9]/g, ""), 10);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      alert("Mohon masukkan jumlah yang valid");
      return;
    }

    setIsSubmitting(true);

    try {
      addTransaction({
        type,
        category,
        amount: amountNumber,
        description,
        date: new Date().toISOString(),
      });

      // Show success briefly
      setTimeout(() => {
        onClose();
        setIsSubmitting(false);
      }, 500);
    } catch (error) {
      setIsSubmitting(false);
      alert("Terjadi kesalahan saat menyimpan transaksi");
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value === "") {
      setAmount("");
    } else {
      // Format as currency
      const number = parseInt(value, 10);
      setAmount(new Intl.NumberFormat("id-ID").format(number));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/10">
                <h2 className="text-xl font-medium text-black dark:text-white">
                  Tambah Transaksi
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-neutral-600 dark:text-white/60" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Type Toggle */}
                <div className="flex gap-2 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                  <button
                    type="button"
                    onClick={() => {
                      setType("expense");
                      setCategory("");
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-medium transition-all ${
                      type === "expense"
                        ? "bg-expense text-white"
                        : "text-neutral-600 dark:text-white/60 hover:text-primary"
                    }`}
                  >
                    <Minus className="w-4 h-4" />
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setType("income");
                      setCategory("");
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-medium transition-all ${
                      type === "income"
                        ? "bg-income text-white"
                        : "text-neutral-600 dark:text-white/60 hover:text-primary"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    Income
                  </button>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-white/60 mb-2">
                    Jumlah
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">Rp</span>
                    <input
                      type="text"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="0"
                      className="w-full pl-12 pr-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-primary rounded-xl text-lg font-medium text-black dark:text-white placeholder-neutral-400 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-white/60 mb-2">
                    Kategori
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map((cat) => {
                      const IconComponent = getIconComponent(cat.icon);
                      const isSelected = category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10"
                              : "border-black/10 dark:border-white/10 hover:border-primary/50"
                          }`}
                        >
                          <IconComponent className={`w-5 h-5 ${
                            isSelected ? "text-primary" : "text-neutral-600 dark:text-white/60"
                          }`} />
                          <span className={`text-xs ${
                            isSelected ? "text-primary font-medium" : "text-neutral-600 dark:text-white/60"
                          }`}>
                            {cat.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-white/60 mb-2">
                    Deskripsi
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Contoh: Makan siang di kantin"
                    className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-primary rounded-xl text-black dark:text-white placeholder-neutral-400 outline-none transition-colors"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-neutral-900 rounded-full py-3.5 font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-neutral-900/30 border-t-neutral-900 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Simpan Transaksi
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}