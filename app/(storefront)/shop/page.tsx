'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const products = [
  { id: 1, name: 'Premium Copier Paper', price: 'TZS 45,000', category: 'Supplies', image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Executive Planner 2026', price: 'TZS 110,000', category: 'Branding', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'Toner Cartridge XL', price: 'TZS 250,000', category: 'Hardware', image: 'https://images.unsplash.com/photo-1621245781308-4663dcc84f47?auto=format&fit=crop&q=80&w=400' },
  { id: 4, name: 'Fountain Pen Suite', price: 'TZS 85,000', category: 'Stationery', image: 'https://images.unsplash.com/photo-1583590082725-d91ff76b1fca?auto=format&fit=crop&q=80&w=400' },
  { id: 5, name: 'Pro Wireless Mouse', price: 'TZS 55,000', category: 'Tech', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=400' },
  { id: 6, name: 'Artist Acrylic Set', price: 'TZS 42,000', category: 'Art', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=400' },
  { id: 7, name: 'Arch Lever Binders', price: 'TZS 35,000', category: 'Supplies', image: 'https://images.unsplash.com/photo-1634546419089-13651dffc5f9?auto=format&fit=crop&q=80&w=400' },
  { id: 8, name: 'Breakroom Coffee 5kg', price: 'TZS 120,000', category: 'Breakroom', image: 'https://images.unsplash.com/photo-1584285496417-6d60ea8d35f4?auto=format&fit=crop&q=80&w=400' },
];

const categories = ['All', 'Supplies', 'Tech', 'Stationery', 'Branding', 'Art', 'Breakroom', 'Hardware'];

export default function ShopArchivePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="w-full flex flex-col items-center space-y-12 pb-20 pt-4">
      
      {/* 1. Page Header Bento */}
      <section className="w-full bg-[#f8f9fa] rounded-[2rem] py-16 px-12 text-center flex flex-col items-center border border-[#18202D]/5">
         <h1 className="text-4xl font-extrabold font-heading text-[#18202D] mb-4">Official Shop Directory</h1>
         <p className="text-gray-500 max-w-md">Browse our catalogue of premium B2B corporate supplies and institutional inventory.</p>
         
         <div className="flex flex-wrap justify-center gap-3 mt-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-[13px] font-bold transition-all ${
                  activeCategory === cat 
                    ? 'bg-[#18202D] text-white shadow-md' 
                    : 'bg-white text-gray-500 hover:text-[#18202D] hover:bg-gray-50 shadow-sm border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
         </div>
      </section>

      {/* 2. Shop Grid */}
      <section className="w-full">
         <div className="flex justify-between items-center mb-8 px-4">
           <span className="text-sm font-bold text-gray-400">{filteredProducts.length} Supplies Available</span>
           <select className="bg-[#f8f9fa] rounded-xl px-4 py-2 text-sm font-bold text-[#18202D] outline-none border border-gray-100 focus:border-[#94B447]">
             <option>Featured Supplies</option>
             <option>Price: Low to High</option>
             <option>Price: High to Low</option>
           </select>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((pkg) => (
               <Link href={`/product/${pkg.id}`} key={pkg.id} className="bg-[#e9ecef] rounded-[2rem] aspect-[4/5] relative flex flex-col items-center group overflow-hidden drop-shadow-sm hover:-translate-y-1 transition-transform border border-[#18202D]/5 p-6">
                 
                 {/* Top Pill / White Header Tag from Havinic Design */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-6 py-2 rounded-b-2xl shadow-sm text-[11px] font-bold text-[#18202D] z-10 whitespace-nowrap">
                   {pkg.name} {/* Short name pill */}
                 </div>

                 {/* Full-bleed Cover for entire card bounds */}
                 <div className="w-full h-full absolute inset-0 z-0 group-hover:scale-105 transition-transform duration-700">
                   <Image src={pkg.image} alt={pkg.name} fill className="object-cover" />
                 </div>

                 {/* Hover Reveal Bottom Pricing Card */}
                 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] bg-white/95 backdrop-blur-md rounded-2xl px-6 py-3 shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-center">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-0.5">{pkg.category}</div>
                    <div className="text-[15px] font-extrabold text-[#18202D]">{pkg.price}</div>
                 </div>
               </Link>
            ))}
         </div>

         {/* Load More Bento Button */}
         {filteredProducts.length > 0 && (
           <div className="w-full flex justify-center mt-12">
              <button className="px-10 py-4 bg-[#f8f9fa] rounded-full text-[#18202D] font-bold text-sm hover:bg-[#18202D] hover:text-white border border-gray-200 hover:border-[#18202D] transition-colors shadow-sm">
                Discover More Inventory
              </button>
           </div>
         )}

      </section>
    </div>
  );
}
