import { Tenant, Appointment } from '@/types';
export { TIME_SLOTS } from '@/utils/slots';

// Helper to get formatted date string relative to today
export function getRelativeDateString(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 't-fashion',
    slug: 'rajhair', // keep aliased for URL compatibility
    name: "Fashion men's Salon",
    tagline: 'Modern Haircuts • Beard Styling • Grooming Care',
    description:
      'Premier men’s styling salon on Poona Link Road, Kalyan East. Specializing in customized scissor cuts, sharp razor fades, luxury beard sculpting, and relaxing head massage in a clean, hygienic, air-conditioned studio.',
    city: 'Mumbai',
    area: 'Kalyan East',
    fullAddress: "Fashion men's Salon, Shop No. 1, Sai Ganesh Apartment, Poona Link Road, Kalyan East, Maharashtra 421306",
    mapEmbedUrl: 'https://maps.google.com/maps?q=Sai+Ganesh+Apartment+Poona+Link+Road+Kalyan+East&t=&z=15&ie=UTF8&iwloc=&output=embed',
    phone: '+91 99693 64699',
    whatsappNumber: '919969364699',
    rating: 4.9,
    reviewCount: 294,
    openingTime: '08:30 AM',
    closingTime: '10:00 PM',
    workingDays: 'Monday - Sunday (Open All 7 Days)',
    theme: {
      primary: '#030712', // Ultra Deep Midnight Obsidian
      primaryHover: '#111827',
      primaryLight: '#f9fafb',
      accent: '#d97706', // Warm Glowing Gold Amber
      accentHover: '#b45309',
      accentLight: '#fef3c7',
      bg: '#030712', // Extra deep dark background
      surface: '#0f172a',
      card: '#111827',
      border: '#1f2937',
      text: '#f9fafb',
      muted: '#9ca3af',
    },
    services: [
      {
        id: 'fms-s1',
        name: 'Classic / Fade Haircut',
        category: 'Hair',
        durationMinutes: 30,
        priceINR: 100,
        description: 'Precision scissor and clipper cut, neckline cleaning, hair wash, and quick matte styling.',
        isPopular: true,
      },
      {
        id: 'fms-s2',
        name: 'Haircut + Beard Styling Combo',
        category: 'Combos',
        durationMinutes: 45,
        priceINR: 160,
        description: 'Our most popular combo: tailored fade haircut paired with crisp razor beard shaping and soothing aftershave.',
        isPopular: true,
      },
      {
        id: 'fms-s3',
        name: 'Beard Trimming & Sharp Line-Up',
        category: 'Beard',
        durationMinutes: 20,
        priceINR: 70,
        description: 'Precision cheek alignment, mustache trimming, warm towel wrap, and nourishing beard oil.',
      },
      {
        id: 'fms-s4',
        name: 'Ayurvedic Head Oil Massage',
        category: 'Spa & Treatment',
        durationMinutes: 20,
        priceINR: 100,
        description: 'Stress-relief head and temple massage with cooling Navratna or warm almond herbal oil.',
        isPopular: true,
      },
      {
        id: 'fms-s5',
        name: 'Hair Spa with Micro-Steam',
        category: 'Spa & Treatment',
        durationMinutes: 40,
        priceINR: 300,
        description: 'Deep conditioning cream treatment followed by ionic steam canopy and scalp revival.',
      },
      {
        id: 'fms-s6',
        name: 'Smooth Feather Razor Shave',
        category: 'Beard',
        durationMinutes: 20,
        priceINR: 80,
        description: 'Warm towel softening, rich whipped foam lather, feather blade glide, and cool alum splash.',
      },
      {
        id: 'fms-s7',
        name: 'Fashion Special Grooming Combo',
        category: 'Combos',
        durationMinutes: 60,
        priceINR: 399,
        description: 'Haircut, beard sculpt, hot towel shave, detox herbal face pack, and 15-min head massage.',
        isPopular: true,
      },
      {
        id: 'fms-s8',
        name: 'Charcoal Face Scrub & Mask',
        category: 'Spa & Treatment',
        durationMinutes: 25,
        priceINR: 180,
        description: 'Deep pore unclogging charcoal scrub to remove dust, blackheads, and excess oil.',
      },
    ],
    gallery: [
      {
        id: 'fms-g1',
        title: 'Modern Taper Fade & Textured Quiff',
        category: 'Haircut',
        imageUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'fms-g2',
        title: 'Clean Beard Gradient & Cheek Line',
        category: 'Beard',
        imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'fms-g3',
        title: 'Classic Side-Part Finish',
        category: 'Haircut',
        imageUrl: 'https://images.unsplash.com/photo-1517832606589-7629c339590a?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'fms-g4',
        title: 'Clean & Air-Conditioned Studio Chairs',
        category: 'Shop Interior',
        imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
      },
    ],
    reviews: [
      {
        id: 'fms-r1',
        authorName: 'Sanjay Shinde',
        rating: 5,
        date: 'Today',
        comment: "Best salon in Kalyan East! Fashion men's Salon gave me a sharp fade that looks amazing. Zero waiting when booked online.",
        serviceUsed: 'Haircut + Beard Styling Combo',
        verified: true,
      },
      {
        id: 'fms-r2',
        authorName: 'Pravin Jadhav',
        rating: 5,
        date: 'Yesterday',
        comment: 'Very clean salon on Poona Link Road. The head massage after a long commute is relaxing. Highly recommended!',
        serviceUsed: 'Ayurvedic Head Oil Massage',
        verified: true,
      },
      {
        id: 'fms-r3',
        authorName: 'Rohan Sharma',
        rating: 5,
        date: '3 days ago',
        comment: 'Perfect beard trim and sharp edge lining. WhatsApp appointment was confirmed immediately.',
        serviceUsed: 'Beard Trimming & Sharp Line-Up',
        verified: true,
      },
      {
        id: 'fms-r4',
        authorName: 'Amol Pawar',
        rating: 5,
        date: '1 week ago',
        comment: 'The Fashion Special Grooming Combo was totally worth it before a family wedding. Polite staff and honest rates.',
        serviceUsed: 'Fashion Special Grooming Combo',
        verified: true,
      },
    ],
  },
];

export function getInitialAppointments(): Appointment[] {
  const today = getRelativeDateString(0);
  const tomorrow = getRelativeDateString(1);

  return [
    {
      id: 'SB-MUM-8921',
      tenantSlug: 'rajhair',
      customerName: 'Akash Gaikwad',
      customerPhone: '9969311223',
      customerNotes: 'Please keep sides short, low fade.',
      serviceIds: ['fms-s2'],
      serviceNames: ['Haircut + Beard Styling Combo'],
      totalPrice: 160,
      totalDurationMinutes: 45,
      date: today,
      timeSlot: '10:00 AM',
      status: 'confirmed',
      createdAt: '2026-10-20T09:15:00Z',
    },
    {
      id: 'SB-MUM-8922',
      tenantSlug: 'rajhair',
      customerName: 'Mahesh More',
      customerPhone: '9969245566',
      customerNotes: 'Regular haircut before office.',
      serviceIds: ['fms-s1'],
      serviceNames: ['Classic / Fade Haircut'],
      totalPrice: 100,
      totalDurationMinutes: 30,
      date: today,
      timeSlot: '11:30 AM',
      status: 'pending',
      createdAt: '2026-10-20T10:00:00Z',
    },
    {
      id: 'SB-MUM-8923',
      tenantSlug: 'rajhair',
      customerName: 'Girish Patil',
      customerPhone: '9833456789',
      customerNotes: 'Head massage and beard trim.',
      serviceIds: ['fms-s3', 'fms-s4'],
      serviceNames: ['Beard Trimming & Sharp Line-Up', 'Ayurvedic Head Oil Massage'],
      totalPrice: 170,
      totalDurationMinutes: 40,
      date: today,
      timeSlot: '02:00 PM',
      status: 'completed',
      createdAt: '2026-10-20T08:30:00Z',
    },
    {
      id: 'SB-MUM-8924',
      tenantSlug: 'rajhair',
      customerName: 'Vijay Deshmukh',
      customerPhone: '9969987654',
      customerNotes: 'Full grooming combo booked for evening.',
      serviceIds: ['fms-s7'],
      serviceNames: ['Fashion Special Grooming Combo'],
      totalPrice: 399,
      totalDurationMinutes: 60,
      date: today,
      timeSlot: '05:30 PM',
      status: 'confirmed',
      createdAt: '2026-10-20T11:20:00Z',
    },
    {
      id: 'SB-MUM-8925',
      tenantSlug: 'rajhair',
      customerName: 'Swapnil Kadam',
      customerPhone: '9821122334',
      customerNotes: 'Haircut for tomorrow morning.',
      serviceIds: ['fms-s1'],
      serviceNames: ['Classic / Fade Haircut'],
      totalPrice: 100,
      totalDurationMinutes: 30,
      date: tomorrow,
      timeSlot: '10:00 AM',
      status: 'confirmed',
      createdAt: '2026-10-20T12:00:00Z',
    },
  ];
}
