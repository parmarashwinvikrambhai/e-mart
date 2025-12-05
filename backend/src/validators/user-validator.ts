import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string(), 
  quantity: z.number(),
  size: z.string().min(1, "Size required")
});

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").toLowerCase(), 
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  isAdmin: z.boolean().optional().default(false), 
  cartData: z.array(cartItemSchema).optional() 
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(1, { message: "Password is required" }),
});

