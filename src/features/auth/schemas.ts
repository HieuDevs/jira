import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(256),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().min(1, "Email is required").email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(256),
});