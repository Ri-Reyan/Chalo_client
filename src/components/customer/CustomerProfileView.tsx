"use client";

import React, { useState } from "react";

interface CustomerProfileViewProps {
  customerName: string;
  customerEmail: string;
}

export const CustomerProfileView: React.FC<CustomerProfileViewProps> = ({
  customerName,
  customerEmail,
}) => {
  const [name, setName] = useState(customerName || "Sarah Khan");
  const [isSaved, setIsSaved] = useState(false);

  const [savedPlaces, setSavedPlaces] = useState([
    { title: "Home", address: "House 14, Road 7, Dhanmondi", icon: "🏠" },
    {
      title: "Office",
      address: "Tower 52, Gulshan Avenue, Gulshan 2",
      icon: "🏢",
    },
    {
      title: "University / Study",
      address: "Brac University Campus, Merul Badda",
      icon: "🎓",
    },
  ]);

  const handleSaveProfile = (e: React.FormEvent) => {
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
              {name ? name.charAt(0).toUpperCase() : "C"}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#6f1b1b] border border-[#c8833b]/50 text-[#d4b454] text-[10px] font-extrabold uppercase tracking-wider mb-1">
                <span>Verified Customer</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white">{name}</h1>
              <p className="text-xs text-stone-200">{customerEmail}</p>
            </div>
          </div>

          <div className="bg-[#6f1b1b] border border-[#c8833b]/50 rounded-2xl px-5 py-3 text-center sm:text-right shrink-0">
            <span className="text-[11px] text-stone-300 block">
              Customer Balance
            </span>
            <div className="text-2xl font-black text-[#d4b454]">৳0.00</div>
            <span className="text-[10px] text-stone-300">
              Cashless Auto-Billing Active
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Account Details (7 cols) */}
        <div className="lg:col-span-7 bg-[#9a2121] border border-[#c8833b]/60 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-[#d4b454]">
            Account Information
          </h2>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-200 mb-1">
                Full Name
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
                Email Address (Prisma Unique Identifier)
              </label>
              <input
                type="email"
                disabled
                value={customerEmail}
                className="w-full h-11 px-3.5 bg-stone-200 text-stone-600 rounded-xl border border-stone-400 text-sm font-medium cursor-not-allowed"
              />
              <span className="text-[11px] text-stone-300 mt-1 block">
                Email address is linked to your authenticated JWT session.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-200 mb-1">
                Assigned Platform Role
              </label>
              <div className="h-11 px-3.5 bg-[#6f1b1b] rounded-xl border border-[#c8833b]/40 flex items-center text-sm font-bold text-[#d4b454]">
                CUSTOMER
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-[#d4b454] hover:bg-[#b45f06] text-[#2a2a2a] hover:text-white font-bold text-xs uppercase tracking-wide transition-all shadow-md"
              >
                Save Profile Changes
              </button>
              {isSaved && (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
                  <span>✓</span> Changes saved!
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Saved Places & Security Preferences (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Saved Places */}
          <div className="bg-[#9a2121] border border-[#c8833b]/60 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#c8833b]/30">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#d4b454]">
                Saved Favorites
              </h3>
              <span className="text-xs text-stone-300">Quick Destination</span>
            </div>

            <div className="space-y-3">
              {savedPlaces.map((place, idx) => (
                <div
                  key={idx}
                  className="bg-[#6f1b1b] border border-[#c8833b]/40 rounded-2xl p-3 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{place.icon}</span>
                    <div>
                      <div className="font-bold text-white">{place.title}</div>
                      <div className="text-[11px] text-stone-300">
                        {place.address}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety & SOS Settings */}
          <div className="bg-[#9a2121] border border-[#c8833b]/60 rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#d4b454]">
              Safety & Verification
            </h3>
            <div className="bg-[#6f1b1b] border border-[#c8833b]/40 rounded-2xl p-3 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-stone-300">Mandatory 4-Digit OTP</span>
                <span className="text-emerald-400 font-bold">✓ Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-300">Emergency SOS Hotline</span>
                <span className="text-emerald-400 font-bold">
                  ✓ 24/7 Monitored
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfileView;
