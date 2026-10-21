"use client";

import React, { useState, useEffect } from "react";
import CustomerSidebar, { CustomerTab } from "@/components/customer/CustomerSidebar";
import RequestRideView, { ActiveRideState } from "@/components/customer/RequestRideView";
import LiveTrackingView from "@/components/customer/LiveTrackingView";
import RideHistoryView from "@/components/customer/RideHistoryView";
import CustomerProfileView from "@/components/customer/CustomerProfileView";

export default function CustomerDashboardPage() {
  const [activeTab, setActiveTab] = useState<CustomerTab>("request");
  const [activeRide, setActiveRide] = useState<ActiveRideState | null>(null);
  const [completedRides, setCompletedRides] = useState<ActiveRideState[]>([]);
  const [customerName, setCustomerName] = useState("Sarah Khan");
  const [customerEmail, setCustomerEmail] = useState("customer@chalo.app");

  // Load user from localStorage if logged in
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("chalo_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.name) setCustomerName(parsed.name);
          if (parsed.email) setCustomerEmail(parsed.email);
        } catch {
          // ignore parsing error
        }
      }
    }
  }, []);

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
    <div className="min-h-screen bg-[#6f1b1b] text-white flex flex-col lg:flex-row font-sans">
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
              onRideCompleted={handleRideCompleted}
              onRideCancelled={handleRideCancelled}
            />
          )}

          {activeTab === "history" && (
            <RideHistoryView
              rides={completedRides}
              onRebook={handleRebook}
            />
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

