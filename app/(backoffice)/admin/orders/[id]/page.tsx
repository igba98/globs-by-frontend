'use client';

import { use } from 'react';
import Link from 'next/link';

// Detailed Mock Data for the single order
const orderDetails = {
  id: 'ORD-00123',
  date: '22 Mar 2026',
  time: '14:30',
  status: 'Processing',
  payment: 'Paid',
  customer: {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+255 712 345 678',
    company: 'Tech Innovators Ltd',
    address: '15 Ocean Road, Upanga, Dar es Salaam, Tanzania'
  },
  items: [
    { name: 'Executive Diary', sku: 'ST-ED-001', category: 'Paper & Books', price: 'TZS 117,000', qty: 2, subtotal: 'TZS 234,000' },
    { name: 'Ergonomic Office Chair', sku: 'FN-EOC-22', category: 'Furniture', price: 'TZS 1,115,000', qty: 1, subtotal: 'TZS 1,115,000' },
  ],
  totals: {
    subtotal: 'TZS 1,349,000',
    shipping: 'TZS 15,000',
    discount: '- TZS 50,000',
    total: 'TZS 1,314,000'
  },
  paymentDetails: {
    method: 'M-Pesa (Mobile Money)',
    transactionId: 'MPX98235FGH',
    paidOn: '22 Mar 2026, 14:32'
  },
  timeline: [
    { status: 'Order Placed', time: '22 Mar, 14:30', user: 'System', type: 'pending' },
    { status: 'Payment Confirmed', time: '22 Mar, 14:32', user: 'System', type: 'paid' },
    { status: 'Processing Started', time: '23 Mar, 09:00', user: 'Admin User', type: 'processing' }
  ],
  notes: [
    { author: 'Admin User', time: '2 hours ago', text: 'Customer requested expedited delivery if possible. Checking with logistics team.' }
  ]
};

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    'Paid': 'bg-green-100 text-green-700',
    'Pending': 'bg-yellow-100 text-yellow-700',
    'Processing': 'bg-blue-100 text-blue-700',
    'Shipped': 'bg-purple-100 text-purple-700',
    'Delivered': 'bg-green-100 text-green-700',
    'Cancelled': 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const orderId = unwrappedParams.id; // Usually we fetch data based on this ID. We'll use mock.

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <nav className="flex items-center text-sm font-medium text-muted-foreground mb-2">
            <Link href="/admin/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            <span className="mx-2">/</span>
            <Link href="/admin/orders" className="hover:text-primary transition-colors">Orders</Link>
            <span className="mx-2">/</span>
            <span className="text-primary">{orderId}</span>
          </nav>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-primary font-heading">Order {orderId}</h1>
            <StatusBadge status={orderDetails.status} />
          </div>
          <p className="text-sm text-muted-foreground mt-2">{orderDetails.date} at {orderDetails.time}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Print Invoice
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#2a3038] transition-colors shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Order Items Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-heading text-primary">Order Items</h2>
              <p className="text-sm text-muted-foreground mt-1">Products included in this transaction</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="p-4 font-semibold">Product</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold text-right">Unit Price</th>
                    <th className="p-4 font-semibold text-center">Qty</th>
                    <th className="p-4 font-semibold text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {orderDetails.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center p-2">
                            {/* Mock image fallback */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-primary line-clamp-1">{item.name}</div>
                            <div className="text-xs text-muted-foreground font-mono mt-0.5">{item.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex px-2.5 py-1 rounded bg-gray-100 text-gray-700 text-[11px] font-medium tracking-wide uppercase">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4 text-right text-sm text-gray-500">{item.price}</td>
                      <td className="p-4 text-center font-medium text-primary text-sm">× {item.qty}</td>
                      <td className="p-4 text-right font-semibold text-primary text-sm">{item.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Block */}
            <div className="p-6 bg-gray-50/50 flex justify-end shrink-0">
              <div className="w-full max-w-xs space-y-3 shrink-0">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-primary">{orderDetails.totals.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-primary">{orderDetails.totals.shipping}</span>
                </div>
                <div className="flex justify-between text-sm text-red-600">
                  <span>Discount</span>
                  <span className="font-medium">{orderDetails.totals.discount}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between">
                  <span className="text-base font-bold text-primary">Total</span>
                  <span className="text-lg font-bold font-heading text-primary">{orderDetails.totals.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline & Notes Side-by-Side on large screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Order Timeline */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-heading text-primary mb-1">Order Timeline</h2>
              <p className="text-sm text-muted-foreground mb-8">Status history and activity log</p>
              
              <div className="relative pl-6 space-y-8">
                {/* Vertical Line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100" />
                
                {orderDetails.timeline.map((event, idx) => (
                  <div key={idx} className="relative">
                    {/* Circle Node */}
                    <div className={`absolute -left-6 w-3 h-3 rounded-full border-2 border-white top-1 ${
                      event.type === 'pending' ? 'bg-yellow-400' :
                      event.type === 'paid' ? 'bg-green-500' :
                      event.type === 'processing' ? 'bg-blue-500' : 'bg-gray-400'
                    }`} />
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-primary">{event.status}</span>
                      <span className="text-xs text-muted-foreground mt-1">{event.time} • by {event.user}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

             {/* Internal Notes */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-heading text-primary mb-1">Internal Notes</h2>
                <p className="text-sm text-muted-foreground">Only visible to administrators</p>
              </div>

              <div className="p-6 flex-1 flex flex-col gap-6">
                
                {/* Existing Notes */}
                <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 flex-1">
                  {orderDetails.notes.map((note, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-primary">{note.author}</span>
                        <span className="text-[10px] text-muted-foreground">{note.time}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{note.text}</p>
                    </div>
                  ))}
                </div>

                {/* Add Note Form */}
                <div className="pt-4 border-t border-gray-100 mt-auto">
                  <textarea 
                    placeholder="Add an internal note..." 
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none mb-3 bg-white shadow-sm"
                    rows={3}
                  />
                  <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-primary font-medium text-sm rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Add Note
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-8">
          
          {/* Order Status Controller */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-visible relative z-20">
            <h2 className="text-xl font-heading text-primary mb-6">Order Status</h2>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Update Current Status</label>
              
              <div className="relative inline-block w-full">
                <select 
                  defaultValue={orderDetails.status}
                  className="appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-xl text-sm focus:outline-none focus:border-primary bg-white shadow-sm cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>

              <button className="w-full py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-[#2a3038] transition-colors shadow-sm mt-2">
                Save Status
              </button>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative z-10">
            <h2 className="text-xl font-heading text-primary mb-6">Payment Details</h2>
            
            <dl className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <dt className="text-muted-foreground">Payment Status</dt>
                <dd><StatusBadge status={orderDetails.payment} /></dd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <dt className="text-muted-foreground">Payment Method</dt>
                <dd className="font-medium text-primary text-right">{orderDetails.paymentDetails.method}</dd>
              </div>
              <div className="flex flex-col gap-1 py-2 border-b border-gray-50">
                <dt className="text-muted-foreground">Transaction ID</dt>
                <dd className="font-mono text-xs font-semibold text-primary">{orderDetails.paymentDetails.transactionId}</dd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <dt className="text-muted-foreground">Amount Paid</dt>
                <dd className="font-bold text-primary">{orderDetails.totals.total}</dd>
              </div>
              <div className="flex justify-between items-center py-2">
                <dt className="text-muted-foreground">Paid On</dt>
                <dd className="font-medium text-primary text-xs">{orderDetails.paymentDetails.paidOn}</dd>
              </div>
            </dl>
          </div>

          {/* Customer Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative z-10">
            <h2 className="text-xl font-heading text-primary mb-6">Customer Information</h2>
            
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center text-accent font-bold text-lg">
                 {orderDetails.customer.name.split(' ').map(n=>n[0]).join('')}
               </div>
               <div>
                  <h3 className="font-bold text-primary text-base">{orderDetails.customer.name}</h3>
                  <p className="text-xs text-muted-foreground">Orders: 14</p>
               </div>
            </div>

            <dl className="space-y-4 text-sm mt-4">
               <div>
                 <dt className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Company</dt>
                 <dd className="font-medium text-primary">{orderDetails.customer.company}</dd>
               </div>
               <div className="pt-2">
                 <dt className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Contact</dt>
                 <dd className="font-medium text-primary flex flex-col gap-1">
                    <a href={`mailto:${orderDetails.customer.email}`} className="text-accent hover:underline">{orderDetails.customer.email}</a>
                    <a href={`tel:${orderDetails.customer.phone}`} className="text-primary hover:underline">{orderDetails.customer.phone}</a>
                 </dd>
               </div>
               <div className="pt-2">
                 <dt className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Shipping Address</dt>
                 <dd className="font-medium text-primary leading-relaxed">{orderDetails.customer.address}</dd>
               </div>
            </dl>

            <button className="w-full mt-6 py-2.5 bg-gray-50 border border-gray-200 text-primary rounded-xl text-sm font-medium hover:border-gray-300 transition-colors shadow-sm">
               View Full Profile
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
