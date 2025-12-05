"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSchema = exports.cartItemSchema = void 0;
const zod_1 = require("zod");
exports.cartItemSchema = zod_1.z.object({
    productId: zod_1.z.string().optional(),
    quantity: zod_1.z.number().min(1).optional(),
    size: zod_1.z.string().optional()
});
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    isAdmin: zod_1.z.boolean().optional().default(false),
    cartData: zod_1.z.array(exports.cartItemSchema).optional()
});
//# sourceMappingURL=user-validator.js.map