'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supplyProducts } from '@/lib/data';
import AnimatedBanner from '@/components/storefront/shop/AnimatedBanner';

const categories = ['All', 'Paper & Books', 'Organizers', 'Supplies', 'Stationery', 'Hardware'];

function ProductGrid({ products }: { products: typeof supplyProducts }) {
  if (products.length === 0) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 px-4 w-full max-w-[1600px] mx-auto">
      {products.map((pkg) => (
        <Link href={`/product/${pkg.id}`} key={pkg.id} className="bg-white rounded-2xl aspect-[3/4] relative flex flex-col items-center group overflow-hidden drop-shadow-sm hover:-translate-y-1 transition-transform border border-gray-100 p-3 sm:p-4 hover:shadow-md">
          
          {/* Top Pill / White Header Tag */}
          <div className="absolute top-0 left-0 w-full bg-white/95 backdrop-blur-sm px-2 py-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] text-[10px] sm:text-xs font-bold text-[#18202D] z-10 text-center truncate border-b border-gray-50 flex items-center justify-center gap-1">
            {pkg.name}
            {pkg.isOnSale && <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 animate-pulse"></span>}
          </div>

          {/* Full-bleed Cover */}
          <div className="w-full h-[65%] mt-6 relative z-0 group-hover:scale-105 transition-transform duration-700 bg-[#f8f9fa] rounded-lg overflow-hidden border border-gray-50">
            <Image src={pkg.image} alt={pkg.name} fill className="object-contain p-2" />
          </div>

          {/* Pricing Info at bottom */}
          <div className="w-full mt-auto text-center flex flex-col items-center justify-end">
             <div className="text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-0.5 truncate w-full">{pkg.category}</div>
             <div className="text-xs sm:text-sm font-extrabold text-[#94B447]">{pkg.price}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function ShopArchiveContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState(q);
  const [loadingMore, setLoadingMore] = useState('');
  const [visibleCount, setVisibleCount] = useState(24);

  useEffect(() => {
    setSearchQuery(q);
  }, [q]);

  const searchedProducts = supplyProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = activeCategory === 'All' 
    ? searchedProducts 
    : searchedProducts.filter(p => p.category === activeCategory);

  const onSaleProducts = filteredProducts.filter(p => p.isOnSale);
  const topSellingProducts = filteredProducts.filter(p => p.isTopSelling && !p.isOnSale);
  const regularProducts = filteredProducts.filter(p => !p.isOnSale && !p.isTopSelling);

  const handleLoadMore = () => {
    setLoadingMore('loading');
    setTimeout(() => {
      if (visibleCount + 24 >= regularProducts.length) {
        setVisibleCount(regularProducts.length);
        setLoadingMore('done');
      } else {
        setVisibleCount(prev => prev + 24);
        setLoadingMore('');
      }
    }, 800);
  };

  const displayedRegularProducts = regularProducts.slice(0, visibleCount);

  return (
    <div className="w-full flex flex-col items-center space-y-12 pb-20 pt-4">
      
      {/* 1. Page Header Bento */}
      <section className="w-full bg-[#f8f9fa] rounded-[2rem] py-16 px-6 sm:px-12 text-center flex flex-col items-center border border-[#18202D]/5 max-w-[1600px] mx-auto">
         <h1 className="text-4xl font-extrabold font-heading text-[#94B447] mb-4">Official Shop Directory</h1>
         <p className="text-[#18202D] max-w-md mb-8">Browse our catalogue of premium B2B corporate supplies and institutional inventory.</p>
         

         
         <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setVisibleCount(24);
                  setLoadingMore('');
                }}
                className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-[13px] font-bold transition-all ${
                  activeCategory === cat 
                    ? 'bg-[#18202D] text-white shadow-md' 
                    : 'bg-white text-[#18202D] hover:text-[#18202D] hover:bg-gray-50 shadow-sm border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
         </div>
      </section>

      {/* 2. Shop Grid & Sections */}
      <section className="w-full flex flex-col gap-12">
         {/* Filter & Count Header */}
         <div className="flex justify-between items-center px-4 max-w-[1600px] mx-auto w-full">
           <span className="text-sm font-bold text-[#18202D] bg-gray-100 px-3 py-1 rounded w-fit">{filteredProducts.length} Supplies Available</span>
           <select className="bg-[#f8f9fa] rounded-xl px-4 py-2 text-sm font-bold text-[#18202D] outline-none border border-gray-200 focus:border-[#94B447] cursor-pointer">
             <option>Featured Supplies</option>
             <option>Price: Low to High</option>
             <option>Price: High to Low</option>
           </select>
         </div>

         {/* Section 1: On Promotion */}
         {onSaleProducts.length > 0 && (
           <div className="w-full">
             <div className="max-w-[1600px] mx-auto px-4 mb-6">
               <h2 className="text-2xl font-bold font-heading text-[#FF6B35] flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11.1 17.1 2.2 2.2a1 1 0 0 0 1.4 0l6.2-6.2a1 1 0 0 0 0-1.4l-2.2-2.2a1 1 0 0 0-1.4 0l-6.2 6.2a1 1 0 0 0 0 1.4Z"></path><path d="m14 14 3-3"></path><path d="M7 6v6l5 5"></path><path d="M4 6v6"></path><path d="M10 6v2"></path></svg>
                 On Promotion
               </h2>
               <p className="text-sm text-gray-500">Specially discounted supplies for a limited time.</p>
             </div>
             <ProductGrid products={onSaleProducts} />
             <div className="w-full mt-12">
               <AnimatedBanner />
             </div>
           </div>
         )}

         {/* Section 2: Top Selling */}
         {topSellingProducts.length > 0 && (
           <div className="w-full">
             <div className="max-w-[1600px] mx-auto px-4 mb-6">
               <h2 className="text-2xl font-bold font-heading text-[#F5A623] flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                 Top Selling items
               </h2>
               <p className="text-sm text-gray-500">Our customer favorites across all categories.</p>
             </div>
             <ProductGrid products={topSellingProducts} />
             {regularProducts.length > 0 && (
               <div className="w-full mt-12 bg-gray-50 border-y border-gray-100 py-8">
                  <div className="max-w-[1600px] mx-auto px-4 text-center">
                    <p className="text-sm font-bold text-gray-400 tracking-widest uppercase">Explore the rest of our catalogue below</p>
                  </div>
               </div>
             )}
           </div>
         )}

         {/* Section 3: All Other Products */}
         {displayedRegularProducts.length > 0 && (
           <div className="w-full mt-6">
             <div className="max-w-[1600px] mx-auto px-4 mb-6 flex justify-between items-end">
               <div>
                 <h2 className="text-2xl font-bold font-heading text-[#94B447]">All Supplies</h2>
                 <p className="text-sm text-gray-500">Browse our extended catalogue of daily essentials.</p>
               </div>
               <Link href="/shop/all-supplies" className="text-sm font-bold text-[#18202D] hover:text-[#94B447] transition-colors flex items-center gap-2">
                 View Full Page
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
               </Link>
             </div>
             <ProductGrid products={displayedRegularProducts} />
           </div>
         )}

         {/* Load More Button -> Link to All Supplies */}
         {regularProducts.length > visibleCount && (
           <div className="w-full flex justify-center mt-8">
              <Link 
                href="/shop/all-supplies"
                className="px-10 py-4 bg-[#18202D] rounded-full text-white font-bold text-sm hover:bg-[#94B447] transition-all shadow-md flex items-center gap-2 min-w-[240px] justify-center"
              >
                Explore Full Inventory
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
           </div>
         )}

      </section>
    </div>
  );
}

export default function ShopArchivePage() {
  return (
    <Suspense fallback={<div className="w-full py-20 text-center">Loading catalogue...</div>}>
      <ShopArchiveContent />
    </Suspense>
  );
}
