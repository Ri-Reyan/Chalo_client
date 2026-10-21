"use client";

import React, { useState, useEffect } from "react";
import { ActiveRideState } from "./RequestRideView";

interface LiveTrackingViewProps {
  ride: ActiveRideState | null;
  onRideCompleted: (ride: ActiveRideState) => void;
  onRideCancelled: () => void;
}

export const LiveTrackingView: React.FC<LiveTrackingViewProps> = ({
  ride,
  onRideCompleted,
  onRideCancelled,
}) => {
  const [etaSeconds, setEtaSeconds] = useState(180); // 3 minutes demo countdown
  const [driverProgress, setDriverProgress] = useState(25); // Simulated percent along route
  const [isCalling, setIsCalling] = useState(false);
  const [sosActivated, setSosActivated] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(5);

  useEffect(() => {
    if (!ride) return;

    const interval = setInterval(() => {
      setEtaSeconds((prev) => {
        if (prev <= 1) return 1;
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
      <div className="bg-white border border-stone-200/80 rounded-3xl p-10 text-center shadow-sm space-y-4 animate-in fade-in">
        <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 text-3xl flex items-center justify-center mx-auto">
          🚕
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#292524]">
          No Active Ride In Progress
        </h2>
        <p className="text-sm text-stone-500 max-w-md mx-auto">
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
      <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-2xl shadow-2xs animate-pulse">
              {ride.vehicleType === "BIKE" ? "🏍️" : "🚗"}
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live Journey Tracking
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-[#292524]">
                Your driver is on the way
              </h1>
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200/80 rounded-2xl px-5 py-2.5 text-center sm:text-right">
            <span className="text-[10px] text-stone-500 uppercase tracking-wider block">
              Estimated Arrival
            </span>
            <div className="text-2xl font-black text-[#292524]">
              {formatEta(etaSeconds)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map representation + Ride Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Simulated Map (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-600">
            <span>
              Route: {ride.pickup} → {ride.destination}
            </span>
            <span className="text-[#292524] font-bold">
              {ride.distanceKm} km
            </span>
          </div>

          {/* Map Surface */}
          <div className="relative h-80 rounded-2xl bg-[#F7F6F0] border border-stone-200 overflow-hidden shadow-inner flex items-center justify-center">
            {/* Grid texture */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#292524_1px,transparent_1px)] bg-size-[20px_20px]" />

            {/* Simulated Animated Road Path */}
            <svg className="absolute inset-0 w-full h-full">
              <path
                d="M 60 250 Q 180 120 340 60"
                fill="none"
                stroke="#FFB7B2"
                strokeWidth="6"
                strokeLinecap="round"
                className="opacity-80"
              />
              <path
                d="M 60 250 Q 180 120 340 60"
                fill="none"
                stroke="#292524"
                strokeWidth="2"
                strokeDasharray="8,6"
              />
            </svg>

            {/* Pickup Marker */}
            <div className="absolute left-12 bottom-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold">
                P
              </div>
              <span className="text-[10px] font-bold bg-[#292524] text-white px-2 py-0.5 rounded shadow mt-1">
                You
              </span>
            </div>

            {/* Destination Marker */}
            <div className="absolute right-12 top-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-rose-500 border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold">
                D
              </div>
              <span className="text-[10px] font-bold bg-[#292524] text-white px-2 py-0.5 rounded shadow mt-1">
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
                <div className="w-10 h-10 rounded-full bg-[#FFB7B2] border-2 border-[#292524] shadow-md flex items-center justify-center text-base animate-bounce">
                  {ride.vehicleType === "BIKE" ? "🏍️" : "🚗"}
                </div>
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <span className="text-[10px] font-extrabold bg-[#292524] text-white px-2 py-0.5 rounded-full shadow mt-1 whitespace-nowrap">
                {ride.driver.name.split(" ")[0]} ({formatEta(etaSeconds)})
              </span>
            </div>
          </div>

          {/* Prototype Simulation Control Bar */}
          <div className="p-3.5 bg-stone-50 border border-stone-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-stone-600 font-medium">
              💡 Prototype Demo: Simulate ending the ride to test completion &
              rating.
            </span>
            <button
              type="button"
              onClick={handleCompleteTrip}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs"
            >
              Simulate Ride Arrival &rarr;
            </button>
          </div>
        </div>

        {/* Right Column: Driver Card, Security PIN, & Emergency (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Driver Profile Card */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Assigned Driver
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-[#E8EFE8] border border-emerald-200 px-2.5 py-0.5 rounded-md">
                Verified Partner
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#FFB7B2] text-[#292524] flex items-center justify-center text-xl font-extrabold shadow-xs">
                {ride.driver.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#292524]">
                  {ride.driver.name}
                </h3>
                <div className="text-xs text-stone-600 font-semibold flex items-center gap-1">
                  <span className="text-amber-500">★</span>
                  <span className="font-bold text-[#292524]">{ride.driver.rating}</span>
                  <span className="text-stone-400">• 1,200+ rides</span>
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  {ride.driver.vehicleModel}
                </div>
              </div>
            </div>

            {/* License Plate Number */}
            <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3 flex items-center justify-between text-xs">
              <span className="text-stone-500 font-medium">Plate Number:</span>
              <span className="font-extrabold text-[#292524] tracking-wider">
                {ride.driver.plateNumber}
              </span>
            </div>

            {/* Action Buttons: Call Driver & Cancel */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsCalling(true);
                  setTimeout(() => setIsCalling(false), 2000);
                }}
                className="py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-[#292524] font-bold text-xs flex items-center justify-center gap-2 border border-stone-200 transition-all"
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
                className="py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
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
                className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <span>🚨</span>
                <span>Emergency SOS Shield</span>
              </button>
            </div>

            {sosActivated && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 animate-in fade-in space-y-1">
                <div className="font-bold flex items-center gap-1 text-rose-900">
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
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-7 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white text-3xl flex items-center justify-center mx-auto shadow-md">
              ✓
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#292524]">
                You&apos;ve Arrived!
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Thank you for traveling with Chalo. Your payment has been
                captured seamlessly.
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 text-xs space-y-1.5">
              <div className="flex justify-between text-stone-600">
                <span>Trip Fare:</span>
                <span className="font-bold text-[#292524]">৳{ride.fare}.00</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Distance:</span>
                <span className="font-bold text-[#292524]">
                  {ride.distanceKm} km
                </span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold border-t border-stone-200 pt-1.5">
                <span>Payment Status:</span>
                <span>CAPTURED (Cashless)</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-stone-700 block mb-2">
                Rate your driver ({ride.driver.name}):
              </span>
              <div className="flex justify-center gap-2 text-2xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`transition-transform hover:scale-125 ${
                      star <= rating ? "text-amber-400" : "text-stone-300"
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
              className="w-full py-3.5 rounded-xl bg-[#FFB7B2] hover:bg-[#FF9E98] text-[#292524] font-extrabold text-sm transition-all shadow-sm"
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
