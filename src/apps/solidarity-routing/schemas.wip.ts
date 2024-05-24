import * as z from "zod";

import {
  DriverType as DBDriverType,
  JobType as DBJobType,
  type Prisma,
} from "@prisma/client";

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

export const driverFormSchema = z.object({
  id: z.string(),
  vehicleId: z.string().optional(),

  addressId: z.string().optional(),
  startAddressId: z.string().optional(),
  endAddressId: z.string().optional().nullish(),

  type: z.nativeEnum(DBDriverType),
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  email: z.string().email(),
  phone: z.string().regex(/^\d{10}$/, {
    message: "Phone number must be in the format +1 (XXX) XXX-XXXX.",
  }),

  address: z.object({
    formatted: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  startAddress: z
    .object({
      formatted: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional()
    .nullish(),

  endAddress: z
    .object({
      formatted: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional()
    .nullable(),

  maxTravelTime: z.coerce.number().min(0),
  maxTasks: z.coerce.number().min(0),
  maxDistance: z.coerce.number().min(0),

  breaks: z
    .array(
      z.object({
        id: z.number(),
        duration: z.coerce.number().min(0),
      })
    )
    .max(3),

  shiftStart: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Invalid time format. Time must be in 24hr HH:MM format.",
  }),
  shiftEnd: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Invalid time format. Time must be in 24hr  HH:MM format.",
  }),
  capacity: z.coerce.number().min(0).optional(),
});
