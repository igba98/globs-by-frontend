'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';

const DELIVERY_FEES = {
  dar_es_salaam: 5000,
  mbeya: 15000,
  other: 25000,
};

export default function CheckoutPage() {
  const { items, getFormattedTotal } = useCartStore();
  
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryZone, setDeliveryZone] = useState<keyof typeof DELIVERY_FEES>('dar_es_salaam');

  const subtotal = items.reduce((acc: any, curr: any) => acc + curr.price * curr.quantity, 0);
  const deliveryFee = deliveryMethod === 'delivery' ? DELIVERY_FEES[deliveryZone] : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6">
      
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold font-heading text-[#94B447]">Checkout</h1>
        <p className="text-sm font-medium text-[#18202D] mt-2">Secure encrypted payment processing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Form Panel: Information & Payment */}
        <div className="lg:col-span-7 flex flex-col gap-10">
          
          {/* Section 1: Customer Details */}
          <section>
            <h2 className="text-xl font-bold text-[#94B447] mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#18202D] text-white flex items-center justify-center text-xs">1</span>
              Customer Details
            </h2>
            <div className="bg-[#f8f9fa] rounded-2xl p-8 border border-[#18202D]/5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="w-full p-4 rounded-xl border border-gray-200 outline-none text-[15px] font-medium placeholder-gray-400 focus:border-[#18202D]" />
                <input type="text" placeholder="Last Name" className="w-full p-4 rounded-xl border border-gray-200 outline-none text-[15px] font-medium placeholder-gray-400 focus:border-[#18202D]" />
              </div>
              <input type="email" placeholder="Email Address" className="w-full p-4 rounded-xl border border-gray-200 outline-none text-[15px] font-medium placeholder-gray-400 focus:border-[#18202D]" />
              <input type="tel" placeholder="Phone Number (e.g. +255 712...)" className="w-full p-4 rounded-xl border border-gray-200 outline-none text-[15px] font-medium placeholder-gray-400 focus:border-[#18202D]" />
            </div>
          </section>

          {/* Section 2: Delivery Options */}
          <section>
            <h2 className="text-xl font-bold text-[#94B447] mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#18202D] text-white flex items-center justify-center text-xs">2</span>
              Delivery Method
            </h2>
            <div className="bg-white rounded-2xl p-6 border border-[#18202D]/10 flex flex-col gap-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${deliveryMethod === 'delivery' ? 'border-[#18202D] bg-[#f8f9fa]' : 'border-gray-100 hover:border-gray-200'}`}>
                  <input type="radio" checked={deliveryMethod === 'delivery'} onChange={() => setDeliveryMethod('delivery')} className="w-5 h-5 accent-[#18202D]" />
                  <span className="font-bold text-[#18202D]">Standard Delivery</span>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${deliveryMethod === 'pickup' ? 'border-[#18202D] bg-[#f8f9fa]' : 'border-gray-100 hover:border-gray-200'}`}>
                  <input type="radio" checked={deliveryMethod === 'pickup'} onChange={() => setDeliveryMethod('pickup')} className="w-5 h-5 accent-[#18202D]" />
                  <span className="font-bold text-[#18202D]">Self Pickup</span>
                </label>
              </div>

              {deliveryMethod === 'delivery' && (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-[#18202D]">Delivery Zone</label>
                    <select 
                      value={deliveryZone} 
                      onChange={(e) => setDeliveryZone(e.target.value as any)}
                      className="w-full p-4 rounded-xl border border-gray-200 outline-none text-[15px] font-medium focus:border-[#18202D] bg-white"
                    >
                      <option value="dar_es_salaam">Dar es Salaam Region (TZS 5,000)</option>
                      <option value="mbeya">Mbeya Region (TZS 15,000)</option>
                      <option value="other">Other Regions (TZS 25,000)</option>
                    </select>
                  </div>
                  <input type="text" placeholder="Full Delivery Address / Landmark" className="w-full p-4 rounded-xl border border-gray-200 outline-none text-[15px] font-medium placeholder-gray-400 focus:border-[#18202D]" />
                </div>
              )}

              {deliveryMethod === 'pickup' && (
                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                  Please collect your order at our Dar es Salaam branch (Grants Care Building) or Mbeya branch (Mwanjelwa Tunduma Road). You will receive an SMS when the package is ready.
                </div>
              )}
            </div>
          </section>

          {/* Section 3: Mobile Network & Payments */}
          <section>
            <h2 className="text-xl font-bold text-[#94B447] mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#18202D] text-white flex items-center justify-center text-xs">3</span>
              Payment Method
            </h2>
            
            <div className="flex flex-col gap-4">
               {/* Option 1: Mobile Money */}
               <label className="flex items-center justify-between bg-[#f8f9fa] border-2 border-[#18202D] rounded-2xl p-6 cursor-pointer">
                 <div className="flex items-center gap-4">
                   <input type="radio" name="payment" defaultChecked className="w-5 h-5 accent-[#18202D]" />
                   <div>
                     <h4 className="text-[15px] font-bold text-[#94B447]">Mobile Network (Tanzania)</h4>
                     <p className="text-[13px] text-[#18202D] font-medium">Pay instantly via M-Pesa, Tigo Pesa, or Airtel Money.</p>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   <div className="w-8 h-8 rounded-full bg-red-500 border border-red-600"></div> {/* Vodacom Mock */}
                   <div className="w-8 h-8 rounded-full bg-blue-500 border border-blue-600"></div> {/* Tigo Mock */}
                   <div className="w-8 h-8 rounded-full bg-red-600 border border-red-700"></div> {/* Airtel Mock */}
                 </div>
               </label>
               
               {/* Internal M-Pesa push form simulation */}
               <div className="bg-[#f8f9fa] border border-[#18202D]/10 rounded-2xl p-6 pl-14">
                  <p className="text-[13px] font-medium text-[#18202D] mb-3 cursor-text">Enter your mobile money number to receive a payment prompt on your phone.</p>
                  <input type="tel" placeholder="07XX XXX XXX or 06XX XXX XXX" className="w-full max-w-sm p-4 rounded-xl border border-gray-200 outline-none text-[15px] font-medium shadow-sm placeholder-gray-400 focus:border-[#18202D]" />
               </div>

               {/* Option 2: Credit Card */}
               <label className="flex items-center justify-between bg-white border border-[#18202D]/10 rounded-2xl p-6 cursor-pointer hover:border-[#18202D]/30 transition-colors">
                 <div className="flex items-center gap-4">
                   <input type="radio" name="payment" className="w-5 h-5 accent-[#18202D]" />
                   <div>
                     <h4 className="text-[15px] font-bold text-[#94B447]">Credit Card</h4>
                     <p className="text-[13px] text-[#18202D] font-medium">Visa, Mastercard, American Express.</p>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   {/* Visa / MC mock shapes */}
                   <div className="w-10 h-6 bg-blue-100 rounded"></div>
                   <div className="w-10 h-6 bg-orange-100 rounded"></div>
                 </div>
               </label>

            </div>
          </section>

        </div>

        {/* Right Panel: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-[#f8f9fa] rounded-3xl p-8 sticky top-[100px] border border-[#18202D]/5">
            <h3 className="text-xl font-bold text-[#94B447] mb-6">Order Summary</h3>
            
            <div className="flex flex-col gap-6 mb-8 border-b border-gray-200 pb-8">
               {items.map((item: any) => (
                 <div key={item.id} className="flex gap-4">
                   <div className="w-20 h-20 bg-white rounded-xl relative overflow-hidden flex-shrink-0 border border-gray-100 p-2">
                     <Image src={item.image} alt={item.name} fill className="object-cover" />
                     <div className="absolute top-[-5px] right-[-5px] w-5 h-5 bg-[#18202D] text-white rounded-full flex items-center justify-center text-[10px] z-10">{item.quantity}</div>
                   </div>
                   <div className="flex-1 flex flex-col justify-center">
                     <h4 className="text-[15px] font-bold text-[#94B447] truncate">{item.name}</h4>
                     <p className="text-[13px] font-medium text-[#18202D]">TZS {(item.price).toLocaleString()}</p>
                   </div>
                   <div className="text-[15px] font-bold text-[#94B447] flex items-center">
                     TZS {(item.price * item.quantity).toLocaleString()}
                   </div>
                 </div>
               ))}

               {items.length === 0 && (
                 <p className="text-sm font-medium text-gray-500 text-center py-4">Your cart is empty.</p>
               )}
            </div>

            <div className="flex flex-col gap-3 font-medium text-[15px] text-[#18202D] mb-8">
              <div className="flex justify-between">
                <span className="text-[#18202D]">Subtotal</span>
                <span>TZS {subtotal.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-[#18202D]">
                  {deliveryMethod === 'delivery' 
                    ? `Shipping (${deliveryZone.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())})`
                    : 'Self Pickup'
                  }
                </span>
                <span>{deliveryFee === 0 ? 'Free' : `TZS ${deliveryFee.toLocaleString()}`}</span>
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-200 text-xl font-extrabold pb-2">
                <span>Total</span>
                <span className="text-[#94B447]">TZS {total.toLocaleString()}</span>
              </div>
            </div>

            <Link href="/checkout/success">
              <button disabled={items.length === 0} className="w-full h-14 bg-[#18202D] text-white font-bold rounded-xl text-[15px] hover:bg-[#94B447] transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                Complete Order
              </button>
            </Link>

            <p className="text-center text-[11px] text-[#18202D] mt-6 flex items-center justify-center gap-1 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Standard 256-bit SSL Encryption
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
