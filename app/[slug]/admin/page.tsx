'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTenant } from '@/context/TenantContext';
import AdminDashboard from '@/components/AdminDashboard';

export default function TenantAdminPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'rajhair';
  const { currentTenant, setCurrentTenantBySlug } = useTenant();

  // Sync active tenant slug with URL
  useEffect(() => {
    if (slug && slug !== currentTenant.slug) {
      setCurrentTenantBySlug(slug);
    }
  }, [slug, currentTenant.slug, setCurrentTenantBySlug]);

  return <AdminDashboard />;
}
