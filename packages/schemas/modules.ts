import { z } from "zod";

export const moduleSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1, "Module name is required"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  hours: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Hours must be a decimal number"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createModuleSchema = moduleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateModuleSchema = createModuleSchema.partial();

export type Module = z.infer<typeof moduleSchema>;
