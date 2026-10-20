'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTenant } from '@/context/TenantContext';
import {
  Store,
  LayoutDashboard,
  RotateCcw,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';

export default function DemoTenantSwitcher() {
  const { currentTenant, resetDemoData, themeMode, toggleThemeMode } = useTenant();
  const pathname = usePathname();
  const [resetNotice, setResetNotice] = useState(false);

  // Check if current page is admin
  const isAdminView = pathname.includes('/admin');

  const handleReset = () => {
    if (window.confirm('Reset demo bookings and catalog back to default?')) {
      resetDemoData();
      setResetNotice(true);
      setTimeout(() => setResetNotice(false), 2000);
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-slate-950/95 text-slate-100 border-b border-amber-500/20 shadow-md backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2">
        <div className="flex items-center justify-between gap-2">
          {/* Left Brand Identity */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="flex items-center gap-2 font-black tracking-tight text-sm text-white hover:opacity-90 transition-opacity"
            >
              <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-900 border border-amber-500/40 p-0.5 flex items-center justify-center shrink-0">
                <img
                  src="/logo.png"
                  alt="SmartBarber"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="bg-gradient-to-r from-white via-slate-200 to-amber-300 bg-clip-text text-transparent hidden xs:inline">
                SmartBarber
              </span>
            </Link>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold tracking-wide rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>
                {currentTenant.name} • {currentTenant.area}, {currentTenant.city}
              </span>
            </span>
          </div>

          {/* Center Info Pill */}
          <div className="hidden md:flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Open Today: {currentTenant.openingTime} – {currentTenant.closingTime}
            </span>
          </div>

          {/* Right Action Switchers & Theme Mode Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={toggleThemeMode}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 transition-all cursor-pointer shadow-xs active:scale-95"
              title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {themeMode === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-300" />
                  <span className="hidden sm:inline">Dark Mode</span>
                </>
              )}
            </button>

            {isAdminView ? (
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm"
                title="View Customer Booking Page"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Client View</span>
              </Link>
            ) : (
              <Link
                href="/rajhair/admin"
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 transition-all shadow-sm"
                title="Open Barber Management Dashboard"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Barber Admin</span>
              </Link>
            )}

            <button
              onClick={handleReset}
              className="p-1 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {resetNotice && (
          <div className="text-[11px] text-center text-amber-300 py-1 font-semibold animate-fade-in">
            Demo data has been restored to {currentTenant.name} defaults!
          </div>
        )}
      </div>
    </div>
  );
}
