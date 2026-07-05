'use client';

import { useState } from 'react';
import type { ProductImage as ProductImageType } from '@/lib/types';
import ProductImage from '@/components/storefront/shop/ProductImage';

export default function Gallery({ images, name }: { images: ProductImageType[]; name: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Huge Display Block */}
      <div className="w-full aspect-[4/3] bg-[#f8f9fa] rounded-[2rem] relative overflow-hidden flex items-center justify-center p-8 border border-[#18202D]/5">
        <ProductImage
          src={active?.url}
          alt={active?.alt ?? name}
          className="object-cover hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails — only when there is more than one image */}
      {images.length > 1 && (
        <div className="grid grid-cols-2 gap-4">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`w-full aspect-[4/3] bg-[#f8f9fa] rounded-[2rem] relative overflow-hidden border flex items-center justify-center p-4 transition-opacity ${
                index === activeIndex ? 'border-[#94B447] opacity-100' : 'border-[#18202D]/5 opacity-50 hover:opacity-80'
              }`}
              aria-label={`Show image ${index + 1} of ${name}`}
            >
              <ProductImage src={image.url} alt={image.alt ?? `${name} detail ${index + 1}`} className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
