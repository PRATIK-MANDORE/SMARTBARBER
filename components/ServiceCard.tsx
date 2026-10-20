'use client';

import React from 'react';
import { Service } from '@/types';
import { useTenant } from '@/context/TenantContext';
import { formatINR } from '@/utils/currency';
import { Clock, Check, Plus, Crown } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  isSelected?: boolean;
  onToggleSelect?: (service: Service) => void;
  onDirectBook?: (service: Service) => void;
}

export default function ServiceCard({
  service,
  isSelected = false,
  onToggleSelect,
  onDirectBook,
}: ServiceCardProps) {
  const { currentTenant } = useTenant();

  return (
    <div
      className={`group relative rounded-2xl p-5 border transition-all duration-150 flex flex-col justify-between transform-gpu ${
        isSelected
          ? 'bg-amber-500/5 dark:bg-slate-900/90 shadow-xl ring-2 ring-amber-400 border-amber-400'
          : 'bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-500/40 shadow-sm dark:shadow-md'
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/90 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700/80">
            {service.category}
          </span>
          {service.isPopular && (
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-300 bg-amber-500/10 border border-amber-500/40 px-2 py-0.5 rounded-full shadow-xs">
              <Crown className="w-3 h-3 text-amber-500 dark:text-amber-400" /> VIP Choice
            </span>
          )}
        </div>

        {/* Service Name */}
        <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
          {service.name}
        </h3>

        {/* Description */}
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
          {service.description}
        </p>
      </div>

      {/* Footer Info: Duration & Price & Button */}
      <div className="mt-5 pt-3.5 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>{service.durationMinutes} mins</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
            {formatINR(service.priceINR)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onToggleSelect && (
            <button
              onClick={() => onToggleSelect(service)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
              }`}
            >
              {isSelected ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Added
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" /> Select
                </>
              )}
            </button>
          )}

          {onDirectBook && (
            <button
              onClick={() => onDirectBook(service)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              Book VIP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
