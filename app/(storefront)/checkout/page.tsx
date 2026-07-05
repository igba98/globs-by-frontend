'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/storefront/cart/CartContext';
import { ApiError, createOrder, getDeliveryZones } from '@/lib/api';
import { formatTzs } from '@/lib/format';
import type { DeliveryZone } from '@/lib/types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(\+?255|0)[67]\d{8}$/;

type DeliveryMethod = 'PICKUP' | 'DELIVERY';
type PaymentMethod = 'MOBILE_MONEY' | 'CARD' | 'CASH';

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; description: string }[] = [
  {
    value: 'MOBILE_MONEY',
    label: 'Mobile Money',
    description: 'Pay via M-Pesa, Tigo Pesa, or Airtel Money.',
  },
  {
    value: 'CARD',
    label: 'Card on delivery',
    description: 'Pay by Visa or Mastercard when your order arrives.',
  },
  {
    value: 'CASH',
    label: 'Cash',
    description: 'Pay with cash on pickup or delivery.',
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart, isHydrated } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('DELIVERY');
  const [deliveryZoneId, setDeliveryZoneId] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MOBILE_MONEY');

  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [zonesLoading, setZonesLoading] = useState(true);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getDeliveryZones()
      .then((data) => {
        if (cancelled) return;
        setZones(data);
        if (data.length === 0) setDeliveryMethod('PICKUP');
      })
      .catch(() => {
        if (!cancelled) setZones([]);
      })
      .finally(() => {
        if (!cancelled) setZonesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedZone = useMemo(
    () => zones.find((z) => z.id === deliveryZoneId),
    [zones, deliveryZoneId],
  );

  const deliveryFee = useMemo(() => {
    if (deliveryMethod === 'PICKUP') return 0;
    if (!selectedZone) return 0;
    if (selectedZone.freeOver != null && subtotal >= selectedZone.freeOver) return 0;
    return selectedZone.fee;
  }, [deliveryMethod, selectedZone, subtotal]);

  const total = subtotal + deliveryFee;

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) errs.customerName = 'Full name is required.';
    if (!EMAIL_RE.test(customerEmail.trim())) errs.customerEmail = 'Enter a valid email address.';
    const strippedPhone = customerPhone.replace(/\s+/g, '');
    if (!PHONE_RE.test(strippedPhone)) {
      errs.customerPhone = 'Enter a valid Tanzanian mobile number, e.g. 07XX XXX XXX.';
    }
    if (deliveryMethod === 'DELIVERY' && !deliveryZoneId) {
      errs.deliveryZoneId = 'Select a delivery zone.';
    }
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;

    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const order = await createOrder({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.replace(/\s+/g, ''),
        deliveryMethod,
        deliveryZoneId: deliveryMethod === 'DELIVERY' ? deliveryZoneId : undefined,
        deliveryAddress:
          deliveryMethod === 'DELIVERY' && deliveryAddress.trim() ? deliveryAddress.trim() : undefined,
        paymentMethod,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      clearCart();
      router.push('/checkout/success?order=' + encodeURIComponent(order.orderNumber));
    } catch (err) {
      if (err instanceof ApiError) {
        setSubmitError(err.message);
      } else {
        setSubmitError('Something went wrong placing your order. Please try again.');
      }
      setIsSubmitting(false);
    }
  }

  // Wait for the localStorage cart to hydrate before deciding whether to show
  // the empty-cart state, so a real saved cart doesn't flash "empty".
  if (isHydrated && items.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto py-24 px-4 text-center">
        <h1 className="text-3xl font-extrabold font-heading text-[#94B447] mb-4">Your cart is empty</h1>
        <p className="text-[#18202D] text-[15px] font-medium mb-10">
          Add some items to your cart before checking out.
        </p>
        <Link
          href="/shop"
          className="inline-flex px-10 py-4 bg-[#18202D] text-white font-bold rounded-xl hover:bg-[#94B447] transition-colors shadow-lg text-[15px]"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6">

      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold font-heading text-[#94B447]">Checkout</h1>
        <p className="text-sm font-medium text-[#18202D] mt-2">Secure encrypted payment processing.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Left Form Panel: Information & Payment */}
        <div className="lg:col-span-7 flex flex-col gap-10">

          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm font-medium">
              {submitError}
            </div>
          )}

          {/* Section 1: Customer Details */}
          <section>
            <h2 className="text-xl font-bold text-[#94B447] mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#18202D] text-white flex items-center justify-center text-xs">1</span>
              Customer Details
            </h2>
            <div className="bg-[#f8f9fa] rounded-2xl p-8 border border-[#18202D]/5 flex flex-col gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-4 rounded-xl border border-gray-200 outline-none text-[15px] font-medium placeholder-gray-400 focus:border-[#18202D]"
                />
                {fieldErrors.customerName && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.customerName}</p>
                )}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full p-4 rounded-xl border border-gray-200 outline-none text-[15px] font-medium placeholder-gray-400 focus:border-[#18202D]"
                />
                {fieldErrors.customerEmail && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.customerEmail}</p>
                )}
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="07XX XXX XXX"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full p-4 rounded-xl border border-gray-200 outline-none text-[15px] font-medium placeholder-gray-400 focus:border-[#18202D]"
                />
                <p className="text-xs text-gray-400 mt-1">Format: 07XX XXX XXX</p>
                {fieldErrors.customerPhone && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.customerPhone}</p>
                )}
              </div>
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
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${deliveryMethod === 'DELIVERY' ? 'border-[#18202D] bg-[#f8f9fa]' : 'border-gray-100 hover:border-gray-200'}`}>
                  <input type="radio" checked={deliveryMethod === 'DELIVERY'} onChange={() => setDeliveryMethod('DELIVERY')} className="w-5 h-5 accent-[#18202D]" />
                  <span className="font-bold text-[#18202D]">Standard Delivery</span>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${deliveryMethod === 'PICKUP' ? 'border-[#18202D] bg-[#f8f9fa]' : 'border-gray-100 hover:border-gray-200'}`}>
                  <input type="radio" checked={deliveryMethod === 'PICKUP'} onChange={() => setDeliveryMethod('PICKUP')} className="w-5 h-5 accent-[#18202D]" />
                  <span className="font-bold text-[#18202D]">Self Pickup</span>
                </label>
              </div>

              {deliveryMethod === 'DELIVERY' && (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-[#18202D]">Delivery Zone</label>
                    {zonesLoading ? (
                      <div className="w-full p-4 rounded-xl border border-gray-200 text-[15px] text-gray-400 font-medium bg-white">
                        Loading delivery zones…
                      </div>
                    ) : zones.length === 0 ? (
                      <div className="w-full p-4 rounded-xl border border-gray-200 text-[15px] text-gray-500 font-medium bg-white">
                        No delivery zones available right now — please choose Self Pickup.
                      </div>
                    ) : (
                      <select
                        value={deliveryZoneId}
                        onChange={(e) => setDeliveryZoneId(e.target.value)}
                        className="w-full p-4 rounded-xl border border-gray-200 outline-none text-[15px] font-medium focus:border-[#18202D] bg-white"
                      >
                        <option value="">Select a zone…</option>
                        {zones.map((zone) => (
                          <option key={zone.id} value={zone.id}>
                            {zone.name} — {formatTzs(zone.fee)}
                            {zone.freeOver != null ? ` (free over ${formatTzs(zone.freeOver)})` : ''}
                          </option>
                        ))}
                      </select>
                    )}
                    {fieldErrors.deliveryZoneId && (
                      <p className="text-xs text-red-600 font-medium">{fieldErrors.deliveryZoneId}</p>
                    )}
                  </div>
                  <textarea
                    placeholder="Full Delivery Address / Landmark (optional)"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    rows={3}
                    className="w-full p-4 rounded-xl border border-gray-200 outline-none text-[15px] font-medium placeholder-gray-400 focus:border-[#18202D] resize-none"
                  />
                </div>
              )}

              {deliveryMethod === 'PICKUP' && (
                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                  Please collect your order at our Dar es Salaam branch (Grants Care Building) or Mbeya branch (Mwanjelwa Tunduma Road). You will receive an SMS when the package is ready.
                </div>
              )}
            </div>
          </section>

          {/* Section 3: Payment */}
          <section>
            <h2 className="text-xl font-bold text-[#94B447] mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#18202D] text-white flex items-center justify-center text-xs">3</span>
              Payment Method
            </h2>

            <div className="flex flex-col gap-4">
              {PAYMENT_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-4 rounded-2xl p-6 cursor-pointer transition-colors border-2 ${
                    paymentMethod === option.value
                      ? 'bg-[#f8f9fa] border-[#18202D]'
                      : 'bg-white border-[#18202D]/10 hover:border-[#18202D]/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === option.value}
                    onChange={() => setPaymentMethod(option.value)}
                    className="w-5 h-5 accent-[#18202D]"
                  />
                  <div>
                    <h4 className="text-[15px] font-bold text-[#94B447]">{option.label}</h4>
                    <p className="text-[13px] text-[#18202D] font-medium">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

        </div>

        {/* Right Panel: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-[#f8f9fa] rounded-3xl p-8 sticky top-[100px] border border-[#18202D]/5">
            <h3 className="text-xl font-bold text-[#94B447] mb-6">Order Summary</h3>

            <div className="flex flex-col gap-6 mb-8 border-b border-gray-200 pb-8">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  <div className="w-20 h-20 bg-white rounded-xl relative overflow-hidden flex-shrink-0 border border-gray-100 p-2">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                    <div className="absolute top-[-5px] right-[-5px] w-5 h-5 bg-[#18202D] text-white rounded-full flex items-center justify-center text-[10px] z-10">{item.quantity}</div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-[15px] font-bold text-[#94B447] truncate">{item.name}</h4>
                    <p className="text-[13px] font-medium text-[#18202D]">{formatTzs(item.price)}</p>
                  </div>
                  <div className="text-[15px] font-bold text-[#94B447] flex items-center">
                    {formatTzs(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 font-medium text-[15px] text-[#18202D] mb-8">
              <div className="flex justify-between">
                <span className="text-[#18202D]">Subtotal</span>
                <span>{formatTzs(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#18202D]">
                  {deliveryMethod === 'DELIVERY' ? 'Delivery Fee' : 'Self Pickup'}
                </span>
                <span>{deliveryFee === 0 ? 'Free' : formatTzs(deliveryFee)}</span>
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-200 text-xl font-extrabold pb-2">
                <span>Total</span>
                <span className="text-[#94B447]">{formatTzs(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="w-full h-14 bg-[#18202D] text-white font-bold rounded-xl text-[15px] hover:bg-[#94B447] transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Placing order…
                </>
              ) : (
                'Complete Order'
              )}
            </button>

            <p className="text-center text-[11px] text-[#18202D] mt-6 flex items-center justify-center gap-1 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Standard 256-bit SSL Encryption
            </p>
          </div>
        </div>

      </form>
    </div>
  );
}
