import type { Prisma } from "@prisma/client";
import * as z from "zod";

export type VersionOneDriverCSV = {
  name: string;
  address: string;
  email: string;
  phone: string;
  default_capacity: number;
  default_distance: number;
  default_shift_start: string;
  default_shift_end: string;
  default_travel_time: number;
  default_stops: number;
  default_breaks: string;
};

export type VersionOneClientCSV = {
  name: string;
  address: string;
  email?: string;
  phone?: string;
  default_prep_time?: number;
  default_service_time?: number;
  default_priority?: number;

  default_time_start?: string;
  default_time_end?: string;

  notes?: string;
};

const clientSchema = z.object({
  name: z.string(),
  address: z.object({
    formatted: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  email: z.string().email().optional(),
  phone: z.coerce.string().optional(),
});

const jobSchema = z.object({
  type: z.string(),
  serviceTime: z.number(),
  prepTime: z.number(),
  priority: z.number(),
  timeWindowStart: z.number(),
  timeWindowEnd: z.number(),
  notes: z.string().optional(),
});

const driverSchema = z.object({
  name: z.string(),
  address: z.object({
    formatted: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  email: z.string().email(),
  phone: z.coerce.string(),
});

const vehicleSchema = z.object({
  type: z.string(),
  capacity: z.number(),
  maxTasks: z.number(),
  maxTravelTime: z.number(),
  maxDistance: z.number(),
  shiftStart: z.number(),
  shiftEnd: z.number(),
  breaks: z.array(
    z
      .object({
        duration: z.number(),
        start: z.number(),
        end: z.number(),
      })
      .optional()
  ),
});

export const driverVehicleSchema = z.object({
  driver: driverSchema,
  vehicle: vehicleSchema,
});

export const clientJobSchema = z.object({
  client: clientSchema,
  job: jobSchema,
});

export const driverFormSchema = z.object({
  id: z.number(),
  databaseDriverId: z.string().optional(),

  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    })
    .or(z.number()),

  address: z.object({
    formatted: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),

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

  shift: z.object({
    start: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Invalid time format. Time must be in 24hr HH:MM format.",
    }),
    end: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Invalid time format. Time must be in 24hr  HH:MM format.",
    }),
  }),
});

export type DriverFormValues = z.infer<typeof driverFormSchema>;

export type DriverVehicleBundle = z.infer<typeof driverVehicleSchema>;

export type ClientJobBundle = z.infer<typeof clientJobSchema>;

export type Driver = Prisma.DriverGetPayload<{
  include: {
    address: true;
    vehicles: true;
  };
}>;
