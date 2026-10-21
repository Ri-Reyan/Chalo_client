"use client";

import React, { useState, useEffect } from "react";

export interface DriverRideOffer {
  id: string;
  customerName: string;
  customerRating: string;
  pickup: string;
  destination: string;
  distanceKm: number;
  pickupDistanceKm: number;
  grossFare: number;
  netEarnings: number;
  vehicleType: "BIKE" | "CAR";
  expiresInSeconds: number;
}

interface AvailableRequestsViewProps {
  isOnline: boolean;
  onGoOnline: () => void;
  onAcceptRide: (offer: DriverRideOffer) => void;
  vehicleType: "BIKE" | "CAR";
}

const mockInitialOffers: DriverRideOffer[] = [
  {
    id: "req-9841",
    customerName: "Sarah Khan",
    customerRating: "5.0 ★",
    pickup: "Gulshan 2 Circle, Road 54",
    destination: "Dhanmondi 27, Road 16",
    distanceKm: 8.4,
    pickupDistanceKm: 0.6,
    grossFare: 140,
    netEarnings: 126, // 90%
    vehicleType: "BIKE",
    expiresInSeconds: 30,
  },
  {
    id: "req-9842",
    customerName: "Tanvir Hasan",
    customerRating: "4.9 ★",
    pickup: "Banani 11 Shopping Zone",
    destination: "Uttara Sector 7, Jashimuddin Ave",
    distanceKm: 12.2,
    pickupDistanceKm: 1.1,
    grossFare: 210,
    netEarnings: 189, // 90%
    vehicleType: "BIKE",
    expiresInSeconds: 30,
  },
];

export const AvailableRequestsView: React.FC<AvailableRequestsViewProps> = ({
  isOnline,
  onGoOnline,
  onAcceptRide,
  vehicleType,
}) => {
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [countdown, setCountdown] = useState(30);

  const activeOffer = mockInitialOffers[currentOfferIndex] || null;

  // 30-second countdown for decision
  useEffect(() => {
    if (!isOnline || !activeOffer) return;

    setCountdown(30);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Time expired, rotate to next offer
          setCurrentOfferIndex((curr) => (curr + 1) % mockInitialOffers.length);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOnline, currentOfferIndex, activeOffer]);

  const handleDecline = () => {
    setCurrentOfferIndex((curr) => (curr + 1) % mockInitialOffers.length);
    setCountdown(30);
  };

  const handleAccept = () => {
    if (!activeOffer) return;
    onAcceptRide({
      ...activeOffer,
      vehicleType,
    });
  };

  if (!isOnline) {
    return (
      <div className="bg-[#9a2121] border border-[#c8833b]/60 rounded-3xl p-10 text-center shadow-xl space-y-5 animate-in fade-in">
        <div className="w-20 h-20 rounded-full bg-[#6f1b1b] border border-[#c8833b]/50 text-4xl flex items-center justify-center mx-auto shadow-inner">
          ⏸️
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          You are currently Offline
        </h2>
        <p className="text-sm text-stone-200 max-w-md mx-auto">
          Go online to start receiving nearby ride offers within your 2km radius. You maintain total control over your schedule.
        </p>
        <button
          type="button"
          onClick={onGoOnline}
          className="h-14 px-8 rounded-2xl bg-[#d4b454] hover:bg-[#b45f06] text-[#2a2a2a] hover:text-white font-extrabold text-base tracking-wide transition-all shadow-xl hover:scale-105 active:scale-95"
        >
          Go Online Now 🟢
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-[#9a2121] border border-[#c8833b]/60 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6f1b1b] border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Active &amp; Ready for Rides</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Available Requests
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-200">
            Incoming dispatch offers within your 2km radius with full upfront destination disclosure.
          </p>
        </div>

        <div className="bg-[#6f1b1b] border border-[#c8833b]/50 rounded-2xl px-5 py-3 text-center sm:text-right shrink-0">
          <span className="text-[11px] text-stone-300 block">Radius Dispatch</span>
          <div className="text-xl font-bold text-[#d4b454]">&le; 2.0 KM</div>
          <span className="text-[10px] text-emerald-400 font-semibold">Strict Geo-Matching</span>
        </div>
      </div>

      {/* Active Request Notification Card */}
      {activeOffer ? (
        <div className="bg-[#9a2121] border-2 border-[#d4b454] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Top 30-Second Countdown Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#6f1b1b]">
            <div
              className="h-full bg-rose-500 transition-all duration-1000 ease-linear"
              style={{ width: `${(countdown / 30) * 100}%` }}
            />
          </div>

          {/* Header Row */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#6f1b1b] border border-[#c8833b] flex items-center justify-center text-xl">
                👤
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {activeOffer.customerName}
                </h3>
                <div className="text-xs text-[#d4b454] font-semibold">
                  ★ {activeOffer.customerRating} &bull; Verified Passenger
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#6f1b1b] border border-rose-500/50 rounded-xl px-3 py-1.5 text-xs font-black text-rose-400">
              <span>⏱️</span>
              <span>{countdown}s remaining</span>
            </div>
          </div>

          {/* Route Details */}
          <div className="bg-[#6f1b1b] border border-[#c8833b]/40 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-base mt-0.5">🟢</span>
              <div>
                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  Pickup Location ({activeOffer.pickupDistanceKm} km away)
                </div>
                <div className="text-sm font-semibold text-white">
                  {activeOffer.pickup}
                </div>
              </div>
            </div>

            <div className="w-0.5 h-4 bg-stone-500 ml-5" />

            <div className="flex items-start gap-3">
              <span className="text-base mt-0.5">📍</span>
              <div>
                <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                  Destination ({activeOffer.distanceKm} km total trip)
                </div>
                <div className="text-sm font-semibold text-white">
                  {activeOffer.destination}
                </div>
              </div>
            </div>
          </div>

          {/* Earnings Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="bg-[#6f1b1b] border border-[#c8833b]/40 rounded-xl p-3">
              <span className="text-[10px] text-stone-300 block uppercase">Gross Customer Fare</span>
              <span className="text-base font-bold text-white">৳{activeOffer.grossFare}.00</span>
            </div>
            <div className="bg-[#6f1b1b] border border-[#c8833b]/40 rounded-xl p-3">
              <span className="text-[10px] text-stone-300 block uppercase">Flat 10% Chalo Cut</span>
              <span className="text-base font-bold text-rose-400">- ৳{Math.round(activeOffer.grossFare * 0.1)}.00</span>
            </div>
            <div className="bg-[#6f1b1b] border border-[#d4b454] rounded-xl p-3 shadow-inner">
              <span className="text-[10px] text-[#d4b454] font-bold block uppercase">Your Net Take-Home</span>
              <span className="text-2xl font-black text-[#d4b454]">+ ৳{activeOffer.netEarnings}.00</span>
            </div>
          </div>

          {/* Accept / Decline Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              onClick={handleDecline}
              className="h-14 rounded-2xl bg-[#6f1b1b] hover:bg-[#7e1f1f] text-stone-200 border border-[#c8833b]/50 font-bold text-sm tracking-wide transition-all shadow-md"
            >
              Decline Offer
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="h-14 rounded-2xl bg-[#d4b454] hover:bg-[#b45f06] text-[#2a2a2a] hover:text-white font-black text-base tracking-wide transition-all shadow-xl hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <span>Accept Ride (+৳{activeOffer.netEarnings}) →</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#9a2121] border border-[#c8833b]/60 rounded-3xl p-10 text-center shadow-xl space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#6f1b1b] flex items-center justify-center mx-auto text-xl">
            📡
          </div>
          <h3 className="text-lg font-bold text-white">Searching for requests...</h3>
          <p className="text-xs text-stone-300">
            You will be alerted instantly when a rider requests a ride within 2km.
          </p>
        </div>
      )}
    </div>
  );
};

export default AvailableRequestsView;

