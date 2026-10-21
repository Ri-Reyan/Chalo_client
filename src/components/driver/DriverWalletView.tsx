"use client";

import React, { useState } from "react";

interface DriverWalletViewProps {
  balance: number;
  onWithdrawSuccess: (amount: number) => void;
}

interface WithdrawalItem {
  id: string;
  amount: number;
  method: string;
  account: string;
  status: "COMPLETED" | "PENDING" | "REJECTED";
  createdAt: string;
}

export const DriverWalletView: React.FC<DriverWalletViewProps> = ({
  balance,
  onWithdrawSuccess,
}) => {
  const [withdrawals, setWithdrawals] = useState<WithdrawalItem[]>([
    {
      id: "wth-8102",
      amount: 1200,
      method: "bKash",
      account: "01812-987654",
      status: "COMPLETED",
      createdAt: "Yesterday, 8:30 PM",
    },
    {
      id: "wth-7491",
      amount: 2500,
      method: "Bank Transfer",
      account: "City Bank - A/C 2108",
      status: "COMPLETED",
      createdAt: "Oct 18, 4:10 PM",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"bKash" | "Nagad" | "Bank">("bKash");
  const [accountNumber, setAccountNumber] = useState("01812-987654");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 100) {
      setError("Minimum withdrawal amount is ৳100.");
      return;
    }

    if (numAmount > balance) {
      setError("Amount exceeds your available balance.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const newWithdrawal: WithdrawalItem = {
        id: "wth-" + Math.floor(1000 + Math.random() * 9000),
        amount: numAmount,
        method,
        account: accountNumber,
        status: "COMPLETED", // Instant prototype settlement
        createdAt: "Just now",
      };

      setWithdrawals((prev) => [newWithdrawal, ...prev]);
      onWithdrawSuccess(numAmount);
      setShowModal(false);
      setAmount("");
    }, 700);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Balance Banner */}
      <div className="bg-[#9a2121] border border-[#c8833b]/60 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6f1b1b] border border-[#c8833b]/40 text-[#d4b454] text-xs font-bold uppercase tracking-wider mb-2">
            <span>💳</span>
            <span>Driver Payout Account</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Available Earnings Balance
          </h1>
          <div className="text-4xl sm:text-5xl font-black text-[#d4b454] mt-2">
            ৳{balance.toFixed(2)}
          </div>
          <span className="text-xs text-emerald-400 font-semibold mt-1 block">
            ✓ Ready for instant same-day withdrawal
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            setError("");
            setShowModal(true);
          }}
          disabled={balance < 100}
          className="h-14 px-8 rounded-2xl bg-[#d4b454] hover:bg-[#b45f06] text-[#2a2a2a] hover:text-white font-extrabold text-base tracking-wide transition-all shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 shrink-0"
        >
          Request Withdrawal &rarr;
        </button>
      </div>

      {/* Commission Transparency Banner */}
      <div className="bg-[#6f1b1b] border border-[#c8833b]/50 rounded-3xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤝</span>
          <div>
            <div className="text-sm font-bold text-white">
              Flat 10% Platform Cut &bull; Keep 90% of Every Fare
            </div>
            <div className="text-xs text-stone-300">
              Zero hidden technology fees. Fares deposit immediately into your wallet after each completed ride.
            </div>
          </div>
        </div>
        <div className="text-xs font-bold text-[#d4b454] bg-[#9a2121] px-3 py-1.5 rounded-xl border border-[#c8833b]/40 shrink-0">
          90% Net Take-Home
        </div>
      </div>

      {/* Withdrawal Transactions History */}
      <div className="bg-[#9a2121] border border-[#c8833b]/60 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#c8833b]/40">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-[#d4b454]">
            Payout &amp; Withdrawal History
          </h2>
          <span className="text-xs text-stone-300">{withdrawals.length} Total Requests</span>
        </div>

        <div className="space-y-3">
          {withdrawals.map((w) => (
            <div
              key={w.id}
              className="bg-[#6f1b1b] border border-[#c8833b]/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">
                    {w.method} Payout ({w.account})
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      w.status === "COMPLETED"
                        ? "bg-emerald-950/70 text-emerald-400 border border-emerald-500/40"
                        : "bg-amber-950/70 text-amber-400 border border-amber-500/40"
                    }`}
                  >
                    {w.status}
                  </span>
                </div>
                <div className="text-stone-300">
                  Transaction ID: <span className="font-mono text-white">{w.id}</span> &bull; {w.createdAt}
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-lg font-black text-[#d4b454]">
                  - ৳{w.amount}.00
                </div>
                <span className="text-[10px] text-stone-300">0% Processing Fee</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Withdrawal Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#9a2121] border border-[#c8833b] rounded-3xl p-7 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#c8833b]/40">
              <h3 className="text-lg font-bold text-white">Request Payout</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-stone-300 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1">
                  Payout Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["bKash", "Nagad", "Bank"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMethod(m)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        method === m
                          ? "bg-[#d4b454] text-[#2a2a2a] border-[#d4b454]"
                          : "bg-[#6f1b1b] text-white border-stone-500/40"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1">
                  Withdrawal Amount (৳)
                </label>
                <input
                  type="number"
                  min={100}
                  max={balance}
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Max ৳${balance.toFixed(2)}`}
                  className="w-full h-11 px-3.5 bg-[#f5f5f5] text-[#2a2a2a] rounded-xl border border-[#c8833b] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#d4b454]"
                />
                <span className="text-[11px] text-stone-300 mt-1 block">
                  Available: ৳{balance.toFixed(2)} (Min ৳100)
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1">
                  Recipient Account Details
                </label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. 01812-000000 or Bank A/C"
                  className="w-full h-11 px-3.5 bg-[#f5f5f5] text-[#2a2a2a] rounded-xl border border-[#c8833b] text-sm focus:outline-none focus:ring-2 focus:ring-[#d4b454]"
                />
              </div>

              {error && (
                <div className="text-xs text-rose-300 font-semibold text-center">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-[#d4b454] hover:bg-[#b45f06] text-[#2a2a2a] hover:text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Confirm Payout &rarr;</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverWalletView;

