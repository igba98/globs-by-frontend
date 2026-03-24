'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from '@/components/icons';
import { useCart } from '@/components/storefront/cart/CartContext';

interface ProductCardProps {
  product: {
    name: string;
    price: string;
    category: string;
    image: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link 
      href={`/product/${encodeURIComponent(product.name)}`} 
      className="relative group rounded-[3rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 block"
    >
      
      {/* Product Card Background Layer */}
      <div className="bg-[#ececec] absolute inset-0 transition-colors duration-500 group-hover:bg-[#5a5a5a]" />

      <div className="relative aspect-[4/5] flex items-center justify-center">
         {/* Top Floating Category Pill */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 bg-white group-hover:bg-black/60 group-hover:text-white px-10 py-3 rounded-b-[1.5rem] shadow-sm text-sm font-medium text-primary transition-colors duration-500 whitespace-nowrap">
           {product.category}
         </div>
         
         <Image 
           src={product.image} 
           fill 
           className="object-cover object-center transition-transform duration-700 group-hover:scale-105" 
           alt={product.name} 
           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
         />

         {/* Dark Overlay on Hover */}
         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

         {/* Bottom Floating Info Box (Revealed on Hover) */}
         <div className="absolute bottom-6 left-6 right-6 bg-white rounded-[2rem] p-6 flex justify-between items-center shadow-[0_10px_40px_rgba(0,0,0,0.15)] opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out z-30">
           <div>
             <h4 className="font-heading font-normal text-xl text-[#94B447] md:text-2xl mb-1 truncate max-w-[150px] sm:max-w-[200px]">{product.name}</h4>
             <p className="text-sm md:text-base font-semibold text-[#94B447]">{product.price}</p>
           </div>
           <button 
             onClick={handleAddToCart}
             className="h-12 w-12 border border-gray-200 rounded-full flex items-center justify-center hover:bg-[#18202D] hover:text-white transition-colors flex-shrink-0"
             aria-label="Add to cart"
           >
              <ShoppingCart className="h-5 w-5" />
           </button>
         </div>
      </div>
    </Link>
  );
}
