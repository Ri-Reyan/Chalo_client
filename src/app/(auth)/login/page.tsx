"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { getErrorMessage } from "@/lib/axios";
import ConfirmModal from "@/components/common/ConfirmModal";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user, isAuthenticated, loading } = useAuth();

  const [role, setRole] = useState<"CUSTOMER" | "DRIVER">("CUSTOMER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      const redirectParam = searchParams.get("redirect");
      const target =
        redirectParam || (user.role === "DRIVER" ? "/driver" : "/customer");
      router.replace(target);
    }
  }, [loading, isAuthenticated, user, router, searchParams]);

  const handleQuickFill = (targetRole: "CUSTOMER" | "DRIVER") => {
    setRole(targetRole);
    setErrorMessage("");
    if (targetRole === "CUSTOMER") {
      setEmail("customer@chalo.app");
      setPassword("Pass1234!");
    } else {
      setEmail("driver@chalo.app");
      setPassword("Pass1234!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please fill in both email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ email, password });
    } catch (err: unknown) {
      setErrorMessage(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-115 mx-auto animate-in fade-in duration-300">
      {/* Auth Card */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-7 sm:p-9 shadow-xl shadow-stone-200/50">
        {/* Role Switcher Tabs */}
        <div className="flex bg-stone-100/90 p-1.5 rounded-2xl mb-7 border border-stone-200/80">
          <button
            type="button"
            onClick={() => {
              setRole("CUSTOMER");
              setErrorMessage("");
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              role === "CUSTOMER"
                ? "bg-[#292524] text-white shadow-xs"
                : "text-stone-600 hover:text-[#292524]"
            }`}
          >
            <span>🚶</span>
            <span>Customer Login</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setRole("DRIVER");
              setErrorMessage("");
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              role === "DRIVER"
                ? "bg-[#292524] text-white shadow-xs"
                : "text-stone-600 hover:text-[#292524]"
            }`}
          >
            <span>🏍️</span>
            <span>Driver Login</span>
          </button>
        </div>

        {/* Headline */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#292524] tracking-tight">
            Welcome back
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-stone-500">
            {role === "CUSTOMER"
              ? "Sign in to your customer account"
              : "Sign in to your driver partner dashboard"}
          </p>
        </div>

        {/* Quick Demo Pre-fill Pill Bar */}
        <div className="mb-6 bg-stone-50 border border-stone-200/90 rounded-2xl p-3 text-center">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block mb-2">
            ⚡ Quick Prototype Demo
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill("CUSTOMER")}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-stone-100 rounded-xl text-xs font-semibold text-stone-700 border border-stone-200 shadow-2xs transition-colors"
            >
              Fill Customer Creds
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("DRIVER")}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-stone-100 rounded-xl text-xs font-semibold text-stone-700 border border-stone-200 shadow-2xs transition-colors"
            >
              Fill Driver Creds
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800 flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#292524] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. customer@example.com"
              className="w-full h-11 px-3.5 bg-stone-50 text-[#292524] placeholder-stone-400 rounded-xl border border-stone-200 text-sm focus:outline-none focus:bg-white focus:border-[#FFB7B2] focus:ring-2 focus:ring-[#FFB7B2]/30 transition-all font-medium"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#292524]">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] font-semibold text-stone-600 hover:text-[#292524]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-11 px-3.5 bg-stone-50 text-[#292524] placeholder-stone-400 rounded-xl border border-stone-200 text-sm focus:outline-none focus:bg-white focus:border-[#FFB7B2] focus:ring-2 focus:ring-[#FFB7B2]/30 transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center gap-2 text-stone-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 text-[#292524] focus:ring-[#FFB7B2] accent-[#292524]"
              />
              <span className="font-medium">Keep me signed in</span>
            </label>
            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                setIsForgotModalOpen(true);
              }}
              className="text-stone-600 hover:text-[#292524] hover:underline font-medium"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 mt-2 rounded-xl bg-[#FFB7B2] hover:bg-[#FF9E98] text-[#292524] font-bold text-sm tracking-wide transition-all duration-200 hover:shadow-md active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>
                Sign In as {role === "CUSTOMER" ? "Customer" : "Driver"} →
              </span>
            )}
          </button>
        </form>

        {/* Footer Link to Register */}
        <div className="mt-7 pt-5 border-t border-stone-200 text-center text-xs text-stone-500">
          Don&apos;t have an account yet?{" "}
          <Link
            href={`/register?role=${role}`}
            className="font-bold text-[#292524] hover:underline"
          >
            Create an account
          </Link>
        </div>
      </div>

      <ConfirmModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Prototype Notice"
        message="Password recovery is disabled for this MVP prototype. Please select a Quick-Fill Demo Account above to sign in instantly."
        confirmText="Understood"
        variant="info"
        isAlertOnly
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="text-stone-700 text-sm font-semibold flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-[#292524] border-t-transparent rounded-full animate-spin" />
          <span>Loading Chalo login...</span>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
