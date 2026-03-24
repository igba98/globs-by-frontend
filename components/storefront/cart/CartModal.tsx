'use client';

import { useCart } from '@/components/storefront/cart/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CartModal() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, subtotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-[90%] max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-heading text-[#94B447] font-medium">Your Cart</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="text-[#18202D] hover:text-primary transition-colors text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Cart Items List */}
        <div className="max-h-[50vh] overflow-y-auto px-6 py-4 space-y-6">
          {items.length === 0 ? (
            <p className="text-[#18202D] text-center py-8">Your cart is currently empty.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                
                {/* Thumbnail */}
                <div className="relative w-24 h-24 bg-[#ececec] rounded-2xl flex-shrink-0 flex items-center justify-center p-2">
                  <Image 
                    src={item.image} 
                    fill 
                    alt={item.name} 
                    className="object-contain mix-blend-multiply" 
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-heading text-lg text-[#94B447]">{item.name}</h3>
                  <p className="text-sm font-semibold text-[#94B447] mt-1">{item.price}</p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-[#18202D] hover:text-red-500 mt-2 transition-colors"
                  >
                    Remove
                  </button>
                </div>

                {/* Qty Input */}
                <input 
                  type="number" 
                  min="1" 
                  value={item.quantity} 
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                  className="w-16 border border-gray-200 rounded-xl px-2 py-2 text-center text-primary"
                />
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {items.length > 0 && (
          <div className="p-6 bg-gray-50/50 border-t border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-medium text-primary">Subtotal</span>
              <span className="text-xl font-heading text-[#94B447]">{subtotal}</span>
            </div>
            <Link 
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="w-full bg-black text-white hover:bg-[#1a1a1a] transition-colors py-4 rounded-xl font-medium text-lg flex items-center justify-center"
            >
              Continue to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
