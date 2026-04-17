import { z } from "zod"

export const changePasswordSchema = z.object({
    oldPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
    newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmNewPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match"
});