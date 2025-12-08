import { useState, useEffect } from "react";
import axiosInstance from "../../services/apiClient";
import { X } from "lucide-react";

function ListItems() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/product");
        setProducts(res.data.product);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Delete handler
  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/product/${id}`); 
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6">
      <div className="p-4">
        <h1 className="capitalize text-gray-700 text-xl mb-4">
          All product list
        </h1>

        {/* Table Header */}
        <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr] gap-x-4 border border-gray-400 p-2 font-semibold text-gray-600 text-center">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span>Action</span>
        </div>

        {/* Table Rows */}
        {products.map((product) => (
          <div
            key={product._id}
            className="grid grid-cols-[60px_1fr_1fr_1fr_1fr] gap-x-4 text-center mt-3 border-b border-gray-200 py-2 text-sm p-2 items-center"
          >
            <div>
              <img
                src={product.images[0]} // assume images array
                alt={product.name}
                className="h-16 w-16 object-cover rounded"
              />
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
              <span>{product.name}</span>

              <div className="flex gap-2 mt-1">
                {product.sizes.map((sz: string) => (
                  <span
                    key={sz}
                    className="h-6 w-6 inline-flex px-3 items-center justify-center border border-gray-400 rounded text-xs text-gray-800"
                  >
                    {sz}
                  </span>
                ))}
              </div>
            </div>

            <div className="capitalize">{product.category}</div>
            <div>${product.price}</div>
            <div className="flex flex-col justify-center items-center gap-1">
              <div
                className="text-red-500 cursor-pointer"
                onClick={() => handleDelete(product._id)}
              >
                <X />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListItems;
