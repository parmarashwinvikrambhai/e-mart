import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().optional().default(""),
    price: z.number().min(0, "Price must be greater than or equal to 0"),
    images: z.array(z.string().min(1, "Image URL cannot be empty")).min(1, "At least one image is required"),
    category: z.string().optional().default(""),
    subcategory: z.string().optional().default(""),
    sizes: z.array(z.string()).optional().default([]),
    bestseller: z.boolean().optional().default(false),
    date: z.preprocess((arg) => arg ? new Date(arg as string) : new Date(), z.date()).optional()
});
