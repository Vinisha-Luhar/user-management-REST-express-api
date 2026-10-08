const { z } = require("zod");

const signupSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must not exceed 100 characters"),

        email: z
            .string()
            .trim()
            .email("Invalid email format"),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(128, "Password must not exceed 128 characters")
    })
    .strict();

const loginSchema = z
    .object({
        email: z
            .string()
            .trim()
            .email("Invalid email format"),

        password: z
            .string()
            .min(1, "Password is required")
            .max(128, "Password must not exceed 128 characters")
    })
    .strict();

module.exports = {
    signupSchema,
    loginSchema
};