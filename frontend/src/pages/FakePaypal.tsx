import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../services/apiClient";
import { useDispatch } from "react-redux";
import { setCart } from "../redux/slices/cartSlice";
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";

function FakePaypal() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // PlaceOrder.tsx se data receive kar rahe hain
  const { items, totalAmount, address } = location.state as {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: any[];
    totalAmount: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    address: any;
  };

  const [step, setStep] = useState(1);
  const [cardNumber, setCardNumber] = useState("");
  const [status, setStatus] = useState("");

 const handlePay = async () => {
   setStep(3);
   setTimeout(async () => {
     if (cardNumber === "12345678") {
       setStatus("SUCCESS");
    await new Promise((resolve) => setTimeout(resolve, 5000));
        try {
         await axiosInstance.post(
           "/order/create-order",
           {
             items: items.map((item) => ({
               productId: item.productId._id,
               quantity: item.quantity,
               size: item.size,
             })),
             amount: totalAmount,
             address,
             paymentMethod: "paypal",
           },
           { withCredentials: true }
         );

         toast.success("Order placed successfully with PayPal!", {
           style: {
             borderRadius: "8px",
             background: "#1e40af",
             color: "#fff",
             fontWeight: 600,
             padding: "12px 16px",
             boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
           },
           iconTheme: { primary: "#fff", secondary: "#1e40af" },
         }); // Clear cart

         dispatch(setCart([])); // Redirect to orders page

         navigate("/orders"); // eslint-disable-next-line @typescript-eslint/no-unused-vars
       } catch (error) {
         toast.error("Failed to place PayPal order", {
           style: {
             borderRadius: "8px",
             background: "#dc2626",
             color: "#fff",
             fontWeight: 600,
             padding: "12px 16px",
             boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
           },
           iconTheme: { primary: "#fff", secondary: "#dc2626" },
         });
       }
     } else {
       setStatus("FAILED");
     }
   }, 1200);
 };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <img
            src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
            alt="paypal"
            className="w-20 mx-auto mb-3"
          />
          <h1 className="text-xl font-semibold text-blue-700">
            PayPal Test Mode
          </h1>
          <p className="text-xs text-gray-500">(No real money will be used)</p>
        </motion.div>
        {/* STEPS - LINE THICKNESS INCREASED TO 4PX (border-t-4) */}
        <div className="relative mb-6">
          {/* Absolute Lines Container (Always in the background) */}
          <div className="absolute top-4 left-0 right-0 h-0.5 pointer-events-none flex justify-between transform -translate-y-1/2">
            {/* Line 1 (1 to 2) */}
            <div
              className={`w-[40%] h-0.5 border-t-4 border-dotted transition-colors duration-300 mx-auto ${
                step > 1 ? "border-green-600" : "border-gray-400"
              }`}
            ></div>

            {/* Small Gap (to keep the space between lines) */}
            <div className="w-[10%]"></div>

            {/* Line 2 (2 to 3) */}
            <div
              className={`w-[40%] h-0.5 border-t-4 border-dotted transition-colors duration-300 mx-auto ${
                step > 2 ? "border-green-600" : "border-gray-400"
              }`}
            ></div>
          </div>

          {/* Steps Circles and Text (Always in the foreground) */}
          <div className="flex justify-between text-sm font-medium relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-300 ${
                  step >= 1
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                1
              </div>
              <span
                className={`mt-2 transition-colors duration-300 ${
                  step >= 1 ? "text-green-700 font-semibold" : "text-gray-400"
                }`}
              >
                Review
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-300 ${
                  step >= 2
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                2
              </div>
              <span
                className={`mt-2 transition-colors duration-300 ${
                  step >= 2 ? "text-green-700 font-semibold" : "text-gray-400"
                }`}
              >
                Payment
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-300 ${
                  step >= 3
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                3
              </div>
              <span
                className={`mt-2 transition-colors duration-300 ${
                  step >= 3 ? "text-green-700 font-semibold" : "text-gray-400"
                }`}
              >
                Result
              </span>
            </div>
          </div>
        </div>
        {/* STEP 1 - REVIEW */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="border p-4 rounded-xl bg-gray-50 mb-4">
              <p className="font-semibold text-lg">Your Order</p>
              <ul className="text-gray-600 text-sm mt-2 space-y-1">
                {items.map((item, index) => (
                  <li key={index}>
                    {item.productId?.name} x {item.quantity} ($
                    {item.productId?.price * item.quantity})
                  </li>
                ))}
              </ul>
              <p className="text-gray-800 font-semibold mt-2 flex gap-3">
                <ShoppingCart /> ${totalAmount}
              </p>
            </div>
            <button
              className="w-full py-3 text-lg rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
              onClick={() => setStep(2)}
            >
              Continue to Payment
            </button>
          </motion.div>
        )}
        {/* STEP 2 - PAYMENT */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-4">
              <label className="text-sm font-medium">Card Number</label>
              <input
                className="w-full border rounded-xl p-3 mt-1 focus:outline-none"
                placeholder="Enter card number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </div>
            <button
              className="w-full py-3 text-lg rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
              onClick={handlePay}
            >
              Pay ${totalAmount}
            </button>
          </motion.div>
        )}
        {/* STEP 3 - RESULT */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center"
          >
            {!status && (
              <p className="text-gray-600 text-sm">Processing payment...</p>
            )}
            {status === "SUCCESS" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="p-4 bg-green-100 rounded-xl"
              >
                <div className="text-green-600 text-4xl">✓</div>
                <p className="font-semibold text-green-700 mt-2">
                  Payment Successful
                </p>
              </motion.div>
            )}
            {status === "FAILED" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="p-4 bg-red-100 rounded-xl"
              >
                <div className="text-red-600 text-4xl">✗</div>
                <p className="font-semibold text-red-700 mt-2">
                  Payment Failed
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default FakePaypal;
