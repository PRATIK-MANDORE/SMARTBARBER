'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTenant } from '@/context/TenantContext';
import { Appointment, AppointmentStatus, Service, ServiceCategory } from '@/types';
import { formatINR } from '@/utils/currency';
import { TIME_SLOTS } from '@/utils/slots';
import { getRelativeDateString } from '@/data/sampleTenants';
import {
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  DollarSign,
  TrendingUp,
  Users,
  Store,
  Settings,
  Phone,
  MessageCircle,
  Save,
  RotateCcw,
  Sparkles,
  Scissors,
  UserCheck,
  Check,
  Ban,
  UserX,
  ExternalLink,
} from 'lucide-react';

export default function AdminDashboard() {
  const {
    currentTenant,
    appointments,
    updateAppointmentStatus,
    addService,
    updateService,
    deleteService,
    updateTenantProfile,
    createBooking,
  } = useTenant();

  const [activeTab, setActiveTab] = useState<'queue' | 'services' | 'profile'>('queue');
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all');
  const [dateFilter, setDateFilter] = useState<string>(getRelativeDateString(0)); // default today

  // Walk-In Booking modal
  const [walkInModalOpen, setWalkInModalOpen] = useState(false);
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInServiceIds, setWalkInServiceIds] = useState<string[]>([]);
  const [walkInSlot, setWalkInSlot] = useState(TIME_SLOTS[0]);
  const [walkInError, setWalkInError] = useState('');

  // Service Edit / Create modal
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceName, setServiceName] = useState('');
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory>('Hair');
  const [serviceDuration, setServiceDuration] = useState(30);
  const [servicePrice, setServicePrice] = useState(100);
  const [serviceDesc, setServiceDesc] = useState('');
  const [servicePopular, setServicePopular] = useState(false);

  // Profile Edit state
  const [shopName, setShopName] = useState(currentTenant.name);
  const [shopTagline, setShopTagline] = useState(currentTenant.tagline);
  const [shopPhone, setShopPhone] = useState(currentTenant.phone);
  const [shopWhatsapp, setShopWhatsapp] = useState(currentTenant.whatsappNumber);
  const [shopAddress, setShopAddress] = useState(currentTenant.fullAddress);
  const [shopOpenTime, setShopOpenTime] = useState(currentTenant.openingTime);
  const [shopCloseTime, setShopCloseTime] = useState(currentTenant.closingTime);
  const [selectedPrimaryColor, setSelectedPrimaryColor] = useState(currentTenant.theme.primary);
  const [profileSavedNotice, setProfileSavedNotice] = useState(false);

  // Sync state if currentTenant changes (e.g. from switcher)
  React.useEffect(() => {
    setShopName(currentTenant.name);
    setShopTagline(currentTenant.tagline);
    setShopPhone(currentTenant.phone);
    setShopWhatsapp(currentTenant.whatsappNumber);
    setShopAddress(currentTenant.fullAddress);
    setShopOpenTime(currentTenant.openingTime);
    setShopCloseTime(currentTenant.closingTime);
    setSelectedPrimaryColor(currentTenant.theme.primary);
  }, [currentTenant]);

  // Appointments for this tenant
  const tenantAppointments = appointments.filter((a) => a.tenantSlug === currentTenant.slug);

  // Metrics for selected date (e.g. Today)
  const dateAppointments = tenantAppointments.filter((a) => a.date === dateFilter);
  const todayTotalCount = dateAppointments.length;
  const todayCompletedCount = dateAppointments.filter((a) => a.status === 'completed').length;
  const todayRemainingCount = dateAppointments.filter(
    (a) => a.status === 'pending' || a.status === 'confirmed'
  ).length;
  const todayCompletedRevenue = dateAppointments
    .filter((a) => a.status === 'completed')
    .reduce((sum, a) => sum + a.totalPrice, 0);
  const todayEstimatedTotalRevenue = dateAppointments
    .filter((a) => a.status !== 'cancelled' && a.status !== 'no-show')
    .reduce((sum, a) => sum + a.totalPrice, 0);

  // Filtered appointments for table
  const displayedAppointments = tenantAppointments
    .filter((a) => (dateFilter ? a.date === dateFilter : true))
    .filter((a) => (statusFilter === 'all' ? true : a.status === statusFilter))
    .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));

  // Handle Walk-In Submission
  const handleWalkInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName.trim()) {
      setWalkInError('Please enter client name');
      return;
    }
    if (walkInServiceIds.length === 0) {
      setWalkInError('Please select at least one service');
      return;
    }

    const cleanPhone = walkInPhone.replace(/\D/g, '') || '9999900000';
    const result = createBooking(
      {
        selectedServiceIds: walkInServiceIds,
        date: dateFilter,
        timeSlot: walkInSlot,
        customerName: walkInName.trim(),
        customerPhone: cleanPhone,
        customerNotes: 'Walk-in client added by barber',
      },
      currentTenant.slug
    );

    if (!result.success) {
      setWalkInError(result.error || 'Failed to add walk-in');
      return;
    }

    // Auto mark as confirmed
    if (result.appointment) {
      updateAppointmentStatus(result.appointment.id, 'confirmed');
    }

    setWalkInName('');
    setWalkInPhone('');
    setWalkInServiceIds([]);
    setWalkInError('');
    setWalkInModalOpen(false);
  };

  // Handle Service Save / Create
  const handleOpenNewServiceModal = () => {
    setEditingService(null);
    setServiceName('');
    setServiceCategory('Hair');
    setServiceDuration(30);
    setServicePrice(100);
    setServiceDesc('');
    setServicePopular(false);
    setServiceModalOpen(true);
  };

  const handleOpenEditServiceModal = (s: Service) => {
    setEditingService(s);
    setServiceName(s.name);
    setServiceCategory(s.category);
    setServiceDuration(s.durationMinutes);
    setServicePrice(s.priceINR);
    setServiceDesc(s.description);
    setServicePopular(!!s.isPopular);
    setServiceModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim()) return;

    if (editingService) {
      updateService(currentTenant.slug, {
        ...editingService,
        name: serviceName.trim(),
        category: serviceCategory,
        durationMinutes: Number(serviceDuration),
        priceINR: Number(servicePrice),
        description: serviceDesc.trim(),
        isPopular: servicePopular,
      });
    } else {
      addService(currentTenant.slug, {
        name: serviceName.trim(),
        category: serviceCategory,
        durationMinutes: Number(serviceDuration),
        priceINR: Number(servicePrice),
        description: serviceDesc.trim(),
        isPopular: servicePopular,
      });
    }
    setServiceModalOpen(false);
  };

  // Handle Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateTenantProfile(currentTenant.slug, {
      name: shopName.trim(),
      tagline: shopTagline.trim(),
      phone: shopPhone.trim(),
      whatsappNumber: shopWhatsapp.trim(),
      fullAddress: shopAddress.trim(),
      openingTime: shopOpenTime,
      closingTime: shopCloseTime,
      theme: {
        ...currentTenant.theme,
        primary: selectedPrimaryColor,
        primaryHover: selectedPrimaryColor,
      },
    });
    setProfileSavedNotice(true);
    setTimeout(() => setProfileSavedNotice(false), 2500);
  };

  const PRESET_COLORS = [
    { name: 'Royal Navy', hex: '#1e3a8a' },
    { name: 'Amber Bronze', hex: '#d97706' },
    { name: 'Crimson Slate', hex: '#991b1b' },
    { name: 'Forest Emerald', hex: '#059669' },
    { name: 'Charcoal Black', hex: '#18181b' },
    { name: 'Royal Purple', hex: '#7c3aed' },
  ];

  return (
    <div className="min-h-screen bg-slate-100/80 dark:bg-[#030712] pb-16 transition-colors duration-150">
      {/* Top Banner with Shop details & Customer link */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md border border-slate-700 bg-slate-950 p-1 flex items-center justify-center shrink-0 mt-0.5">
                <img src="/logo.png" alt="SmartBarber Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  <Store className="w-3.5 h-3.5" />
                  <span>Barber Business Management System</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black mt-1 flex items-center gap-3">
                  <span>{currentTenant.name}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                    {currentTenant.city}
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Live queue operations, walk-in booking, price catalog & brand settings.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-sm transition-all"
              >
                <span>View Customer Page</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'queue'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Queue & Appointments</span>
              <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-slate-900/30">
                {dateAppointments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'services'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Scissors className="w-4 h-4" />
              <span>Services & Rates</span>
              <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-slate-900/30">
                {currentTenant.services.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'profile'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Shop Profile & Theme</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* ===================== TAB 1: QUEUE & SCHEDULING ===================== */}
        {activeTab === 'queue' && (
          <div className="space-y-6">
            {/* Top Metrics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>Today Appointments</span>
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  {todayTotalCount}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Booked for this day</div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>Completed Clients</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-2">
                  {todayCompletedCount}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Chair finished</div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>Remaining in Queue</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-700 mt-2">
                  {todayRemainingCount}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Pending & confirmed</div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>Estimated Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  {formatINR(todayEstimatedTotalRevenue)}
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                  {formatINR(todayCompletedRevenue)} collected
                </div>
              </div>
            </div>

            {/* Filter & Action Row */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Date picker & Status filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Date:</span>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-medium focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    onClick={() => setDateFilter(getRelativeDateString(0))}
                    className="text-[11px] text-amber-700 hover:underline font-semibold"
                  >
                    Today
                  </button>
                </div>

                <div className="h-4 w-px bg-slate-200 hidden md:block" />

                <div className="flex items-center gap-1 overflow-x-auto text-xs">
                  {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-lg capitalize font-semibold transition-all ${
                        statusFilter === st
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Walk-in Button */}
              <button
                onClick={() => {
                  setWalkInServiceIds(currentTenant.services.slice(0, 1).map((s) => s.id));
                  setWalkInModalOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:brightness-110 active:scale-95 transition-all"
                style={{ backgroundColor: currentTenant.theme.primary }}
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Walk-In Client</span>
              </button>
            </div>

            {/* Live Queue Table */}
            <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">
                  Appointment Queue ({displayedAppointments.length})
                </h3>
                <span className="text-xs text-slate-500">
                  Click action pills to update status instantly
                </span>
              </div>

              {displayedAppointments.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  <UserCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  No appointments found for date {dateFilter} with filter &quot;{statusFilter}&quot;.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">Time</th>
                        <th className="py-3 px-4">Client</th>
                        <th className="py-3 px-4">Services</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {displayedAppointments.map((appt) => {
                        const statusColors: Record<AppointmentStatus, string> = {
                          pending: 'bg-amber-100 text-amber-900 border-amber-300',
                          confirmed: 'bg-blue-100 text-blue-900 border-blue-300',
                          completed: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                          cancelled: 'bg-rose-100 text-rose-900 border-rose-300',
                          'no-show': 'bg-slate-200 text-slate-700 border-slate-300',
                        };

                        return (
                          <tr key={appt.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span>{appt.timeSlot}</span>
                              </div>
                              <div className="text-[10px] font-mono text-slate-400">{appt.id}</div>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-900">{appt.customerName}</div>
                              <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                                <Phone className="w-3 h-3 text-slate-400" />
                                <a
                                  href={`tel:${appt.customerPhone}`}
                                  className="hover:underline text-slate-700"
                                >
                                  +91 {appt.customerPhone}
                                </a>
                              </div>
                              {appt.customerNotes && (
                                <div className="text-[10px] text-slate-400 italic line-clamp-1 mt-0.5">
                                  &quot;{appt.customerNotes}&quot;
                                </div>
                              )}
                            </td>

                            <td className="py-3.5 px-4 text-slate-700">
                              <div className="font-medium">{appt.serviceNames.join(' + ')}</div>
                              <div className="text-[10px] text-slate-400">
                                ~{appt.totalDurationMinutes} mins
                              </div>
                            </td>

                            <td className="py-3.5 px-4 font-black text-slate-900 whitespace-nowrap">
                              {formatINR(appt.totalPrice)}
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                                  statusColors[appt.status]
                                }`}
                              >
                                {appt.status}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {appt.status !== 'confirmed' && appt.status !== 'completed' && (
                                  <button
                                    onClick={() => updateAppointmentStatus(appt.id, 'confirmed')}
                                    className="px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[11px] border border-blue-200"
                                    title="Confirm appointment"
                                  >
                                    Confirm
                                  </button>
                                )}

                                {appt.status !== 'completed' && (
                                  <button
                                    onClick={() => updateAppointmentStatus(appt.id, 'completed')}
                                    className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] border border-emerald-200"
                                    title="Mark completed"
                                  >
                                    Complete
                                  </button>
                                )}

                                {appt.status !== 'cancelled' && (
                                  <button
                                    onClick={() => updateAppointmentStatus(appt.id, 'cancelled')}
                                    className="px-2 py-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-[11px] border border-rose-200"
                                    title="Cancel appointment"
                                  >
                                    Cancel
                                  </button>
                                )}

                                {appt.status !== 'no-show' && appt.status !== 'completed' && (
                                  <button
                                    onClick={() => updateAppointmentStatus(appt.id, 'no-show')}
                                    className="px-2 py-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium text-[11px]"
                                    title="Mark client as no-show"
                                  >
                                    No-Show
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== TAB 2: SERVICE MANAGEMENT ===================== */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Salon Service Catalog</h3>
                <p className="text-xs text-slate-500">
                  Manage haircuts, beard grooming, facial spa packages and INR rates.
                </p>
              </div>

              <button
                onClick={handleOpenNewServiceModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:brightness-110"
                style={{ backgroundColor: currentTenant.theme.primary }}
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentTenant.services.map((srv) => (
                <div
                  key={srv.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {srv.category}
                      </span>
                      {srv.isPopular && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                          ★ Popular
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">{srv.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400">{srv.durationMinutes} mins</div>
                      <div className="text-base font-black text-slate-900">
                        {formatINR(srv.priceINR)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditServiceModal(srv)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit service"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete service "${srv.name}"?`)) {
                            deleteService(currentTenant.slug, srv.id);
                          }
                        }}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 3: BUSINESS PROFILE & THEME ===================== */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Barbershop Profile & Branding</h3>
                <p className="text-xs text-slate-500">
                  Update contact numbers, working hours, and shop theme color in real-time.
                </p>
              </div>

              {profileSavedNotice && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Profile and theme settings successfully saved and applied!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Barbershop Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Shop Tagline *
                    </label>
                    <input
                      type="text"
                      required
                      value={shopTagline}
                      onChange={(e) => setShopTagline(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Customer Calling Phone *
                    </label>
                    <input
                      type="text"
                      required
                      value={shopPhone}
                      onChange={(e) => setShopPhone(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      WhatsApp Booking Number (without +) *
                    </label>
                    <input
                      type="text"
                      required
                      value={shopWhatsapp}
                      onChange={(e) => setShopWhatsapp(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Opening Time
                    </label>
                    <input
                      type="text"
                      value={shopOpenTime}
                      onChange={(e) => setShopOpenTime(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Closing Time
                    </label>
                    <input
                      type="text"
                      value={shopCloseTime}
                      onChange={(e) => setShopCloseTime(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Street Address
                  </label>
                  <textarea
                    rows={2}
                    value={shopAddress}
                    onChange={(e) => setShopAddress(e.target.value)}
                    className="w-full p-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Live Brand Primary Color Picker */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Brand Primary Color (Live Theme Customizer)
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    {PRESET_COLORS.map((col) => (
                      <button
                        type="button"
                        key={col.hex}
                        onClick={() => setSelectedPrimaryColor(col.hex)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                          selectedPrimaryColor.toLowerCase() === col.hex.toLowerCase()
                            ? 'ring-2 ring-amber-400 border-slate-900 bg-slate-50'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.name}</span>
                      </button>
                    ))}

                    <div className="flex items-center gap-2 px-3 py-1 rounded-xl border border-slate-200 bg-white">
                      <span className="text-xs text-slate-500">Custom:</span>
                      <input
                        type="color"
                        value={selectedPrimaryColor}
                        onChange={(e) => setSelectedPrimaryColor(e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                      />
                      <span className="font-mono text-xs">{selectedPrimaryColor}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Saving dynamically updates buttons, accents, and badges on the customer landing
                    page!
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md hover:brightness-110 active:scale-95 transition-all"
                    style={{ backgroundColor: selectedPrimaryColor }}
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Update Salon</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ===================== MODAL: WALK-IN CLIENT ===================== */}
      {walkInModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Add Walk-in Client to Queue
              </h3>
              <button
                onClick={() => setWalkInModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {walkInError && (
              <div className="mx-5 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {walkInError}
              </div>
            )}

            <form onSubmit={handleWalkInSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Bhai"
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone (Optional for walk-in)
                </label>
                <input
                  type="tel"
                  placeholder="98200 00000"
                  value={walkInPhone}
                  onChange={(e) => setWalkInPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Time Slot *
                </label>
                <select
                  value={walkInSlot}
                  onChange={(e) => setWalkInSlot(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Services Ordered *
                </label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {currentTenant.services.map((s) => {
                    const isChecked = walkInServiceIds.includes(s.id);
                    return (
                      <label
                        key={s.id}
                        className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer ${
                          isChecked ? 'bg-amber-50 border-amber-300' : 'border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setWalkInServiceIds([...walkInServiceIds, s.id]);
                              } else {
                                setWalkInServiceIds(walkInServiceIds.filter((id) => id !== s.id));
                              }
                            }}
                            className="rounded text-amber-600 focus:ring-amber-500"
                          />
                          <span className="font-semibold text-slate-800">{s.name}</span>
                        </div>
                        <span className="font-bold text-slate-900">{formatINR(s.priceINR)}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setWalkInModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: currentTenant.theme.primary }}
                >
                  Add to Active Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: SERVICE CREATE / EDIT ===================== */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button
                onClick={() => setServiceModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Skin Fade Haircut"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value as ServiceCategory)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Hair">Hair</option>
                    <option value="Beard">Beard</option>
                    <option value="Combos">Combos</option>
                    <option value="Spa & Treatment">Spa & Treatment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min={10}
                    step={5}
                    value={serviceDuration}
                    onChange={(e) => setServiceDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Price in ₹ (INR) *</label>
                <input
                  type="number"
                  min={10}
                  step={10}
                  required
                  value={servicePrice}
                  onChange={(e) => setServicePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description / Inclusions
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Scissor cut, hot towel wipe, styling wax finish."
                  value={serviceDesc}
                  onChange={(e) => setServiceDesc(e.target.value)}
                  className="w-full p-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="popCheck"
                  checked={servicePopular}
                  onChange={(e) => setServicePopular(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="popCheck" className="text-xs font-semibold text-slate-700">
                  Highlight as &quot;Popular Choice&quot; on customer page
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: currentTenant.theme.primary }}
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
