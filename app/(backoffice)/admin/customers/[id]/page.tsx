'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// The backend has no customers endpoint yet. This stub exists only so old
// links/bookmarks to /admin/customers/:id don't 404 — it redirects immediately.
export default function CustomerProfilePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return null;
}
