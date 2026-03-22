'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const { isOpen, closeCart, openCart, items, getFormattedTotal } = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
             <Link href="/" className="text-sm font-bold text-[#18202D] border-b-2 border-[#18202D] pb-1">Home</Link>
             <Link href="/about" className="text-sm font-semibold text-gray-500 hover:text-[#18202D] transition-colors pb-1">About</Link>
             <Link href="/shop" className="text-sm font-semibold text-gray-500 hover:text-[#18202D] transition-colors pb-1">Shop</Link>
             <Link href="/admin/login" className="text-sm font-semibold text-gray-500 hover:text-[#18202D] transition-colors pb-1">Admin</Link>
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

      {/* 4. The Requested Dark Footer from the Screenshot */}
      <footer className="bg-[#18181b] text-white py-16 mt-20 px-4 sm:px-6 lg:px-12 rounded-t-[2.5rem] md:mx-6 mb-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 pb-16">
          
          {/* Column 1: Newsletter */}
          <div className="max-w-md">
            <h3 className="text-3xl font-medium font-heading leading-tight mb-8 text-white/95">
              Stay Connected with the World of Office Solutions
            </h3>
            <div className="relative mb-6">
              <input 
                type="email" 
                placeholder="Your Email Address" 
                className="w-full bg-transparent border-b border-gray-700 py-3 text-sm text-gray-300 outline-none focus:border-white transition-colors"
                autoComplete="off"
              />
            </div>
            <button className="bg-white text-black px-6 py-2.5 rounded text-sm font-semibold flex items-center gap-2 hover:bg-[#94B447] hover:text-white transition-colors">
              Subscribe Now <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </button>
          </div>

          {/* Nav Columns Container */}
          <div className="flex flex-wrap md:flex-nowrap gap-12 lg:gap-24">
             
             {/* Nav 1 */}
             <div className="flex flex-col gap-5 text-sm font-medium text-gray-300">
               <Link href="/" className="hover:text-white transition-colors">Home</Link>
               <Link href="/about" className="hover:text-white transition-colors">About</Link>
               <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
               <Link href="/blogs" className="hover:text-white transition-colors">Blogs</Link>
               <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
             </div>

             {/* Nav 2 */}
             <div className="flex flex-col gap-5 text-sm font-medium text-gray-300">
               <Link href="/404" className="hover:text-white transition-colors">404 Error</Link>
               <Link href="/password" className="hover:text-white transition-colors">Password Protected</Link>
               <Link href="/changelog" className="hover:text-white transition-colors">Changelog</Link>
               <Link href="/style-guide" className="hover:text-white transition-colors">Style Guide</Link>
               <Link href="/licenses" className="hover:text-white transition-colors">Licenses</Link>
             </div>

             {/* Contact Info Column */}
             <div className="flex flex-col gap-8 max-w-[200px]">
               <div>
                  <h4 className="text-lg font-medium text-white mb-2">We're just a call away.</h4>
                  <p className="text-sm text-gray-400">+255 (712) 345-678</p>
               </div>
               <div>
                  <h4 className="text-lg font-medium text-white mb-2">Got a question?</h4>
                  <p className="text-sm text-gray-400">sales@globs-by.co.tz</p>
               </div>
               <div className="flex gap-4">
                  {/* Social Circles */}
                  <a href="#" className="w-9 h-9 border border-gray-600 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                  </a>
                  <a href="#" className="w-9 h-9 border border-gray-600 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a href="#" className="w-9 h-9 border border-gray-600 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                  </a>
               </div>
             </div>
          </div>

        </div>

        {/* Absolute Bottom Strip */}
        <div className="max-w-7xl mx-auto border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-[12px] text-gray-500 font-medium">
           <p>Copyright © Globs-By | Designed by Theme Sleek</p>
           <p className="mt-4 md:mt-0">Powered by <span className="text-white">Next.js Framework.</span></p>
        </div>
      </footer>

      {/* Center Modal Cart Mockup (Havinic Style) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={closeCart}></div>
          
          <div className="relative w-full max-w-[480px] bg-white rounded-3xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden mx-4">
             {/* Header */}
             <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100">
                <h2 className="text-2xl font-medium font-heading text-[#18202D]">Your Cart</h2>
                <button onClick={closeCart} className="text-gray-400 hover:text-[#18202D] transition-colors p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
             </div>
             
             {/* Cart Items List */}
             <div className="p-8 pb-4 flex flex-col gap-6 max-h-[40vh] overflow-y-auto">
                
                {items.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 font-medium">Your cart is currently empty.</div>
                ) : (
                  items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-6">
                      {/* Thumbnail */}
                      <div className="w-16 h-16 bg-[#f8f9fa] rounded-xl relative overflow-hidden flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      
                      {/* Details */}
                      <div className="flex-1">
                         <h4 className="text-[17px] font-medium text-[#18202D] truncate w-40 sm:w-auto">{item.name}</h4>
                         <p className="text-[13px] text-[#18202D] mt-1">TZS {(item.price).toLocaleString()}</p>
                         <button onClick={() => useCartStore.getState().removeItem(item.id)} className="text-[12px] text-gray-400 hover:text-red-500 transition-colors mt-2 font-medium">Remove</button>
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
