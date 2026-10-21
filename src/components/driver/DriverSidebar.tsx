"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type DriverTab = "requests" | "ongoing" | "history" | "withdraw" | "profile";

interface DriverSidebarProps {
  activeTab: DriverTab;
  setActiveTab: (tab: DriverTab) => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  hasActiveRide: boolean;
  driverName: string;
  vehicleType: "BIKE" | "CAR";
  balance: number;
}

export const DriverSidebar: React.FC<DriverSidebarProps> = ({
  activeTab,
  setActiveTab,
  isOnline,
  setIsOnline,
  hasActiveRide,
  driverName,
  vehicleType,
  balance,
}) => {
  const router = useRouter();

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("chalo_user");
    }
    router.push("/login");
  };

  const navItems: { id: DriverTab; label: string; icon: string; badge?: string }[] = [
    {
      id: "requests",
      label: "Available Requests",
      icon: "📲",
      badge: isOnline && !hasActiveRide ? "1 New" : undefined,
    },
    {
      id: "ongoing",
      label: "Ongoing Ride",
      icon: "📍",
      badge: hasActiveRide ? "Active" : undefined,
    },
    {
      id: "history",
      label: "Ride History",
      icon: "📜",
    },
    {
      id: "withdraw",
      label: "Withdraw",
      icon: "💳",
    },
    {
      id: "profile",
      label: "Profile",
      icon: "👤",
    },
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#6f1b1b] border-b lg:border-b-0 lg:border-r border-[#c8833b]/40 flex flex-col justify-between shrink-0">
      <div className="p-5 sm:p-6">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none mb-6"
        >
          <div className="w-8 h-8 rounded-full bg-[#FFB7B2] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
            <div className="w-2.5 h-2.5 rounded-full bg-[#292524] shadow-xs" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white leading-none">
              Chalo
            </span>
            <span className="text-[10px] font-bold text-[#d4b454] uppercase tracking-wider">
              Driver Partner Hub
            </span>
          </div>
        </Link>

        {/* Driver Profile Card */}
        <div className="bg-[#9a2121] border border-[#c8833b]/50 rounded-2xl p-3.5 mb-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#d4b454] text-[#2a2a2a] flex items-center justify-center font-bold text-sm shadow-xs">
              {driverName ? driverName.charAt(0).toUpperCase() : "D"}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-white truncate">
                {driverName || "Driver Partner"}
              </div>
              <div className="text-[11px] text-[#d4b454] font-semibold flex items-center gap-1">
                <span>{vehicleType === "BIKE" ? "🏍️ Bike" : "🚗 Car"}</span>
                <span className="text-stone-300">&bull; 4.95 ★</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#c8833b]/30 flex items-center justify-between text-xs">
            <span className="text-stone-300 font-medium">Balance:</span>
            <span className="font-extrabold text-[#d4b454]">৳{balance.toFixed(2)}</span>
          </div>
        </div>

        {/* Online / Offline Availability Toggle (As specified in prompt) */}
        <div className="mb-6 bg-[#9a2121] border border-[#c8833b]/50 rounded-2xl p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  isOnline
                    ? "bg-emerald-400 animate-ping"
                    : "bg-stone-500"
                }`}
              />
              <span className="text-xs font-bold text-white">
                {isOnline ? "You are Online" : "You are Offline"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOnline(!isOnline)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isOnline ? "bg-emerald-500" : "bg-stone-600"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isOnline ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <div className="mt-1 text-[10px] text-stone-300">
            {isOnline
              ? "Ready to receive nearby customer ride requests"
              : "Toggle online to start receiving ride offers"}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5" aria-label="Driver Navigation">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#d4b454] text-[#2a2a2a] shadow-md font-bold scale-[1.01]"
                    : "text-stone-200 hover:text-white hover:bg-[#9a2121]/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-[#2a2a2a] text-[#d4b454]"
                        : "bg-emerald-500 text-white animate-pulse"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sign Out */}
      <div className="p-5 sm:p-6 border-t border-[#c8833b]/30">
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-stone-300 hover:text-white bg-[#9a2121]/80 hover:bg-[#9a2121] border border-[#c8833b]/40 transition-colors"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default DriverSidebar;

