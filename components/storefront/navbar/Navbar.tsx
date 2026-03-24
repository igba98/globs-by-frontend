'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingCart, Menu } from '@/components/icons';
import { useCart } from '@/components/storefront/cart/CartContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();

  // Scroll listener to activate floating state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`w-full z-50 flex justify-center pointer-events-none px-4 fixed left-0 right-0 mx-auto transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? 'top-4 max-w-[1200px]' : 'top-[32px] sm:top-[36px] max-w-full'}`}
    >
      <div 
        className={`bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center justify-between pointer-events-auto transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden origin-top ${
          isScrolled 
            ? 'rounded-full px-6 py-3 w-[95%] md:w-full border border-gray-100 gap-8 translate-y-0 scale-95 md:scale-100' 
            : 'rounded-[2rem] px-6 md:px-10 py-5 w-[90%] md:w-auto border border-transparent gap-8 md:gap-16 translate-y-0 scale-100'
        }`}
      >
        
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0 transition-transform duration-1000">
          <Image src="/logo/Globs-by-logo.png" alt="Globs-By Logo" width={60} height={40} className={`object-contain transition-all duration-1000 ${isScrolled ? 'scale-90' : 'scale-100'}`} priority />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-bold border-b-2 border-primary pb-0.5 text-[#94B447]">Home</Link>
          <Link href="/about" className="text-sm font-semibold text-[#18202D] hover:text-[#94B447] transition-colors pb-0.5">About</Link>
          <Link href="/shop" className="text-sm font-semibold text-[#18202D] hover:text-[#94B447] transition-colors pb-0.5">Shop</Link>
          <Link href="/shop" className="text-sm font-semibold text-[#18202D] hover:text-[#94B447] transition-colors pb-0.5">Pages +</Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-5 flex-shrink-0">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative text-primary hover:text-accent transition-colors flex items-center gap-2 group"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className={`bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center transition-colors duration-500 ${cartCount > 0 ? 'bg-accent scale-110' : 'group-hover:bg-accent'}`}>
              {cartCount}
            </span>
          </button>

          <button className="md:hidden text-[#94B447]">
            <Menu className="h-6 w-6" />
          </button>
        </div>

      </div>
    </header>
  );
}
