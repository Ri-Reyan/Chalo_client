"use client";

import React, { useState, useEffect } from "react";
import { DriverRideOffer } from "./AvailableRequestsView";
import ConfirmModal from "@/components/common/ConfirmModal";
import toast from "@/lib/toast";
import api from "@/lib/axios";
import { getSocket, joinRideRoom, leaveRideRoom } from "@/lib/socket";

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
  // 1: En Route to Pickup -> 2: Arrived / Passenger Boarding -> 3: In Transit -> 4: Completed
  const [tripStep, setTripStep] = useState<1 | 2 | 3 | 4>(1);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  if (!ride) {
    return (
      <div className="bg-white border border-stone-200/80 rounded-3xl p-10 text-center shadow-sm space-y-4 animate-in fade-in">
        <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 text-3xl flex items-center justify-center mx-auto">
          🏍️
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#292524]">
          No Active Ride In Progress
        </h2>
        <p className="text-sm text-stone-500 max-w-md mx-auto">
          You don&apos;t currently have an accepted ride. Check the Available
          Requests tab to accept new incoming offers.
        </p>
      </div>
    );
  }

  // Real-time synchronization via Socket.IO
  useEffect(() => {
    if (!ride) return;
    joinRideRoom(ride.id);

    const socket = getSocket();
    const handleRemoteCompleted = (data: any) => {
      setTripStep(4);
      toast.success(
        "Trip Completed!",
        `Customer arrived safely. $${Number(ride.netEarnings).toFixed(2)} deposited to wallet.`
      );
    };

    socket.on("ride:completed", handleRemoteCompleted);

    return () => {
      leaveRideRoom(ride.id);
      socket.off("ride:completed", handleRemoteCompleted);
    };
  }, [ride]);

  const handleArrivedAtPickup = async () => {
    setTripStep(2);
    toast.success("Arrived at Pickup", "Passenger has been notified.");
    try {
      await api.post(`/rides/${ride.id}/arrived`);
    } catch (e) {
      console.warn("Backend arrived fallback:", e);
    }
  };

  const handleStartTrip = async () => {
    setTripStep(3);
    toast.info("Trip Started", "Heading towards drop-off destination.");
    try {
      await api.post(`/rides/${ride.id}/start`);
    } catch (e) {
      console.warn("Backend start trip fallback:", e);
    }
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
      <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              {tripStep === 1 && "Step 1 of 3: En Route to Pickup"}
              {tripStep === 2 && "Step 2 of 3: At Pickup Location"}
              {tripStep === 3 && "Step 3 of 3: In Transit to Destination"}
              {tripStep === 4 && "Trip Completed Successfully"}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#292524] mt-0.5">
              {tripStep === 1 && "Driving to passenger pickup point"}
              {tripStep === 2 && "Passenger boarding • Ready to begin trip"}
              {tripStep === 3 &&
                "Passenger on board • Navigating to destination"}
              {tripStep === 4 && "Earnings deposited to your wallet!"}
            </h1>
          </div>

          <div className="bg-[#E8EFE8] border border-emerald-200 rounded-2xl px-5 py-2.5 text-center sm:text-right shrink-0">
            <span className="text-[10px] text-emerald-800 font-bold block uppercase">
              Net Fare Take-Home
            </span>
            <div className="text-2xl font-black text-emerald-800">
              + ${Number(ride.netEarnings).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
          <div
            className="h-full bg-[#FFB7B2] transition-all duration-500 ease-out"
            style={{ width: `${(tripStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Navigation Map Simulation (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700">
            <span>
              {tripStep < 3
                ? `Heading to: ${ride.pickup}`
                : `Heading to: ${ride.destination}`}
            </span>
            <span className="text-[#292524]">
              {tripStep < 3 ? "0.6 km to pickup" : `${ride.distanceKm} km trip`}
            </span>
          </div>

          {/* Map Surface */}
          <div className="relative h-72 rounded-2xl bg-[#F7F6F0] border border-stone-200 overflow-hidden shadow-inner flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#292524_1px,transparent_1px)] bg-size-[18px_18px]" />

            {/* Turn-by-Turn Route Line */}
            <svg className="absolute inset-0 w-full h-full">
              <path
                d="M 50 220 Q 180 120 320 60"
                fill="none"
                stroke="#FF9E98"
                strokeWidth="5"
                strokeDasharray="6,4"
              />
            </svg>

            {/* Current Position Marker */}
            <div className="absolute left-1/3 bottom-1/3 flex flex-col items-center animate-pulse">
              <div className="w-9 h-9 rounded-full bg-[#FFB7B2] border-2 border-[#292524] shadow-md flex items-center justify-center text-sm">
                🏍️
              </div>
              <span className="text-[10px] font-bold bg-[#292524] text-white px-2 py-0.5 rounded shadow mt-1">
                You
              </span>
            </div>

            {/* Target Destination Marker */}
            <div className="absolute right-14 top-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold">
                {tripStep < 3 ? "P" : "D"}
              </div>
              <span className="text-[10px] font-bold bg-[#292524] text-white px-2 py-0.5 rounded shadow mt-1">
                {tripStep < 3 ? "Pickup" : "Destination"}
              </span>
            </div>
          </div>

          {/* Turn-by-Turn Instruction Banner */}
          <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 flex items-center gap-3 text-xs">
            <div className="w-8 h-8 rounded-xl bg-[#292524] text-white flex items-center justify-center font-bold text-sm shrink-0">
              ↱
            </div>
            <div>
              <div className="font-bold text-[#292524]">
                In 200m, turn right onto Road 54
              </div>
              <div className="text-stone-500">
                {tripStep < 3
                  ? "Approaching pickup spot on the right."
                  : "Continue straight toward Dhanmondi 27."}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Passenger Card & Trip Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Passenger Details
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-[#E8EFE8] border border-emerald-200 px-2.5 py-0.5 rounded-md">
                ★ {ride.customerRating}
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#FFB7B2] text-[#292524] flex items-center justify-center text-lg font-bold shadow-xs">
                {ride.customerName.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-[#292524]">
                  {ride.customerName}
                </h3>
                <div className="text-xs text-stone-500">Verified Customer</div>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>✕ Cancel Ride</span>
              </button>
            </div>

            {/* STEP 1 ACTION: I've Arrived */}
            {tripStep === 1 && (
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleArrivedAtPickup}
                  className="w-full h-14 rounded-2xl bg-[#FFB7B2] hover:bg-[#FF9E98] text-[#292524] font-extrabold text-base tracking-wide transition-all shadow-sm hover:scale-[1.01]"
                >
                  I&apos;ve Arrived at Pickup Spot &rarr;
                </button>
              </div>
            )}

            {/* STEP 2 ACTION: Start Trip (No OTP required) */}
            {tripStep === 2 && (
              <div className="pt-3 space-y-3">
                <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 text-center">
                  <div className="text-sm font-bold text-[#292524]">
                    Passenger At Pickup Location
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Confirm passenger has boarded and begin navigating to
                    destination.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleStartTrip}
                  className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base tracking-wide transition-all shadow-md hover:scale-[1.01]"
                >
                  Start Trip &amp; Begin Journey &rarr;
                </button>
              </div>
            )}

            {/* STEP 3 ACTION: Complete Ride */}
            {tripStep === 3 && (
              <div className="pt-3 space-y-2">
                <div className="bg-[#E8EFE8] border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 text-center font-semibold">
                  ✓ Ride in progress &bull; Navigating to destination
                </div>
                <button
                  type="button"
                  onClick={handleFinishRide}
                  className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base tracking-wide transition-all shadow-md hover:scale-[1.01]"
                >
                  Complete Ride &amp; Collect Fare &rarr;
                </button>
              </div>
            )}

            {/* STEP 4 ACTION: Summary & Return to Dashboard */}
            {tripStep === 4 && (
              <div className="pt-2 space-y-4 animate-in zoom-in-95">
                <div className="bg-stone-50 border border-emerald-300 rounded-2xl p-4 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white text-2xl flex items-center justify-center mx-auto shadow-xs">
                    ✓
                  </div>
                  <div className="text-lg font-black text-[#292524]">
                    Trip Completed!
                  </div>
                  <div className="text-2xl font-black text-emerald-700">
                    + ${Number(ride.netEarnings).toFixed(2)}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Gross: ${Number(ride.grossFare).toFixed(2)} | 10% Chalo cut: -${(Number(ride.grossFare) * 0.1).toFixed(2)}
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold block pt-1">
                    ✓ Credited immediately to your driver wallet
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleReturnToDashboard}
                  className="w-full h-14 rounded-2xl bg-[#FFB7B2] hover:bg-[#FF9E98] text-[#292524] font-extrabold text-base tracking-wide transition-all shadow-sm"
                >
                  Done &bull; Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Driver Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={() => {
          toast.info("Ride cancelled", "You cancelled the ongoing trip.");
          onRideCancelled();
        }}
        title="Cancel Accepted Ride?"
        message="Are you sure you want to cancel this ride? The passenger will be notified immediately."
        confirmText="Yes, Cancel Ride"
        cancelText="Continue Trip"
        variant="danger"
      />
    </div>
  );
};

export default DriverOngoingRideView;
