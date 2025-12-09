import { useEffect, useState } from "react";
import axiosInstance from "../services/apiClient";

const statusStepsBase = [
  "Order Placed",
  "Processing",
  "Shipped",
  "Transit",
  "Delivered",
];

interface TrackOrderModalProps {
  orderId: string;
  onClose: () => void;
}

// Custom checkmark icon
const CheckmarkIcon = () => (
  <svg
    className="w-4 h-4 text-white"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 13l4 4L19 7"
    ></path>
  </svg>
);

export default function TrackOrderModal({
  orderId,
  onClose,
}: TrackOrderModalProps) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axiosInstance.get(`/order/${orderId}`);
        // Status ko uppercase mein store kar rahe hain for easier comparison
        setStatus(res.data.order.status.toUpperCase());
      } catch (err) {
        console.error("Failed to fetch order", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );

  // Normalize status steps to uppercase for matching
  const statusSteps = statusStepsBase.map((s) => s.toUpperCase());

  if (status === "CANCELLED" && !statusSteps.includes("CANCELLED")) {
    statusSteps.splice(1, 0, "CANCELLED");
  }

  // Current step ka index dhundh rahe hain
  const currentStepIndex = statusSteps.indexOf(status);
  const isCancelled = status === "CANCELLED";
  const isDelivered = status === "DELIVERED";

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div
        className="absolute inset-0 bg-opacity-80 backdrop-blur-md bg-black/40" 
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div className="relative bg-white rounded-xl max-w-md w-full p-6 z-50 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors"
        ></button>

        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
          <span role="img" aria-label="package">
            📦
          </span>{" "}
          Track Your Order{" "}
        </h2>

        {/* Timeline container */}
        <div className="relative pl-8">
          {/* Dashed Vertical Path (Road effect) */}
          {!isCancelled && (
            <div
              className="absolute left-[18px] top-0 h-full w-0.5 border-l-4 border-dashed border-blue-300"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, #3b82f6 50%, transparent 50%)",
                backgroundSize: "4px 16px",
              }}
            ></div>
          )}

          {/* Steps */}
          <div className="flex flex-col space-y-8">
            {statusSteps.map((step, index) => {
              const isActive = index <= currentStepIndex && !isCancelled;
              const isCurrent = index === currentStepIndex && !isCancelled;
              const isCancelledStep = isCancelled && step === "CANCELLED";

              let stepColor = "bg-gray-300";
              let textColor = "text-gray-500";
              let borderColor = "border-gray-300";

              if (isCancelledStep) {
                stepColor = "bg-red-500";
                textColor = "text-red-600 font-bold";
                borderColor = "border-red-500";
              } else if (isActive) {
                stepColor = isDelivered ? "bg-green-500" : "bg-blue-500";
                textColor =
                  isDelivered && step === "DELIVERED"
                    ? "text-green-600 font-bold"
                    : "text-blue-600 font-semibold";
                borderColor =
                  isDelivered && step === "DELIVERED"
                    ? "border-green-500"
                    : "border-blue-500";
              }

              return (
                <div key={step} className="flex items-start gap-4 z-10">
                  <div className="relative flex flex-col items-center">
                    {/* Step Indicator (Pin) */}
                    <div
                      className={`w-4 h-4 rounded-full border-4 ${borderColor} ${stepColor} flex items-center justify-center shadow-md transition-colors duration-300`}
                    >
                      {isCancelledStep ? (
                        "!"
                      ) : isActive ? (
                        <CheckmarkIcon />
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col -mt-1">
                    <span
                      className={`text-sm ${textColor} ${
                        isCurrent ? "text-lg font-extrabold" : ""
                      }`}
                    >
                      {/* Convert status back to Title Case for display */}
                      {step
                        .split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )
                        .join(" ")}
                    </span>

                    {/* Status message */}
                    {isDelivered && step === "DELIVERED" && (
                      <span className="text-xs text-green-500 mt-0.5 font-semibold">
                        Your order delivered! 🎉
                      </span>
                    )}

                    {isCurrent && !isCancelled && !isDelivered && (
                      <span className="text-xs text-blue-500 mt-0.5">
                        Your order is currently here!
                      </span>
                    )}
                    {isCancelledStep && (
                      <span className="text-xs text-red-500 mt-0.5">
                        Order was cancelled.
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-100 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors"
          >
            {isDelivered ? "Finish" : "Close Tracking"}
          </button>
        </div>
      </div>
    </div>
  );
}
