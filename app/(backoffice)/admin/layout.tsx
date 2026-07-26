'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { adminLogout, getSession } from '@/lib/admin-api';

// The session lives in localStorage — an external system — so we read it
// with useSyncExternalStore rather than useState+useEffect. getSession()
// is a cheap synchronous read (cached by admin-api.ts) so it doubles as the
// snapshot function; getServerSnapshot returns null so SSR/first hydration
// pass renders the same "checking session" splash on both sides, then React
// re-syncs to the real client value automatically.
function subscribeToSessionChanges(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('focus', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('focus', callback);
  };
}

function getServerSessionSnapshot() {
  return null;
}
// Icons are defined as inline SVGs below to avoid external dependency issues.
const BoxIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const GraphIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const CartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const InventoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="M3.27 6.96 12 12.01 20.73 6.96"></path><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const SmsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;

// NOTE: no "Customers" link — the backend has no customers endpoint yet.
// /admin/customers and /admin/customers/[id] stay in place as redirect
// stubs so any stale bookmarks/links don't 404.
const navLinks = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: GraphIcon },
  { name: 'Orders', href: '/admin/orders', icon: CartIcon },
  { name: 'Products', href: '/admin/products', icon: BoxIcon },
  { name: 'Inventory', href: '/admin/inventory', icon: InventoryIcon },
  { name: 'SMS', href: '/admin/sms', icon: SmsIcon },
  { name: 'Communications', href: '/admin/communications', icon: SmsIcon },
  { name: 'Settings', href: '/admin/settings', icon: SettingsIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const session = useSyncExternalStore(
    subscribeToSessionChanges,
    getSession,
    getServerSessionSnapshot,
  );
  const pathname = usePathname();
  const router = useRouter();
  const isLoginRoute = pathname === '/admin/login';

  // Pure navigation side-effect (no local setState) — redirect once we know
  // for sure there's no session and we're not already on the login page.
  useEffect(() => {
    if (isLoginRoute || session) return;
    router.replace('/admin/login');
  }, [isLoginRoute, session, router]);

  const handleSignOut = async () => {
    await adminLogout();
    router.replace('/admin/login');
  };

  // If we are identically on exactly /admin/login, we don't return the shell
  if (isLoginRoute) {
    return <>{children}</>;
  }

  // Guard: no session yet (still hydrating, or redirecting) — render nothing
  // but a tiny splash
  if (!session) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f5f7]">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const initials = session.user.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'AD';

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f5f7]">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-primary border-r border-gray-800 text-white">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
           <Image src="/logo/Globs-by-logo.png" alt="Logo" width={110} height={35} className="object-contain brightness-0 invert" />
        </div>
        <nav className="flex-1 py-6 px-3 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-accent/20 text-accent' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <link.icon />
                {link.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-gray-800 space-y-3">
          <div className="flex items-center gap-3 px-3">
            <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
              <p className="text-xs text-gray-400 truncate capitalize">{session.user.role.toLowerCase()}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-10">
          
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileOpen(true)} className="md:hidden text-gray-500 hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
            </button>

            <div className="hidden sm:flex relative w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </span>
              <input type="text" placeholder="Search orders, products..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">
              {initials}
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />
          <aside className="relative w-64 bg-primary text-white flex flex-col">
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
               <Image src="/logo/Globs-by-logo.png" alt="Logo" width={100} height={35} className="object-contain brightness-0 invert" />
               <button onClick={() => setIsMobileOpen(false)} className="text-gray-400 hover:text-white">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
               </button>
            </div>
            <nav className="flex-1 py-6 px-3 space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-accent/20 text-accent' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                    <link.icon />
                    {link.name}
                  </Link>
                )
              })}
            </nav>
            <div className="p-4 border-t border-gray-800 space-y-3">
              <div className="flex items-center gap-3 px-3">
                <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
                  <p className="text-xs text-gray-400 truncate capitalize">{session.user.role.toLowerCase()}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsMobileOpen(false);
                  handleSignOut();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

    </div>
  );
}
