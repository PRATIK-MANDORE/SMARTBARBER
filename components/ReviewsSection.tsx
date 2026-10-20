'use client';

import React from 'react';
import { useTenant } from '@/context/TenantContext';
import { Star, CheckCircle, Crown } from 'lucide-react';

export default function ReviewsSection() {
  const { currentTenant } = useTenant();

  return (
    <section id="reviews" className="py-14 sm:py-20 bg-white dark:bg-[#030712] text-slate-900 dark:text-white border-b border-slate-200 dark:border-amber-500/20 transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 mb-2.5 shadow-xs">
              <Crown className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>100% Verified Clients</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Client Testimonials & Feedback
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Honest ratings from gentlemen visiting our Poona Link Road studio in {currentTenant.area}.
            </p>
          </div>

          {/* Rating summary box */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200 dark:border-amber-500/30 shrink-0 shadow-md">
            <div className="text-3xl sm:text-4xl font-black text-amber-500 dark:text-amber-400 leading-none">
              {currentTenant.rating.toFixed(1)}
            </div>
            <div>
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                Based on {currentTenant.reviewCount} verified reviews
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {currentTenant.reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 shadow-sm dark:shadow-md transition-all duration-150 flex flex-col justify-between"
            >
              <div>
                {/* Star rating & Date */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < rev.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-slate-300 dark:fill-slate-800 text-slate-300 dark:text-slate-800'
                    }`}
                  />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-500">{rev.date}</span>
                </div>

                {/* Review Comment */}
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              {/* Author info & service used */}
              <div className="mt-5 pt-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{rev.authorName}</span>
                    {rev.verified && (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 fill-emerald-500/20" />
                    )}
                  </div>
                  <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                    {rev.serviceUsed}
                  </div>
                </div>

                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xs font-black text-slate-950 uppercase shadow-xs">
                  {rev.authorName.charAt(0)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
