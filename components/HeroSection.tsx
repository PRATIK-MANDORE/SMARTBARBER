'use client';

import React from 'react';
import { useTenant } from '@/context/TenantContext';
import {
  Star,
  MapPin,
  Calendar,
  Phone,
  MessageCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Crown,
  Zap,
} from 'lucide-react';

interface HeroSectionProps {
  onOpenBooking: () => void;
}

export default function HeroSection({ onOpenBooking }: HeroSectionProps) {
  const { currentTenant } = useTenant();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-100 via-white to-slate-50 dark:from-[#030712] dark:via-[#080d19] dark:to-[#030712] text-slate-900 dark:text-white py-12 sm:py-20 border-b border-slate-200 dark:border-amber-500/20 transition-colors duration-150">
      {/* Decorative luxury lighting glow (hardware accelerated) */}
      <div className="absolute top-0 right-1/4 -mt-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none transform-gpu" />
      <div className="absolute bottom-0 left-10 -mb-20 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none transform-gpu" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Luxury Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 shadow-xs">
                <Crown className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span>{currentTenant.area}’s Premier Grooming Lounge</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-200/80 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span>Poona Link Road, {currentTenant.area}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-xs">
                <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                <span>{currentTenant.rating.toFixed(1)} / 5.0</span>
                <span className="font-semibold text-slate-900">({currentTenant.reviewCount} Reviews)</span>
              </div>
            </div>

            {/* Main Headline */}
            <div>
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-amber-400/50 bg-slate-950 p-1 shadow-lg shrink-0">
                  <img
                    src="/logo.png"
                    alt={`${currentTenant.name} Logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xs uppercase tracking-widest font-black text-amber-600 dark:text-amber-400">
                  Official Salon Studio
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-600 dark:from-white dark:via-slate-100 dark:to-amber-200 bg-clip-text text-transparent">
                  {currentTenant.name}
                </span>
              </h1>
              <p className="mt-2 text-base sm:text-xl font-medium text-amber-700 dark:text-amber-300/90 tracking-wide">
                {currentTenant.tagline}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {currentTenant.description}
            </p>

            {/* Fancy Trust Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-left pt-1">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 shadow-xs backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Zero Wait Time with Slot</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 shadow-xs backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Sanitized Feather Blades</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 shadow-xs backdrop-blur-sm col-span-2 sm:col-span-1">
                <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {currentTenant.openingTime} – {currentTenant.closingTime}
                </span>
              </div>
            </div>

            {/* Quick Action Luxury Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3">
              <button
                onClick={onOpenBooking}
                className="flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm sm:text-base font-black text-slate-950 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-xl shadow-amber-500/20 transition-transform active:scale-95 transform-gpu cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-slate-950" />
                <span>Book VIP Appointment</span>
              </button>

              <a
                href={`https://wa.me/${currentTenant.whatsappNumber}?text=${encodeURIComponent(
                  `Hi ${currentTenant.name}, I would like to book a VIP slot at ${currentTenant.area}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-transform active:scale-95 transform-gpu cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white text-transparent" />
                <span>WhatsApp Booking</span>
              </a>

              <a
                href={`tel:${currentTenant.phone}`}
                className="flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold rounded-xl bg-slate-200 dark:bg-slate-800/90 hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Call Salon</span>
              </a>
            </div>
          </div>

          {/* Right Visual Image Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/30 bg-slate-950 aspect-[4/3] sm:aspect-[16/12]">
                <img
                  src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80"
                  alt={`${currentTenant.name} Kalyan East`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 transform-gpu"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent flex items-end p-5 sm:p-6">
                  <div className="text-white space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-500 text-slate-950">
                      <Zap className="w-3 h-3" /> Live Salon Studio
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      The Gentleman&apos;s Sanctuary on Poona Link Road
                    </h3>
                    <p className="text-xs text-slate-300">
                      Air-conditioned styling lounge, sterilized tools, and master barbers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating luxury badge */}
              <div className="absolute -bottom-4 -left-3 sm:-bottom-5 sm:-left-5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 dark:border-amber-500/40 p-3 sm:p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">Starting from ₹70</div>
                  <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">{currentTenant.area} Grooming</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
