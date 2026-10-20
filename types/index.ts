export type ServiceCategory = 'Hair' | 'Beard' | 'Combos' | 'Spa & Treatment';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  durationMinutes: number;
  priceINR: number;
  description: string;
  isPopular?: boolean;
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  date: string;
  comment: string;
  serviceUsed: string;
  verified: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
}

export interface TenantTheme {
  primary: string; // hex
  primaryHover: string;
  primaryLight: string;
  accent: string; // hex
  accentHover: string;
  accentLight: string;
  bg: string;
  surface: string;
  card: string;
  border: string;
  text: string;
  muted: string;
}

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  city: string;
  area: string;
  fullAddress: string;
  mapEmbedUrl: string;
  phone: string;
  whatsappNumber: string;
  rating: number;
  reviewCount: number;
  openingTime: string; // e.g. "09:00 AM"
  closingTime: string; // e.g. "09:00 PM"
  workingDays: string; // e.g. "Mon - Sun"
  theme: TenantTheme;
  services: Service[];
  gallery: GalleryItem[];
  reviews: Review[];
}

export interface Appointment {
  id: string;
  tenantSlug: string;
  customerName: string;
  customerPhone: string;
  customerNotes?: string;
  serviceIds: string[];
  serviceNames: string[];
  totalPrice: number;
  totalDurationMinutes: number;
  date: string; // "YYYY-MM-DD"
  timeSlot: string; // e.g. "10:30 AM"
  status: AppointmentStatus;
  createdAt: string;
}

export interface BookingFormData {
  selectedServiceIds: string[];
  date: string;
  timeSlot: string;
  customerName: string;
  customerPhone: string;
  customerNotes?: string;
}
