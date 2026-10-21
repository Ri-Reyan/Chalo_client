"use client";

import React from "react";
import { DriverRideOffer } from "./AvailableRequestsView";

interface DriverHistoryViewProps {
  completedRides: DriverRideOffer[];
}

const mockDefaultDriverTrips: DriverRideOffer[] = [
  {
    id: "ride-hist-1",
    customerName: "Farhana Rahman",
    customerRating: "5.0 ★",
    pickup: "Banani 11, Block D",
    destination: "Dhanmondi 27, Road 16",
    distanceKm: 9.2,
    pickupDistanceKm: 0.5,
    grossFare: 168,
    netEarnings: 151, // 90%
    vehicleType: "BIKE",
    expiresInSeconds: 0,
  },
  {
    id: "ride-hist-2",
    customerName: "Tahsin Ahmed",
    customerRating: "4.9 ★",
    pickup: "Gulshan 1 Circle, Avenue 3",
    destination: "Motijheel Commercial Zone",
    distanceKm: 11.5,
    pickupDistanceKm: 0.8,
    grossFare: 202,
    netEarnings: 182,
    vehicleType: "BIKE",
    expiresInSeconds: 0,
  },
  {
    id: "ride-hist-3",
    customerName: "Nusrat Jahan",
    customerRating: "5.0 ★",
    pickup: "Uttara Sector 7, Jashimuddin",
    destination: "Gulshan 2, Road 54",
    distanceKm: 13.0,
    pickupDistanceKm: 1.2,
    grossFare: 225,
    netEarnings: 202,
    vehicleType: "BIKE",
    expiresInSeconds: 0,
  },
];

export const DriverHistoryView: React.FC<DriverHistoryViewProps> = ({
  completedRides,
}) => {
  const allTrips = [...completedRides, ...mockDefaultDriverTrips];
  const totalEarnings = allTrips.reduce((acc, t) => acc + t.netEarnings, 0);
  const totalDistance = allTrips.reduce((acc, t) => acc + t.distanceKm, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-[#9a2121] border border-[#c8833b]/60 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#d4b454] uppercase tracking-wider block mb-1">
            Performance &amp; Trips
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Driver Trip History
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-200">
            Every completed ride with transparent 90% take-home calculations.
          </p>
        </div>

        <div className="bg-[#6f1b1b] border border-[#c8833b]/50 rounded-2xl px-5 py-3 text-center sm:text-right shrink-0">
          <span className="text-[11px] text-stone-300 block">Total Historical Earnings</span>
          <div className="text-3xl font-black text-[#d4b454]">
            ৳{totalEarnings}.00
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#9a2121] border border-[#c8833b]/50 rounded-2xl p-5 shadow-sm text-center">
          <span className="text-xs text-stone-300 uppercase tracking-wider block">Completed Rides</span>
          <div className="text-2xl font-black text-white mt-1">{allTrips.length} Rides</div>
        </div>
        <div className="bg-[#9a2121] border border-[#c8833b]/50 rounded-2xl p-5 shadow-sm text-center">
          <span className="text-xs text-stone-300 uppercase tracking-wider block">Total Distance Covered</span>
          <div className="text-2xl font-black text-white mt-1">{totalDistance.toFixed(1)} km</div>
        </div>
        <div className="bg-[#9a2121] border border-[#c8833b]/50 rounded-2xl p-5 shadow-sm text-center">
          <span className="text-xs text-stone-300 uppercase tracking-wider block">Average Passenger Rating</span>
          <div className="text-2xl font-black text-[#d4b454] mt-1">4.96 ★</div>
        </div>
      </div>

      {/* Trip List */}
      <div className="space-y-3">
        {allTrips.map((trip, idx) => (
          <div
            key={trip.id + idx}
            className="bg-[#9a2121] border border-[#c8833b]/50 rounded-2xl p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#6f1b1b] flex items-center justify-center text-xs">
                  {trip.vehicleType === "BIKE" ? "🏍️" : "🚗"}
                </span>
                <span className="font-bold text-white text-sm">
                  Passenger: {trip.customerName}
                </span>
                <span className="text-xs text-[#d4b454]">★ {trip.customerRating}</span>
              </div>

              <div className="text-xs text-stone-200 pl-8">
                <span className="text-emerald-400 font-semibold">{trip.pickup}</span>
                <span className="mx-2 text-[#d4b454]">&rarr;</span>
                <span className="text-rose-400 font-semibold">{trip.destination}</span>
              </div>

              <div className="text-[11px] text-stone-400 pl-8 flex gap-3">
                <span>Trip: {trip.distanceKm} km</span>
                <span>&bull;</span>
                <span>Gross Fare: ৳{trip.grossFare}.00</span>
                <span>&bull;</span>
                <span>10% Platform Cut: -৳{Math.round(trip.grossFare * 0.1)}.00</span>
              </div>
            </div>

            <div className="text-left md:text-right border-t md:border-t-0 border-[#c8833b]/30 pt-2 md:pt-0 shrink-0">
              <span className="text-[10px] text-emerald-400 font-bold uppercase block">
                Net Deposited
              </span>
              <div className="text-2xl font-black text-[#d4b454]">
                + ৳{trip.netEarnings}.00
              </div>
              <span className="text-[10px] text-stone-300">
                Payment Captured ✓
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverHistoryView;

