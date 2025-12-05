import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading";
import axiosInstance from "../services/apiClient"; 


// Product interface, jaisa humne pichli files mein use kiya tha
interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
    category?: string;
    subcategory?: string;
}

function LatestCollection() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLatestProducts = async () => {
            try {
                const res = await axiosInstance.get("/product?limit=8");
                
                setProducts(res.data.products || res.data.product || []); 
                setError(null);
            } catch (err) {
                console.error("Error fetching latest collection:", err);
                setError("Failed to load latest collection.");
            } finally {
                setLoading(false);
            }
        };

        fetchLatestProducts();
    }, []);

    if (loading) {
        return (
            <div className="mt-20 w-full text-center">
                <SectionHeading 
                    title1="latest" 
                    title2="collections" 
                    title3="Discover a curated world of fashion where elegance meets everyday comfort..."
                />
                <p className="mt-10 text-lg text-gray-600">Loading latest products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-20 w-full text-center">
                <SectionHeading 
                    title1="latest" 
                    title2="collections" 
                    title3="Discover a curated world of fashion where elegance meets everyday comfort..."
                />
                <p className="mt-10 text-lg text-red-500">{error}</p>
            </div>
        );
    }
    
    // Agar koi product nahi mila toh
    if (products.length === 0) {
        return (
            <div className="mt-20 w-full text-center">
                <SectionHeading 
                    title1="latest" 
                    title2="collections" 
                    title3="Discover a curated world of fashion where elegance meets everyday comfort..."
                />
                <p className="mt-10 text-lg text-gray-600">No products found in the latest collection.</p>
            </div>
        );
    }

    return (
        <div className="mt-20 w-full">
            {/* Heading Center */}
            <SectionHeading 
                title1="latest" 
                title2="collections" 
                title3="Discover a curated world of fashion where elegance meets everyday
                    comfort — because you deserve to look extraordinary in every moment."
            />
            
            <div className="w-full mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
        </div>
    );
}

export default LatestCollection;