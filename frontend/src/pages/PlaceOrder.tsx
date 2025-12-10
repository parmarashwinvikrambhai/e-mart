import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Add this
import CartTotal from "../components/CartTotal";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import axiosInstance from "../services/apiClient";
import { setCart } from "../redux/slices/cartSlice";
import toast from "react-hot-toast";

export default function PlaceOrder() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ Add this

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const subtotal = cartItems?.reduce((total, item) => {
    const product = item.productId as unknown as { price: number };
    return total + (product.price || 0) * (item.quantity || 0);
  }, 0);
  const shippingFee = 10;
  const totalAmount = subtotal + shippingFee;

  const handlePlaceOrder = async (): Promise<boolean> => {
    if (
      !address.street ||
      !address.city ||
      !address.country ||
      !address.state
    ) {
      toast.error("Delivery fields are Required", {
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
      return false;
    }

    // -------------------
    // ✅ PayPal Flow
    // -------------------
    if (paymentMethod === "paypal") {
      navigate("/paypal", {
        state: {
          items: cartItems,
          totalAmount: totalAmount,
          address: address,
        },
      });
      return false; // COD order flow ko abhi execute na kare
    }

    // -------------------
    // COD / Normal Flow
    // -------------------
    try {
      const res = await axiosInstance.post(
        "/order/create-order",
        {
          items: cartItems.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
            size: item.size,
          })),
          amount: totalAmount,
          address,
          paymentMethod,
        },
        { withCredentials: true }
      );

      toast.success(res.data.message || "Order placed successfully", {
        style: {
          borderRadius: "8px",
          background: "#1e40af",
          color: "#fff",
          fontWeight: 600,
          padding: "12px 16px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        },
        iconTheme: { primary: "#fff", secondary: "#1e40af" },
      });
      dispatch(setCart([]));
      return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to place order", {
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
      return false;
    }
  };

  return (
    <>
      <hr className="border-t border-gray-300" />
      <div className="max-w-6xl mx-auto mt-14 px-4">
        <div className="flex gap-2 items-center mb-4 ml-4">
          <h1 className="text-2xl uppercase flex gap-2 tracking-wide">
            <span className="text-gray-400">delivery</span>
            <span>information</span>
          </h1>
          <div className="w-10 h-0.5 bg-black"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* FORM */}
          <form className="p-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Street"
                className="border p-2 col-span-2"
                value={address.street}
                onChange={(e) =>
                  setAddress({ ...address, street: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="City"
                className="border p-2"
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="State"
                className="border p-2"
                value={address.state}
                onChange={(e) =>
                  setAddress({ ...address, state: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Zip code"
                className="border p-2"
                value={address.postalCode}
                onChange={(e) =>
                  setAddress({ ...address, postalCode: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Country"
                className="border p-2"
                value={address.country}
                onChange={(e) =>
                  setAddress({ ...address, country: e.target.value })
                }
              />
            </div>
          </form>

          {/* RIGHT SIDE */}
          <div className="p-4">
            {/* PAYMENT SECTION */}
            <div className="flex flex-col mb-10">
              <div className="flex gap-2 items-center mb-4">
                <h1 className="text-2xl uppercase flex gap-2 tracking-wide">
                  <span className="text-gray-400">payment</span>
                  <span>methods</span>
                </h1>
                <div className="w-10 h-0.5 bg-black"></div>
              </div>

              <div className="flex gap-6">
                {/* PayPal */}
                <label className="flex items-center gap-3 border border-gray-300 rounded px-5 py-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "paypal"}
                    onChange={() => setPaymentMethod("paypal")}
                  />
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK_kZ_jqsE_dKzHu_Eh8ey6LafUWro5sjYfA&s"
                    alt="paypal"
                    className="h-5"
                  />
                </label>

                {/* COD (default) */}
                <label className="flex items-center gap-3 border border-gray-300 rounded px-5 py-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <span className="uppercase text-gray-700 font-medium">
                    Cash on Delivery
                  </span>
                </label>
              </div>
            </div>

            {/* ORDER BUTTON */}
            <div className="w-full">
              <CartTotal
                subtotal={subtotal}
                redirectTo="/orders"
                btnText="Place Order"
                onClick={handlePlaceOrder}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
