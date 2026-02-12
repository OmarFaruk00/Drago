"use client";

/**
 * OrderTrackingStepper - 4-step horizontal progress bar
 * Steps: Order Received, Processing, Shipped, Delivered
 * Active: red circle, Inactive: gray dashed circle
 */

const STEPS = [
  { key: "order_received", label: "Order Received" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

const STATUS_TO_STEP = {
  pending: 0,
  order_received: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -1,
};

export default function OrderTrackingStepper({ status }) {
  const s = (status || "").toLowerCase();
  const currentStep = STATUS_TO_STEP[s] ?? 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="flex items-start justify-between gap-2">
        {STEPS.map((step, i) => {
          const isActive = i <= currentStep && currentStep >= 0;
          const isCompleted = i < currentStep;
          const isLast = i === STEPS.length - 1;
          return (
            <div key={step.key} className="flex flex-1 flex-col items-center min-w-0">
              <div className="flex items-center w-full">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                    isActive
                      ? "bg-brand border-brand text-white"
                      : "border-2 border-dashed border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  {isActive ? (
                    isCompleted ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-sm font-semibold">{i + 1}</span>
                    )
                  ) : (
                    <span className="text-sm font-medium">{i + 1}</span>
                  )}
                </div>
                {!isLast && (
                  <div
                    className={`flex-1 h-1 mx-1 -mt-5 rounded ${
                      isActive ? "bg-brand" : "bg-gray-200 border border-dashed border-gray-300"
                    }`}
                  />
                )}
              </div>
              <p className={`text-xs mt-2 font-medium text-center ${isActive ? "text-brand" : "text-gray-500"}`}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
