import React from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import SocialProof from "@/components/landing/SocialProof";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCF8] text-[#292524]">
      {/* 1. Landing Page Navbar */}
      <Navbar />

      {/* Main Landing Content */}
      <main className="flex-1">
        {/* 2. Hero Section with strong CTAs */}
        <Hero />

        {/* 3. Social Proof / Stats Section */}
        <SocialProof />
      </main>
    </div>
  );
}
