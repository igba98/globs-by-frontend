'use client';

import Link from 'next/link';
import { ShoppingCart } from '@/components/icons';
import { useCart } from '@/components/storefront/cart/CartContext';
import { formatTzs } from '@/lib/format';
import type { Product } from '@/lib/types';
import ProductImage from './ProductImage';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO(task3): CartContext is still keyed by product name and stores price
    // as a formatted string. Once the cart is consolidated onto numeric
    // price + productId/slug (Task 3), pass { productId: product.id, slug: product.slug,
    // name: product.name, price: product.price, image } directly.
    addToCart({
      name: product.name,
      price: formatTzs(product.price),
      category: product.category.name,
      image: product.images[0]?.url ?? '',
    });
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="relative group rounded-[3rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 block"
    >

      {/* Product Card Background Layer */}
      <div className="bg-[#ececec] absolute inset-0 transition-colors duration-500 md:group-hover:bg-[#5a5a5a]" />

      <div className="relative aspect-[4/5] flex items-center justify-center">
         {/* Top Floating Category Pill */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 bg-white md:group-hover:bg-black/60 md:group-hover:text-white px-10 py-3 rounded-b-[1.5rem] shadow-sm text-sm font-medium text-primary transition-colors duration-500 whitespace-nowrap">
           {product.category.name}
         </div>

         <ProductImage
           src={product.images[0]?.url}
           alt={product.images[0]?.alt ?? product.name}
           className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
         />

         {/* Dark Overlay on Hover (desktop only — keep mobile text legible) */}
         <div className="absolute inset-0 bg-black/40 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

         {/* Bottom Floating Info Box — visible by default on mobile, hover-reveal on md+ */}
         <div className="absolute bottom-6 left-6 right-6 bg-white rounded-[2rem] p-6 flex justify-between items-center shadow-[0_10px_40px_rgba(0,0,0,0.15)] opacity-100 translate-y-0 md:opacity-0 md:translate-y-8 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-500 ease-out z-30">
           <div>
             <h4 className="font-heading font-normal text-xl text-[#94B447] md:text-2xl mb-1 truncate max-w-[150px] sm:max-w-[200px]">{product.name}</h4>
             <p className="text-sm md:text-base font-semibold text-[#94B447]">{formatTzs(product.price)}</p>
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
