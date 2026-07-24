import { CheckCircle } from '@/components/icons';

const DELIVERY_STEPS = ['Order Placed', 'Confirmed', 'Processing', 'Out for Delivery', 'Completed'];
const PICKUP_STEPS = ['Order Placed', 'Confirmed', 'Processing', 'Ready for Pickup', 'Completed'];

function currentStepIndex(orderStatus: string, isPickup: boolean): number {
  switch (orderStatus) {
    case 'PENDING':
      return 0;
    case 'CONFIRMED':
      return 1;
    case 'PROCESSING':
      return 2;
    case 'READY':
      // Delivery orders show READY as still within Processing; pickup orders
      // have a dedicated "Ready for Pickup" step.
      return isPickup ? 3 : 2;
    case 'OUT_FOR_DELIVERY':
      return 3;
    case 'COMPLETED':
      return 4;
    default:
      return 0;
  }
}

export default function ProgressStepper({
  orderStatus,
  deliveryMethod,
}: {
  orderStatus: string;
  deliveryMethod: string;
}) {
  if (orderStatus === 'CANCELLED') {
    return (
      <div className="mb-16 bg-red-50 border border-red-200 rounded-3xl p-8 text-center">
        <p className="text-red-700 font-bold text-lg mb-1">This order was cancelled.</p>
        <p className="text-red-600 text-sm">
          If you have any questions, please contact us — our numbers are at the bottom of this page.
        </p>
      </div>
    );
  }

  const isPickup = deliveryMethod === 'PICKUP';
  const steps = isPickup ? PICKUP_STEPS : DELIVERY_STEPS;
  const current = currentStepIndex(orderStatus, isPickup);

  return (
    <div className="mb-16">
      <ol className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-0">
        {steps.map((label, i) => {
          const isDone = i < current;
          const isCurrent = i === current;
          return (
            <li key={label} className="flex sm:flex-col sm:flex-1 items-center sm:items-center gap-3 sm:gap-2 relative isolate">
              {/* Connector line (desktop: horizontal, before each step except the first) */}
              {i > 0 && (
                <div
                  className={`hidden sm:block absolute top-5 right-1/2 w-full h-0.5 -z-10 ${
                    i <= current ? 'bg-[#94B447]' : 'bg-gray-200'
                  }`}
                />
              )}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                  isDone
                    ? 'bg-[#94B447] border-[#94B447] text-white'
                    : isCurrent
                      ? 'bg-white border-[#94B447] text-[#94B447]'
                      : 'bg-white border-gray-200 text-gray-300'
                }`}
              >
                {isDone ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-bold">{i + 1}</span>
                )}
              </div>
              <span
                className={`text-sm font-semibold sm:text-center ${
                  isDone || isCurrent ? 'text-[#18202D]' : 'text-gray-400'
                }`}
              >
                {label}
                {isCurrent && (
                  <span className="block text-xs font-medium text-[#94B447]">Current stage</span>
                )}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
