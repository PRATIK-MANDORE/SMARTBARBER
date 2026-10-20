'use client';

import React, { useState } from 'react';
import { useTenant } from '@/context/TenantContext';
import { Camera, Eye } from 'lucide-react';

export default function GallerySection() {
  const { currentTenant } = useTenant();
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [activePreview, setActivePreview] = useState<string | null>(null);

  const categories = ['All', 'Haircut', 'Beard', 'Shop Interior'];

  const filteredItems =
    activeFilter === 'All'
      ? currentTenant.gallery
      : currentTenant.gallery.filter((item) => item.category === activeFilter);

  return (
    <section id="gallery" className="py-14 sm:py-20 bg-slate-100/60 dark:bg-[#070b14] border-t border-b border-slate-200 dark:border-amber-500/20 text-slate-900 dark:text-white transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 mb-3 shadow-xs">
            <Camera className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>Master Craftsman Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            {currentTenant.area} Lookbook & Salon Atmosphere
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Real clients, precision fades, crisp beard lines, and our sanitized Poona Link Road studio.
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === cat
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePreview(item.imageUrl)}
              className="group relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 hover:border-amber-400/50 transition-all duration-200 bg-slate-950 aspect-square cursor-pointer transform-gpu"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 transform-gpu"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                  {item.category}
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5 leading-snug">{item.title}</h4>
              </div>

              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/70 backdrop-blur-md text-amber-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Modal Lightbox Preview */}
        {activePreview && (
          <div
            onClick={() => setActivePreview(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer animate-fade-in"
          >
            <div className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30">
              <img
                src={activePreview}
                alt="Enlarged Portfolio View"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
