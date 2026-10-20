'use client';

import React from 'react';
import Link from 'next/link';
import { useTenant } from '@/context/TenantContext';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Navigation,
  ShieldCheck,
  Heart,
} from 'lucide-react';

export default function FooterSection() {
  const { currentTenant } = useTenant();

  return (
    <footer id="contact" className="bg-slate-900 dark:bg-[#02050c] text-slate-300 pt-12 pb-8 border-t border-slate-800 transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
          {/* Shop Details & Bio */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-md border border-slate-700 bg-slate-950 p-1 flex items-center justify-center shrink-0">
                <img src="/logo.png" alt={`${currentTenant.name} Logo`} className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">{currentTenant.name}</h3>
                <p className="text-xs text-amber-400 font-semibold">
                  {currentTenant.area}, {currentTenant.city}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {currentTenant.description}
            </p>

            {/* Quick Contact Buttons */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href={`tel:${currentTenant.phone}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call Shop</span>
              </a>
              <a
                href={`https://wa.me/${currentTenant.whatsappNumber}?text=${encodeURIComponent(
                  `Hi ${currentTenant.name}, I would like to inquire about booking a slot.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
              <Link
                href="/rajhair/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Owner Portal</span>
              </Link>
            </div>
          </div>

          {/* Operating Hours & Address */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" /> Operating Hours & Address
            </h4>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="font-medium">Working Days:</span>
                <span className="font-semibold text-white">{currentTenant.workingDays}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="font-medium">Daily Timing:</span>
                <span className="font-semibold text-amber-400">
                  {currentTenant.openingTime} – {currentTenant.closingTime}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Salon Address</div>
                  <div className="text-slate-300 mt-0.5 leading-relaxed font-medium">
                    {currentTenant.fullAddress}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Embedded Map / Direction */}
          <div className="lg:col-span-4 space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Navigation className="w-4 h-4 text-amber-400" /> Location Map
            </h4>

            <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-800 h-44 shadow-inner">
              <iframe
                title={`${currentTenant.name} Location`}
                src={currentTenant.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-90 hover:opacity-100 transition-opacity"
              />
              <div className="absolute bottom-2 right-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${currentTenant.name} ${currentTenant.fullAddress}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 text-[11px] font-bold bg-white text-slate-900 rounded-md shadow-md hover:bg-slate-100 transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <Navigation className="w-3 h-3 text-blue-600" /> Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {currentTenant.name}. Built with{' '}
            <span className="text-white font-semibold">SmartBarber</span> platform.
          </div>
          <div className="flex items-center gap-1">
            <span>Tailored for Kalyan East, Maharashtra</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
