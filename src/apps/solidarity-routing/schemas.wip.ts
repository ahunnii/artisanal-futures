import * as z from "zod";

export const depotFormSchema = z
  .object({
    name: z.string().min(1).optional(),
    address: z
      .object({
        formatted: z.string(),
        latitude: z.number(),
        longitude: z.number(),
      })
      .optional(),
    magicCode: z.string(),
  })
  .refine((input) => {
    //  If partial address, return false, but if all fields are undefined, return true
    if (input.address) {
      return !!(
        input.address.formatted &&
        input.address.latitude &&
        input.address.longitude
      );
    } else {
      return true;
    }
  });

export const messageSchema = z.object({
  message: z.string(),
});

export const addressSchema = z.object({
  formatted: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});
