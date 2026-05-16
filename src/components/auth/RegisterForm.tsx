"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { validateRegisterForm, getPasswordStrength, PasswordStrength } from "@/lib/validation";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";

export default function RegisterForm() {
  const { register, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

  const passwordStrength: PasswordStrength = getPasswordStrength(password);

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "weak":
        return "bg-expense";
      case "medium":
        return "bg-warning";
      case "strong":
        return "bg-income";
      default:
        return "bg-neutral-200 dark:bg-neutral-700";
    }
  };

  const getStrengthWidth = () => {
    switch (passwordStrength) {
      case "weak":
        return "w-1/3";
      case "medium":
        return "w-2/3";
      case "strong":
        return "w-full";
      default:
        return "w-0";
    }
  };

  const getStrengthLabel = () => {
    switch (passwordStrength) {
      case "weak":
        return "text-expense";
      case "medium":
        return "text-warning";
      case "strong":
        return "text-income";
      default:
        return "text-neutral-500";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    // Validate form
    const validationErrors = validateRegisterForm({
      name,
      email,
      password,
      confirmPassword,
      terms,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    // Register
    const result = await register(name, email, password);
    if (!result.success && result.error) {
      setServerError(result.error);
    }
  };

  const handleBlur = (field: string) => {
    const validationErrors = validateRegisterForm({
      name,
      email,
      password,
      confirmPassword,
      terms,
    });

    if (validationErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validationErrors[field] }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Server Error */}
        {serverError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 rounded-lg bg-expense/10 border border-expense/20"
          >
            <p className="text-sm text-expense flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {serverError}
            </p>
          </motion.div>
        )}

        {/* Name Input */}
        <AuthInput
          label="Nama Lengkap"
          type="text"
          placeholder="Masukan nama lengkap"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => handleBlur("name")}
          error={errors.name}
          prefixIcon={<User className="w-5 h-5" />}
          autoComplete="name"
        />

        {/* Email Input */}
        <AuthInput
          label="Email"
          type="email"
          placeholder="nama@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => handleBlur("email")}
          error={errors.email}
          prefixIcon={<Mail className="w-5 h-5" />}
          autoComplete="email"
        />

        {/* Password Input */}
        <div className="space-y-2">
          <AuthInput
            label="Kata Sandi"
            type={showPassword ? "text" : "password"}
            placeholder="Masukan kata sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur("password")}
            error={errors.password}
            prefixIcon={<Lock className="w-5 h-5" />}
            suffixIcon={
              showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )
            }
            onSuffixClick={() => setShowPassword(!showPassword)}
            autoComplete="new-password"
          />
          <p className="text-xs text-neutral-500 dark:text-white/50">
            Minimal 8 karakter
          </p>
        </div>

        {/* Password Strength Indicator */}
        {password && (
          <div className="space-y-2">
            <div className="h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${getStrengthColor()} ${getStrengthWidth()}`}
              />
            </div>
            <p className={`text-xs ${getStrengthLabel()}`}>
              {passwordStrength === "weak"
                ? "Lemah"
                : passwordStrength === "medium"
                ? "Sedang"
                : "Kuat"}
            </p>
          </div>
        )}

        {/* Confirm Password Input */}
        <AuthInput
          label="Konfirmasi Kata Sandi"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Ulangi kata sandi"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => handleBlur("confirmPassword")}
          error={errors.confirmPassword}
          prefixIcon={<Lock className="w-5 h-5" />}
          suffixIcon={
            showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )
          }
          onSuffixClick={() => setShowConfirmPassword(!showConfirmPassword)}
          autoComplete="new-password"
        />

        {/* Terms Checkbox */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            onBlur={() => handleBlur("terms")}
            className="w-5 h-5 rounded border border-black/10 dark:border-white/10 accent-primary cursor-pointer mt-0.5"
          />
          <label
            htmlFor="terms"
            className="text-sm text-neutral-600 dark:text-white/50 cursor-pointer"
          >
            Saya setuju dengan{" "}
            <Link
              href="/terms"
              className="text-primary hover:underline"
            >
              Syarat & Ketentuan
            </Link>{" "}
            dan{" "}
            <Link
              href="/privacy"
              className="text-primary hover:underline"
            >
              Kebijakan Privasi
            </Link>
          </label>
        </div>
        {errors.terms && (
          <p className="text-xs text-expense">{errors.terms}</p>
        )}

        {/* Submit Button */}
        <AuthButton type="submit" isLoading={isLoading} label="Daftar" />
      </form>

      {/* Footer Link */}
      <p className="text-center text-sm text-neutral-600 dark:text-white/50 mt-6">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="text-primary hover:underline font-medium"
        >
          Masuk di sini
        </Link>
      </p>
    </motion.div>
  );
}