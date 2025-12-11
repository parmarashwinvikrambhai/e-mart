import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../services/apiClient";
import toast from "react-hot-toast";
import { X, MapPin, Calendar, CreditCard, Package, DollarSign, Eye } from "lucide-react";

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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
        Orders Details
      </h2>

      {error && (
        <div
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Orders List Header */}
      <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_0.5fr] gap-4 mb-4 px-6 font-semibold text-gray-600 border p-2 rounded-lg">
        <div>Customer Name</div>
        <div>Product</div>
        <div>Payment Status</div>
        <div>Order Status</div>
        <div className="text-center">Details</div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const firstItem = order.items[0];
          const productName = firstItem?.productId?.name || "Deleted Product";
          const itemCount = order.items.length;
          const displayProduct =
            itemCount > 1 ? `${productName} +${itemCount - 1} more` : productName;

          const normalizedPayment = getNormalizedPayment(order);
          const showPaymentDropdown =
            order.paymentMethod?.toLowerCase() === "cod";
          const isLoading = !!loadingIds[order._id];

          return (
            <div
              key={order._id}
              className="border rounded-xl p-4 md:p-6 bg-white flex flex-col md:grid md:grid-cols-[1fr_2fr_1fr_1fr_0.5fr] gap-4 items-center shadow-sm"
            >
              {/* Client Name */}
              <div className="text-sm font-medium w-full md:w-auto capitalize">
                 <span className="md:hidden font-semibold text-gray-500 mr-2">Customer:</span>
                {order.userId?.name || "Unknown User"}
              </div>

              {/* Product Name */}
              <div className="text-sm text-gray-700 w-full md:w-auto truncate" title={displayProduct}>
                 <span className="md:hidden font-semibold text-gray-500 mr-2">Product:</span>
                {displayProduct}
              </div>

              {/* Payment Status Dropdown/Badge */}
              <div className="w-full md:w-auto">
                 <span className="md:hidden font-semibold text-gray-500 mr-2">Payment:</span>
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
                    className="border border-gray-300 rounded px-2 py-1 text-xs cursor-pointer outline-none bg-yellow-50 text-yellow-800 font-semibold w-full md:w-auto"
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
                    {normalizedPayment === "paid" ? "Paid" : "Pending"}
                  </span>
                )}
              </div>

              {/* Order Status Dropdown */}
              <div className="w-full md:w-auto">
                 <span className="md:hidden font-semibold text-gray-500 mr-2">Status:</span>
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleOrderStatusChange(
                      order._id,
                      order.status,
                      e.target.value
                    )
                  }
                  className="border border-gray-300 rounded px-2 py-1 text-xs cursor-pointer outline-none bg-blue-50 text-blue-800 font-semibold w-full md:w-auto"
                  disabled={isLoading}
                >
                  {orderStatusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Details Icon */}
              <div className="w-full md:w-auto flex justify-center">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="View Details"
                >
                  <Eye className="text-gray-600" size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md  bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-scaleIn">
            
            {/* Header */}
            <div className="sticky top-0 bg-gray-50 px-8 py-5 flex justify-between items-center z-10">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Order Details</h3>
                <p className="text-sm text-gray-500 mt-1">Order ID: <span className="font-mono text-gray-700 select-all">{selectedOrder._id}</span></p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-8">
              
              {/* Order Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Delivery Info */}
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 flex gap-4">
                  <div className="mt-1 bg-white p-2 rounded-full shadow-sm h-fit">
                    <MapPin className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Delivery Address</h4>
                    <div className="text-gray-600 text-sm leading-relaxed">
                      <p className="font-medium text-gray-900 capitalize">{selectedOrder.userId?.name || "N/A"}</p>
                      <p>{selectedOrder.userId.email}</p>
                      <p className="capitalize mt-2">{selectedOrder.address.street},</p>
                      <p className="capitalize">{`${selectedOrder.address.city}, ${selectedOrder.address.state}`}</p>
                      <p className="capitalize">{`${selectedOrder.address.country} - ${selectedOrder.address.postalCode}`}</p>
                    </div>
                  </div>
                </div>

                {/* Status & Payment Info */}
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 flex gap-4">
                  <div className="mt-1 bg-white p-2 rounded-full shadow-sm h-fit">
                     <CreditCard className="text-green-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 mb-2">Order Info</h4>
                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                       <div>
                          <p className="text-gray-500 text-xs uppercase font-semibold">Date</p>
                          <p className="font-medium text-gray-700 flex items-center gap-1 mt-1">
                            <Calendar size={14} />
                            {new Date(selectedOrder.date).toLocaleDateString()}
                          </p>
                       </div>
                       <div>
                          <p className="text-gray-500 text-xs uppercase font-semibold">Method</p>
                          <p className="font-medium text-gray-700 uppercase mt-1">{selectedOrder.paymentMethod}</p>
                       </div>
                       <div>
                          <p className="text-gray-500 text-xs uppercase font-semibold">Payment</p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${getNormalizedPayment(selectedOrder) === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {getNormalizedPayment(selectedOrder) === 'paid' ? 'Received' : 'Pending'}
                           </span>
                       </div>
                       <div>
                          <p className="text-gray-500 text-xs uppercase font-semibold">Status</p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                             {selectedOrder.status}
                          </span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                   <Package className="text-purple-600" size={20} />
                   Ordered Items <span className="text-gray-400 font-normal text-sm">({selectedOrder.items.length})</span>
                </h4>
                <div className="rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex gap-4 items-center p-4 hover:bg-gray-50 transition-colors bg-white">
                       <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                         {item.productId?.images?.[0] ? (
                           <img 
                              src={item.productId.images[0]} 
                              alt={item.productId.name} 
                              className="w-full h-full object-cover"
                           />
                         ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                         )}
                       </div>
                       <div className="flex-1">
                          <p className="font-semibold text-gray-800">{item.productId?.name || "Product Unavailable"}</p>
                          <div className="flex gap-4 mt-1 text-sm text-gray-500">
                             <p>Size: <span className="font-medium text-gray-700">{item.size}</span></p>
                             <p>Quantity: <span className="font-medium text-gray-700">{item.quantity}</span></p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="font-bold text-gray-900">${item.productId?.price || 0}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Summary */}
             <div className="bg-gray-50 px-8 py-6 flex justify-end items-center gap-4">
                <span className="text-gray-500 font-medium">Total Amount</span>
                <span className="text-2xl font-bold text-gray-900 flex items-center">
                   <DollarSign size={24} strokeWidth={2.5} className="text-gray-400 mr-1" />
                   {selectedOrder.amount}
                </span>
             </div>

          </div>
        </div>
      )}
    </div>
  );
}
