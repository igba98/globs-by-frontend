'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isOpen, closeCart, openCart, items, getFormattedTotal } = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Shop', href: '/shop' },
    { name: 'Admin', href: '/admin/login' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white font-body selection:bg-[#94B447] selection:text-white">
      
      {/* 1. Global Announcement Bar (Black Top Layer) */}
      <div className="bg-[#18202D] text-white text-[13px] font-medium py-3 px-4 text-center relative z-50 flex items-center justify-center overflow-hidden h-[44px]">
        <div className="flex gap-8 whitespace-nowrap opacity-80 animate-[marquee_20s_linear_infinite]">
          <span>Transform Your Workspace – Save 30% Today!</span>
          <span>Transform Your Workspace – Save 30% Today!</span>
          <span>Transform Your Workspace – Save 30% Today!</span>
          <span>Transform Your Workspace – Save 30% Today!</span>
          <span>Transform Your Workspace – Save 30% Today!</span>
        </div>
      </div>

      {/* 2. Floating Navbar Pill (Smooth CSS Sticky Architecture) */}
      <header className="sticky top-0 left-0 w-full z-40 transition-all duration-300 flex justify-center pointer-events-none">
        <div className={`flex items-center gap-12 pointer-events-auto transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md w-full px-8 h-16 shadow-sm justify-between max-w-[1600px] border-b border-gray-100 rounded-none' 
            : 'bg-white rounded-b-3xl px-8 h-16 shadow-[0_10px_40px_rgba(0,0,0,0.08)] justify-center'
        }`}>
          
          <Link href="/" className="flex items-center gap-2 shrink-0">
             <Image src="/logo/Globs-by-logo.png" alt="Globs-By" width={100} height={30} className="object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 px-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`text-sm font-bold transition-all pb-1 border-b-2 ${
                    isActive 
                      ? 'text-[#18202D] border-[#18202D]' 
                      : 'text-[#18202D] border-transparent hover:text-[#18202D] hover:border-[#18202D]/30'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center">
             <button onClick={openCart} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
               <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#18202D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
               <span className="w-5 h-5 bg-[#18202D] text-white flex items-center justify-center text-[11px] font-bold rounded-full">{items.length}</span>
             </button>
          </div>
          
        </div>
      </header>

      {/* 3. Main Content Injection */}
      <main className="flex-1 w-full bg-white relative z-10 pt-8">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
           {children}
        </div>
      </main>

      {/* 4. Dark Footer */}
      <footer className="bg-[#94B447] text-white py-16 mt-20 px-4 sm:px-6 lg:px-12 rounded-t-[2.5rem] md:mx-6 mb-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 pb-16">
          
          {/* Column 1: CTA */}
          <div className="max-w-md">
            <h3 className="text-3xl font-medium font-heading leading-tight mb-8 text-white/95">
              Keep In Touch With Us for Top Quality Stationary Supplies
            </h3>
            <div className="relative mb-6">
              <input 
                type="email" 
                placeholder="Your Email Address" 
                className="w-full bg-transparent border-b border-gray-700 py-3 text-sm text-[#18202D] outline-none focus:border-white transition-colors"
                autoComplete="off"
              />
            </div>
            <button className="bg-white text-black px-6 py-2.5 rounded text-sm font-semibold flex items-center gap-2 hover:bg-[#94B447] hover:text-white transition-colors">
              Subscribe Now <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </button>
          </div>

          {/* Nav & Contact Columns */}
          <div className="flex flex-wrap md:flex-nowrap gap-12 lg:gap-20">
             
             {/* Navigation */}
             <div className="flex flex-col gap-5 text-sm font-medium text-[#18202D]">
               <Link href="/" className="hover:text-white transition-colors">Home</Link>
               <Link href="/about" className="hover:text-white transition-colors">About</Link>
               <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
             </div>

             {/* Dar es Salaam Office */}
             <div className="flex flex-col gap-3 max-w-[220px]">
               <h4 className="text-lg font-medium text-white mb-1">Dar es Salaam Office</h4>
               <p className="text-sm text-[#18202D]">Grants Care Building</p>
               <p className="text-sm text-[#18202D]">📞 0743 483 769</p>
             </div>

             {/* Mbeya Office */}
             <div className="flex flex-col gap-3 max-w-[220px]">
               <h4 className="text-lg font-medium text-white mb-1">Mbeya Office</h4>
               <p className="text-sm text-[#18202D]">Mwanjelwa Tunduma Road</p>
               <p className="text-sm text-[#18202D]">📞 0769 017 608</p>
             </div>

             {/* Email & Social */}
             <div className="flex flex-col gap-6 max-w-[220px]">
               <div>
                  <h4 className="text-lg font-medium text-white mb-2">Email</h4>
                  <p className="text-sm text-[#18202D]">info@globsby.co.tz</p>
                  <p className="text-sm text-[#18202D]">marketing@globsby.co.tz</p>
               </div>
               <div className="flex gap-4">
                  {/* Instagram */}
                  <a href="https://www.instagram.com/globsby_stationers?igsh=MW81aHRwaDkwbWw3Zg==" target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-gray-600 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
               </div>
             </div>
          </div>

        </div>

        {/* Absolute Bottom Strip */}
        <div className="max-w-7xl mx-auto border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-[12px] text-[#18202D] font-medium">
           <p>Copyright © Globs-By {new Date().getFullYear()}</p>
           <p className="mt-4 md:mt-0">Powered by <span className="text-white">Globs-By</span></p>
        </div>
      </footer>

      {/* Center Modal Cart Mockup (Havinic Style) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={closeCart}></div>
          
          <div className="relative w-full max-w-[480px] bg-white rounded-3xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden mx-4">
             {/* Header */}
             <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100">
                <h2 className="text-2xl font-medium font-heading text-[#94B447]">Your Cart</h2>
                <button onClick={closeCart} className="text-[#18202D] hover:text-[#18202D] transition-colors p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
             </div>
             
             {/* Cart Items List */}
             <div className="p-8 pb-4 flex flex-col gap-6 max-h-[40vh] overflow-y-auto">
                
                {items.length === 0 ? (
                  <div className="text-center py-8 text-[#18202D] font-medium">Your cart is currently empty.</div>
                ) : (
                  items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-6">
                      {/* Thumbnail */}
                      <div className="w-16 h-16 bg-[#f8f9fa] rounded-xl relative overflow-hidden flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      
                      {/* Details */}
                      <div className="flex-1">
                         <h4 className="text-[17px] font-medium text-[#94B447] truncate w-40 sm:w-auto">{item.name}</h4>
                         <p className="text-[13px] text-[#18202D] mt-1">TZS {(item.price).toLocaleString()}</p>
                         <button onClick={() => useCartStore.getState().removeItem(item.id)} className="text-[12px] text-[#18202D] hover:text-red-500 transition-colors mt-2 font-medium">Remove</button>
                      </div>
                      
                      {/* Quantity Input */}
                      <div className="w-[60px]">
                        <input 
                          type="number" 
                          min="1" 
                          readOnly
                          value={item.quantity}
                          className="w-full h-10 border border-gray-200 rounded text-center text-sm outline-none focus:border-[#18202D] text-[#18202D] font-medium bg-transparent"
                        />
                      </div>
                    </div>
                  ))
                )}

             </div>

             {/* Footer Totals */}
             <div className="p-8 pt-4 flex flex-col border-t border-gray-50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[19px] font-medium text-[#18202D]">Subtotal</span>
                  <span className="text-[19px] font-medium text-[#18202D]">{getFormattedTotal()}</span>
                </div>
                
                <Link href="/checkout" onClick={closeCart}>
                  <button disabled={items.length === 0} className="w-full h-14 bg-black text-white font-medium rounded text-[15px] hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Continue to Checkout
                  </button>
                </Link>
             </div>
             
          </div>
        </div>
      )}

      {/* Simple marquee animation for tailwind config if missing */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
      `}} />
    </div>
  );
}
