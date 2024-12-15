import { z } from "zod";


export const createWorkspaceSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  image: z.union([
    z.instanceof(File),
    z.string().transform((value) => value==="" ? undefined : value).optional(),
  ]),
});

export const updateWorkspaceSchema = createWorkspaceSchema.partial();