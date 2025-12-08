import Product from "../models/product-model";
import { IProduct } from "../types/product-types"

const createProduct = async (data:IProduct) => {
    const product = new Product(data);
    return await product.save();
}

const getProduct = async () => {
    return await Product.find().sort({ createdAt: -1 });
}

const getProductById = async (id:string) => {
    return await Product.findById(id);
}

const filterProducts = async (filters: any) => {
    return await Product.find(filters);
};

const deleteProduct = async (id:string) => {
    return await Product.findByIdAndDelete(id);
}

export default {
    createProduct,
    getProduct,
    getProductById,
    filterProducts,
    deleteProduct
}