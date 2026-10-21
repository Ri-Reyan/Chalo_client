"use client";

import React, { useState } from "react";
import { ActiveRideState } from "./RequestRideView";

interface RideHistoryViewProps {
  rides: ActiveRideState[];
  onRebook: (pickup: string, destination: string) => void;
}

const mockDefaultRides: ActiveRideState[] = [
  {
    id: "ride-948102",
    pickup: "Banani 11, Block D",
    destination: "Dhanmondi 27, Road 16",
    vehicleType: "BIKE",
    distanceKm: 9.2,
    fare: 168,
    status: "COMPLETED",
    driver: {
      name: "Kamal Hossain",
      vehicleModel: "Yamaha FZ 150cc",
      rating: "4.98 ★",
      plateNumber: "DHAKA METRO-HA 48-2910",
      etaMinutes: 0,
    },
    otp: "4190",
    createdAt: "Yesterday, 6:45 PM",
  },
  {
    id: "ride-829140",
    pickup: "Gulshan 2 Circle",
    destination: "Motijheel Commercial Area",
    vehicleType: "CAR",
    distanceKm: 11.5,
    fare: 482,
    status: "COMPLETED",
    driver: {
      name: "Rafiqul Alam",
      vehicleModel: "Toyota Corolla Axio",
      rating: "4.92 ★",
      plateNumber: "DHAKA METRO-GA 21-8841",
      etaMinutes: 0,
    },
    otp: "7721",
    createdAt: "Oct 19, 9:15 AM",
  },
  {
    id: "ride-710492",
    pickup: "Uttara Sector 7",
    destination: "Gulshan 1, Avenue 3",
    vehicleType: "BIKE",
    distanceKm: 12.8,
    fare: 222,
    status: "COMPLETED",
    driver: {
      name: "Tariqul Islam",
      vehicleModel: "Bajaj Pulsar 150",
      rating: "4.89 ★",
      plateNumber: "DHAKA METRO-LA 12-4091",
      etaMinutes: 0,
    },
    otp: "3319",
    createdAt: "Oct 17, 2:30 PM",
  },
];

export const RideHistoryView: React.FC<RideHistoryViewProps> = ({
  rides,
  onRebook,
}) => {
  const [selectedReceipt, setSelectedReceipt] = useState<ActiveRideState | null>(null);

  // Combine live completed rides with historical mock rides
  const allRides = [...rides, ...mockDefaultRides];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-[#9a2121] border border-[#c8833b]/60 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#d4b454] uppercase tracking-wider block mb-1">
            Trip Records & Receipts
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ride History
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-200">
            View detailed trip breakdowns, driver details, and receipts for all your travels.
          </p>
        </div>

        <div className="bg-[#6f1b1b] border border-[#c8833b]/50 rounded-2xl px-5 py-3 text-center sm:text-right shrink-0">
          <span className="text-[11px] text-stone-300 block">Total Trips Completed</span>
          <div className="text-2xl font-black text-[#d4b454]">
            {allRides.length} Trips
          </div>
        </div>
      </div>

      {/* Rides List */}
      <div className="space-y-4">
        {allRides.map((rideItem) => (
          <div
            key={rideItem.id}
            className="bg-[#9a2121] border border-[#c8833b]/50 rounded-3xl p-5 sm:p-6 shadow-md hover:border-[#d4b454]/80 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#6f1b1b] border border-[#c8833b]/40 flex items-center justify-center text-sm">
                    {rideItem.vehicleType === "BIKE" ? "🏍️" : "🚗"}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-white">
                      {rideItem.vehicleType === "BIKE" ? "Motorbike Ride" : "Car Ride"}
                    </span>
                    <span className="text-[11px] text-stone-300 ml-2">
                      &bull; {rideItem.createdAt}
                    </span>
                  </div>
                </div>

                <div className="text-sm font-semibold text-white pl-11">
                  <span className="text-emerald-400">From:</span> {rideItem.pickup}
                  <span className="mx-2 text-[#d4b454]">&rarr;</span>
                  <span className="text-rose-400">To:</span> {rideItem.destination}
                </div>

                <div className="text-xs text-stone-300 pl-11 flex flex-wrap items-center gap-3">
                  <span>Driver: <strong className="text-white">{rideItem.driver.name}</strong> ({rideItem.driver.rating})</span>
                  <span>&bull;</span>
                  <span>Vehicle: {rideItem.driver.vehicleModel}</span>
                  <span>&bull;</span>
                  <span>Distance: {rideItem.distanceKm} km</span>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-[#c8833b]/30 pt-3 md:pt-0 shrink-0">
                <div className="text-left md:text-right">
                  <div className="text-xl font-black text-[#d4b454]">
                    ৳{rideItem.fare}.00
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded">
                    CAPTURED (Paid)
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedReceipt(rideItem)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-[#6f1b1b] hover:bg-[#7e1f1f] text-stone-200 font-semibold border border-[#c8833b]/40 transition-colors"
                  >
                    View Receipt
                  </button>
                  <button
                    type="button"
                    onClick={() => onRebook(rideItem.pickup, rideItem.destination)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-[#d4b454] hover:bg-[#b45f06] text-[#2a2a2a] hover:text-white font-bold transition-all shadow-xs"
                  >
                    Rebook
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#9a2121] border border-[#c8833b] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#c8833b]/40">
              <span className="text-xs font-bold text-[#d4b454] uppercase tracking-wider">
                Official Chalo Trip Receipt
              </span>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="text-stone-300 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-center py-2">
              <span className="text-xs text-stone-300">Total Charged</span>
              <div className="text-3xl font-black text-[#d4b454]">
                ৳{selectedReceipt.fare}.00
              </div>
              <span className="text-[11px] text-emerald-400 font-bold">
                ✓ Cashless Settlement Captured
              </span>
            </div>

            <div className="bg-[#6f1b1b] border border-[#c8833b]/40 rounded-2xl p-4 text-xs space-y-2">
              <div className="flex justify-between text-stone-300">
                <span>Trip ID:</span>
                <span className="font-mono text-white">{selectedReceipt.id}</span>
              </div>
              <div className="flex justify-between text-stone-300">
                <span>Date & Time:</span>
                <span className="text-white">{selectedReceipt.createdAt}</span>
              </div>
              <div className="flex justify-between text-stone-300">
                <span>Vehicle:</span>
                <span className="text-white">{selectedReceipt.driver.vehicleModel}</span>
              </div>
              <div className="flex justify-between text-stone-300">
                <span>Driver:</span>
                <span className="text-white">{selectedReceipt.driver.name}</span>
              </div>
              <div className="border-t border-[#c8833b]/30 pt-2 flex justify-between text-stone-300">
                <span>Distance:</span>
                <span className="text-white">{selectedReceipt.distanceKm} km</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Surge Multiplier:</span>
                <span>0.0x (Flat Rate Guarantee)</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const pick = selectedReceipt.pickup;
                  const dest = selectedReceipt.destination;
                  setSelectedReceipt(null);
                  onRebook(pick, dest);
                }}
                className="flex-1 py-3 rounded-xl bg-[#d4b454] hover:bg-[#b45f06] text-[#2a2a2a] hover:text-white font-bold text-xs transition-colors shadow-md"
              >
                Rebook Route →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RideHistoryView;

