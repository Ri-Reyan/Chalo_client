"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"CUSTOMER" | "DRIVER">( "CUSTOMER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please fill in both email and password.");
      return;
    }

    setIsLoading(true);

    // Simulate authentication and persist mock session
    setTimeout(() => {
      setIsLoading(false);

      const mockUser = {
        id: role === "CUSTOMER" ? "cust-uuid-1" : "driver-uuid-1",
        name: role === "CUSTOMER" ? "Sarah Khan" : "Rafiqul Alam",
        email: email.trim().toLowerCase(),
        role: role,
        vehicleType: role === "DRIVER" ? "BIKE" : null,
        isOnline: false,
        balance: "0.00",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("chalo_user", JSON.stringify(mockUser));
      }

      if (role === "CUSTOMER") {
        router.push("/dashboard/customer");
      } else {
        router.push("/dashboard/driver");
      }
    }, 600);
  };

  return (
    <div className="w-full max-w-[460px] mx-auto animate-in fade-in duration-300">
      {/* Auth Card */}
      <div className="bg-[#9a2121] border border-[#c8833b] rounded-3xl p-7 sm:p-9 shadow-2xl">
        {/* Role Switcher Tabs */}
        <div className="flex bg-[#6f1b1b] p-1.5 rounded-2xl mb-7 border border-[#c8833b]/40">
          <button
            type="button"
            onClick={() => {
              setRole("CUSTOMER");
              setErrorMessage("");
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              role === "CUSTOMER"
                ? "bg-[#d4b454] text-[#2a2a2a] shadow-sm"
                : "text-stone-300 hover:text-white"
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
                ? "bg-[#d4b454] text-[#2a2a2a] shadow-sm"
                : "text-stone-300 hover:text-white"
            }`}
          >
            <span>🏍️</span>
            <span>Driver Login</span>
          </button>
        </div>

        {/* Headline */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome back
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-stone-200">
            {role === "CUSTOMER"
              ? "Sign in to your customer account"
              : "Sign in to your driver partner dashboard"}
          </p>
        </div>

        {/* Quick Demo Pre-fill Pill Bar */}
        <div className="mb-6 bg-[#6f1b1b]/80 border border-[#c8833b]/50 rounded-2xl p-3 text-center">
          <span className="text-[11px] font-semibold text-[#d4b454] uppercase tracking-wider block mb-2">
            ⚡ Quick Prototype Demo
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill("CUSTOMER")}
              className="flex-1 py-1.5 px-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium text-white transition-colors"
            >
              Fill Customer Creds
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("DRIVER")}
              className="flex-1 py-1.5 px-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium text-white transition-colors"
            >
              Fill Driver Creds
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 bg-[#f44336]/20 border border-[#f44336] rounded-xl p-3 text-xs text-white flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-200 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. customer@example.com"
              className="w-full h-11 px-3.5 bg-[#f5f5f5] text-[#2a2a2a] placeholder-stone-500 rounded-xl border border-[#c8833b] text-sm focus:outline-none focus:ring-2 focus:ring-[#d4b454] transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-200">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-[#d4b454] hover:underline"
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
                className="w-full h-11 px-3.5 bg-[#f5f5f5] text-[#2a2a2a] placeholder-stone-500 rounded-xl border border-[#c8833b] text-sm focus:outline-none focus:ring-2 focus:ring-[#d4b454] transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center gap-2 text-stone-200 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 text-[#d4b454] focus:ring-[#d4b454] accent-[#d4b454]"
              />
              <span>Keep me signed in</span>
            </label>
            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                alert("For this prototype, use the demo credentials above.");
              }}
              className="text-[#d4b454] hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 mt-2 rounded-xl bg-[#d4b454] hover:bg-[#b45f06] text-[#2a2a2a] hover:text-white font-bold text-sm tracking-wide transition-all duration-200 hover:scale-[0.99] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Sign In as {role === "CUSTOMER" ? "Customer" : "Driver"} →</span>
            )}
          </button>
        </form>

        {/* Footer Link to Register */}
        <div className="mt-7 pt-5 border-t border-[#c8833b]/40 text-center text-xs text-stone-200">
          Don&apos;t have an account yet?{" "}
          <Link
            href={`/register?role=${role}`}
            className="font-bold text-[#d4b454] hover:underline"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
