import type { Request, Response } from "express";
import { ZodError } from "zod";
import User from "../models/user-model";
import { cartItemSchema } from "../validators/user-validator";



export const addToCart = async (req: Request, res: Response) => {
    try {
        const validateData = cartItemSchema.safeParse(req.body);

        if (!validateData.success) {
            return res.status(400).json({
                message: validateData.error.issues[0].message
            });
        }

        const { productId, size, quantity } = validateData.data;
        const userId = (req as any).user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const qty = quantity <= 0 && user.cartData.length === 0 ? 1 : quantity;

        const existingItemIndex = user.cartData.findIndex(
            (item) =>
                item.productId!.toString() === productId &&
                item.size === size
        );

        if (existingItemIndex !== -1) {
            const existingItem = user.cartData[existingItemIndex];

            existingItem.quantity! += qty;

            if (existingItem.quantity! <= 0) {
                user.cartData.splice(existingItemIndex, 1); 
            }

        } else if (qty > 0) { 
            user.cartData.push({ productId, size, quantity: qty });
        }

        await user.save();

        await user.populate("cartData.productId");

        return res.status(200).json({ message: "Added to cart", cart: user.cartData });

    } catch (error) {
        return res.status(error instanceof ZodError ? 400 : 500).json({
            message:
                error instanceof ZodError
                    ? error.issues[0].message
                    : "Internal Server Error",
        });
    }
};

export const getCart = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const user = await User.findById(userId).populate("cartData.productId");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ cartData: user.cartData });
    } catch (error) {
        return res.status(error instanceof ZodError ? 400 : 500).json({
            message:
                error instanceof ZodError
                    ? error.issues[0].message
                    : "Internal Server Error",
        });
    }
}

export const updateCart = async (req: Request, res: Response) => {
    try {
        const { newQuantity } = req.body;
        const { itemId } = req.params;
        const userId = (req as any).user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const existingItem = user.cartData.id(itemId);
        if (!existingItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        const qty = newQuantity <= 0 ? 0 : newQuantity;
        existingItem.quantity = qty;

        if (existingItem.quantity! <= 0) {
            user.cartData.pull({ _id: itemId });
        }

        await user.save();

        await user.populate("cartData.productId");

        return res.status(200).json({
            message: "Quantity updated successfully",
            cart: user.cartData
        });

    } catch (error) {
        return res.status(error instanceof ZodError ? 400 : 500).json({
            message: error instanceof ZodError
                ? error.issues[0].message
                : "Internal Server Error",
        });
    }
};

export const deleteCart = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { id } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.cartData.pull(id);
        await user.save();

        // --- FIX: Populate data to ensure product details are sent to frontend ---
        await user.populate("cartData.productId");

        return res.status(200).json({ message: "Item Removed successfully", cart: user.cartData });
    } catch (error) {
        return res.status(error instanceof ZodError ? 400 : 500).json({
            message: error instanceof ZodError
                ? error.issues[0].message
                : "Internal Server Error",
        });
    }
}