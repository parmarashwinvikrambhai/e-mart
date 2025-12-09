import { useEffect, useState } from "react";
import axiosInstance from "../../services/apiClient";

interface Order {
  _id: string;
  userId: { _id: string; name: string; email: string };
  items: Array<{
    productId: { _id: string; name: string; price: number; images: string[] };
    quantity: number;
    size: string;
  }>;
  amount: number;
  paymentMethod: string;
  payment: boolean;
  status: string;
  date: number;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

interface UpdateOrderStatusPayload {
  status: string;
}

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  const orderStatusOptions = [
    "Order Placed",
    "Processing",
    "Shipped",
    "Transit",
    "Delivered",
    "Cancelled",
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/order", {
          withCredentials: true,
        });
        setOrders(res.data.order);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to fetch orders.");
      }
    };
    fetchOrders();
  }, []);

  const updateOrderStatus = async (
    orderId: string,
    data: UpdateOrderStatusPayload
  ) => {
    try {
      return await axiosInstance.patch(
        `/order/update-status/${orderId}`,
        data,
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Failed to update order status:", err);
      throw err;
    }
  };

  const handleStatusChange = async (
    orderId: string,
    oldStatus: string,
    newStatus: string
  ) => {
    setError(null);
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      await updateOrderStatus(orderId, { status: newStatus });
    } catch {
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: oldStatus } : o))
      );
      setError(
        `Failed to update status for order ${orderId}. Please try again.`
      );
    }
  };

  return (
    <div className="mt-1">
      <h2 className="text-2xl font-semibold mb-6">Order Page</h2>

      {error && (
        <div
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="space-y-8">
        {orders.map((order) => {
          const title = order.items
            .map(
              (it) =>
                `${it.productId?.name || "Deleted Product"} × ${it.quantity} ${
                  it.size
                }`
            )
            .join(", ");
          const fullAddress = `${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country}, ${order.address.postalCode}`;
          const paymentText = order.payment ? "Paid" : "Pending";
          const formattedDate = new Date(order.date).toLocaleDateString();

          return (
            <div
              key={order._id}
              className="border rounded-xl p-6 flex justify-between items-start bg-white"
            >
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/679/679922.png"
                    alt=""
                    className="w-8 opacity-70"
                  />
                </div>

                <div>
                  <div className="space-y-1">
                    {title.split(",").map((line, index) => (
                      <h3 key={index} className="font-medium">
                        {line.trim()}
                      </h3>
                    ))}
                  </div>

                  <p className="text-sm mt-2 capitalize">
                    {order.userId?.name}
                  </p>
                  <p className="text-sm text-gray-600 w-80 leading-5">
                    {fullAddress}
                  </p>
                </div>
              </div>

              <div className="text-sm leading-6">
                <p>
                  <span className="font-medium">Items :</span>{" "}
                  {order.items.length}
                </p>
                <p className="font-medium">${order.amount}</p>
                <p>
                  <span className="font-medium">Method :</span>{" "}
                  {order.paymentMethod.toUpperCase()}
                </p>
                <p>
                  <span className="font-medium">Payment :</span> {paymentText}
                </p>
                <p>
                  <span className="font-medium">Date :</span> {formattedDate}
                </p>
              </div>

              <div>
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, order.status, e.target.value)
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm cursor-pointer outline-none"
                >
                  {orderStatusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Orders;
