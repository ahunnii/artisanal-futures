import * as z from "zod";

export const depotFormSchema = z.object({
  name: z.string().min(1).optional(),
  address: z
    .object({
      formatted: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),
});

export const messageSchema = z.object({
  message: z.string(),
});
