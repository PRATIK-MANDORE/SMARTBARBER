'use client';

import React, { useState } from 'react';
import { useTenant } from '@/context/TenantContext';
import { Service, ServiceCategory } from '@/types';
import ServiceCard from './ServiceCard';
import { formatINR } from '@/utils/currency';
import { Sparkles, Calendar } from 'lucide-react';

interface ServiceSectionProps {
  onOpenBookingWithService?: (serviceId: string) => void;
  onOpenBookingModal: (preselectedIds?: string[]) => void;
}

const CATEGORIES: ('All' | ServiceCategory)[] = [
  'All',
  'Hair',
  'Beard',
  'Combos',
  'Spa & Treatment',
];

export default function ServiceSection({
  onOpenBookingWithService,
  onOpenBookingModal,
}: ServiceSectionProps) {
  const { currentTenant } = useTenant();
  const [selectedCategory, setSelectedCategory] = useState<'All' | ServiceCategory>('All');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  const filteredServices =
    selectedCategory === 'All'
      ? currentTenant.services
      : currentTenant.services.filter((s) => s.category === selectedCategory);

  const toggleSelectService = (service: Service) => {
    setSelectedServiceIds((prev) =>
      prev.includes(service.id)
        ? prev.filter((id) => id !== service.id)
        : [...prev, service.id]
    );
  };

  const selectedServices = currentTenant.services.filter((s) =>
    selectedServiceIds.includes(s.id)
  );
  const totalSelectedPrice = selectedServices.reduce((sum, s) => sum + s.priceINR, 0);
  const totalSelectedDuration = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);

  const handleBookSelected = () => {
    onOpenBookingModal(selectedServiceIds);
  };

  return (
    <section id="services" className="py-14 sm:py-20 bg-slate-50/50 dark:bg-[#030712] text-slate-900 dark:text-white relative transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>Master Service Menu & Rates</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Curated Men&apos;s Grooming Catalog
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Transparent pricing in INR (₹) for {currentTenant.name}. Pick single services or customize your signature package.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-xs'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isSelected={selectedServiceIds.includes(service.id)}
              onToggleSelect={toggleSelectService}
              onDirectBook={(s) => {
                if (onOpenBookingWithService) {
                  onOpenBookingWithService(s.id);
                } else {
                  onOpenBookingModal([s.id]);
                }
              }}
            />
          ))}
        </div>

        {/* Sticky Bottom Multi-Select Floating Bar */}
        {selectedServiceIds.length > 0 && (
          <div className="fixed bottom-5 left-4 right-4 max-w-xl mx-auto z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-900 dark:text-white p-4 rounded-2xl shadow-2xl border border-slate-300 dark:border-amber-500/40 flex items-center justify-between gap-3 animate-slide-up transform-gpu">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 shadow-md">
                {selectedServiceIds.length}
              </span>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {totalSelectedDuration} mins combo total
                </div>
                <div className="text-lg font-black text-amber-600 dark:text-amber-400">
                  {formatINR(totalSelectedPrice)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedServiceIds([])}
                className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                Clear
              </button>
              <button
                onClick={handleBookSelected}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-black rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book This Combo</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
