import { z } from "zod";


export const createProjectSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  image: z.union([
    z.instanceof(File),
    z.string().transform((value) => value==="" ? undefined : value).optional(),
  ]),
  workspaceId: z.string(),
});

export const updateProjectSchema = createProjectSchema.partial();
