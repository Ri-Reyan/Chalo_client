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
      <div className="bg-white border border-stone-200/80 rounded-3xl p-10 text-center shadow-sm space-y-5 animate-in fade-in">
        <div className="w-20 h-20 rounded-full bg-stone-100 border border-stone-200 text-4xl flex items-center justify-center mx-auto shadow-inner">
          ⏸️
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#292524]">
          You are currently Offline
        </h2>
        <p className="text-sm text-stone-500 max-w-md mx-auto">
          Go online to start receiving nearby ride offers within your 2km radius. You maintain total control over your schedule.
        </p>
        <button
          type="button"
          onClick={onGoOnline}
          className="h-14 px-8 rounded-2xl bg-[#FFB7B2] hover:bg-[#FF9E98] text-[#292524] font-extrabold text-base tracking-wide transition-all shadow-sm hover:scale-105 active:scale-95"
        >
          Go Online Now 🟢
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EFE8] border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Active &amp; Ready for Rides</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292524]">
            Available Requests
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-500">
            Incoming dispatch offers within your 2km radius with full upfront destination disclosure.
          </p>
        </div>

        <div className="bg-stone-50 border border-stone-200/80 rounded-2xl px-5 py-3 text-center sm:text-right shrink-0">
          <span className="text-[11px] text-stone-500 block">Radius Dispatch</span>
          <div className="text-xl font-bold text-[#292524]">&le; 2.0 KM</div>
          <span className="text-[10px] text-emerald-700 font-semibold">Strict Geo-Matching</span>
        </div>
      </div>

      {/* Active Request Notification Card */}
      {activeOffer ? (
        <div className="bg-white border-2 border-[#FFB7B2] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
          {/* Top 30-Second Countdown Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-stone-100">
            <div
              className="h-full bg-rose-500 transition-all duration-1000 ease-linear"
              style={{ width: `${(countdown / 30) * 100}%` }}
            />
          </div>

          {/* Header Row */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-xl shadow-2xs">
                👤
              </div>
              <div>
                <h3 className="text-base font-bold text-[#292524]">
                  {activeOffer.customerName}
                </h3>
                <div className="text-xs text-stone-600 font-semibold">
                  <span className="text-amber-500">★</span> {activeOffer.customerRating} &bull; Verified Passenger
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl px-3 py-1.5 text-xs font-black text-rose-700">
              <span>⏱️</span>
              <span>{countdown}s remaining</span>
            </div>
          </div>

          {/* Route Details */}
          <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-base mt-0.5">🟢</span>
              <div>
                <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  Pickup Location ({activeOffer.pickupDistanceKm} km away)
                </div>
                <div className="text-sm font-semibold text-[#292524]">
                  {activeOffer.pickup}
                </div>
              </div>
            </div>

            <div className="border-t border-stone-200/80 pt-3 flex items-start gap-3">
              <span className="text-base mt-0.5">📍</span>
              <div>
                <div className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
                  Destination Drop-off ({activeOffer.distanceKm} km trip)
                </div>
                <div className="text-sm font-semibold text-[#292524]">
                  {activeOffer.destination}
                </div>
              </div>
            </div>
          </div>

          {/* Upfront Fare Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3">
              <span className="text-[11px] text-stone-500 block">Gross Fare</span>
              <span className="text-base font-bold text-[#292524]">৳{activeOffer.grossFare}.00</span>
            </div>
            <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3">
              <span className="text-[11px] text-stone-500 block">Platform Fee (Flat 10%)</span>
              <span className="text-base font-bold text-stone-600">-৳{(activeOffer.grossFare * 0.1).toFixed(0)}.00</span>
            </div>
            <div className="bg-[#E8EFE8] border border-emerald-300 rounded-xl p-3 shadow-2xs">
              <span className="text-[11px] text-emerald-800 font-bold block uppercase">Your Net Take-Home (90%)</span>
              <span className="text-xl font-black text-emerald-800">+ ৳{activeOffer.netEarnings}.00</span>
            </div>
          </div>

          {/* Action Decision Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleDecline}
              className="h-14 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 font-bold text-sm tracking-wide transition-all"
            >
              Pass Offer
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base tracking-wide transition-all shadow-md hover:scale-[1.01]"
            >
              Accept Trip (Earn ৳{activeOffer.netEarnings}) →
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-stone-300 rounded-3xl p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-xl">
            📡
          </div>
          <h3 className="text-lg font-bold text-[#292524]">
            Scanning for nearby ride requests...
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            You will hear a ping and receive a 30-second decision offer as soon as a customer books in your area.
          </p>
        </div>
      )}
    </div>
  );
};

export default AvailableRequestsView;
