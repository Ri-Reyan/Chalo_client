"use client";

import { Ride, User, Withdrawal } from "./types";

const RIDE_KEY = "chalo_active_ride";
const COMPLETED_RIDES_KEY = "chalo_completed_rides";
const DRIVER_WALLET_KEY = "chalo_driver_wallet";
const WITHDRAWALS_KEY = "chalo_withdrawals";

export const mockRideBus = {
  // Active Ride
  getActiveRide: (): Ride | null => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(RIDE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  setActiveRide: (ride: Ride | null): void => {
    if (typeof window === "undefined") return;
    if (!ride) {
      localStorage.removeItem(RIDE_KEY);
    } else {
      localStorage.setItem(RIDE_KEY, JSON.stringify(ride));
    }
    window.dispatchEvent(new Event("chalo_ride_updated"));
  },

  // Completed Rides History
  getCompletedRides: (): Ride[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(COMPLETED_RIDES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  addCompletedRide: (ride: Ride): void => {
    if (typeof window === "undefined") return;
    const history = mockRideBus.getCompletedRides();
    const updated = [ride, ...history];
    localStorage.setItem(COMPLETED_RIDES_KEY, JSON.stringify(updated));
    mockRideBus.setActiveRide(null);
    window.dispatchEvent(new Event("chalo_history_updated"));
  },

  // Driver Balance
  getDriverBalance: (): number => {
    if (typeof window === "undefined") return 1850;
    try {
      const stored = localStorage.getItem(DRIVER_WALLET_KEY);
      return stored ? parseFloat(stored) : 1850;
    } catch {
      return 1850;
    }
  },

  updateDriverBalance: (amountDelta: number): number => {
    if (typeof window === "undefined") return 1850;
    const current = mockRideBus.getDriverBalance();
    const newBal = Math.max(0, current + amountDelta);
    localStorage.setItem(DRIVER_WALLET_KEY, newBal.toFixed(2));
    window.dispatchEvent(new Event("chalo_wallet_updated"));
    return newBal;
  },

  // Current Session User
  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem("chalo_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser: (user: Partial<User>): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem("chalo_user", JSON.stringify(user));
  },
};

