import * as z from "zod";

export const registerSchema = z.object({
    name: z.string(),
    phone: z.string().regex(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}$/, {
        message: "Invalid Egyptian phone number"
    }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword,
    { message: "password doesn't match", path: ["confirmPassword"] });
