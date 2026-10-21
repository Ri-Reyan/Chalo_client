"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api, { getErrorMessage } from "@/lib/axios";
import toast from "@/lib/toast";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sessionId = searchParams.get("session_id");
  const rideId = searchParams.get("ride_id");
  const tempRideId =
    searchParams.get("temp_ride_id") ||
    searchParams.get("tempRideId") ||
    (rideId?.startsWith("temp_") ? rideId : undefined);

  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [rideDetails, setRideDetails] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    if (!sessionId) {
      setIsVerifying(false);
      setErrorMessage("Missing Stripe checkout session parameter.");
      return;
    }

    const verifyPayment = async () => {
      try {
        const payload: {
          sessionId: string;
          rideId?: string;
          tempRideId?: string;
        } = {
          sessionId,
        };

        if (rideId && rideId !== "null" && rideId !== "undefined") {
          payload.rideId = rideId;
        }

        if (tempRideId && tempRideId !== "null" && tempRideId !== "undefined") {
          payload.tempRideId = tempRideId;
        }

        const response = await api.post("/payments/verify-session", payload);

        if (!isMounted) return;

        if (response.data?.success) {
          const data = response.data.data;
          setIsSuccess(true);
          setRideDetails(data);

          toast.success(
            "Payment Confirmed!",
            `$${Number(data.fare).toFixed(2)} held in escrow. Dispatching drivers...`,
          );

          // Save active ride into session for seamless transition to tracking (without pre-assigned fake driver)
          const activeRide = {
            id: data.rideId,
            pickup: data.pickup || "Pickup Location",
            destination: data.destination || "Destination",
            pickupLat: data.pickupLat,
            pickupLng: data.pickupLng,
            destinationLat: data.destinationLat,
            destinationLng: data.destinationLng,
            vehicleType: data.vehicleType || "BIKE",
            distanceKm: Number(data.distanceKm) || 4.5,
            fare: Number(data.fare) || 2.5,
            status: "REQUESTED",
            driver: null,
            createdAt: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };

          if (typeof window !== "undefined") {
            try {
              sessionStorage.setItem(
                "chalo_active_ride",
                JSON.stringify(activeRide),
              );
            } catch (storageErr) {
              console.warn("Storage warning:", storageErr);
            }
          }

          // Automatically transition to customer live tracking after 1.5s
          setTimeout(() => {
            if (isMounted) {
              router.replace("/customer?tab=tracking");
            }
          }, 1500);
        } else {
          setIsSuccess(false);
          setErrorMessage(
            response.data?.message || "Payment verification failed.",
          );
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        if (isMounted) {
          setIsSuccess(false);
          setErrorMessage(getErrorMessage(err));
        }
      } finally {
        if (isMounted) {
          setIsVerifying(false);
        }
      }
    };

    verifyPayment();

    return () => {
      isMounted = false;
    };
  }, [sessionId, rideId, tempRideId, router]);

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#292524] flex flex-col justify-between p-4 sm:p-8 font-sans bg-grain relative overflow-hidden">
      {/* Ambient glow blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -left-16 w-80 h-80 rounded-full bg-[#E8EFE8]/70 blur-[100px] -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -right-16 w-88 h-88 rounded-full bg-[#FFE4E1]/50 blur-[100px] -z-10"
      />

      {/* Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pt-2">
        <Link href="/customer" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-full bg-[#FFB7B2] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#292524]">
            Chalo
          </span>
        </Link>
      </header>

      {/* Main Status Card */}
      <main className="max-w-lg w-full mx-auto my-auto text-center py-10 px-4">
        {isVerifying ? (
          <div className="bg-white border border-stone-200/80 rounded-3xl p-8 sm:p-10 shadow-sm space-y-5 animate-in fade-in">
            <div className="w-16 h-16 rounded-3xl bg-[#E8EFE8] border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto text-2xl shadow-xs">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#292524]">
              Verifying Stripe Payment...
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto leading-relaxed">
              We are confirming your transaction with Stripe and placing your fare
              into secure escrow hold.
            </p>
          </div>
        ) : isSuccess ? (
          <div className="bg-white border border-stone-200/80 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-[#E8EFE8] border border-emerald-300 text-emerald-800 flex items-center justify-center mx-auto text-3xl shadow-xs">
              ✓
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8EFE8] text-emerald-800 font-bold text-xs uppercase tracking-wider">
                Stripe Authorized
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292524]">
                Payment Authorized!
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto leading-relaxed">
                Your upfront fare of{" "}
                <strong>
                  ${rideDetails ? Number(rideDetails.fare).toFixed(2) : "0.00"}
                </strong>{" "}
                has been authorized. Redirecting you to live driver tracking...
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/customer?tab=tracking"
                className="w-full py-4 px-6 rounded-2xl bg-[#FFB7B2] hover:bg-[#FF9E98] text-[#292524] font-extrabold text-sm tracking-wide shadow-sm hover:scale-[1.01] active:scale-95 transition-all block text-center"
              >
                Go to Live Ride Tracking &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-stone-200/80 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto text-3xl shadow-xs">
              ⚠️
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 font-bold text-xs uppercase tracking-wider border border-rose-200">
                Verification Issue
              </span>
              <h1 className="text-2xl font-extrabold text-[#292524]">
                Could Not Verify Payment
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto leading-relaxed">
                {errorMessage ||
                  "We could not confirm your checkout session. No charge was captured."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/customer"
                className="flex-1 py-3.5 px-5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs border border-stone-200 transition-colors"
              >
                Return to Dashboard
              </Link>
              <Link
                href="/customer"
                className="flex-1 py-3.5 px-5 rounded-2xl bg-[#FFB7B2] hover:bg-[#FF9E98] text-[#292524] font-extrabold text-xs transition-all shadow-xs"
              >
                Try Again
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto text-center text-xs text-stone-400 pb-2">
        &copy; 2026 Chalo Mobility Inc. All payments secured by Stripe.
      </footer>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center p-4">
          <div className="flex items-center gap-3 text-stone-600 font-bold text-sm">
            <div className="w-5 h-5 border-2 border-stone-700 border-t-transparent rounded-full animate-spin" />
            <span>Loading payment confirmation...</span>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}

