'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTenant } from '@/context/TenantContext';
import {
  Phone,
  MessageCircle,
  Calendar,
  MapPin,
  Menu,
  X,
  ShieldCheck,
  Crown,
  Sun,
  Moon,
} from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const { currentTenant, themeMode, toggleThemeMode } = useTenant();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-[41px] z-40 w-full bg-white/95 dark:bg-[#030712]/95 backdrop-blur-md border-b border-slate-200 dark:border-amber-500/20 shadow-md transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="relative w-11 h-11 rounded-2xl overflow-hidden shadow-lg transition-transform group-hover:scale-105 border border-amber-500/40 bg-slate-950 p-1 flex items-center justify-center shrink-0">
            <img src="/logo.png" alt="SmartBarber Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-black text-slate-900 dark:text-white text-base sm:text-lg leading-tight flex items-center gap-1.5">
              <span>{currentTenant.name}</span>
              <Crown className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400/90 flex items-center gap-1 font-semibold">
              <MapPin className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>
                {currentTenant.area}, {currentTenant.city}
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
          <a href="#services" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            Services & Rates
          </a>
          <a href="#gallery" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            Lookbook
          </a>
          <a href="#reviews" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            Reviews
          </a>
          <a href="#contact" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            Hours & Location
          </a>
        </nav>

        {/* Quick Contact & Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleThemeMode}
            className="p-2 rounded-full border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-amber-400 hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer"
            title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme mode"
          >
            {themeMode === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          <a
            href={`tel:${currentTenant.phone}`}
            className="p-2 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-colors cursor-pointer"
            title={`Call ${currentTenant.name}`}
          >
            <Phone className="w-4 h-4" />
          </a>

          <a
            href={`https://wa.me/${currentTenant.whatsappNumber}?text=${encodeURIComponent(
              `Hi ${currentTenant.name}, I would like to inquire about barber services.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/80 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-emerald-500 text-transparent" />
            <span>WhatsApp</span>
          </a>

          <button
            onClick={onOpenBooking}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book VIP</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex sm:hidden items-center gap-2">
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleThemeMode}
            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-amber-400"
            title="Toggle Theme"
          >
            {themeMode === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          <button
            onClick={onOpenBooking}
            className="px-3 py-1.5 text-xs font-black text-slate-950 rounded-lg bg-amber-400 shadow-sm cursor-pointer"
          >
            Book VIP
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-4 pt-2 pb-4 bg-white dark:bg-[#030712] border-b border-slate-200 dark:border-amber-500/20 space-y-3 animate-slide-up">
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={`tel:${currentTenant.phone}`}
              className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-900 rounded-lg text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-800"
            >
              <Phone className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> Call Salon
            </a>
            <a
              href={`https://wa.me/${currentTenant.whatsappNumber}?text=${encodeURIComponent(
                `Hi ${currentTenant.name}, I would like to book a slot.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-lg"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp VIP
            </a>
          </div>

          <div className="flex flex-col gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-900">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-amber-600 dark:hover:text-amber-400"
            >
              Services & Rates
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-amber-600 dark:hover:text-amber-400"
            >
              Lookbook & Haircut Styles
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-amber-600 dark:hover:text-amber-400"
            >
              Client Reviews ({currentTenant.reviewCount})
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-amber-600 dark:hover:text-amber-400"
            >
              Operating Hours & Address
            </a>
            <Link
              href="/rajhair/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Barber Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
