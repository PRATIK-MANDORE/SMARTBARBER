import type { Metadata } from 'next';
import './globals.css';
import { TenantProvider } from '@/context/TenantContext';
import DemoTenantSwitcher from '@/components/DemoTenantSwitcher';

export const metadata: Metadata = {
  title: "Fashion men's Salon Kalyan East | SmartBarber Luxury Booking & Lounge",
  description:
    "Official online booking platform for Fashion men's Salon, Shop No. 1, Sai Ganesh Apartment, Poona Link Road, Kalyan East. Modern haircuts, razor beard sculpting, and hair spa.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 antialiased selection:bg-amber-400 selection:text-slate-950 transition-colors duration-150">
        <TenantProvider>
          <DemoTenantSwitcher />
          <main className="flex-1">{children}</main>
        </TenantProvider>
      </body>
    </html>
  );
}
