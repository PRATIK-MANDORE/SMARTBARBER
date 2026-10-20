'use client';

import React, { useState, useEffect } from 'react';
import { useTenant } from '@/context/TenantContext';
import { Service, Appointment } from '@/types';
import { TIME_SLOTS, getAvailableDates, getBookedSlotsForDate } from '@/utils/slots';
import { formatINR } from '@/utils/currency';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  FileText,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  MessageCircle,
  Crown,
  Check,
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceIds?: string[];
}

export default function BookingModal({
  isOpen,
  onClose,
  preselectedServiceIds = [],
}: BookingModalProps) {
  const { currentTenant, appointments, createBooking } = useTenant();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const availableDates = getAvailableDates(7);

  // Initialize preselected services and default date
  useEffect(() => {
    if (isOpen) {
      if (preselectedServiceIds.length > 0) {
        setSelectedServiceIds(preselectedServiceIds);
      } else if (currentTenant.services.length > 0 && selectedServiceIds.length === 0) {
        const popular = currentTenant.services.find((s) => s.isPopular) || currentTenant.services[0];
        setSelectedServiceIds([popular.id]);
      }

      if (!selectedDate && availableDates.length > 0) {
        setSelectedDate(availableDates[0].dateString);
      }
      setErrorMessage('');
    }
  }, [isOpen, preselectedServiceIds, currentTenant]);

  if (!isOpen) return null;

  const toggleService = (serviceId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
    setErrorMessage('');
  };

  const selectedServices = currentTenant.services.filter((s) =>
    selectedServiceIds.includes(s.id)
  );
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.priceINR, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);

  const bookedSlots = getBookedSlotsForDate(currentTenant.slug, selectedDate, appointments);

  // Validation
  const handleProceedToStep2 = () => {
    if (selectedServiceIds.length === 0) {
      setErrorMessage('Please select at least one service to proceed.');
      return;
    }
    setErrorMessage('');
    setStep(2);
  };

  const handleProceedToStep3 = () => {
    if (!selectedDate) {
      setErrorMessage('Please pick an appointment date.');
      return;
    }
    if (!selectedTimeSlot) {
      setErrorMessage('Please choose a time slot.');
      return;
    }
    setErrorMessage('');
    setStep(3);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Call Context to record appointment
    const result = createBooking(
      {
        selectedServiceIds,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        customerNotes: customerNotes.trim(),
      },
      currentTenant.slug
    );

    if (!result.success || !result.appointment) {
      setErrorMessage(result.error || 'Failed to complete booking. Please try again.');
      return;
    }

    setConfirmedBooking(result.appointment);
    setErrorMessage('');
    setStep(4);
  };

  const handleResetAndClose = () => {
    setStep(1);
    setSelectedServiceIds([]);
    setSelectedTimeSlot('');
    setCustomerName('');
    setCustomerPhone('');
    setCustomerNotes('');
    setConfirmedBooking(null);
    setErrorMessage('');
    onClose();
  };

  // WhatsApp Pre-filled message generator
  const getWhatsAppBookingUrl = (appt: Appointment) => {
    const servicesText = appt.serviceNames.join(', ');
    const msg = `Hi ${currentTenant.name}, I booked a VIP appointment for ${servicesText} on ${appt.date} at ${appt.timeSlot}. Name: ${appt.customerName}. Booking ID: ${appt.id}.`;
    return `https://wa.me/${currentTenant.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0b101e] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-amber-500/40 overflow-hidden flex flex-col max-h-[92vh] transition-colors duration-150">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md border border-amber-500/40 bg-slate-950 p-1 flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="SmartBarber Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Book VIP at {currentTenant.name}</span>
                <Crown className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              </div>
              <div className="text-xs text-amber-600 dark:text-amber-400/90 font-semibold">
                {currentTenant.area}, {currentTenant.city}
              </div>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Indicator */}
        <div className="bg-slate-100/90 dark:bg-slate-950 px-5 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-amber-600 dark:text-amber-400' : ''}`}>
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                step >= 1 ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              1
            </span>
            <span className="hidden sm:inline">Services</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-amber-600 dark:text-amber-400' : ''}`}>
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                step >= 2 ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              2
            </span>
            <span className="hidden sm:inline">Date & Time</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-amber-600 dark:text-amber-400' : ''}`}>
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                step >= 3 ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              3
            </span>
            <span className="hidden sm:inline">Details</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
          <div className={`flex items-center gap-1.5 ${step >= 4 ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                step === 4 ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              ✓
            </span>
            <span className="hidden sm:inline">VIP Pass</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-500/40 text-rose-700 dark:text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Modal Body with Fast Native Scroll */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: Select Service */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Select Services (Single or Custom Combo)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select single haircuts or bundle with beard sculpt and scalp therapies.
                </p>
              </div>

              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {currentTenant.services.map((service) => {
                  const isChecked = selectedServiceIds.includes(service.id);
                  return (
                    <div
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`cursor-pointer p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        isChecked
                          ? 'border-amber-400 bg-amber-500/10 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 transition-colors ${
                            isChecked
                              ? 'bg-amber-400 text-slate-950 font-bold'
                              : 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {service.name}
                            </span>
                            <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                              {service.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {service.description}
                          </p>
                          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-500 dark:text-amber-400" /> {service.durationMinutes} mins
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-base font-black text-amber-600 dark:text-amber-400">
                          {formatINR(service.priceINR)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Step 1 Total Summary */}
              {selectedServices.length > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-amber-500/30 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {selectedServices.length} service(s) selected
                    </span>
                    <span className="text-slate-500 ml-1.5">• ~{totalDuration} mins</span>
                  </div>
                  <div className="text-base font-black text-amber-600 dark:text-amber-400">
                    Total: {formatINR(totalPrice)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Pick Date & Time Slot */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Date selection */}
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2">
                  1. Choose Appointment Date
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {availableDates.map((item) => {
                    const isSelected = selectedDate === item.dateString;
                    return (
                      <button
                        key={item.dateString}
                        onClick={() => {
                          setSelectedDate(item.dateString);
                          setSelectedTimeSlot('');
                          setErrorMessage('');
                        }}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md font-bold'
                            : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="text-[10px] font-extrabold uppercase opacity-80">
                          {item.dayName}
                        </div>
                        <div className="text-base font-black leading-tight mt-0.5">
                          {item.dayNumber}
                        </div>
                        <div className="text-[10px] opacity-75">{item.monthName}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time slot selection with Collision Detection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    2. Select Time Slot (30-min Intervals)
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Available
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500" /> Booked
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[220px] overflow-y-auto pr-1">
                  {TIME_SLOTS.map((slot) => {
                    const isBooked = bookedSlots.includes(slot);
                    const isSelected = selectedTimeSlot === slot;

                    return (
                      <button
                        key={slot}
                        disabled={isBooked}
                        onClick={() => {
                          setSelectedTimeSlot(slot);
                          setErrorMessage('');
                        }}
                        className={`py-2 px-2 rounded-lg text-xs font-bold text-center border transition-all cursor-pointer ${
                          isBooked
                            ? 'bg-slate-100 dark:bg-slate-950 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-900 cursor-not-allowed line-through opacity-50'
                            : isSelected
                            ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm font-black'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Slot preview */}
              {selectedTimeSlot && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
                  <span className="font-medium">
                    Reserved for: <strong>{selectedDate}</strong> at{' '}
                    <strong>{selectedTimeSlot}</strong>
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-black">Slot Guaranteed</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Customer Details */}
          {step === 3 && (
            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">VIP Guest Contact Details</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  We generate your WhatsApp booking pass with this information.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Indian Mobile Number *
                  </label>
                  <div className="relative">
                    <span className="text-xs font-bold text-slate-500 absolute left-3 top-2.5">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="98765 43210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-12 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Special Style Requests or Notes (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <textarea
                      rows={2}
                      placeholder="e.g. Low drop fade with textured crop on top"
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary box */}
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Selected Services:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">
                    {selectedServices.map((s) => s.name).join(', ')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Date & Slot:</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {selectedDate} at {selectedTimeSlot}
                  </span>
                </div>
                <div className="flex justify-between text-slate-800 dark:text-slate-300 pt-1 border-t border-slate-200 dark:border-slate-800">
                  <span className="font-bold">Total Estimated:</span>
                  <span className="font-black text-amber-600 dark:text-amber-400 text-sm">{formatINR(totalPrice)}</span>
                </div>
              </div>
            </form>
          )}

          {/* STEP 4: Instant Confirmation VIP Pass */}
          {step === 4 && confirmedBooking && (
            <div className="space-y-6 text-center animate-fade-in py-2">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-500 dark:text-amber-400 flex items-center justify-center border border-amber-400/40 shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 mb-2">
                  VIP Appointment Confirmed
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Welcome to {currentTenant.name}!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  Your chair is reserved at {currentTenant.fullAddress}. Please show your VIP Token ID upon arrival.
                </p>
              </div>

              {/* VIP Ticket Pass Card */}
              <div className="max-w-md mx-auto bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-amber-500/40 p-4 text-left space-y-3 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                      VIP Token ID
                    </div>
                    <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                      {confirmedBooking.id}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Price at Salon
                    </div>
                    <div className="text-lg font-black text-amber-600 dark:text-amber-400">
                      {formatINR(confirmedBooking.totalPrice)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Guest</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {confirmedBooking.customerName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Phone</span>
                    <span className="font-mono text-slate-900 dark:text-white">
                      +91 {confirmedBooking.customerPhone}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Date</span>
                    <span className="font-bold text-slate-900 dark:text-white">{confirmedBooking.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Time Slot</span>
                    <span className="font-black text-amber-600 dark:text-amber-400">
                      {confirmedBooking.timeSlot}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <span className="text-slate-500 block text-[11px]">Services Booked</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {confirmedBooking.serviceNames.join(' + ')} (~
                    {confirmedBooking.totalDurationMinutes} mins)
                  </span>
                </div>
              </div>

              {/* Send to WhatsApp Pre-filled Action */}
              <div className="space-y-2 max-w-md mx-auto">
                <a
                  href={getWhatsAppBookingUrl(confirmedBooking)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl transition-transform active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-transparent" />
                  <span>Send Confirmation to Salon WhatsApp</span>
                </a>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Sends token directly to master barber for immediate seat preparation.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-3">
          {step > 1 && step < 4 && (
            <button
              onClick={() => {
                setErrorMessage('');
                setStep((prev) => (prev - 1) as 1 | 2 | 3);
              }}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}

          {step === 1 && (
            <div className="ml-auto">
              <button
                onClick={handleProceedToStep2}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md transition-all cursor-pointer"
              >
                <span>Select Date & Slot</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="ml-auto">
              <button
                onClick={handleProceedToStep3}
                disabled={!selectedTimeSlot}
                className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black text-slate-950 shadow-md transition-all cursor-pointer ${
                  selectedTimeSlot
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400'
                    : 'opacity-40 cursor-not-allowed bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span>Guest Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="ml-auto">
              <button
                onClick={handleConfirmBooking}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Lock VIP Appointment</span>
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="w-full flex items-center justify-between">
              <button
                onClick={() => {
                  setStep(1);
                  setSelectedServiceIds([]);
                  setSelectedTimeSlot('');
                  setConfirmedBooking(null);
                }}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                + Book Another VIP Slot
              </button>
              <button
                onClick={handleResetAndClose}
                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 cursor-pointer"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
