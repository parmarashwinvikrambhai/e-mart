import {z} from "zod"
 
export const resetPasswordSchema = z.object({
    password: z
        .string()
        .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Must contain at least one number" })
        .regex(/[@$!%*?&#]/, { message: "Must contain at least one special character" }),
})