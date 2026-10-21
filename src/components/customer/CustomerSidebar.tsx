"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type CustomerTab = "request" | "tracking" | "history" | "profile";

interface CustomerSidebarProps {
  activeTab: CustomerTab;
  setActiveTab: (tab: CustomerTab) => void;
  hasActiveRide: boolean;
  customerName: string;
  customerEmail: string;
}

export const CustomerSidebar: React.FC<CustomerSidebarProps> = ({
  activeTab,
  setActiveTab,
  hasActiveRide,
  customerName,
  customerEmail,
}) => {
  const router = useRouter();

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("chalo_user");
    }
    router.push("/login");
  };

  const navItems: { id: CustomerTab; label: string; icon: string; badge?: string }[] = [
    {
      id: "request",
      label: "Request Ride",
      icon: "🚗",
    },
    {
      id: "tracking",
      label: "Ongoing Ride",
      icon: "📍",
      badge: hasActiveRide ? "Live" : undefined,
    },
    {
      id: "history",
      label: "Ride History",
      icon: "📜",
    },
    {
      id: "profile",
      label: "Profile",
      icon: "👤",
    },
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#6f1b1b] border-b lg:border-b-0 lg:border-r border-[#c8833b]/40 flex flex-col justify-between shrink-0">
      {/* Top Branding & Profile Summary */}
      <div className="p-5 sm:p-6">
        {/* Logo */}
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
              Customer Hub
            </span>
          </div>
        </Link>

        {/* Customer Info Card */}
        <div className="bg-[#9a2121] border border-[#c8833b]/50 rounded-2xl p-3.5 mb-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#d4b454] text-[#2a2a2a] flex items-center justify-center font-bold text-sm shadow-xs">
              {customerName ? customerName.charAt(0).toUpperCase() : "C"}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-white truncate">
                {customerName || "Customer"}
              </div>
              <div className="text-[11px] text-stone-300 truncate">
                {customerEmail || "customer@chalo.app"}
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#c8833b]/30 flex items-center justify-between text-xs">
            <span className="text-stone-300 font-medium">Role:</span>
            <span className="font-bold text-[#d4b454] bg-[#6f1b1b] px-2 py-0.5 rounded-md text-[10px] uppercase">
              Customer
            </span>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="space-y-1.5" aria-label="Customer Dashboard Navigation">
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
                    className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full animate-pulse ${
                      isActive
                        ? "bg-[#2a2a2a] text-[#d4b454]"
                        : "bg-emerald-500 text-white"
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

      {/* Bottom Sign Out Bar */}
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

export default CustomerSidebar;

