import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ApiError, API_BASE, trackOrder } from '@/lib/api';
import { formatTzs } from '@/lib/format';
import { CheckCircle } from '@/components/icons';
import ProgressStepper from './ProgressStepper';

function labelize(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function orderStatusClasses(status: string): string {
  switch (status) {
    case 'DELIVERED':
      return 'bg-green-50 text-green-700 border border-green-200';
    case 'CANCELLED':
      return 'bg-red-50 text-red-700 border border-red-200';
    case 'SHIPPED':
    case 'PROCESSING':
      return 'bg-blue-50 text-blue-700 border border-blue-200';
    default:
      return 'bg-gray-100 text-[#18202D] border border-gray-200';
  }
}

function paymentStatusClasses(status: string): string {
  switch (status) {
    case 'PAID':
      return 'bg-green-50 text-green-700 border border-green-200';
    case 'FAILED':
    case 'REFUNDED':
      return 'bg-red-50 text-red-700 border border-red-200';
    default:
      return 'bg-yellow-50 text-yellow-800 border border-yellow-200';
  }
}

export default async function TrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderNumber = decodeURIComponent(id);

  let order;
  try {
    order = await trackOrder(orderNumber);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  const createdAt = new Date(order.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="w-full min-h-screen bg-white pb-24 pt-32 sm:pt-40">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 text-green-600 rounded-full mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="font-heading text-4xl text-[#94B447] font-medium mb-4">Track Your Order</h1>
          <p className="text-[#18202D] text-lg">
            Order <span className="font-bold text-[#94B447]">{order.orderNumber}</span> placed on {createdAt}.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${orderStatusClasses(order.orderStatus)}`}>
              {labelize(order.orderStatus)}
            </span>
            <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${paymentStatusClasses(order.paymentStatus)}`}>
              Payment: {labelize(order.paymentStatus)}
            </span>
          </div>
        </div>

        <ProgressStepper orderStatus={order.orderStatus} deliveryMethod={order.deliveryMethod} />

        {/* Order Details */}
        <div className="bg-[#f8f9fa] rounded-[3rem] p-10 sm:p-16 border border-gray-100">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <h2 className="font-heading text-2xl text-[#94B447]">Order Details</h2>
            <span className="text-sm font-bold text-[#18202D] bg-white border border-gray-200 px-4 py-2 rounded-full">
              {order.deliveryMethod === 'PICKUP' ? 'Self Pickup' : 'Delivery'}
            </span>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto mb-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-[#18202D] text-xs font-bold uppercase tracking-wide">
                  <th className="py-3 pr-4">Item</th>
                  <th className="py-3 pr-4 text-center">Qty</th>
                  <th className="py-3 pr-4 text-right">Unit Price</th>
                  <th className="py-3 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-4 pr-4 font-semibold text-[#94B447]">{item.productName}</td>
                    <td className="py-4 pr-4 text-center text-[#18202D] font-medium">{item.quantity}</td>
                    <td className="py-4 pr-4 text-right text-[#18202D] font-medium">{formatTzs(item.unitPrice)}</td>
                    <td className="py-4 text-right text-[#18202D] font-bold">{formatTzs(item.lineTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex flex-col gap-3 font-medium text-[15px] text-[#18202D] max-w-sm ml-auto">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatTzs(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{order.deliveryFee === 0 ? 'Free' : formatTzs(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-gray-200 text-xl font-extrabold pb-2">
              <span>Total</span>
              <span className="text-[#94B447]">{formatTzs(order.total)}</span>
            </div>
          </div>
        </div>

        {(order.orderStatus !== 'PENDING' && order.orderStatus !== 'CANCELLED') || order.paymentStatus === 'PAID' ? (
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            {order.orderStatus !== 'PENDING' && order.orderStatus !== 'CANCELLED' && (
              <a
                href={`${API_BASE}/api/orders/${order.orderNumber}/invoice.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center bg-[#94B447] hover:bg-[#86a53f] text-white font-medium px-8 py-4 rounded-xl transition-colors"
              >
                Download Proforma Invoice (PDF)
              </a>
            )}
            {order.paymentStatus === 'PAID' && (
              <a
                href={`${API_BASE}/api/orders/${order.orderNumber}/receipt.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center bg-[#18202D] hover:bg-black text-white font-medium px-8 py-4 rounded-xl transition-colors"
              >
                Download Receipt (PDF)
              </a>
            )}
          </div>
        ) : null}

        <div className="mt-12 text-center">
          <Link href="/shop" className="inline-flex bg-white border-2 border-gray-100 hover:border-gray-300 text-primary font-medium px-8 py-4 rounded-xl transition-colors">
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}
