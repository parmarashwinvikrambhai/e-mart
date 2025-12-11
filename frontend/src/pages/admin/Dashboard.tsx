import { useEffect, useState } from "react";
import axiosInstance from "../../services/apiClient";
import {DollarSign,ShoppingBag,Package,TrendingUp,User} from "lucide-react";

interface Order {
  _id: string;
  amount: number;
  payment: string;
  paymentMethod: string;
  date: number;
  status: string;
  userId: { name: string };
  items: Array<{ productId: { name: string } | null; quantity: number }>;
}

interface Product {
  _id: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState({revenue: 0,orders: 0,products: 0});
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          axiosInstance.get("/order", { withCredentials: true }),
          axiosInstance.get("/product"), 
        ]);

        const orders: Order[] = ordersRes.data.order || [];
        const products: Product[] = productsRes.data.product || [];
        const totalRevenue = orders.reduce((acc, order) => { return acc + order.amount }, 0);

      setStats({revenue: totalRevenue,orders: orders.length,products: products.length});

        // Recent Orders (sort by date desc)
        const sortedOrders = [...orders]
          .sort((a, b) => b.date - a.date)
          .slice(0, 5);
        setRecentOrders(sortedOrders);
      } catch (error) {
        console.error("Dashboard Fetch Error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-gray-500">Loading Dashboard...</div>;
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Dashboard Overview
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
              Total Sales
            </p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">
              ${stats.revenue.toLocaleString()}
            </h3>
          </div>
          <div className="p-4 bg-green-50 rounded-full text-green-600">
            <DollarSign size={28} />
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
              Total Orders
            </p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">
              {stats.orders}
            </h3>
          </div>
          <div className="p-4 bg-blue-50 rounded-full text-blue-600">
            <ShoppingBag size={28} />
          </div>
        </div>

        {/* Products Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
              Products
            </p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">
              {stats.products}
            </h3>
          </div>
          <div className="p-4 bg-purple-50 rounded-full text-purple-600">
            <Package size={28} />
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
            <TrendingUp size={20} className="text-gray-400" />
            Recent Activity
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-mono text-xs">
                    {order._id.slice(-6)}...
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                      <User size={14} />
                    </div>
                    <span className="capitalize">
                      {order.userId?.name || "User"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    ${order.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
