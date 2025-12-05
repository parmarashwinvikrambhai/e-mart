 import { Link } from "react-router-dom";


interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category?: string;
  subcategory?: string;
}

interface ProductItemsProps {
    products: Product[];
    loading: boolean;
}

function ProductItems({ products, loading }: ProductItemsProps) {
  
  if (loading) return <p className="mt-10">Loading products...</p>;
  if (!products || products.length === 0)
    return (
      <div className="w-full flex justify-center items-center h-40 mt-10">
        <p className="border border-gray-400 rounded text-center p-4 capitalize text-gray-400 w-[600px]">
          No products found for the current filters.
        </p>
      </div>
    );
  return (
    <div className="w-full mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((item) => (
        <Link
          key={item._id}
          to={`/product/${item._id}`}
          className="flex flex-col gap-1"
        >
          <div className="overflow-hidden rounded-lg w-full h-[280px]">
            <img
              src={item.images[0]}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            />
          </div>

          <span className="text-sm">{item.name}</span>
          <span className="font-medium">${item.price}</span>
        </Link>
      ))}
    </div>
  );
}

export default ProductItems;