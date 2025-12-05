import { useEffect, useState } from "react";
import axiosInstance from "../services/apiClient";

interface OrderItem {
  productId: {
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
  size: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  amount: number;
  paymentMethod: string;
  status: string;
  date: string;
}

export default function Order() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("/order", {
        withCredentials: true,
      });
      setOrders(res.data.order);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return <div className="text-center py-10 text-lg">Loading orders...</div>;

  if (orders.length === 0)
    return <div className="text-center py-10 text-lg">No orders found.</div>;

  return (
    <>
      <hr className="border-t border-gray-300" />
      <div className="max-w-6xl mx-auto mt-14 px-4 mb-20">
        <div className="flex gap-2 items-center mb-10">
          <h1 className="text-2xl uppercase flex gap-2 tracking-wide">
            <span className="text-gray-400">my</span>
            <span>orders</span>
          </h1>
          <div className="w-10 h-0.5 bg-black"></div>
        </div>

        {orders.map((order) => (
          <div key={order._id} className="mt-2 mb-10">
            <hr className="border-t border-gray-300" />

            {order.items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-10 mt-5 items-center justify-center"
              >
                <div className="col-span-6">
                  <div className="flex gap-6">
                    <img
                      src={item.productId.images?.[0]}
                      className="w-20"
                      alt={item.productId.name}
                    />

                    <div className="flex flex-col">
                      <span className="capitalize font-medium text-gray-800 text-lg">
                        {item.productId.name}
                      </span>

                      <div className="flex gap-4 items-center">
                        <span>${order.amount}</span>
                        <span>Quantity: {item.quantity}</span>
                        <span>Size: {item.size}</span>
                      </div>

                      <div className="flex gap-1 items-center">
                        <span>Date:</span>
                        <span className="text-sm text-gray-400">
                          {new Date(order.date).toDateString()}
                        </span>
                      </div>

                      <div className="flex gap-1 items-center">
                        <span>Payment:</span>
                        <span className="text-sm text-gray-400">
                          {order.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 mt-7">
                  <div className="flex gap-2 items-center">
                    <span className="inline-block h-2 w-2 bg-green-500 rounded-full"></span>
                    <span className="text-gray-700">{order.status}</span>
                  </div>
                </div>

                <div className="col-span-2 mt-7 flex flex-row-reverse">
                  <span className="capitalize text-gray-700 border border-gray-400 px-3 py-1 text-sm">
                    Track order
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
