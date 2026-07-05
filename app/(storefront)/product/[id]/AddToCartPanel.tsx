'use client';

import { useState } from 'react';
import { useCart } from '@/components/storefront/cart/CartContext';

interface AddToCartPanelProps {
  productId: string;
  slug: string;
  name: string;
  price: number;
  category?: string;
  image: string;
}

export default function AddToCartPanel({ productId, slug, name, price, image }: AddToCartPanelProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({ productId, slug, name, price, image }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
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
      <button
        onClick={handleAddToCart}
        data-product-id={productId}
        data-product-slug={slug}
        className={`h-[52px] px-8 rounded font-semibold text-[15px] transition-colors shadow-sm flex items-center justify-center gap-2 min-w-[160px] ${
          added ? 'bg-[#94B447] text-white' : 'bg-[#18202D] text-white hover:bg-[#94B447]'
        }`}
      >
        {added ? 'Added to Cart!' : 'Add to Cart'}
      </button>
    </div>
  );
}
