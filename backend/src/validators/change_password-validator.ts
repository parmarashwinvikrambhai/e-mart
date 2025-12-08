import { z } from "zod";

export const changePasswordSchema = z.object({
    Password: z.string(),
    newPassword: z.string(),
});

