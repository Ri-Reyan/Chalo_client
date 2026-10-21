"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CustomerSidebar, {
  CustomerTab,
} from "@/components/customer/CustomerSidebar";
import RequestRideView, {
  ActiveRideState,
} from "@/components/customer/RequestRideView";
import LiveTrackingView from "@/components/customer/LiveTrackingView";
import RideHistoryView from "@/components/customer/RideHistoryView";
import CustomerProfileView from "@/components/customer/CustomerProfileView";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/auth.context";
import toast from "@/lib/toast";
import api from "@/lib/axios";
import { getSocket, joinUserChannel, joinRideRoom, leaveRideRoom } from "@/lib/socket";

function CustomerDashboardContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<CustomerTab>("request");
  const [activeRide, setActiveRide] = useState<ActiveRideState | null>(null);
  const [completedRides, setCompletedRides] = useState<ActiveRideState[]>([]);

  // Check for active ride returned from Stripe Checkout
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("chalo_active_ride");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setActiveRide(parsed);
          setActiveTab("tracking");
          sessionStorage.removeItem("chalo_active_ride");
          return;
        } catch (e) {
          console.error("Failed to parse saved active ride:", e);
        }
      }
    }

    if (searchParams.get("tab") === "tracking") {
      setActiveTab("tracking");
      // Fetch active ride from server if available
      api
        .get("/rides/active?role=CUSTOMER")
        .then((res) => {
          if (res.data?.success && res.data?.data) {
            setActiveRide(res.data.data);
          }
        })
        .catch(() => {});
    }
  }, [searchParams]);

  // Ensure active ride socket room is joined whenever activeRide is set
  useEffect(() => {
    if (!activeRide?.id) return;
    joinRideRoom(activeRide.id);
  }, [activeRide?.id]);

  // Real-time synchronization for customer ride updates
  useEffect(() => {
    if (!user?.id) return;
    joinUserChannel(user.id, "CUSTOMER");

    const socket = getSocket();
    const handleRideAccepted = (data: any) => {
      if (data?.driver) {
        setActiveRide((prev) => ({
          id: data.rideId || prev?.id || "",
          pickup: prev?.pickup || data.pickup || "Pickup Location",
          destination: prev?.destination || data.destination || "Destination",
          pickupLat: typeof data.pickupLat === "number" ? data.pickupLat : prev?.pickupLat,
          pickupLng: typeof data.pickupLng === "number" ? data.pickupLng : prev?.pickupLng,
          destinationLat: typeof data.destinationLat === "number" ? data.destinationLat : prev?.destinationLat,
          destinationLng: typeof data.destinationLng === "number" ? data.destinationLng : prev?.destinationLng,
          vehicleType: data.vehicleType || prev?.vehicleType || "BIKE",
          distanceKm: Number(data.distanceKm) || prev?.distanceKm || 0,
          fare: Number(data.fare) || prev?.fare || 0,
          status: "ACCEPTED",
          driver: data.driver,
          createdAt:
            prev?.createdAt ||
            new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
        }));
        setActiveTab("tracking");
        toast.success(
          "Driver Assigned!",
          `${data.driver?.name || "A driver"} accepted your ride and is en route.`,
        );
      }
    };

    const handleNoDriverFound = () => {
      toast.error(
        "No Drivers Available",
        "Radius limit reached. Your upfront payment hold has been refunded.",
      );
      setActiveRide(null);
      setActiveTab("request");
    };

    const handleRideCancelled = (data?: { message?: string }) => {
      toast.info(
        "Ride Cancelled",
        data?.message || "The ride has been cancelled and held payment refunded."
      );
      setActiveRide(null);
      setActiveTab("request");
    };

    socket.on("ride:accepted", handleRideAccepted);
    socket.on("ride:no_driver", handleNoDriverFound);
    socket.on("ride:cancelled", handleRideCancelled);

    return () => {
      socket.off("ride:accepted", handleRideAccepted);
      socket.off("ride:no_driver", handleNoDriverFound);
      socket.off("ride:cancelled", handleRideCancelled);
    };
  }, [user?.id]);

  const customerName = user?.name || "Customer";
  const customerEmail = user?.email || "";

  const handleRideCreated = (newRide: ActiveRideState) => {
    setActiveRide(newRide);
    setActiveTab("tracking");
  };

  const handleRideCompleted = (completedRide: ActiveRideState) => {
    setCompletedRides((prev) => [completedRide, ...prev]);
    setActiveRide(null);
    setActiveTab("history");
  };

  const handleRideCancelled = () => {
    setActiveRide(null);
    setActiveTab("request");
  };

  const handleRebook = () => {
    setActiveTab("request");
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#292524] flex flex-col lg:flex-row font-sans bg-grain">
      {/* Sidebar Navigation */}
      <CustomerSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasActiveRide={activeRide !== null}
        customerName={customerName}
        customerEmail={customerEmail}
      />

      {/* Main Dashboard Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === "request" && (
            <RequestRideView onRideCreated={handleRideCreated} />
          )}

          {activeTab === "tracking" && (
            <LiveTrackingView
              ride={activeRide}
              onRideAccepted={(data) => {
                if (data?.driver) {
                  setActiveRide((prev) => ({
                    id: data.rideId || prev?.id || "",
                    pickup: prev?.pickup || data.pickup || "Pickup Location",
                    destination: prev?.destination || data.destination || "Destination",
                    pickupLat: typeof data.pickupLat === "number" ? data.pickupLat : prev?.pickupLat,
                    pickupLng: typeof data.pickupLng === "number" ? data.pickupLng : prev?.pickupLng,
                    destinationLat: typeof data.destinationLat === "number" ? data.destinationLat : prev?.destinationLat,
                    destinationLng: typeof data.destinationLng === "number" ? data.destinationLng : prev?.destinationLng,
                    vehicleType: data.vehicleType || prev?.vehicleType || "BIKE",
                    distanceKm: Number(data.distanceKm) || prev?.distanceKm || 0,
                    fare: Number(data.fare) || prev?.fare || 0,
                    status: "ACCEPTED",
                    driver: data.driver,
                    createdAt:
                      prev?.createdAt ||
                      new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                  }));
                }
              }}
              onRideCompleted={handleRideCompleted}
              onRideCancelled={handleRideCancelled}
            />
          )}

          {activeTab === "history" && (
            <RideHistoryView rides={completedRides} onRebook={handleRebook} />
          )}

          {activeTab === "profile" && (
            <CustomerProfileView
              customerName={customerName}
              customerEmail={customerEmail}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default function CustomerDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <Suspense fallback={<div className="min-h-screen bg-[#FDFCF8]" />}>
        <CustomerDashboardContent />
      </Suspense>
    </ProtectedRoute>
  );
}
