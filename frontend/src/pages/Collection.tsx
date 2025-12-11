
import ProductItems from "../components/ProductItems";
import { useEffect, useState } from "react";
import axiosInstance from "../services/apiClient";
import { useSearchParams } from "react-router-dom";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  subcategory: string;
}

export default function Collection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true); 
  const [category, setCategory] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [sort, setSort] = useState<string>("relevant");


  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  // Fetch products with filters
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: any = {};

        if (category) params.category = category;
        if (type) params.type = type;
        if (sort) params.sort = sort;
        if (search) params.search = search;

        const res = await axiosInstance.get("/product/filter", { params });

        setProducts(res.data.products);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, type, sort, search]);

  return (
    <>
      <hr className="col-span-3 border-t border-gray-300" />
      <div className="w-full flex mt-10 gap-5 mb-32">
        {/* Left Sidebar */}
        <div className="w-[30%]">
          <h1 className="uppercase text-2xl">filters</h1>

          {/* Category Filter */}
          <div className="border border-gray-400 w-[290px] mt-5 p-4 rounded-lg">
            <h1 className="uppercase font-semibold">categories</h1>

            <ul className="capitalize mt-4 text-sm flex flex-col gap-2 text-gray-700">
              <li className="flex gap-1">
                <input
                  type="checkbox"
                  checked={category === "men"}
                  onChange={(e) => setCategory(e.target.checked ? "men" : null)}
                />
                men
              </li>

              <li className="flex gap-1">
                <input
                  type="checkbox"
                  checked={category === "women"}
                  onChange={(e) =>
                    setCategory(e.target.checked ? "women" : null)
                  }
                />
                women
              </li>

              <li className="flex gap-1">
                <input
                  type="checkbox"
                  checked={category === "kid"}
                  onChange={(e) => setCategory(e.target.checked ? "kid" : null)}
                />
                kids
              </li>
            </ul>
          </div>

          {/* Type Filter */}
          <div className="border border-gray-400 w-[290px] mt-5 p-4 rounded-lg">
            <h1 className="uppercase font-semibold">type</h1>

            <ul className="capitalize mt-4 text-sm flex flex-col gap-2 text-gray-700">
              <li className="flex gap-1">
                <input
                  type="checkbox"
                  checked={type === "topwear"}
                  onChange={(e) => setType(e.target.checked ? "topwear" : null)}
                />
                topwear
              </li>

              <li className="flex gap-1">
                <input
                  type="checkbox"
                  checked={type === "bottomwear"}
                  onChange={(e) =>
                    setType(e.target.checked ? "bottomwear" : null)
                  }
                />
                bottomwear
              </li>

              <li className="flex gap-1">
                <input
                  type="checkbox"
                  checked={type === "winterwear"}
                  onChange={(e) =>
                    setType(e.target.checked ? "winterwear" : null)
                  }
                />
                winterwear
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full">
          <div className="flex gap-2 items-center">
            <h1 className="text-2xl uppercase flex gap-2">
              <span className="text-gray-400">latest</span>
              <span>collections</span>
            </h1>

            <div className="w-10 h-0.5 bg-black"></div>

            {/* Sort dropdown (yahan sort state aur handler add kiya ja sakta hai) */}
            <div className="ml-auto">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-gray-400 rounded-md px-3 py-2 text-sm outline-none"
              >
                <option value="relevant">Sort by: Relevant</option>
                <option value="lowToHigh">Sort by: Low to High</option>
                <option value="highToLow">Sort by: High to Low</option>
              </select>

            </div>
          </div>

          <ProductItems products={products} loading={loading} />
        </div>
      </div>
    </>
  );
}