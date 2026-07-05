'use client';

import { useState } from 'react';
import { useCart } from '@/components/storefront/cart/CartContext';
import { formatTzs } from '@/lib/format';

interface AddToCartPanelProps {
  productId: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

export default function AddToCartPanel({ productId, slug, name, price, category, image }: AddToCartPanelProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    // TODO(task3): CartContext is still keyed by product name and stores price
    // as a formatted string. Once the cart is consolidated onto numeric
    // price + productId/slug (Task 3), pass { productId, slug, name, price, image }
    // directly instead of re-formatting here.
    addToCart({ name, price: formatTzs(price), category, image }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Kept on the DOM (not yet consumed by CartContext) so Task 3 can wire
  // productId/slug-based cart identity without touching this call site.
  const cartMeta = { productId, slug };

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
        data-product-id={cartMeta.productId}
        data-product-slug={cartMeta.slug}
        className={`h-[52px] px-8 rounded font-semibold text-[15px] transition-colors shadow-sm flex items-center justify-center gap-2 min-w-[160px] ${
          added ? 'bg-[#94B447] text-white' : 'bg-[#18202D] text-white hover:bg-[#94B447]'
        }`}
      >
        {added ? 'Added to Cart!' : 'Add to Cart'}
      </button>
    </div>
  );
}
