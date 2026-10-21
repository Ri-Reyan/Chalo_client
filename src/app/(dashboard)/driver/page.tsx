"use client";

import React, { useState, useEffect } from "react";
import DriverSidebar, { DriverTab } from "@/components/driver/DriverSidebar";
import AvailableRequestsView, {
  DriverRideOffer,
} from "@/components/driver/AvailableRequestsView";
import DriverOngoingRideView from "@/components/driver/DriverOngoingRideView";
import DriverWalletView from "@/components/driver/DriverWalletView";
import DriverHistoryView from "@/components/driver/DriverHistoryView";
import DriverProfileView from "@/components/driver/DriverProfileView";

export default function DriverDashboardPage() {
  const [activeTab, setActiveTab] = useState<DriverTab>("requests");
  const [isOnline, setIsOnline] = useState(true);
  const [activeRide, setActiveRide] = useState<DriverRideOffer | null>(null);
  const [completedRides, setCompletedRides] = useState<DriverRideOffer[]>([]);
  const [balance, setBalance] = useState(1850.0);

  const [driverName, setDriverName] = useState("Rafiqul Alam");
  const [driverEmail, setDriverEmail] = useState("driver@chalo.app");
  const [vehicleType, setVehicleType] = useState<"BIKE" | "CAR">("BIKE");

  // Load user from localStorage if logged in
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("chalo_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.name) setDriverName(parsed.name);
          if (parsed.email) setDriverEmail(parsed.email);
          if (parsed.vehicleType) setVehicleType(parsed.vehicleType);
        } catch {
          // ignore parsing error
        }
      }
    }
  }, []);

  const handleAcceptRide = (offer: DriverRideOffer) => {
    setActiveRide(offer);
    setActiveTab("ongoing");
  };

  const handleRideCompleted = (
    netEarnings: number,
    completedOffer: DriverRideOffer,
  ) => {
    setBalance((prev) => prev + netEarnings);
    setCompletedRides((prev) => [completedOffer, ...prev]);
    setActiveRide(null);
    setActiveTab("withdraw");
  };

  const handleRideCancelled = () => {
    setActiveRide(null);
    setActiveTab("requests");
  };

  const handleWithdrawSuccess = (withdrawAmount: number) => {
    setBalance((prev) => Math.max(0, prev - withdrawAmount));
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#292524] flex flex-col lg:flex-row font-sans bg-grain">
      {/* Sidebar Navigation */}
      <DriverSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOnline={isOnline}
        setIsOnline={setIsOnline}
        hasActiveRide={activeRide !== null}
        driverName={driverName}
        vehicleType={vehicleType}
        balance={balance}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === "requests" && (
            <AvailableRequestsView
              isOnline={isOnline}
              onGoOnline={() => setIsOnline(true)}
              onAcceptRide={handleAcceptRide}
              vehicleType={vehicleType}
            />
          )}

          {activeTab === "ongoing" && (
            <DriverOngoingRideView
              ride={activeRide}
              onRideCompleted={handleRideCompleted}
              onRideCancelled={handleRideCancelled}
            />
          )}

          {activeTab === "history" && (
            <DriverHistoryView completedRides={completedRides} />
          )}

          {activeTab === "withdraw" && (
            <DriverWalletView
              balance={balance}
              onWithdrawSuccess={handleWithdrawSuccess}
            />
          )}

          {activeTab === "profile" && (
            <DriverProfileView
              driverName={driverName}
              driverEmail={driverEmail}
              vehicleType={vehicleType}
              setVehicleType={setVehicleType}
              isOnline={isOnline}
              balance={balance}
            />
          )}
        </div>
      </main>
    </div>
  );
}
