'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, closeCart, openCart, items, getFormattedTotal } = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white font-body selection:bg-[#94B447] selection:text-white">
      
      {/* 1. Global Announcement Bar (Black Top Layer) */}
      <div className="bg-[#18202D] text-white text-[15px] font-medium py-3 px-4 text-center relative z-50 flex items-center justify-center overflow-hidden h-[48px]">
        <div className="flex gap-12 whitespace-nowrap opacity-80 animate-[marquee_30s_linear_infinite]">
          <span>Globsby Stationary - For Top Quality Supplies</span>
          <span>Dar es Salaam office - Grants Care Building (0743 483 769)</span>
          <span>Mbeya office - Mwanjelwa Tunduma Road (0769 017 608)</span>
          <span>Order from us and pay in this website!</span>
          {/* Repeating for a smoother loop */}
          <span>Globsby Stationary - For Top Quality Supplies</span>
          <span>Dar es Salaam office - Grants Care Building (0743 483 769)</span>
          <span>Mbeya office - Mwanjelwa Tunduma Road (0769 017 608)</span>
          <span>Order from us and pay in this website!</span>
        </div>
      </div>

      {/* 2. Floating Navbar Pill (Smooth CSS Sticky Architecture) */}
      <header className="sticky top-0 left-0 w-full z-40 transition-all duration-300 flex justify-center pointer-events-none">
        <div className={`flex items-center pointer-events-auto transition-all duration-300 bg-white w-full px-4 sm:px-8 py-4 justify-between max-w-[1600px] ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 rounded-none' 
            : 'rounded-b-3xl shadow-[0_10px_40px_rgba(0,0,0,0.08)]'
        }`}>
          
          <Link href="/" className="flex items-center shrink-0">
             <Image src="/logo/Globs-by-logo.png" alt="Globs-By" width={240} height={80} className="object-contain max-h-20 w-auto" priority />
          </Link>

          <nav className="hidden">
             {/* Desktop nav removed in favor of fullscreen overlay */}
          </nav>

          <div className="flex items-center gap-4">
             {/* Global Search Bar (Toggleable) */}
             <div className={`flex items-center transition-all duration-300 overflow-hidden ${isSearchOpen ? 'w-[200px] sm:w-[300px] opacity-100' : 'w-0 opacity-0'}`}>
               <form 
                 onSubmit={(e) => {
                   e.preventDefault();
                   if (searchQuery.trim()) {
                     router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
                   }
                   setIsSearchOpen(false);
                 }}
                 className="relative w-full"
               >
                 <input 
                   type="text" 
                   placeholder="Search items..." 
                   value={searchQuery}
                   autoFocus
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm outline-none border border-transparent focus:border-[#94B447] text-[#18202D]"
                 />
               </form>
             </div>

             <button 
               onClick={() => setIsSearchOpen(!isSearchOpen)} 
               className="flex items-center justify-center p-2 hover:bg-gray-100 rounded-full transition-colors text-[#18202D]"
               title="Search"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 {isSearchOpen ? (
                   <path d="M18 6 6 18M6 6l12 12"/>
                 ) : (
                   <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>
                 )}
               </svg>
             </button>

             <button onClick={() => setIsMenuOpen(true)} className="flex items-center justify-center p-2 hover:bg-gray-100 rounded-full transition-colors text-[#18202D]">
               <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
             </button>
          </div>
          
        </div>
      </header>

      {/* Fullscreen Navigation Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
          <button 
            onClick={() => setIsMenuOpen(false)} 
            className="absolute top-6 right-6 p-3 text-[#18202D] hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          
          <nav className="flex flex-col items-center gap-8 text-3xl font-heading font-extrabold text-[#18202D]">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="hover:text-[#94B447] transition-colors flex items-center gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Home
            </Link>
            <Link href="/shop" onClick={() => setIsMenuOpen(false)} className="hover:text-[#94B447] transition-colors flex items-center gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              Shop
            </Link>
            <button 
              onClick={() => {
                setIsMenuOpen(false);
                openCart();
              }} 
              className="hover:text-[#94B447] transition-colors flex items-center gap-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              Cart <span className="text-xl bg-[#94B447] text-white px-3 py-1 rounded-full">{items.length}</span>
            </button>
            <div className="w-16 h-px bg-gray-200 mt-2"></div>
            <Link href="/admin/customers" onClick={() => setIsMenuOpen(false)} className="hover:text-[#94B447] transition-colors flex items-center gap-3 text-[#18202D] opacity-80 text-2xl font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              Admin Backoffice
            </Link>
          </nav>
        </div>
      )}

      {/* Main Content Injection */}
      <main className="flex-1 w-full bg-white relative z-10 pt-8">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
           {children}
        </div>
      </main>



      {/* Dark Footer */}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email Address" 
                className="w-full bg-transparent border-b border-gray-700 py-3 text-sm text-[#18202D] outline-none focus:border-white transition-colors placeholder-[#18202D]/50"
                autoComplete="off"
              />
            </div>
            <button 
              onClick={handleSubscribe} 
              disabled={subscribed || !email}
              className="bg-white text-black px-6 py-2.5 rounded text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#18202D] hover:text-white transition-colors min-w-[160px] disabled:opacity-80 disabled:cursor-not-allowed"
            >
              {subscribed ? 'Subscribed!' : (
                <>Subscribe Now <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg></>
              )}
            </button>
          </div>

          {/* Nav & Contact Columns */}
          <div className="flex flex-wrap md:flex-nowrap gap-12 lg:gap-20">
             
             {/* Navigation */}
             <div className="flex flex-col gap-5 text-sm font-medium text-[#18202D]">
               <Link href="/" className="hover:text-white transition-colors">Home</Link>
               <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
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
                  <a href="https://www.instagram.com/globsby_stationers" target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-gray-600 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors" title="Instagram">
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  {/* Facebook */}
                  <a href="#" className="w-9 h-9 border border-gray-600 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors" title="Facebook">
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </a>
                  {/* WhatsApp */}
                  <a href="#" className="w-9 h-9 border border-gray-600 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors" title="WhatsApp">
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </a>
                  {/* Twitter/X */}
                  <a href="#" className="w-9 h-9 border border-gray-600 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors" title="X">
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"></path><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path></svg>
                  </a>
               </div>
             </div>
          </div>

        </div>

        {/* Absolute Bottom Strip */}
        <div className="max-w-7xl mx-auto border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-[12px] text-[#18202D] font-medium">
           <p>Copyright © Globs-By {new Date().getFullYear()}</p>
           <div className="mt-4 md:mt-0 flex gap-6 items-center">
             <Link href="/admin/login" className="text-gray-400 hover:text-white transition-colors">Staff Login</Link>
             <p>Powered by <span className="text-white">Globs-By</span></p>
           </div>
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
