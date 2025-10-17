'use client';

import { AuthProvider } from '@/lib/auth/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
