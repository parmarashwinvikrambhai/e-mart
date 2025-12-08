import { z } from "zod";


export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").toLowerCase(), 
  email: z.string().email("Invalid email address"),
 
});