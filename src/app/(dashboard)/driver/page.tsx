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
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/auth.context";
import api from "@/lib/axios";
import { getSocket } from "@/lib/socket";

function DriverDashboardContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<DriverTab>("requests");
  const [isOnline, setIsOnline] = useState(true);
  const [activeRide, setActiveRide] = useState<DriverRideOffer | null>(null);
  const [completedRides, setCompletedRides] = useState<DriverRideOffer[]>([]);
  const [balance, setBalance] = useState<number>(() =>
    typeof user?.balance === "number" ? user.balance : 0,
  );

  // Fetch driver live balance and status from backend
  useEffect(() => {
    api
      .get("/drivers/balance")
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          if (typeof res.data.data.balance === "number") {
            setBalance(res.data.data.balance);
          }
          if (typeof res.data.data.isOnline === "boolean") {
            setIsOnline(res.data.data.isOnline);
          }
        }
      })
      .catch(() => {});
  }, [user]);

  // Synchronize online socket room
  useEffect(() => {
    if (!user?.id) return;
    const socket = getSocket();
    if (isOnline) {
      socket.emit("driver:online", { driverId: user.id });
    } else {
      socket.emit("driver:offline");
    }
  }, [user, isOnline]);

  const handleToggleOnline = async (nextOnline: boolean) => {
    setIsOnline(nextOnline);
    try {
      await api.patch("/drivers/status", { isOnline: nextOnline });
    } catch (e) {
      console.warn("Status toggle error:", e);
    }
  };

  const driverName = user?.name || "Driver Partner";
  const driverEmail = user?.email || "";
  const [vehicleType, setVehicleType] = useState<"BIKE" | "CAR">(
    (user?.vehicleType as "BIKE" | "CAR") || "BIKE",
  );

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
        setIsOnline={handleToggleOnline}
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

export default function DriverDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["DRIVER"]}>
      <DriverDashboardContent />
    </ProtectedRoute>
  );
}
