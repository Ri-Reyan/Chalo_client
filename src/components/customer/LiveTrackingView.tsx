"use client";

import React, { useState, useEffect } from "react";
import { ActiveRideState } from "./RequestRideView";

interface LiveTrackingViewProps {
  ride: ActiveRideState | null;
  onRideCompleted: (completedRide: ActiveRideState) => void;
  onRideCancelled: () => void;
}

export const LiveTrackingView: React.FC<LiveTrackingViewProps> = ({
  ride,
  onRideCompleted,
  onRideCancelled,
}) => {
  const [etaSeconds, setEtaSeconds] = useState(180); // 3 minutes countdown
  const [driverProgress, setDriverProgress] = useState(15); // Percentage along route (15% to 100%)
  const [isCalling, setIsCalling] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [sosActivated, setSosActivated] = useState(false);

  // Countdown timer & simulated driver position update
  useEffect(() => {
    if (!ride) return;

    const interval = setInterval(() => {
      setEtaSeconds((prev) => {
        if (prev <= 10) return 10;
        return prev - 1;
      });

      setDriverProgress((prev) => {
        if (prev >= 90) return 90;
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [ride]);

  if (!ride) {
    return (
      <div className="bg-[#9a2121] border border-[#c8833b]/60 rounded-3xl p-10 text-center shadow-xl space-y-4 animate-in fade-in">
        <div className="w-16 h-16 rounded-full bg-[#6f1b1b] border border-[#c8833b]/50 text-3xl flex items-center justify-center mx-auto">
          🚕
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          No Active Ride In Progress
        </h2>
        <p className="text-sm text-stone-300 max-w-md mx-auto">
          You don&apos;t currently have an ongoing trip. Request a ride to track
          your driver live on the map.
        </p>
      </div>
    );
  }

  const formatEta = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? "0" : ""}${secs}s`;
  };

  const handleCompleteTrip = () => {
    setShowRatingModal(true);
  };

  const handleFinishRating = () => {
    setShowRatingModal(false);
    onRideCompleted({
      ...ride,
      status: "COMPLETED",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Status Banner */}
      <div className="bg-[#9a2121] border border-[#c8833b]/60 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#6f1b1b] border border-[#c8833b] flex items-center justify-center text-2xl shadow-inner animate-pulse">
              {ride.vehicleType === "BIKE" ? "🏍️" : "🚗"}
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Journey Tracking
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Your driver is on the way
              </h1>
            </div>
          </div>

          <div className="bg-[#6f1b1b] border border-[#c8833b]/60 rounded-2xl px-5 py-2.5 text-center sm:text-right">
            <span className="text-[10px] text-stone-300 uppercase tracking-wider block">
              Estimated Arrival
            </span>
            <div className="text-2xl font-black text-[#d4b454]">
              {formatEta(etaSeconds)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map representation + Ride Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Simulated Map (7 cols) */}
        <div className="lg:col-span-7 bg-[#9a2121] border border-[#c8833b]/60 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-200">
            <span>
              Route: {ride.pickup} → {ride.destination}
            </span>
            <span className="text-[#d4b454] font-bold">
              {ride.distanceKm} km
            </span>
          </div>

          {/* Map Surface */}
          <div className="relative h-80 rounded-2xl bg-[#1e1e1e] border border-[#c8833b]/50 overflow-hidden shadow-inner flex items-center justify-center">
            {/* Grid texture */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4b454_1px,transparent_1px)] bg-size-[20px_20px]" />

            {/* Simulated Animated Road Path */}
            <svg className="absolute inset-0 w-full h-full">
              <path
                d="M 60 250 Q 180 120 340 60"
                fill="none"
                stroke="#d4b454"
                strokeWidth="6"
                strokeLinecap="round"
                className="opacity-70"
              />
              <path
                d="M 60 250 Q 180 120 340 60"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeDasharray="8,6"
              />
            </svg>

            {/* Pickup Marker */}
            <div className="absolute left-12 bottom-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-bold">
                P
              </div>
              <span className="text-[10px] font-bold bg-[#2a2a2a] text-white px-2 py-0.5 rounded shadow mt-1">
                You
              </span>
            </div>

            {/* Destination Marker */}
            <div className="absolute right-12 top-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-rose-500 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-bold">
                D
              </div>
              <span className="text-[10px] font-bold bg-[#2a2a2a] text-white px-2 py-0.5 rounded shadow mt-1">
                Destination
              </span>
            </div>

            {/* Dynamic Driver Marker with Simulated Position */}
            <div
              className="absolute flex flex-col items-center transition-all duration-1000 ease-linear"
              style={{
                left: `${30 + driverProgress * 0.45}%`,
                bottom: `${25 + driverProgress * 0.55}%`,
              }}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#d4b454] border-2 border-[#2a2a2a] shadow-2xl flex items-center justify-center text-base animate-bounce">
                  {ride.vehicleType === "BIKE" ? "🏍️" : "🚗"}
                </div>
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <span className="text-[10px] font-extrabold bg-[#d4b454] text-[#2a2a2a] px-2 py-0.5 rounded-full shadow mt-1 whitespace-nowrap">
                {ride.driver.name.split(" ")[0]} ({formatEta(etaSeconds)})
              </span>
            </div>
          </div>

          {/* Prototype Simulation Control Bar */}
          <div className="p-3 bg-[#6f1b1b] border border-[#c8833b]/40 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-stone-300">
              💡 Prototype Demo: Simulate ending the ride to test completion &
              rating.
            </span>
            <button
              type="button"
              onClick={handleCompleteTrip}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md"
            >
              Simulate Ride Arrival &rarr;
            </button>
          </div>
        </div>

        {/* Right Column: Driver Card, Security PIN, & Emergency (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Driver Profile Card */}
          <div className="bg-[#9a2121] border border-[#c8833b]/60 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#c8833b]/40">
              <span className="text-xs font-bold text-[#d4b454] uppercase tracking-wider">
                Assigned Driver
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-md">
                Verified Partner
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#d4b454] text-[#2a2a2a] flex items-center justify-center text-xl font-extrabold shadow-md">
                {ride.driver.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {ride.driver.name}
                </h3>
                <div className="text-xs text-[#d4b454] font-semibold flex items-center gap-1">
                  <span>★</span>
                  <span>{ride.driver.rating}</span>
                  <span className="text-stone-300">• 1,200+ rides</span>
                </div>
                <div className="text-xs text-stone-300 mt-0.5">
                  {ride.driver.vehicleModel}
                </div>
              </div>
            </div>

            {/* License Plate Number */}
            <div className="bg-[#6f1b1b] border border-[#c8833b]/50 rounded-2xl p-3 flex items-center justify-between text-xs">
              <span className="text-stone-300">Plate Number:</span>
              <span className="font-extrabold text-white tracking-wider">
                {ride.driver.plateNumber}
              </span>
            </div>

            {/* Security OTP PIN */}
            <div className="bg-linear-to-r from-[#d4b454]/20 to-[#d4b454]/10 border border-[#d4b454]/60 rounded-2xl p-4 text-center">
              <span className="text-[11px] text-stone-200 font-medium block">
                Share this security PIN when boarding:
              </span>
              <div className="text-2xl font-black tracking-widest text-[#d4b454] mt-1">
                OTP: {ride.otp}
              </div>
            </div>

            {/* Action Buttons: Call Driver & Cancel */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsCalling(true);
                  setTimeout(() => setIsCalling(false), 2000);
                }}
                className="py-3 px-4 rounded-xl bg-white hover:bg-stone-100 text-[#2a2a2a] font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span>📞</span>
                <span>{isCalling ? "Connecting..." : "Call Driver"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm("Are you sure you want to cancel this ride?")) {
                    onRideCancelled();
                  }
                }}
                className="py-3 px-4 rounded-xl bg-[#6f1b1b] hover:bg-rose-950 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>✕</span>
                <span>Cancel Ride</span>
              </button>
            </div>

            {/* Emergency SOS Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSosActivated(true)}
                className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <span>🚨</span>
                <span>Emergency SOS Shield</span>
              </button>
            </div>

            {sosActivated && (
              <div className="p-3 bg-rose-950/80 border border-rose-500 rounded-xl text-xs text-rose-200 animate-in fade-in space-y-1">
                <div className="font-bold flex items-center gap-1 text-white">
                  <span>✓</span>
                  <span>Safety Alert Dispatched</span>
                </div>
                <div>
                  Your live GPS coordinates have been relayed to the 24/7
                  hotline. Help is monitoring.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ride Completion & Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#9a2121] border border-[#c8833b] rounded-3xl p-7 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white text-3xl flex items-center justify-center mx-auto shadow-lg">
              ✓
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">
                You&apos;ve Arrived!
              </h3>
              <p className="text-xs text-stone-200 mt-1">
                Thank you for traveling with Chalo. Your payment has been
                captured seamlessly.
              </p>
            </div>

            <div className="bg-[#6f1b1b] border border-[#c8833b]/40 rounded-2xl p-4 text-xs space-y-1.5">
              <div className="flex justify-between text-stone-300">
                <span>Trip Fare:</span>
                <span className="font-bold text-white">৳{ride.fare}.00</span>
              </div>
              <div className="flex justify-between text-stone-300">
                <span>Distance:</span>
                <span className="font-bold text-white">
                  {ride.distanceKm} km
                </span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold border-t border-[#c8833b]/30 pt-1.5">
                <span>Payment Status:</span>
                <span>CAPTURED (Cashless)</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-stone-200 block mb-2">
                Rate your driver ({ride.driver.name}):
              </span>
              <div className="flex justify-center gap-2 text-2xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`transition-transform hover:scale-125 ${
                      star <= rating ? "text-[#d4b454]" : "text-stone-600"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinishRating}
              className="w-full py-3.5 rounded-xl bg-[#d4b454] hover:bg-[#b45f06] text-[#2a2a2a] hover:text-white font-extrabold text-sm transition-all shadow-md"
            >
              Done & Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTrackingView;
