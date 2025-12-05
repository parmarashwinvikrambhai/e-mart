"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderSchema = exports.orderItemSchema = void 0;
const zod_1 = require("zod");
exports.orderItemSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1, "Product ID is required"),
    quantity: zod_1.z.number().min(1, "Quantity must be at least 1").optional(),
    size: zod_1.z.string().optional()
});
exports.createOrderSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1, "User ID is required"),
    items: zod_1.z.array(exports.orderItemSchema).min(1, "At least one item is required"),
    amount: zod_1.z.number().min(0, "Amount must be positive").optional(),
    address: zod_1.z.object({
        street: zod_1.z.string().min(1),
        city: zod_1.z.string().min(1),
        state: zod_1.z.string().optional(),
        postalCode: zod_1.z.string().optional(),
        country: zod_1.z.string().min(1)
    }),
    status: zod_1.z.string().optional().default("Order Placed"),
    paymentMethod: zod_1.z.string().optional(),
    payment: zod_1.z.boolean().optional().default(false),
    date: zod_1.z.preprocess((arg) => arg ? new Date(arg) : new Date(), zod_1.z.date()).optional()
});
//# sourceMappingURL=order-validator.js.map