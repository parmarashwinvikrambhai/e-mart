import type { Request, Response } from "express";
import { ZodError } from "zod";
import cloudinary from "../config/cloudinary";
import { createProductSchema, updateProductSchema } from "../validators/product-validator";
import productRepositories from "../repositories/product-repositories";
import mongoose from "mongoose";

interface AuthRequest extends Request {
    user?: { id: string,isAdmin:boolean };
}

export const createProduct = async (req: Request, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[];
        const uploadedImages: string[] = [];
        for (const file of files) {
            await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "products" },
                    (error, result) => {
                        if (error) reject(error);
                        else {
                            uploadedImages.push(result!.secure_url);
                            resolve(result);
                        }
                    }
                );
                stream.end(file.buffer);
            });
        }

        const data = {
            ...req.body,
            price: Number(req.body.price),
            sizes: req.body.sizes ? JSON.parse(req.body.sizes) : [],
            images: uploadedImages,
            bestseller: req.body.bestseller === "true",
        };
        const validateData = createProductSchema.safeParse(data);
        if (!validateData.success) {
            return res.status(400).json({
                message: validateData.error.issues[0].message,
            });
        }

        const product = await productRepositories.createProduct(validateData.data);
        return res.status(201).json({
            message: "Product created successfully",
            product,
        });

    } catch (error) {
        return res.status(error instanceof ZodError ? 400 : 500).json({ message: error instanceof ZodError ? error.issues[0].message : "Internal server error..." });
    }
};

export const getProduct = async (req: Request, res: Response) => {
    try {
        const product = await productRepositories.getProduct();
        if(!product){
            return res.status(404).json({message:"No product found..."});
        }
        res.status(200).json({ message: "product Found...", product });
    } catch (error) {
        return res.status(error instanceof ZodError ? 400 : 500).json({ message: error instanceof ZodError ? error.issues[0].message : "Internal server error..." });

    }
}

export const getProductById = async (req: Request, res: Response) =>{
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Product ID..." });
        }
        const product = await productRepositories.getProductById(id);
        if (!product) {
            return res.status(404).json({ message: "No product found..." });
        }
        res.status(200).json({ message: "product Found...", product });

    } catch (error) {
        return res.status(error instanceof ZodError ? 400 : 500).json({ message: error instanceof ZodError ? error.issues[0].message : "Internal server error..." });
    }
}

export const filterProducts = async (req: Request, res: Response) => {
    try {
        const category = req.query.category?.toString().toLowerCase();
        const type = req.query.type?.toString().toLowerCase();
        const sort = req.query.sort?.toString();
        const search = req.query.search?.toString();

        const filterQuery: any = {};
        if (category) filterQuery.category = category;
        if (type) filterQuery.subcategory = type;
        if (search) filterQuery.name = { $regex: search, $options: "i" };

        // Fetch filtered products
        let products = await productRepositories.filterProducts(filterQuery);

        // Apply sorting
        if (sort === "lowToHigh") {
            products = products.sort((a, b) => a.price - b.price);
        } else if (sort === "highToLow") {
            products = products.sort((a, b) => b.price - a.price);
        }
        res.status(200).json({
            message: "Filtered products fetched...",
            products,
        });
    } catch (error) {
        return res.status(error instanceof ZodError ? 400 : 500).json({
            message:
                error instanceof ZodError
                    ? error.issues[0].message
                    : "Internal server error...",
        });
    }
};


export const deleteProduct = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: "Only admin can delete products." });
        }
        const {id} = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Product ID..." });
        }
        const product = await productRepositories.deleteProduct(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found..." });
        }
        return res.status(200).json({
            message: "Product deleted successfully",product});
    } catch (error) {
        return res.status(error instanceof ZodError ? 400 : 500).json({
            message:
                error instanceof ZodError
                    ? error.issues[0].message
                    : "Internal server error...",
        });
    }
}

export const updateProduct = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: "Only admin can Update products." });
        }
        const validatedData = updateProductSchema.safeParse(req.body);
        if (!validatedData.success) {
            return res.status(400).json({
                message: validatedData.error.issues[0].message,
            });
        }
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Product ID..." });
        }
        const product = await productRepositories.updateProduct(id, validatedData.data);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found..." });
        }
        return res.status(200).json({
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        return res.status(error instanceof ZodError ? 400 : 500).json({
            message:
                error instanceof ZodError
                    ? error.issues[0].message
                    : "Internal server error...",
        });
    }
}


