import type { Request, Response } from "express";
import { createOrderSchema, updateOrderSchema } from "../validators/order-validator";
import orderRepositories from "../repositories/order-repositories";
import User from "../models/user-model";
import type { IOrder, IUpdateOrder } from "../types/order-types";
import { ZodError } from "zod";


export const createOrder = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized user" });
        }
        const validateData = createOrderSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({
                message: validateData.error.issues[0].message,
            });
        }

       
        const { items, amount, address, status, paymentMethod, date } = validateData.data;

        const isPaid = paymentMethod === 'paypal';
        const orderData: IOrder = {
            userId,
            items,
            amount,
            address,
            status: status || "Order Placed",
            paymentMethod,
            payment: isPaid ? "received" : "pending",
            date: date || Date.now(),
        };

        const newOrder = await orderRepositories.createOrder(orderData);
        await User.findByIdAndUpdate(userId, { $set: { cartData: [] } });
        return res.status(201).json({ message: "Order placed successfully", order: newOrder });
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
        const user = (req as any).user; 
        let order;
        if (user.isAdmin) {
            order = await orderRepositories.getAllOrders();
        }
        else {
            order = await orderRepositories.getOrder(user.id);
        }
        if (order.length === 0) {
            return res.status(404).json({ message: "No orders found", order: [] });
        }
        res.status(200).json({message: "Orders fetched successfully",order});

    } catch (error) {
        return res.status(error instanceof ZodError ? 400 : 500).json({
            message:
                error instanceof ZodError
                    ? error.issues[0].message
                    : "Internal Server Error",
        });
    }
};


export const updateOrder = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized user" });
        }

        const { orderId } = req.params;

        // Validate using Zod (expects string for payment/status)
        const validateData = updateOrderSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({
                message: validateData.error.issues[0].message,
            });
        }

        // status and payment are now string | undefined
        const { status, payment } = validateData.data;

        const updateFields: IUpdateOrder = {};

        // 2. Build updateFields object safely
        if (status !== undefined) {
            updateFields.status = status;
        }

        // Since Zod expects string, 'payment' will be 'paid' or 'pending' (string)
        if (payment !== undefined) {
            updateFields.payment = payment;
        }

        // Ensure at least one field is being updated
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No valid fields provided for update." });
        }

        
        const updatedOrder = await orderRepositories.updateOrderStatus(
            orderId,
            updateFields
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json({
            message: "Order updated successfully",
            order: updatedOrder,
        });
    } catch (error) {
        return res.status(error instanceof ZodError ? 400 : 500).json({
            message:
                error instanceof ZodError
                    ? error.issues[0].message
                    : "Internal Server Error",
        });
    }
};

export const getSingleOrder = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const { orderId } = req.params;

        const order = await orderRepositories.findOrderById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (!user.isAdmin && order.userId.toString() !== user.id.toString()) {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        res.status(200).json({
            message: "Order fetched successfully",
            order,
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


