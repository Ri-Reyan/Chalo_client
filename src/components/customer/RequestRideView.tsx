"use client";

import React, { useState } from "react";

export interface ActiveRideState {
  id: string;
  pickup: string;
  destination: string;
  vehicleType: "BIKE" | "CAR";
  distanceKm: number;
  fare: number;
  status: "REQUESTED" | "ACCEPTED" | "COMPLETED";
  driver: {
    name: string;
    vehicleModel: string;
    rating: string;
    plateNumber: string;
    etaMinutes: number;
  };
  otp: string;
  createdAt: string;
}

interface RequestRideViewProps {
  onRideCreated: (ride: ActiveRideState) => void;
}

const recentPlaces = [
  { label: "Gulshan 2 Circle, Dhaka", distance: 8.4 },
  { label: "Dhanmondi 27, Road 16", distance: 6.2 },
  { label: "Banani 11 Shopping Zone", distance: 4.8 },
  { label: "Uttara Sector 7, Jashimuddin", distance: 14.5 },
  { label: "Motijheel Commercial Area", distance: 11.2 },
];

export const RequestRideView: React.FC<RequestRideViewProps> = ({
  onRideCreated,
}) => {
  const [pickup, setPickup] = useState("Gulshan 2 Circle, Dhaka");
  const [destination, setDestination] = useState("Dhanmondi 27, Road 16");
  const [vehicleType, setVehicleType] = useState<"BIKE" | "CAR">("BIKE");
  const [distanceKm, setDistanceKm] = useState(8.4);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStep, setSearchStep] = useState(1);

  // Fare Calculation aligned with backend specs (No surge multiplier)
  const baseFare = vehicleType === "BIKE" ? 30 : 80;
  const perKmRate = vehicleType === "BIKE" ? 15 : 35;
  const distanceFare = Math.round(distanceKm * perKmRate);
  const totalFare = baseFare + distanceFare;

  const handleSelectDestination = (dest: string, dist: number) => {
    setDestination(dest);
    setDistanceKm(dist);
  };

  const handleBookRide = () => {
    setIsSearching(true);
    setSearchStep(1);

    // Step 1: Pinging drivers
    setTimeout(() => {
      setSearchStep(2); // Driver found & accepted
    }, 1500);

    // Step 2: Initialize Live Tracking
    setTimeout(() => {
      setIsSearching(false);
      const newRide: ActiveRideState = {
        id: "ride-" + Math.floor(100000 + Math.random() * 900000),
        pickup,
        destination,
        vehicleType,
        distanceKm,
        fare: totalFare,
        status: "ACCEPTED",
        driver: {
          name: vehicleType === "BIKE" ? "Kamal Hossain" : "Rafiqul Alam",
          vehicleModel:
            vehicleType === "BIKE" ? "Yamaha FZ 150cc" : "Toyota Corolla Axio",
          rating: "4.95 ★",
          plateNumber:
            vehicleType === "BIKE"
              ? "DHAKA METRO-HA 48-2910"
              : "DHAKA METRO-GA 21-8841",
          etaMinutes: 3,
        },
        otp: "5821",
        createdAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      onRideCreated(newRide);
    }, 2800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EFE8] border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <span>⚡</span>
              <span>Guaranteed Zero Surge</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292524]">
              Where would you like to go?
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-stone-500">
              Select your pickup and drop-off points to calculate your upfront,
              locked fare.
            </p>
          </div>

          <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 shrink-0 text-center sm:text-right">
            <span className="text-[11px] text-stone-500 block font-medium">
              Upfront Estimated Fare
            </span>
            <div className="text-3xl font-extrabold text-[#292524] mt-0.5">
              ৳{totalFare}
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold">
              ✓ No surge penalty applied
            </span>
          </div>
        </div>
      </div>

      {/* Main Form & Map Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Location & Vehicle Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
          {/* 1. Pickup Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Pickup Point
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base">
                🟢
              </span>
              <input
                type="text"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="Enter pickup address"
                className="w-full h-12 pl-10 pr-10 bg-stone-50 text-[#292524] placeholder-stone-400 rounded-xl border border-stone-200 text-sm font-semibold focus:outline-none focus:bg-white focus:border-[#FFB7B2] focus:ring-2 focus:ring-[#FFB7B2]/30 transition-all"
              />
              <button
                type="button"
                title="Use Current GPS Location"
                onClick={() => setPickup("Current Location (Gulshan 2)")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors"
              >
                🎯
              </button>
            </div>
          </div>

          {/* 2. Destination Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Destination Point
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base">
                📍
              </span>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination address"
                className="w-full h-12 pl-10 pr-4 bg-stone-50 text-[#292524] placeholder-stone-400 rounded-xl border border-stone-200 text-sm font-semibold focus:outline-none focus:bg-white focus:border-[#FFB7B2] focus:ring-2 focus:ring-[#FFB7B2]/30 transition-all"
              />
            </div>
          </div>

          {/* Quick Destination Pills */}
          <div>
            <span className="text-[11px] font-semibold text-stone-500 block mb-2">
              Popular Saved Spots:
            </span>
            <div className="flex flex-wrap gap-2">
              {recentPlaces.map((place) => (
                <button
                  key={place.label}
                  type="button"
                  onClick={() =>
                    handleSelectDestination(place.label, place.distance)
                  }
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    destination === place.label
                      ? "bg-[#292524] text-white font-bold border-[#292524] shadow-2xs"
                      : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  {place.label.split(",")[0]} (~{place.distance} km)
                </button>
              ))}
            </div>
          </div>

          {/* 3. Vehicle Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              Select Vehicle Type
            </label>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Bike */}
              <button
                type="button"
                onClick={() => setVehicleType("BIKE")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  vehicleType === "BIKE"
                    ? "bg-[#FFB7B2]/15 border-[#FFB7B2] ring-2 ring-[#FFB7B2] shadow-xs"
                    : "bg-stone-50 border-stone-200 hover:bg-stone-100/80"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🏍️</span>
                  <span className="text-xs font-bold text-[#292524] bg-white border border-stone-200 px-2 py-0.5 rounded-md shadow-2xs">
                    Fast & Agile
                  </span>
                </div>
                <div className="text-sm font-bold text-[#292524]">Motorbike</div>
                <div className="text-xs text-stone-500 mt-0.5">
                  Base ৳30 + ৳15/km
                </div>
                <div className="text-base font-extrabold text-[#292524] mt-2">
                  ৳{Math.round(30 + distanceKm * 15)}
                </div>
              </button>

              {/* Car */}
              <button
                type="button"
                onClick={() => setVehicleType("CAR")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  vehicleType === "CAR"
                    ? "bg-[#FFB7B2]/15 border-[#FFB7B2] ring-2 ring-[#FFB7B2] shadow-xs"
                    : "bg-stone-50 border-stone-200 hover:bg-stone-100/80"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🚗</span>
                  <span className="text-xs font-bold text-[#292524] bg-white border border-stone-200 px-2 py-0.5 rounded-md shadow-2xs">
                    Comfort & AC
                  </span>
                </div>
                <div className="text-sm font-bold text-[#292524]">Car / Sedan</div>
                <div className="text-xs text-stone-500 mt-0.5">
                  Base ৳80 + ৳35/km
                </div>
                <div className="text-base font-extrabold text-[#292524] mt-2">
                  ৳{Math.round(80 + distanceKm * 35)}
                </div>
              </button>
            </div>
          </div>

          {/* Book Action Button */}
          <div className="pt-2">
            <button
              type="button"
              disabled={isSearching}
              onClick={handleBookRide}
              className="w-full h-14 rounded-2xl bg-[#FFB7B2] hover:bg-[#FF9E98] text-[#292524] font-extrabold text-base tracking-wide transition-all duration-200 hover:shadow-md active:scale-[0.99] shadow-sm flex items-center justify-center gap-2"
            >
              {isSearching ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-3 border-[#292524] border-t-transparent rounded-full animate-spin" />
                  <span>
                    {searchStep === 1
                      ? "Pinging nearby drivers within 2km..."
                      : "Driver found! Securing ride..."}
                  </span>
                </div>
              ) : (
                <span>
                  Request {vehicleType === "BIKE" ? "Bike" : "Car"} Now (৳
                  {totalFare}) →
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Fare Breakdown & Interactive Route Representation (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Route Map Simulation Card */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-5 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-3 text-xs font-bold text-stone-700">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Dispatch Map Preview
              </span>
              <span className="text-[#292524]">~{distanceKm} km route</span>
            </div>

            {/* Map Visual Representation */}
            <div className="relative h-56 rounded-2xl bg-[#F7F6F0] border border-stone-200 overflow-hidden flex items-center justify-center shadow-inner">
              {/* Simulated Map Grid */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#292524_1px,transparent_1px)] bg-size-[16px_16px]" />

              {/* Connecting Route Line */}
              <svg className="absolute inset-0 w-full h-full">
                <path
                  d="M 60 170 Q 150 90 260 50"
                  fill="none"
                  stroke="#FF9E98"
                  strokeWidth="4"
                  strokeDasharray="6,4"
                />
              </svg>

              {/* Pickup Marker */}
              <div className="absolute left-10 bottom-8 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-emerald-600 border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold">
                  P
                </div>
                <span className="text-[10px] font-bold bg-[#292524] text-white px-2 py-0.5 rounded shadow mt-1">
                  Pickup
                </span>
              </div>

              {/* Destination Marker */}
              <div className="absolute right-12 top-8 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-rose-500 border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold">
                  D
                </div>
                <span className="text-[10px] font-bold bg-[#292524] text-white px-2 py-0.5 rounded shadow mt-1">
                  Destination
                </span>
              </div>

              {/* Simulated Nearby Available Drivers Indicator */}
              <div className="absolute top-1/2 left-1/3 flex items-center gap-1 bg-white/95 border border-stone-200 rounded-full px-2.5 py-1 text-[11px] font-bold text-[#292524] shadow-xs">
                <span>🏍️ 3 drivers ready</span>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown Card */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-5 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#292524] mb-3">
              Transparent Fare Breakdown
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Base Fare</span>
                <span className="font-semibold text-[#292524]">৳{baseFare}.00</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>
                  Distance Charge ({distanceKm} km × ৳{perKmRate})
                </span>
                <span className="font-semibold text-[#292524]">
                  ৳{distanceFare}.00
                </span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold border-t border-stone-200 pt-2">
                <span>Surge Pricing</span>
                <span>0.0x (No Surge Ever)</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#292524] border-t border-stone-300 pt-2.5">
                <span>Total Upfront Amount</span>
                <span>৳{totalFare}.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestRideView;
