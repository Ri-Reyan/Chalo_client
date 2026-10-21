import React from "react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#6f1b1b] text-white flex flex-col justify-between relative overflow-hidden selection:bg-[#d4b454] selection:text-[#2a2a2a]">
      {/* Decorative Brand Ambient Blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#9a2121] opacity-60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#d4b454] opacity-20 blur-3xl"
      />

      {/* Auth Top Header */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4b454] rounded-full"
        >
          <div className="w-8 h-8 rounded-full bg-[#FFB7B2] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
            <div className="w-2.5 h-2.5 rounded-full bg-[#292524] shadow-xs" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white leading-none">
              Chalo
            </span>
            <span className="text-[10px] font-semibold text-[#d4b454] uppercase tracking-wider">
              Mobility
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs sm:text-sm font-medium text-stone-300 hover:text-white px-3.5 py-1.5 rounded-full border border-stone-500/40 hover:border-white/60 transition-all flex items-center gap-1.5"
        >
          <span>←</span>
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10 sm:py-14">
        {children}
      </main>

      {/* Auth Bottom Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pb-6 text-center text-xs text-stone-400">
        <p>&copy; 2026 Chalo Technologies Inc. Guaranteed flat fares & fair driver earnings.</p>
      </footer>
    </div>
  );
}

