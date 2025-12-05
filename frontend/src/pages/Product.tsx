// product.tsx (Updated with Add to Cart)
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import ProductItems from "../components/ProductItems";
import axiosInstance from "../services/apiClient";
import { useDispatch } from "react-redux"; // Added
import { setCart } from "../redux/slices/cartSlice"; // Added
import toast from "react-hot-toast";

interface ProductType {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  category: string;
  subcategory: string;
  bestseller: boolean;
}

interface RelatedProduct {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

export default function Product() {
  const { id } = useParams();
  const dispatch = useDispatch(); // Initialized useDispatch
  const [product, setProduct] = useState<ProductType | null>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async (category: string, subcategory: string) => {
      setRelatedLoading(true);
      try {
        const res = await axiosInstance.get("/product/filter", {
          params: {
            category,
            type: subcategory,
          },
        });

        const filteredProducts = res.data.products.filter(
          (item: RelatedProduct) => item._id !== id
        );
        setRelatedProducts(filteredProducts);
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      } finally {
        setRelatedLoading(false);
      }
    };

    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/product/${id}`);
        const fetchedProduct = res.data.product;

        setProduct(fetchedProduct);
        setMainImage(fetchedProduct.images[0]);

        fetchRelated(fetchedProduct.category, fetchedProduct.subcategory);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
     toast.error("Please selct size", {
       style: {
         borderRadius: "8px",
         background: "#dc2626",
         color: "#fff",
         fontWeight: 600,
         padding: "12px 16px",
         boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
       },
       iconTheme: { primary: "#fff", secondary: "#dc2626" },
     });
      return;
    }

    try {
      const res = await axiosInstance.post(
        "/cart/add",
        {
          productId: product!._id,
          size: selectedSize,
          quantity: 1,
        },
        { withCredentials: true }
      );

      dispatch(setCart(res.data.cart));

      toast.success(res.data.message || "Product Added to cart", {
        style: {
          borderRadius: "8px",
          background: "#1e40af",
          color: "#fff",
          fontWeight: 600,
          padding: "12px 16px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        },
        iconTheme: { primary: "#fff", secondary: "#1e40af" },
      });
      console.log(res.data.cart); 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add to cart");
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <>
      <hr className="border-t border-gray-300" />
      <div className="mt-8 grid grid-cols-[100px_400px_500px] gap-6">
        <div className="flex flex-col gap-2">
          {product.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`product-${i}`}
              className="cursor-pointer"
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>

        <div className="w-[400px] h-[600px] overflow-hidden rounded-lg">
          <img
            src={mainImage}
            alt="main-product"
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-semibold">{product.name}</h1>
            <div className="flex gap-1">
              <span className="text-yellow-400">★</span>
              <span className="text-yellow-400">★</span>
              <span className="text-yellow-400">★</span>
              <span className="text-yellow-400">★</span>
              <span className="text-amber-200">★</span>
              <span className="font-semibold">(122)</span>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-semibold">${product.price}</span>
            </div>
            <div className="mt-5">
              <span className="text-gray-400">{product.description}</span>
            </div>
            <div className="mt-5 flex flex-col gap-4">
              <p className="font-medium">Select size</p>
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2 border rounded-sm ${
                      selectedSize === size
                        ? "border-orange-500 bg-gray-200"
                        : "border-gray-300 bg-[#F3F4F6]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7 mb-5">
              <button
                onClick={handleAddToCart}
                className="border px-4 py-2 uppercase text-sm hover:bg-black hover:text-white transition-all duration-500 rounded-sm"
              >
                Add to cart
              </button>
            </div>

            <hr className="border-t border-gray-300 mt-3 w-[500px]" />
            <div className="mt-2">
              <span className="text-sm text-gray-400">
                100% Original product. <br />
                Cash on delivery is available on this product.
                <br />
                Easy return and exchange policy within 7 days.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-32 mb-10">
        <div className="flex text-sm">
          <span className="border-[0.5px] border-gray-300 px-4 py-2 font font-medium">
            Description
          </span>
          <span className="border-[0.5px] border-gray-300 px-4 py-2">
            Reviews(122)
          </span>
        </div>
        <div className="flex flex-col border-[0.5px] border-gray-300 gap-4 text-sm p-5 text-gray-400">
          <p>
            An e-commerce website is an online platform that facilitates the
            buying and selling of products or services over the internet. It
            serves as a virtual marketplace where businesses and individuals can
            showcase their products, interact with customers, and conduct
            transactions without the need for a physical presence.
          </p>
          <p>
            E-commerce websites typically display products or services along
            with detailed descriptions, images, prices, and any available
            variations (e.g., sizes, colors). Each product usually has its own
            dedicated page with relevant information.
          </p>
        </div>
      </div>

      <div className="mb-15">
        <SectionHeading title1="related" title2="products" />
        <ProductItems products={relatedProducts} loading={relatedLoading} />
      </div>
    </>
  );
}
