"use client";

/**
 * OrderStatusStepper - Horizontal progress bar with steps
 * Steps: Processing, On the Way, Delivered
 */

const steps = [
  { key: "processing", label: "Processing" },
  { key: "on_the_way", label: "On the Way" },
  { key: "delivered", label: "Delivered" },
];

const statusOrder = ["pending", "processing", "shipped", "on_the_way", "delivered", "cancelled"];

export default function OrderStatusStepper({ status }) {
  const s = (status || "").toLowerCase();
  const currentIndex = statusOrder.indexOf(s);
  const isDelivered = s === "delivered" || currentIndex >= statusOrder.indexOf("delivered");
  const isOnTheWay = s === "shipped" || s === "on_the_way" || (currentIndex >= statusOrder.indexOf("shipped") && !isDelivered);
  const stepIndex = isDelivered ? 2 : isOnTheWay ? 1 : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between gap-4">
        {steps.map((step, i) => {
          const isActive = i <= stepIndex;
          const isLast = i === steps.length - 1;
          return (
            <div key={step.key} className="flex flex-1 flex-col items-center">
              <div className="flex items-center w-full">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isActive ? "bg-brand text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isActive ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm font-medium">{i + 1}</span>
                  )}
                </div>
                {!isLast && (
                  <div
                    className={`flex-1 h-0.5 mx-2 -mt-5 ${
                      isActive ? "bg-brand" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
              <p className={`text-xs mt-2 font-medium ${isActive ? "text-gray-900" : "text-gray-500"}`}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
