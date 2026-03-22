'use client';

import { use } from 'react';
import Link from 'next/link';
import { CheckCircle, Clock, Truck, Shield } from '@/components/icons';

const STAGES = [
  { id: 1, name: 'Order Placed', description: 'We have received your order securely.', icon: Shield, status: 'completed' },
  { id: 2, name: 'Payment Confirmed', description: 'Mobile payment verified.', icon: CheckCircle, status: 'completed' },
  { id: 3, name: 'Processing', description: 'We are preparing your items for shipment.', icon: Clock, status: 'active' },
  { id: 4, name: 'In Transit', description: 'Your order is on the way to your address.', icon: Truck, status: 'pending' },
  { id: 5, name: 'Delivered', description: 'Order successfully delivered.', icon: CheckCircle, status: 'pending' }
];

export default function TrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const orderId = unwrappedParams.id;

  return (
    <div className="w-full min-h-screen bg-white pb-24 pt-32 sm:pt-40">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 text-green-600 rounded-full mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="font-heading text-4xl text-primary font-medium mb-4">Order Successfully Placed!</h1>
          <p className="text-muted-foreground text-lg">
            Thank you for shopping with Globs-By. Your order <span className="font-bold text-primary">{orderId}</span> is now being processed.
          </p>
        </div>

        {/* Tracking Stepper */}
        <div className="bg-[#f8f9fa] rounded-[3rem] p-10 sm:p-16 border border-gray-100">
           <h2 className="font-heading text-2xl text-primary mb-10">Live Tracking</h2>
           
           <div className="relative">
              {/* Vertical line connecting steps */}
              <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-gray-200" />
              
              <div className="space-y-12">
                {STAGES.map((stage, index) => {
                  const Icon = stage.icon;
                  return (
                    <div key={stage.id} className="relative flex items-start gap-6">
                      
                      {/* Node circle */}
                      <div className={`relative z-10 w-16 h-16 rounded-full flex flex-shrink-0 items-center justify-center transition-colors shadow-sm
                        ${stage.status === 'completed' ? 'bg-primary text-white scale-100' : 
                          stage.status === 'active' ? 'bg-white border-[3px] border-primary text-primary scale-110 shadow-md' : 
                          'bg-white border-2 border-gray-200 text-gray-300'}
                      `}>
                         <Icon className="w-6 h-6" />
                      </div>

                      {/* Content */}
                      <div className={`pt-3 ${stage.status === 'pending' ? 'opacity-40' : 'opacity-100'}`}>
                        <h4 className="font-heading text-xl text-primary">{stage.name}</h4>
                        <p className="text-sm font-medium text-muted-foreground mt-1">{stage.description}</p>
                        
                        {stage.status === 'active' && (
                          <div className="mt-4 inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider">
                            Current Stage
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
           </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/shop" className="inline-flex bg-white border-2 border-gray-100 hover:border-gray-300 text-primary font-medium px-8 py-4 rounded-xl transition-colors">
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}
