import { z } from "zod";

export const orderItemSchema = z.object({
    productId: z.string().min(1, "Product ID is required"), 
    quantity: z.number().min(1, "Quantity must be at least 1").optional(),
    size: z.string().optional()
});

export const createOrderSchema = z.object({
    items: z.array(orderItemSchema).min(1, "At least one item is required"),
    amount: z.number().min(0, "Amount must be positive"),
    address: z.object({
        street: z.string().min(1),
        city: z.string().min(1),
        state: z.string(),
        postalCode: z.string(),
        country: z.string().min(1)
    }),
    status: z.string().optional().default("Order Placed"),
    paymentMethod: z.string(),
    payment: z.boolean().optional().default(false),
    date: z.preprocess((arg) => arg ? new Date(arg as string) : new Date(), z.date())
});
export const updateOrderSchema = z.object({
    status: z.string().optional().default("Processing"),

});
