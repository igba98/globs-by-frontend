'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { supplyProducts } from '@/lib/data';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state: any) => state.addItem);

  const product = supplyProducts.find(p => p.id === parseInt(id)) || supplyProducts[0];

  return (
    <div className="w-full max-w-7xl mx-auto py-12 lg:py-16">
      
      {/* Breadcrumb back to shop */}
      <div className="mb-8">
        <Link href="/shop" className="text-sm font-bold text-gray-400 hover:text-[#18202D] transition-colors flex items-center gap-2">
          ← Back to Shop
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Left Column: Image Gallery Grid */}
        <div className="flex flex-col gap-4">
          {/* Main Huge Display Block */}
          <div className="w-full aspect-[4/3] bg-[#f8f9fa] rounded-[2rem] relative overflow-hidden flex items-center justify-center p-8 border border-[#18202D]/5">
             <Image 
               src={product.image} 
               alt={product.name} 
               fill 
               className="object-cover hover:scale-105 transition-transform duration-700"
             />
          </div>
          
          {/* Bottom Thumbnails (Reusing same image or others if available, for now just same) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full aspect-[4/3] bg-[#f8f9fa] rounded-[2rem] relative overflow-hidden border border-[#18202D]/5 flex items-center justify-center p-4 opacity-50">
               <Image 
                 src={product.image} 
                 alt="Detail 1" 
                 fill 
                 className="object-cover"
               />
            </div>
            <div className="w-full aspect-[4/3] bg-[#f8f9fa] rounded-[2rem] relative overflow-hidden border border-[#18202D]/5 flex items-center justify-center p-4 opacity-50">
               <Image 
                 src={product.image} 
                 alt="Detail 2" 
                 fill 
                 className="object-cover"
               />
            </div>
          </div>
        </div>

        {/* Right Column: Product Detail Pane */}
        <div className="flex flex-col justify-start py-8">
          
          <div className="text-[12px] uppercase tracking-wider font-bold text-[#94B447] mb-2">{product.category}</div>
          <h1 className="text-4xl lg:text-[40px] font-medium font-heading text-[#18202D] mb-6">
            {product.name}
          </h1>

          <p className="text-[15px] leading-relaxed text-gray-500 mb-8 max-w-[90%] font-medium">
            {product.description}
          </p>

          <div className="text-[28px] font-medium text-[#18202D] mb-10">
            {product.price}
          </div>

          <div className="flex items-center gap-4 mb-16">
             {/* Quantity Input */}
             <div className="relative">
               <input 
                 type="number" 
                 min="1" 
                 value={quantity} 
                 onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                 className="w-20 h-[52px] border border-gray-200 rounded text-center px-4 outline-none focus:border-[#18202D] text-[#18202D] font-medium"
               />
             </div>
             {/* Add to Cart Button */}
             <button onClick={() => addItem({ id: product.id.toString(), name: product.name, price: parseInt(product.price.replace(/[^\d]/g, '')), quantity, image: product.image })} className="h-[52px] bg-[#18202D] text-white px-8 rounded font-semibold text-[15px] hover:bg-[#94B447] transition-colors shadow-sm">
               Add to Cart
             </button>
          </div>

          {/* Shipping & Delivery Grid */}
          <div className="pt-10 border-t border-gray-100">
             <h3 className="text-xl font-medium text-[#18202D] mb-8">Shipping & Delivery</h3>
             
             <div className="grid grid-cols-3 gap-6">
               
               <div className="flex flex-col gap-4">
                 <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#18202D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline><path d="M16.5 4.5l3-3"></path><path d="M21 7V3h-4"></path></svg>
                 <p className="text-[13px] text-gray-800 font-medium leading-snug">
                   Quick order preparation and dispatch.
                 </p>
               </div>
               
               <div className="flex flex-col gap-4">
                 <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#18202D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                 <p className="text-[13px] text-gray-800 font-medium leading-snug">
                   Safe and reliable on-time delivery assured.
                 </p>
               </div>
               
               <div className="flex flex-col gap-4">
                 <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#18202D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                 <p className="text-[13px] text-gray-800 font-medium leading-snug">
                   Easy tracking from dispatch to arrival.
                 </p>
               </div>

             </div>
          </div>

        </div>

      </div>

    </div>
  );
}
