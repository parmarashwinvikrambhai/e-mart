import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../services/apiClient";
import toast from "react-hot-toast";

interface Order {
  _id: string;
  userId: { _id: string; name: string; email: string };
  items: Array<{
    productId: {
      _id: string;
      name: string;
      price: number;
      images: string[];
    } | null;
    quantity: number;
    size: string;
  }>;
  amount: number;
  paymentMethod: string; 
  payment: string; 
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

type UpdatePayload = {
  status?: string;
  payment?: boolean; 
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});

  const orderStatusOptions = [
    "Order Placed",
    "Processing",
    "Shipped",
    "Transit",
    "Delivered",
    "Cancelled",
  ];

 
  const paymentOptions = [
    { label: "Pending", value: "pending" },
    { label: "Received", value: "paid" }, 
  ];

  const apiUpdateOrder = useCallback(
    async (orderId: string, payload: UpdatePayload) => {
      return axiosInstance.put(`/order/update-status/${orderId}`, payload, {
        withCredentials: true,
      });
    },
    []
  );

  //  Fetch orders 
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/order", {
          withCredentials: true,
        });
       
        setOrders(res.data.order || []);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to fetch orders.");
      }
    };

    fetchOrders();

  }, []);

  // Handle Order Status Change 
  const handleOrderStatusChange = async (
    orderId: string,
    oldStatus: string,
    newStatus: string
  ) => {
    setError(null);
    setLoadingIds((s) => ({ ...s, [orderId]: true }));

    // Optimistic Update
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      await apiUpdateOrder(orderId, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update status:", err);

      // Rollback on failure
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: oldStatus } : o))
      );
      setError(`Failed to update status. Reverting change.`);
      toast.error("Failed to update order status");
    } finally {
      setLoadingIds((s) => ({ ...s, [orderId]: false }));
    }
  };

  // Handle Payment Status Change 
  const handlePaymentStatusChange = async (
    orderId: string,
    oldPayment: string,
    newPaymentString: string 
  ) => {
    setError(null);
    setLoadingIds((s) => ({ ...s, [orderId]: true }));

    const newPaymentBool = newPaymentString === "paid";

    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId ? { ...o, payment: newPaymentString } : o
      )
    );

    try {
      await apiUpdateOrder(orderId, { payment: newPaymentBool });

     
      toast.success(
        `Payment set to ${newPaymentBool ? "Received" : "Pending"}`
      );
    } catch (err) {
      console.error("Failed to update payment:", err);

      // Rollback on failure
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, payment: oldPayment } : o))
      );
      setError(`Failed to update payment. Reverting change.`);
      toast.error("Failed to update payment status");
    } finally {
      setLoadingIds((s) => ({ ...s, [orderId]: false }));
    }
  };

  const getNormalizedPayment = (order: Order) => {
    // If payment method is PayPal, assume it's paid (unless DB says otherwise, but we simplify)
    if (order.paymentMethod?.toLowerCase() === "paypal") {
      return "paid";
    }

    // Check the actual payment string value from the DB
    const p = String(order.payment).toLowerCase();

    if (p === "paid" || p === "received") return "paid";

    return "pending";
  };

  return (
    <div className="mt-1">
      <h2 className="text-2xl font-semibold mb-6">
        Order Management Dashboard
      </h2>

      {error && (
        <div
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="space-y-6">
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

          const normalizedPayment = getNormalizedPayment(order);
          const formattedDate = new Date(order.date).toLocaleDateString();

          const showPaymentDropdown =
            order.paymentMethod?.toLowerCase() === "cod";
          const isLoading = !!loadingIds[order._id];

          return (
            <div
              key={order._id}
              className="border rounded-xl p-6 flex flex-col md:flex-row justify-between items-start bg-white gap-4"
            >
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/679/679922.png"
                    alt=""
                    className="w-8 opacity-70"
                  />
                </div>

                <div>
                  <div className="space-y-1">
                    {title.split(",").map((line, i) => (
                      <h3 key={i} className="font-medium">
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

              <div className="text-sm leading-6 flex flex-col md:flex-row gap-6 items-start">
                <div className="min-w-[150px]">
                  <p>
                    <span className="font-medium">Amount :</span>{" "}
                    <span className="font-bold text-lg">${order.amount}</span>
                  </p>
                  <p>
                    <span className="font-medium">Method :</span>{" "}
                    {order.paymentMethod.toUpperCase()}
                  </p>
                  <p>
                    <span className="font-medium">Date :</span> {formattedDate}
                  </p>
                  <p>
                    <span className="font-medium">Items :</span>{" "}
                    {order.items.length}
                  </p>
                </div>

                {/* Payment Status Dropdown */}
                <div className="min-w-[150px]">
                  <p className="font-medium mb-1">Payment Status:</p>
                  {showPaymentDropdown ? (
                    <select
                      value={normalizedPayment}
                      onChange={(e) =>
                        handlePaymentStatusChange(
                          order._id,
                          order.payment,
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded-lg px-4 py-2 text-sm cursor-pointer outline-none bg-yellow-50 text-yellow-800 font-semibold"
                      disabled={isLoading}
                    >
                      {paymentOptions.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        normalizedPayment === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {normalizedPayment === "paid"
                        ? "Paid (Received)"
                        : "Pending"}{" "}
                      ({order.paymentMethod.toUpperCase()})
                    </span>
                  )}
                </div>

                {/* Order Status Dropdown */}
                <div>
                  <p className="font-medium mb-1">Order Status:</p>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleOrderStatusChange(
                        order._id,
                        order.status,
                        e.target.value
                      )
                    }
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm cursor-pointer outline-none bg-blue-50 text-blue-800 font-semibold"
                    disabled={isLoading}
                  >
                    {orderStatusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {isLoading && (
                  <span className="text-blue-500 ml-2">Updating...</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
