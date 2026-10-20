'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tenant, Service, Appointment, AppointmentStatus, BookingFormData } from '@/types';
import { INITIAL_TENANTS, getInitialAppointments } from '@/data/sampleTenants';
import { isSlotBooked } from '@/utils/slots';

interface TenantContextType {
  tenants: Tenant[];
  currentTenant: Tenant;
  currentSlug: string;
  appointments: Appointment[];
  themeMode: 'dark' | 'light';
  toggleThemeMode: () => void;
  setThemeMode: (mode: 'dark' | 'light') => void;
  setCurrentTenantBySlug: (slug: string) => void;
  createBooking: (
    data: BookingFormData,
    tenantSlug: string
  ) => { success: boolean; appointment?: Appointment; error?: string };
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  addService: (tenantSlug: string, newService: Omit<Service, 'id'>) => void;
  updateService: (tenantSlug: string, updatedService: Service) => void;
  deleteService: (tenantSlug: string, serviceId: string) => void;
  updateTenantProfile: (tenantSlug: string, updates: Partial<Tenant>) => void;
  resetDemoData: () => void;
}

const STORAGE_KEYS = {
  TENANTS: 'smartbarber_tenants_v4',
  APPOINTMENTS: 'smartbarber_appointments_v4',
  ACTIVE_SLUG: 'smartbarber_active_slug_v4',
  THEME_MODE: 'smartbarber_theme_mode_v1',
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({
  children,
  initialSlug = 'rajhair',
}: {
  children: ReactNode;
  initialSlug?: string;
}) {
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [currentSlug, setCurrentSlug] = useState<string>(initialSlug);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [themeMode, setThemeModeState] = useState<'dark' | 'light'>('dark');
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from LocalStorage or seed data on mount
  useEffect(() => {
    try {
      const storedTenants = localStorage.getItem(STORAGE_KEYS.TENANTS);
      const storedAppointments = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      const storedSlug = localStorage.getItem(STORAGE_KEYS.ACTIVE_SLUG);
      const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME_MODE) as 'dark' | 'light' | null;

      if (storedTenants) {
        setTenants(JSON.parse(storedTenants));
      } else {
        setTenants(INITIAL_TENANTS);
        localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(INITIAL_TENANTS));
      }

      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      } else {
        const seedAppointments = getInitialAppointments();
        setAppointments(seedAppointments);
        localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(seedAppointments));
      }

      if (storedSlug && !initialSlug) {
        setCurrentSlug(storedSlug);
      } else if (initialSlug) {
        setCurrentSlug(initialSlug);
      }

      if (storedTheme === 'light' || storedTheme === 'dark') {
        setThemeModeState(storedTheme);
      }
    } catch (e) {
      console.warn('LocalStorage error, using defaults:', e);
      setTenants(INITIAL_TENANTS);
      setAppointments(getInitialAppointments());
    } finally {
      setIsLoaded(true);
    }
  }, [initialSlug]);

  const toggleThemeMode = () => {
    setThemeModeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(STORAGE_KEYS.THEME_MODE, next);
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  const setThemeMode = (mode: 'dark' | 'light') => {
    setThemeModeState(mode);
    try {
      localStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
    } catch (e) {
      // ignore
    }
  };

  // Persist tenants to localStorage when modified
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(tenants));
      } catch (e) {
        console.error('Failed to save tenants:', e);
      }
    }
  }, [tenants, isLoaded]);

  // Persist appointments to localStorage when modified
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
      } catch (e) {
        console.error('Failed to save appointments:', e);
      }
    }
  }, [appointments, isLoaded]);

  // Sync active tenant theme CSS variables and dark/light class on root
  const currentTenant =
    tenants.find((t) => t.slug === currentSlug) ||
    (currentSlug === 'attitudesalon' || currentSlug === 'atitudesalon'
      ? tenants.find((t) => t.slug === 'rajhair')
      : null) ||
    tenants.find((t) => t.slug === 'rajhair') ||
    tenants[0];

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;

      if (themeMode === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        // Ultra deep midnight obsidian
        root.style.setProperty('--theme-primary', '#030712');
        root.style.setProperty('--theme-primary-hover', '#111827');
        root.style.setProperty('--theme-primary-light', '#1f2937');
        root.style.setProperty('--theme-accent', '#f59e0b');
        root.style.setProperty('--theme-accent-hover', '#d97706');
        root.style.setProperty('--theme-accent-light', '#fef3c7');
        root.style.setProperty('--theme-bg', '#030712');
        root.style.setProperty('--theme-surface', '#0b0f19');
        root.style.setProperty('--theme-card', '#111827');
        root.style.setProperty('--theme-border', '#1f2937');
        root.style.setProperty('--theme-text', '#f9fafb');
        root.style.setProperty('--theme-muted', '#9ca3af');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
        // Crisp pearl light theme
        root.style.setProperty('--theme-primary', '#0f172a');
        root.style.setProperty('--theme-primary-hover', '#1e293b');
        root.style.setProperty('--theme-primary-light', '#f1f5f9');
        root.style.setProperty('--theme-accent', '#d97706');
        root.style.setProperty('--theme-accent-hover', '#b45309');
        root.style.setProperty('--theme-accent-light', '#fef3c7');
        root.style.setProperty('--theme-bg', '#f8fafc');
        root.style.setProperty('--theme-surface', '#ffffff');
        root.style.setProperty('--theme-card', '#ffffff');
        root.style.setProperty('--theme-border', '#e2e8f0');
        root.style.setProperty('--theme-text', '#0f172a');
        root.style.setProperty('--theme-muted', '#64748b');
      }
    }
  }, [themeMode, currentTenant]);

  const setCurrentTenantBySlug = (slug: string) => {
    setCurrentSlug(slug);
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SLUG, slug);
    } catch (e) {
      // ignore
    }
  };

  const createBooking = (
    data: BookingFormData,
    tenantSlug: string
  ): { success: boolean; appointment?: Appointment; error?: string } => {
    const tenant = tenants.find((t) => t.slug === tenantSlug);
    if (!tenant) {
      return { success: false, error: 'Shop not found' };
    }

    // Collision Detection: Verify slot isn't already taken
    const slotAlreadyBooked = isSlotBooked(tenantSlug, data.date, data.timeSlot, appointments);
    if (slotAlreadyBooked) {
      return {
        success: false,
        error: `Slot "${data.timeSlot}" on ${data.date} was just taken by another client! Please select another time slot.`,
      };
    }

    // Find services details
    const selectedServices = tenant.services.filter((s) =>
      data.selectedServiceIds.includes(s.id)
    );

    if (selectedServices.length === 0) {
      return { success: false, error: 'Please select at least one service.' };
    }

    const totalPrice = selectedServices.reduce((sum, s) => sum + s.priceINR, 0);
    const totalDuration = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);
    const serviceNames = selectedServices.map((s) => s.name);

    // Generate unique Indian booking identifier
    const prefix = tenantSlug === 'rajhair' ? 'SB-MUM' : 'SB-PUN';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `${prefix}-${randomNum}`;

    const newAppointment: Appointment = {
      id: newId,
      tenantSlug,
      customerName: data.customerName.trim(),
      customerPhone: data.customerPhone.trim(),
      customerNotes: data.customerNotes?.trim() || '',
      serviceIds: data.selectedServiceIds,
      serviceNames,
      totalPrice,
      totalDurationMinutes: totalDuration,
      date: data.date,
      timeSlot: data.timeSlot,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    return {
      success: true,
      appointment: newAppointment,
    };
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((appt) => (appt.id === id ? { ...appt, status } : appt))
    );
  };

  const addService = (tenantSlug: string, newService: Omit<Service, 'id'>) => {
    const serviceId = `srv-${Date.now()}`;
    const completeService: Service = {
      ...newService,
      id: serviceId,
    };

    setTenants((prev) =>
      prev.map((t) => {
        if (t.slug === tenantSlug) {
          return {
            ...t,
            services: [...t.services, completeService],
          };
        }
        return t;
      })
    );
  };

  const updateService = (tenantSlug: string, updatedService: Service) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.slug === tenantSlug) {
          return {
            ...t,
            services: t.services.map((s) => (s.id === updatedService.id ? updatedService : s)),
          };
        }
        return t;
      })
    );
  };

  const deleteService = (tenantSlug: string, serviceId: string) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.slug === tenantSlug) {
          return {
            ...t,
            services: t.services.filter((s) => s.id !== serviceId),
          };
        }
        return t;
      })
    );
  };

  const updateTenantProfile = (tenantSlug: string, updates: Partial<Tenant>) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.slug === tenantSlug) {
          return {
            ...t,
            ...updates,
            theme: {
              ...t.theme,
              ...(updates.theme || {}),
            },
          };
        }
        return t;
      })
    );
  };

  const resetDemoData = () => {
    setTenants(INITIAL_TENANTS);
    const initialAppts = getInitialAppointments();
    setAppointments(initialAppts);
    try {
      localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(INITIAL_TENANTS));
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(initialAppts));
    } catch (e) {
      // ignore
    }
  };

  return (
    <TenantContext.Provider
      value={{
        tenants,
        currentTenant,
        currentSlug,
        appointments,
        themeMode,
        toggleThemeMode,
        setThemeMode,
        setCurrentTenantBySlug,
        createBooking,
        updateAppointmentStatus,
        addService,
        updateService,
        deleteService,
        updateTenantProfile,
        resetDemoData,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
