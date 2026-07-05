import Image from 'next/image';

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Shared product image renderer used across the shop grid, all-supplies grid,
 * ProductCard, and the product detail gallery. Falls back to a neutral
 * placeholder box (no external/unsplash images) when a product has no image.
 * Expects to be placed inside a `relative`-positioned, sized parent (it fills
 * that parent, matching the existing `fill` <Image> usage it replaces).
 */
export default function ProductImage({ src, alt, className = '', sizes, priority }: ProductImageProps) {
  if (!src) {
    return (
      <div className={`absolute inset-0 flex items-center justify-center bg-[#f1f2f4] text-gray-300 ${className}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      </div>
    );
  }

  return (
    <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={className} />
  );
}
