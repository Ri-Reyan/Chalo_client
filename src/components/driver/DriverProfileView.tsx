"use client";

import React, { useState } from "react";

interface DriverProfileViewProps {
  driverName: string;
  driverEmail: string;
  vehicleType: "BIKE" | "CAR";
  setVehicleType: (vt: "BIKE" | "CAR") => void;
  isOnline: boolean;
  balance: number;
}

export const DriverProfileView: React.FC<DriverProfileViewProps> = ({
  driverName,
  driverEmail,
  vehicleType,
  setVehicleType,
  isOnline,
  balance,
}) => {
  const [name, setName] = useState(driverName || "Rafiqul Alam");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-[#9a2121] border border-[#c8833b]/60 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-[#d4b454] text-[#2a2a2a] flex items-center justify-center text-2xl font-black shadow-lg">
              {name ? name.charAt(0).toUpperCase() : "D"}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#6f1b1b] border border-emerald-500/50 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                <span>Verified Driver Partner</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white">{name}</h1>
              <p className="text-xs text-stone-200">{driverEmail}</p>
            </div>
          </div>

          <div className="bg-[#6f1b1b] border border-[#c8833b]/50 rounded-2xl px-5 py-3 text-center sm:text-right shrink-0">
            <span className="text-[11px] text-stone-300 block">Available Balance</span>
            <div className="text-2xl font-black text-[#d4b454]">
              ৳{balance.toFixed(2)}
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">
              Status: {isOnline ? "Online 🟢" : "Offline ⏸️"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Driver Info & Vehicle Assignment (7 cols) */}
        <div className="lg:col-span-7 bg-[#9a2121] border border-[#c8833b]/60 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-[#d4b454]">
            Driver &amp; Vehicle Configuration
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-200 mb-1">
                Legal Driver Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-3.5 bg-[#f5f5f5] text-[#2a2a2a] rounded-xl border border-[#c8833b] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#d4b454]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-200 mb-1">
                Registered Email (Prisma User ID)
              </label>
              <input
                type="email"
                disabled
                value={driverEmail}
                className="w-full h-11 px-3.5 bg-stone-200 text-stone-600 rounded-xl border border-stone-400 text-sm font-medium cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-200 mb-1.5">
                Active Vehicle Class (Prisma Enum: BIKE | CAR)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVehicleType("BIKE")}
                  className={`py-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    vehicleType === "BIKE"
                      ? "bg-[#d4b454] text-[#2a2a2a] border-[#d4b454] shadow-md scale-[1.01]"
                      : "bg-[#6f1b1b] text-white border-stone-500/50 hover:bg-[#7e1f1f]"
                  }`}
                >
                  <span>🏍️</span>
                  <span>Motorbike (BIKE)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVehicleType("CAR")}
                  className={`py-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    vehicleType === "CAR"
                      ? "bg-[#d4b454] text-[#2a2a2a] border-[#d4b454] shadow-md scale-[1.01]"
                      : "bg-[#6f1b1b] text-white border-stone-500/50 hover:bg-[#7e1f1f]"
                  }`}
                >
                  <span>🚗</span>
                  <span>Car / Sedan (CAR)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-200 mb-1">
                Assigned Platform Role
              </label>
              <div className="h-11 px-3.5 bg-[#6f1b1b] rounded-xl border border-[#c8833b]/40 flex items-center text-sm font-bold text-[#d4b454]">
                DRIVER
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-[#d4b454] hover:bg-[#b45f06] text-[#2a2a2a] hover:text-white font-bold text-xs uppercase tracking-wide transition-all shadow-md"
              >
                Save Driver Settings
              </button>
              {isSaved && (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
                  <span>✓</span> Settings updated!
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Verification & Policy Badges (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#9a2121] border border-[#c8833b]/60 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#d4b454]">
              Platform Compliance
            </h3>

            <div className="bg-[#6f1b1b] border border-[#c8833b]/40 rounded-2xl p-4 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-stone-300">Driver License Check:</span>
                <span className="text-emerald-400 font-bold">✓ Verified</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-300">National ID (NID):</span>
                <span className="text-emerald-400 font-bold">✓ Verified</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-300">Vehicle Fitness Certificate:</span>
                <span className="text-emerald-400 font-bold">✓ Passed</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#c8833b]/30 pt-2">
                <span className="text-stone-300">Platform Commission Rate:</span>
                <span className="text-[#d4b454] font-bold">10% Flat Cut</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverProfileView;

