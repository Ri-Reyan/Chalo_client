"use client";

import React, { useState } from "react";
import { DriverRideOffer } from "./AvailableRequestsView";

interface DriverOngoingRideViewProps {
  ride: DriverRideOffer | null;
  onRideCompleted: (earnings: number, completedOffer: DriverRideOffer) => void;
  onRideCancelled: () => void;
}

export const DriverOngoingRideView: React.FC<DriverOngoingRideViewProps> = ({
  ride,
  onRideCompleted,
  onRideCancelled,
}) => {
  // 1: En Route to Pickup -> 2: Arrived / Enter OTP -> 3: In Transit -> 4: Completed
  const [tripStep, setTripStep] = useState<1 | 2 | 3 | 4>(1);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isCallingCustomer, setIsCallingCustomer] = useState(false);

  if (!ride) {
    return (
      <div className="bg-[#9a2121] border border-[#c8833b]/60 rounded-3xl p-10 text-center shadow-xl space-y-4 animate-in fade-in">
        <div className="w-16 h-16 rounded-full bg-[#6f1b1b] border border-[#c8833b]/50 text-3xl flex items-center justify-center mx-auto">
          🏍️
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          No Active Ride In Progress
        </h2>
        <p className="text-sm text-stone-200 max-w-md mx-auto">
          You don&apos;t currently have an accepted ride. Check the Available
          Requests tab to accept new incoming offers.
        </p>
      </div>
    );
  }

  const handleArrivedAtPickup = () => {
    setTripStep(2);
  };

  const handleVerifyOtpAndStart = (e: React.FormEvent) => {
    e.preventDefault();
    // Default valid prototype OTP is 5821 or any 4 digits
    if (enteredOtp.length !== 4) {
      setOtpError("Please enter the 4-digit OTP provided by the passenger.");
      return;
    }
    setOtpError("");
    setTripStep(3);
  };

  const handleFinishRide = () => {
    setTripStep(4);
  };

  const handleReturnToDashboard = () => {
    onRideCompleted(ride.netEarnings, ride);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Step Progress Bar */}
      <div className="bg-[#9a2121] border border-[#c8833b]/60 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="text-xs font-bold text-[#d4b454] uppercase tracking-wider">
              {tripStep === 1 && "Step 1 of 3: En Route to Pickup"}
              {tripStep === 2 &&
                "Step 2 of 3: Waiting for Customer • OTP Verification"}
              {tripStep === 3 && "Step 3 of 3: In Transit to Destination"}
              {tripStep === 4 && "Trip Completed Successfully"}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
              {tripStep === 1 && "Driving to passenger pickup point"}
              {tripStep === 2 && "Verify passenger OTP code"}
              {tripStep === 3 &&
                "Passenger on board • Navigating to destination"}
              {tripStep === 4 && "Earnings deposited to your wallet!"}
            </h1>
          </div>

          <div className="bg-[#6f1b1b] border border-[#c8833b]/50 rounded-2xl px-5 py-2.5 text-center sm:text-right shrink-0">
            <span className="text-[10px] text-stone-300 block uppercase">
              Net Fare
            </span>
            <div className="text-2xl font-black text-[#d4b454]">
              + ৳{ride.netEarnings}.00
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-2 bg-[#6f1b1b] rounded-full overflow-hidden border border-[#c8833b]/40">
          <div
            className="h-full bg-[#d4b454] transition-all duration-500 ease-out"
            style={{ width: `${(tripStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Navigation Map Simulation (7 cols) */}
        <div className="lg:col-span-7 bg-[#9a2121] border border-[#c8833b]/60 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-stone-200">
            <span>
              {tripStep < 3
                ? `Heading to: ${ride.pickup}`
                : `Heading to: ${ride.destination}`}
            </span>
            <span className="text-[#d4b454]">
              {tripStep < 3 ? "0.6 km to pickup" : `${ride.distanceKm} km trip`}
            </span>
          </div>

          {/* Map Surface */}
          <div className="relative h-72 rounded-2xl bg-[#1e1e1e] border border-[#c8833b]/50 overflow-hidden shadow-inner flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4b454_1px,transparent_1px)] bg-size-[18px_18px]" />

            {/* Turn-by-Turn Route Line */}
            <svg className="absolute inset-0 w-full h-full">
              <path
                d="M 50 220 Q 180 120 320 60"
                fill="none"
                stroke="#d4b454"
                strokeWidth="5"
                strokeDasharray="6,4"
              />
            </svg>

            {/* Current Position Marker */}
            <div className="absolute left-1/3 bottom-1/3 flex flex-col items-center animate-pulse">
              <div className="w-9 h-9 rounded-full bg-[#d4b454] border-2 border-[#2a2a2a] shadow-2xl flex items-center justify-center text-sm">
                🏍️
              </div>
              <span className="text-[10px] font-bold bg-[#6f1b1b] text-white px-2 py-0.5 rounded shadow mt-1">
                You
              </span>
            </div>

            {/* Target Destination Marker */}
            <div className="absolute right-14 top-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-bold">
                {tripStep < 3 ? "P" : "D"}
              </div>
              <span className="text-[10px] font-bold bg-[#2a2a2a] text-white px-2 py-0.5 rounded shadow mt-1">
                {tripStep < 3 ? "Pickup" : "Destination"}
              </span>
            </div>
          </div>

          {/* Turn-by-Turn Instruction Banner */}
          <div className="bg-[#6f1b1b] border border-[#c8833b]/40 rounded-2xl p-4 flex items-center gap-3 text-xs">
            <div className="w-8 h-8 rounded-xl bg-[#d4b454] text-[#2a2a2a] flex items-center justify-center font-bold text-sm shrink-0">
              ↱
            </div>
            <div>
              <div className="font-bold text-white">
                In 200m, turn right onto Road 54
              </div>
              <div className="text-stone-300">
                {tripStep < 3
                  ? "Approaching pickup spot on the right."
                  : "Continue straight toward Dhanmondi 27."}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Passenger Card & Trip Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#9a2121] border border-[#c8833b]/60 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#c8833b]/30">
              <span className="text-xs font-bold text-[#d4b454] uppercase tracking-wider">
                Passenger Details
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-md">
                ★ {ride.customerRating}
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#d4b454] text-[#2a2a2a] flex items-center justify-center text-lg font-bold shadow-md">
                {ride.customerName.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {ride.customerName}
                </h3>
                <div className="text-xs text-stone-300">Verified Customer</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsCallingCustomer(true);
                  setTimeout(() => setIsCallingCustomer(false), 2000);
                }}
                className="py-2.5 px-3 rounded-xl bg-white hover:bg-stone-100 text-[#2a2a2a] font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>📞</span>
                <span>
                  {isCallingCustomer ? "Calling..." : "Call Customer"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm("Are you sure you want to cancel this ride?")) {
                    onRideCancelled();
                  }
                }}
                className="py-2.5 px-3 rounded-xl bg-[#6f1b1b] hover:bg-rose-950 text-rose-300 border border-rose-500/40 font-bold text-xs transition-all"
              >
                <span>✕ Cancel</span>
              </button>
            </div>

            {/* STEP 1 ACTION: I've Arrived */}
            {tripStep === 1 && (
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleArrivedAtPickup}
                  className="w-full h-14 rounded-2xl bg-[#d4b454] hover:bg-[#b45f06] text-[#2a2a2a] hover:text-white font-extrabold text-base tracking-wide transition-all shadow-xl hover:scale-[1.01]"
                >
                  I&apos;ve Arrived at Pickup Spot &rarr;
                </button>
              </div>
            )}

            {/* STEP 2 ACTION: Enter Customer OTP */}
            {tripStep === 2 && (
              <form
                onSubmit={handleVerifyOtpAndStart}
                className="pt-2 space-y-3"
              >
                <div className="bg-[#6f1b1b] border border-[#c8833b]/50 rounded-2xl p-4 text-center">
                  <label className="block text-xs font-bold text-stone-200 mb-1.5">
                    Ask passenger for their 4-digit OTP:
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="e.g. 5821"
                    className="w-40 h-12 text-center text-2xl font-black tracking-widest text-[#2a2a2a] bg-[#f5f5f5] rounded-xl border border-[#c8833b] focus:outline-none focus:ring-2 focus:ring-[#d4b454] mx-auto block"
                  />
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    (Demo: Enter 5821 or any 4 digits)
                  </span>
                </div>

                {otpError && (
                  <div className="text-xs text-rose-300 font-semibold text-center">
                    {otpError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base tracking-wide transition-all shadow-xl hover:scale-[1.01]"
                >
                  Verify OTP &amp; Start Ride &rarr;
                </button>
              </form>
            )}

            {/* STEP 3 ACTION: Complete Ride */}
            {tripStep === 3 && (
              <div className="pt-3 space-y-2">
                <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-3 text-xs text-emerald-400 text-center font-semibold">
                  ✓ Ride in progress &bull; Passenger OTP verified
                </div>
                <button
                  type="button"
                  onClick={handleFinishRide}
                  className="w-full h-14 rounded-2xl bg-[#d4b454] hover:bg-[#b45f06] text-[#2a2a2a] hover:text-white font-extrabold text-base tracking-wide transition-all shadow-xl hover:scale-[1.01]"
                >
                  Complete Ride &amp; Collect Fare &rarr;
                </button>
              </div>
            )}

            {/* STEP 4 ACTION: Summary & Return to Dashboard */}
            {tripStep === 4 && (
              <div className="pt-2 space-y-4 animate-in zoom-in-95">
                <div className="bg-[#6f1b1b] border border-emerald-500/60 rounded-2xl p-4 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white text-2xl flex items-center justify-center mx-auto shadow-md">
                    ✓
                  </div>
                  <div className="text-lg font-black text-white">
                    Trip Completed!
                  </div>
                  <div className="text-2xl font-black text-[#d4b454]">
                    + ৳{ride.netEarnings}.00
                  </div>
                  <div className="text-[11px] text-stone-300">
                    Gross: ৳{ride.grossFare}.00 | 10% Chalo cut: -৳
                    {Math.round(ride.grossFare * 0.1)}.00
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold block pt-1">
                    ✓ Credited immediately to your driver wallet
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleReturnToDashboard}
                  className="w-full h-14 rounded-2xl bg-[#d4b454] hover:bg-[#b45f06] text-[#2a2a2a] hover:text-white font-extrabold text-base tracking-wide transition-all shadow-xl"
                >
                  Done &bull; Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverOngoingRideView;
