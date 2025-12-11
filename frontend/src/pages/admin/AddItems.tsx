import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import type { RootState } from "../../redux/store";
import axiosInstance from "../../services/apiClient";
import toast from "react-hot-toast";
import uploadImg from "../../assets/file.png";

function AddItems() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  // Admin-only access
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const location = useLocation();
  const userData = location.state?.product || null;

  // Form states
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Men");
  const [subcategory, setSubcategory] = useState("Topwear");
  const [price, setPrice] = useState<number | "">("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [bestseller, setBestseller] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setName(userData.name);
      setDescription(userData.description);
      setCategory(userData.category);
      setSubcategory(userData.subcategory);
      setPrice(userData.price);
      setSelectedSizes(userData.sizes);
      setBestseller(userData.bestseller);
      setExistingImages(userData.images || []);
    }
  }, [userData]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !name ||
      !description ||
      !price ||
      selectedSizes.length === 0 ||
      (images.length === 0 && existingImages.length === 0)
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      if (userData) {
        const payload = {
          name,
          description,
          category: category.toLowerCase(),
          subcategory: subcategory.toLowerCase(),
          price: Number(price),
          sizes: selectedSizes,
          bestseller,

          images: existingImages,
        };
        const res = await axiosInstance.put(
          `/product/${userData._id}`,
          payload
        );
        toast.success(res.data.message || "Product Updated successfully");
        navigate("/admin/item-list");
      } else {
        // Create Logic (Send FormData)
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("category", category.toLowerCase());
        formData.append("subcategory", subcategory.toLowerCase());
        formData.append("price", String(price));
        formData.append("sizes", JSON.stringify(selectedSizes));
        formData.append("bestseller", String(bestseller));
        images.forEach((file) => formData.append("images", file));

        const res = await axiosInstance.post("/product/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(res.data.message || "Product Added successfully");

        setName("");
        setDescription("");
        setPrice("");
        setSelectedSizes([]);
        setImages([]);
        setBestseller(false);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-start">
      <form
        className="w-full max-w-3xl p-10 text-gray-500 flex flex-col gap-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-semibold mb-6">
          {userData ? "Edit Product" : "Add New Product"}
        </h2>

        {/* Image Upload */}
        <div className="flex gap-4 flex-wrap mb-4">
          {[0, 1, 2, 3].map((i) => (
            <label
              key={i}
              className="w-24 h-24 rounded-md flex items-center justify-center cursor-pointer bg-cover bg-center bg-no-repeat border border-gray-300"
              style={{
                backgroundImage: images[i]
                  ? `url(${URL.createObjectURL(images[i])})`
                  : existingImages[i]
                  ? `url(${existingImages[i]})`
                  : `url(${uploadImg})`,
              }}
            >
              <input
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          ))}
        </div>

        {/* Product Name */}
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
        />

        {/* Description */}
        <textarea
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md h-24 resize-none outline-none"
        ></textarea>

        {/* Category, Subcategory, Price */}
        <div className="grid grid-cols-3 gap-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md"
          >
            <option>Men</option>
            <option>Women</option>
            <option>Kids</option>
          </select>

          <select
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md"
          >
            <option>Topwear</option>
            <option>Bottomwear</option>
            <option>Winterwear</option>
          </select>

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded-md outline-none"
          />
        </div>

        {/* Sizes */}
        <div className="flex gap-2 flex-wrap mt-2">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => {
                setSelectedSizes(
                  (prev) =>
                    prev.includes(size)
                      ? prev.filter((s) => s !== size) // remove if already selected
                      : [...prev, size] // add if not selected
                );
              }}
              className={`px-3 py-1 border rounded-sm text-sm ${
                selectedSizes.includes(size)
                  ? "border-orange-500 bg-gray-200"
                  : "border-gray-300 bg-gray-100"
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Bestseller */}
        <label className="flex items-center gap-2 cursor-pointer mt-2">
          <input
            type="checkbox"
            checked={bestseller}
            onChange={(e) => setBestseller(e.target.checked)}
          />
          <span>Add to Bestseller</span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-fit bg-black text-white px-2 py-1 rounded-md mt-4 ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading
            ? userData
              ? "Updating..."
              : "Adding..."
            : userData
            ? "Update Product"
            : "Add Product"}
        </button>
      </form>
    </div>
  );
}

export default AddItems;
