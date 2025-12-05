"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Product name is required"),
    description: zod_1.z.string().optional().default(""),
    price: zod_1.z.number().min(0, "Price must be greater than or equal to 0"),
    images: zod_1.z.array(zod_1.z.string().min(1, "Image URL cannot be empty")).min(1, "At least one image is required"),
    category: zod_1.z.string().optional().default(""),
    subcategory: zod_1.z.string().optional().default(""),
    sizes: zod_1.z.array(zod_1.z.string()).optional().default([]),
    bestseller: zod_1.z.boolean().optional().default(false),
    date: zod_1.z.preprocess((arg) => arg ? new Date(arg) : new Date(), zod_1.z.date()).optional()
});
//# sourceMappingURL=product-validator.js.map