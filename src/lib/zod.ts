import { z } from "zod";

const user_validation = z.object({
    fullname: z
        .string()
        .nonempty({ message: "Fullname field is required" })
        .refine(
            (value) => value.length >= 3 || value === "",
            { message: "Fullname must be at least 3 characters long" }
        )
        .refine(
            (value) => value.length <= 20 || value === "",
            { message: "Fullname must be at most 20 characters long" }
        )

        .optional(),
    email: z
        .string()
        .nonempty({ message: "Email field is required" })
        .refine(
            (value) => /^\S+@\S+\.\S+$/.test(value) || value === "",
            { message: "Invalid email format" }
        ),
    password: z
        .string()
        .nonempty({ message: "Password field is required" })
        .refine(
            (value) => value.length >= 8 || value === "",
            { message: "Password must be at least 8 characters long" }
        )
        .refine(
            (value) => value.length <= 30 || value === "",
            { message: "Password is too long" }
        )
        .refine(
            (value) => /[A-Z]/.test(value) || value === "",
            { message: "Password must contain at least one uppercase letter" }
        )
        .refine(
            (value) => /[a-z]/.test(value) || value === "",
            { message: "Password must contain at least one lowercase letter" }
        )
        .refine(
            (value) => /[0-9]/.test(value) || value === "",
            { message: "Password must contain at least one number" }
        )
        .refine(
            (value) => /[\W_]/.test(value) || value === "",
            { message: "Password must contain at least one special character" }
        ),
})

export {
    user_validation,
}
