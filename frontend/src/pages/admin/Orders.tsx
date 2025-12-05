function Orders() {
  const orders = [
    {
      id: 1,
      title: "Men Round Neck Pure Cotton T-shirt × 1 M",
      name: "Hari Harisudhan",
      address: "8GJP+GW4 Parumala, Kerala, Mannar, Kerala, India, 689626",
      items: 1,
      amount: "$74",
      method: "COD",
      payment: "Pending",
      date: "11/30/2025",
      status: "Shipped",
    },
    {
      id: 2,
      title: "asdf asdf",
      name: "asdfasdf",
      address: "asdfasdf, asdfasdf, Indiaasdf, 284003",
      items: 0,
      amount: "$10",
      method: "COD",
      payment: "Pending",
      date: "11/30/2025",
      status: "Order Placed",
    },
    {
      id: 3,
      title:
        "Women Zip-Front Relaxed Fit Jacket × 1 M, Men Round Neck Pure Cotton T-shirt × 1 XL",
      name: "asdf asdfg",
      address: "asdfasdf, asdfklj, Uttar Pradesh, India, 284000",
      items: 2,
      amount: "$156",
      method: "COD",
      payment: "Pending",
      date: "11/30/2025",
      status: "Order Placed",
    },
  ];

  return (
    <div className="mt-1">
      <h2 className="text-2xl font-semibold mb-6">Order Page</h2>

      <div className="space-y-8">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-xl p-6 flex justify-between items-start bg-white"
          >
            {/* Left Section */}
            <div className="flex gap-6">
              <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/679/679922.png"
                  alt=""
                  className="w-8 opacity-70"
                />
              </div>

              <div>
                {/* ⬇️ MULTI LINE TITLE FIX */}
                <div className="space-y-1">
                  {order.title.split(",").map((line, index) => (
                    <h3 key={index} className="font-medium">
                      {line.trim()}
                    </h3>
                  ))}
                </div>

                <p className="text-sm mt-2">{order.name}</p>
                <p className="text-sm text-gray-600 w-80 leading-5">
                  {order.address}
                </p>
              </div>
            </div>

            {/* Middle Section */}
            <div className="text-sm leading-6">
              <p>
                <span className="font-medium">Items :</span> {order.items}
              </p>
              <p className="font-medium">{order.amount}</p>
              <p>
                <span className="font-medium">Method :</span> {order.method}
              </p>
              <p>
                <span className="font-medium">Payment :</span> {order.payment}
              </p>
              <p>
                <span className="font-medium">Date :</span> {order.date}
              </p>
            </div>

            {/* Status Dropdown */}
            <div>
              <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm cursor-pointer outline-none">
                <option>{order.status}</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
