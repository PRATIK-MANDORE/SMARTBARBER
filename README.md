# SmartBarber 💈
### Online Barber Booking & Business Management Platform (Tailored for Local Indian Barbers)

A high-performance, mobile-first, multi-tenant web application built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS** (with dynamic CSS variables), and **LocalStorage / React Context** mock persistence.

---

## 🌟 Key Features

### 1. Multi-Tenant Architecture & Demo Switcher
- **Top Floating Switcher**: Seamlessly switch between demo tenants or jump between Customer and Owner views.
  - **Raj Hair Studio** (`/rajhair`): Deep Royal Navy (`#1e3a8a`) & Amber (`#d97706`), Bandra West, Mumbai.
  - **Style Point** (`/stylepoint`): Crimson Slate (`#991b1b`) & Charcoal (`#18181b`), FC Road, Pune.
- **Dynamic Theming**: CSS variables (`--theme-primary`, `--theme-accent`, etc.) updated dynamically on `:root` based on active tenant.

### 2. Customer Landing Page (`/[slug]`)
- **Hero Section**: Dynamic shop name, tagline, rating badge (`⭐ 4.8/5`), location pill, and quick-action buttons:
  - `Book Appointment` (Modal trigger)
  - `Call Now` (`tel:+91...`)
  - `WhatsApp Booking` (`https://wa.me/...`)
- **Service Menu**:
  - Filter tabs: `All`, `Hair`, `Beard`, `Combos`, `Spa & Treatment`.
  - Service cards displaying duration, INR price (`₹`), description, and selection controls.
  - Sticky bottom combo bar for multi-service selection with live price/duration calculation.
- **Interactive 4-Step Booking Modal**:
  - **Step 1**: Service Selection (single or combo bundle).
  - **Step 2**: Date Picker (next 7 days) & 30-min Slot Picker (09:00 AM to 09:00 PM).
  - **Collision Detection**: Real-time locking prevents double booking of identical slots.
  - **Step 3**: Customer Details (Name, 10-digit Indian phone, optional notes).
  - **Step 4**: Instant Confirmation Token Screen with pre-filled **"Send to WhatsApp"** button:
    `"Hi [Shop Name], I booked an appointment for [Service] on [Date] at [Time]. Name: [Customer Name]. Booking ID: [ID]."`
- **Visual Portfolio / Gallery**: Categorized showcase of haircut styles (Skin Fade, Pompadour, Beard Sculpt, Shop Interior) with image lightbox preview.
- **Customer Reviews**: Authentic Indian customer testimonials with star ratings, verified badges, and service tags.
- **Footer & Location**: Operating hours, complete address, embedded Google Map iframe, and direct direction links.

### 3. Barber Dashboard & Operations (`/[slug]/admin`)
- **Live Metrics Overview**:
  - Today's Appointments tally
  - Completed clients count
  - Remaining queue count
  - Today's Estimated & Collected Revenue (`₹`)
- **Appointment Queue & Scheduling**:
  - Real-time table with status filtering (`All`, `Pending`, `Confirmed`, `Completed`, `Cancelled`).
  - Instant action buttons: `[Confirm]`, `[Complete]`, `[Cancel]`, `[No-Show]`.
  - **+ Add Walk-In Client**: Immediately seat and book walk-in customers into the live queue.
- **Service Catalog Management**:
  - Add, edit, or delete services.
  - Adjust prices in INR (`₹`), duration, category, and "Popular" tags.
- **Business Profile & Live Theme Customizer**:
  - Update Shop Name, Tagline, Phone, WhatsApp number, Hours, and Address.
  - Real-time Brand Primary Color picker (Royal Navy, Amber, Crimson, Emerald, Purple, or Custom Hex) that dynamically updates the customer view!

---

## 🚀 Running the Project

```bash
# 1. Navigate to the project directory
cd C:\Users\chand\.gemini\antigravity\scratch\smartbarber

# 2. Start the production server (already built)
npm run start

# Or run in development mode
npm run dev
```

Open your browser at:
- **Platform Hub**: [http://localhost:3000](http://localhost:3000)
- **Raj Hair Studio (Customer)**: [http://localhost:3000/rajhair](http://localhost:3000/rajhair)
- **Raj Hair Studio (Admin)**: [http://localhost:3000/rajhair/admin](http://localhost:3000/rajhair/admin)
- **Style Point (Customer)**: [http://localhost:3000/stylepoint](http://localhost:3000/stylepoint)
- **Style Point (Admin)**: [http://localhost:3000/stylepoint/admin](http://localhost:3000/stylepoint/admin)

# SMARTBARBER
