"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole =
    searchParams.get("role") === "DRIVER" ? "DRIVER" : "CUSTOMER";

  const [role, setRole] = useState<"CUSTOMER" | "DRIVER">(initialRole);

  // Exact fields matching backend Prisma schema (user.prisma & auth.schema.ts)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleType, setVehicleType] = useState<"BIKE" | "CAR">("BIKE");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleQuickFill = (targetRole: "CUSTOMER" | "DRIVER") => {
    setRole(targetRole);
    setErrorMessage("");

    if (targetRole === "CUSTOMER") {
      setName("Sarah Khan");
      setEmail("customer@chalo.app");
      setPassword("Pass1234!");
    } else {
      setName("Rafiqul Alam");
      setEmail("driver@chalo.app");
      setPassword("Pass1234!");
      setVehicleType("BIKE");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Name is required.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (role === "DRIVER" && !vehicleType) {
      setErrorMessage("Vehicle type (Bike or Car) is required for drivers.");
      return;
    }

    setIsLoading(true);

    // Simulate backend registration payload & response
    setTimeout(() => {
      setIsLoading(false);

      const mockUser = {
        id: role === "CUSTOMER" ? "cust-uuid-1" : "driver-uuid-1",
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: role,
        vehicleType: role === "DRIVER" ? vehicleType : null,
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
    <div className="w-full max-w-115 mx-auto animate-in fade-in duration-300">
      <div className="bg-[#9a2121] border border-[#c8833b] rounded-3xl p-7 sm:p-9 shadow-2xl">
        {/* Role Switcher Tabs */}
        <div className="flex bg-[#6f1b1b] p-1.5 rounded-2xl mb-6 border border-[#c8833b]/40">
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
            <span>Customer Sign Up</span>
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
            <span>Driver Sign Up</span>
          </button>
        </div>

        {/* Headline */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {role === "CUSTOMER"
              ? "Create your Customer account"
              : "Register as a Driver"}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-stone-200">
            {role === "CUSTOMER"
              ? "Fast, calm, and zero-surge rides across your city"
              : "Earn with our flat 10% platform fee and take home 90%"}
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
              Fill Customer Data
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("DRIVER")}
              className="flex-1 py-1.5 px-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium text-white transition-colors"
            >
              Fill Driver Data
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

        {/* Form (Strictly aligned with backend registerSchema: name, email, password, role, vehicleType) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-200 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Khan"
              className="w-full h-11 px-3.5 bg-[#f5f5f5] text-[#2a2a2a] placeholder-stone-400 rounded-xl border border-[#c8833b] text-sm focus:outline-none focus:ring-2 focus:ring-[#d4b454] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-200 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. customer@example.com"
              className="w-full h-11 px-3.5 bg-[#f5f5f5] text-[#2a2a2a] placeholder-stone-400 rounded-xl border border-[#c8833b] text-sm focus:outline-none focus:ring-2 focus:ring-[#d4b454] transition-all"
            />
          </div>

          {/* Vehicle Type (Only required for Drivers) */}
          {role === "DRIVER" && (
            <div>
              <label className="block text-xs font-semibold text-stone-200 mb-1.5">
                Vehicle Type (Required for Driver)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVehicleType("BIKE")}
                  className={`py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    vehicleType === "BIKE"
                      ? "bg-[#d4b454] text-[#2a2a2a] border-[#d4b454] shadow-xs"
                      : "bg-[#6f1b1b] text-white border-stone-500/50 hover:bg-[#7e1f1f]"
                  }`}
                >
                  <span>🏍️</span>
                  <span>Bike</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVehicleType("CAR")}
                  className={`py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    vehicleType === "CAR"
                      ? "bg-[#d4b454] text-[#2a2a2a] border-[#d4b454] shadow-xs"
                      : "bg-[#6f1b1b] text-white border-stone-500/50 hover:bg-[#7e1f1f]"
                  }`}
                >
                  <span>🚗</span>
                  <span>Car</span>
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-200 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              className="w-full h-11 px-3.5 bg-[#f5f5f5] text-[#2a2a2a] placeholder-stone-400 rounded-xl border border-[#c8833b] text-sm focus:outline-none focus:ring-2 focus:ring-[#d4b454] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 mt-2 rounded-xl bg-[#d4b454] hover:bg-[#b45f06] text-[#2a2a2a] hover:text-white font-bold text-sm tracking-wide transition-all duration-200 hover:scale-[0.99] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>
                Register as {role === "CUSTOMER" ? "Customer" : "Driver"} →
              </span>
            )}
          </button>
        </form>

        {/* Footer Link to Sign In */}
        <div className="mt-7 pt-5 border-t border-[#c8833b]/40 text-center text-xs text-stone-200">
          Already registered?{" "}
          <Link
            href="/login"
            className="font-bold text-[#d4b454] hover:underline"
          >
            Sign in to your account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="text-white text-sm font-semibold flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-[#d4b454] border-t-transparent rounded-full animate-spin" />
          <span>Loading Chalo registration...</span>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
