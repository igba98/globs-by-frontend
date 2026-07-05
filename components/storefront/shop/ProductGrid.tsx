import Link from 'next/link';
import type { Product } from '@/lib/types';
import { formatTzs } from '@/lib/format';
import ProductImage from './ProductImage';

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 px-4 w-full max-w-[1600px] mx-auto">
      {products.map((product) => (
        <Link
          href={`/product/${product.slug}`}
          key={product.id}
          className="bg-white rounded-2xl aspect-[3/4] relative flex flex-col items-center group overflow-hidden drop-shadow-sm hover:-translate-y-1 transition-transform border border-gray-100 p-3 sm:p-4 hover:shadow-md"
        >
          {/* Top Pill / White Header Tag */}
          <div className="absolute top-0 left-0 w-full bg-white/95 backdrop-blur-sm px-2 py-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] text-[10px] sm:text-xs font-bold text-[#18202D] z-10 text-center truncate border-b border-gray-50 flex items-center justify-center gap-1">
            {product.name}
            {product.isOnSale && <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 animate-pulse"></span>}
          </div>

          {/* Full-bleed Cover */}
          <div className="w-full h-[65%] mt-6 relative z-0 group-hover:scale-105 transition-transform duration-700 bg-[#f8f9fa] rounded-lg overflow-hidden border border-gray-50">
            <ProductImage
              src={product.images[0]?.url}
              alt={product.images[0]?.alt ?? product.name}
              className="object-contain p-2"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
            />
          </div>

          {/* Pricing Info at bottom */}
          <div className="w-full mt-auto text-center flex flex-col items-center justify-end">
            <div className="text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-0.5 truncate w-full">{product.category.name}</div>
            <div className="text-xs sm:text-sm font-extrabold text-[#94B447]">{formatTzs(product.price)}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
