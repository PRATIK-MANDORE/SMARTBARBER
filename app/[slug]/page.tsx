'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTenant } from '@/context/TenantContext';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ServiceSection from '@/components/ServiceSection';
import GallerySection from '@/components/GallerySection';
import ReviewsSection from '@/components/ReviewsSection';
import FooterSection from '@/components/FooterSection';
import BookingModal from '@/components/BookingModal';
import { Calendar, Phone, MessageCircle } from 'lucide-react';

export default function TenantLandingPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'rajhair';
  const { currentTenant, setCurrentTenantBySlug } = useTenant();

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [preselectedServiceIds, setPreselectedServiceIds] = useState<string[]>([]);

  // Sync active tenant slug with URL
  useEffect(() => {
    if (slug && slug !== currentTenant.slug) {
      setCurrentTenantBySlug(slug);
    }
  }, [slug, currentTenant.slug, setCurrentTenantBySlug]);

  const handleOpenBooking = (serviceIds: string[] = []) => {
    setPreselectedServiceIds(serviceIds);
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 transition-colors duration-150">
      {/* Shop Navbar */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection onOpenBooking={() => handleOpenBooking()} />

        {/* 2. Categorized Service Menu */}
        <ServiceSection
          onOpenBookingWithService={(serviceId) => handleOpenBooking([serviceId])}
          onOpenBookingModal={(ids) => handleOpenBooking(ids || [])}
        />

        {/* 3. Visual Portfolio / Gallery */}
        <GallerySection />

        {/* 4. Customer Reviews */}
        <ReviewsSection />

        {/* 5. Footer & Contact Details with Map */}
        <FooterSection />
      </main>

      {/* Interactive Booking Flow Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedServiceIds={preselectedServiceIds}
      />

      {/* Floating Quick Action Trigger for Mobile Screens */}
      <div className="sm:hidden fixed bottom-5 right-5 z-40">
        <button
          onClick={() => handleOpenBooking()}
          className="flex items-center gap-2 px-4 py-3 rounded-full text-white font-bold text-xs shadow-2xl active:scale-95 transition-transform"
          style={{ backgroundColor: currentTenant.theme.primary }}
        >
          <Calendar className="w-4 h-4" />
          <span>Book Slot</span>
        </button>
      </div>
    </div>
  );
}
