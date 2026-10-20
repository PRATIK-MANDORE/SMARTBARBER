'use client';

import React, { useState } from 'react';
import { useTenant } from '@/context/TenantContext';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ServiceSection from '@/components/ServiceSection';
import GallerySection from '@/components/GallerySection';
import ReviewsSection from '@/components/ReviewsSection';
import FooterSection from '@/components/FooterSection';
import BookingModal from '@/components/BookingModal';
import { Calendar } from 'lucide-react';

export default function HomePage() {
  const { currentTenant } = useTenant();
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [preselectedServiceIds, setPreselectedServiceIds] = useState<string[]>([]);

  const handleOpenBooking = (serviceIds: string[] = []) => {
    setPreselectedServiceIds(serviceIds);
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 transition-colors duration-150">
      {/* Salon Luxury Navbar */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      {/* Main Luxury Experience */}
      <main className="flex-1">
        {/* 1. Fancy Hero Banner */}
        <HeroSection onOpenBooking={() => handleOpenBooking()} />

        {/* 2. Curated Men's Service Menu */}
        <ServiceSection
          onOpenBookingWithService={(serviceId) => handleOpenBooking([serviceId])}
          onOpenBookingModal={(ids) => handleOpenBooking(ids || [])}
        />

        {/* 3. Visual Portfolio / Lookbook */}
        <GallerySection />

        {/* 4. Verified Mumbai Client Reviews */}
        <ReviewsSection />

        {/* 5. Timings, Address, Google Map & Contacts */}
        <FooterSection />
      </main>

      {/* Interactive 4-Step Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedServiceIds={preselectedServiceIds}
      />

      {/* Mobile Floating VIP Booking Trigger */}
      <div className="sm:hidden fixed bottom-5 right-5 z-40">
        <button
          onClick={() => handleOpenBooking()}
          className="flex items-center gap-2 px-5 py-3 rounded-full text-slate-950 font-black text-xs bg-gradient-to-r from-amber-400 to-amber-500 shadow-2xl active:scale-95 transition-transform cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-slate-950" />
          <span>Book Slot</span>
        </button>
      </div>
    </div>
  );
}
