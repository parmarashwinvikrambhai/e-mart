import type { Request, Response } from "express";
import { createOrderSchema } from "../validators/order-validator";
import orderRepositories from "../repositories/order-repositories";
import User from "../models/user-model";
import type { IOrder } from "../types/order-types";
import { ZodError } from "zod";


export const createOrder = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized user" });
        }
        const validated = createOrderSchema.safeParse(req.body);
        if (!validated.success) {
            return res.status(400).json({
                message: validated.error.issues[0].message,
            });
        }
        const { items, amount, address, status, paymentMethod, payment, date } = validated.data;
        const orderData: IOrder = {
            userId,
            items,
            amount,
            address,
            status: status || "Order Placed",
            paymentMethod,
            payment: payment || false,
            date: date || Date.now(),
        };

        const newOrder = await orderRepositories.createOrder(orderData);
        await User.findByIdAndUpdate(userId, { $set: { cartData: [] } });
        return res.status(201).json({message: "Order placed successfully",order: newOrder});
    } catch (error: any) {
        return res.status(error instanceof ZodError ? 400 : 500).json({
            message:
                error instanceof ZodError
                    ? error.issues[0].message
                    : "Internal Server Error",
        });
    }
};

export const getOrder = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized user" });
        }
        const order = await orderRepositories.getOrder(userId);
        if(!order){
            return res.status(404).json({ message: "No order found" });
        }
        res.status(200).json({message:"order fetch successfully", order});
    } catch (error) {
        return res.status(error instanceof ZodError ? 400 : 500).json({
            message:
                error instanceof ZodError
                    ? error.issues[0].message
                    : "Internal Server Error",
        });
    }
}
