import { Trash2 } from "lucide-react";
import CartTotal from "../components/CartTotal";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../redux/slices/cartSlice";
import axiosInstance from "../services/apiClient";

interface CartItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  size: string;
  quantity: number;
}

interface RootState {
  cart: {
    items: CartItem[];
  };
}


export default function Cart() {
  const dispatch = useDispatch();

  const cartItems = useSelector((state: RootState) => state.cart.items);

  const subtotal = cartItems?.reduce(
    (total, item) =>
      total + (item.productId?.price || 0) * (item.quantity || 0),
    0
  );

  // Load cart initially if empty
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axiosInstance.get("/cart", {
          withCredentials: true,
        });
        dispatch(setCart(res.data.cartData));
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    };

    fetchCart(); // ALWAYS FETCH FROM BACKEND
  }, [dispatch]);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto mt-20 text-center mb-15">
        <h2 className="text-3xl font-semibold text-gray-700">
          Your Cart is Empty! 🛒
        </h2>
        <p className="mt-4 text-gray-500">
          Add some amazing products to get started.
        </p>
      </div>
    );
  }

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    try {
      const res = await axiosInstance.put(
        `/cart/update-cart/${itemId}`,
        { newQuantity: newQuantity },
        { withCredentials: true }
      );
      dispatch(setCart(res.data.cart)); // update redux store
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      const res = await axiosInstance.delete(`/cart/delete-cart/${id}`, {
        withCredentials: true,
      });

      dispatch(setCart(res.data.cart));
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  return (
    <>
      <hr className="border-t border-gray-300" />
      <div className="max-w-6xl mx-auto mt-14 px-4">
        <div className="flex gap-2 items-center mb-10">
          <h1 className="text-2xl uppercase flex gap-2 tracking-wide">
            <span className="text-gray-400">your</span>
            <span>cart</span>
          </h1>
          <div className="w-10 h-0.5 bg-black"></div>
        </div>

        <div className="mt-5 mb-32">
          {cartItems.map((item) => (
            <div key={item._id}>
              <hr className="border-t border-gray-300" />
              <div className="grid grid-cols-10 mt-5 items-center justify-center">
                <div className="col-span-6">
                  <div className="flex gap-6">
                    <img
                      src={item.productId.images?.[0]}
                      className="w-20"
                      alt={item.productId?.name || "Product"}
                    />

                    <div className="flex flex-col">
                      <span className="capitalize font-medium text-gray-800 text-lg">
                        {item.productId.name}
                      </span>
                      <div className="flex gap-7 mt-4 items-center">
                        <span>${item.productId.price}</span>
                        <div className="flex gap-2">
                          <span className="border border-gray-400 w-10 h-8 flex justify-center items-center bg-[#E0FFFF]">
                            {item.size}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quantity Input */}
                <div className="col-span-2 mt-7">
                  <div>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const value = Number(e.target.value);

                        if (value <= 0) {
                          handleQuantityChange(item._id, 0); // DELETE item in backend
                        } else {
                          handleQuantityChange(item._id, value); // normal update
                        }
                      }}
                      className="border border-gray-400 w-20 outline-none px-2 py-1"
                    />
                  </div>
                </div>

                {/* Remove Item */}
                <div className="col-span-2 mt-7 flex flex-row-reverse">
                  <Trash2
                    size={19}
                    className="text-gray-600 cursor-pointer"
                    onClick={() => handleRemoveItem(item._id)}
                  />
                </div>
              </div>
            </div>
          ))}
          <hr className="border-t border-gray-300 mt-5" />
        </div>

        <CartTotal
          subtotal={subtotal}
          redirectTo="/place-order"
          btnText="proceed to checkout"
        />
      </div>
    </>
  );
}
