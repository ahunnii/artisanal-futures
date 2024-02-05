import { DriverType as DBDriverType, type Prisma } from "@prisma/client";

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

export type UploadOptions<T> = {
  type: keyof T;
  parseHandler: FileUploadHandler<T>;
  handleAccept: ({ data, saveToDB }: { data: T[]; saveToDB: boolean }) => void;
  currentData?: T[] | null;
};

type UploadProps<T> = {
  event: React.ChangeEvent<HTMLInputElement>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  callback: ({
    data,
    tableData,
  }: {
    data: T[];
    tableData: { name: string; address: string }[];
  }) => void;
};

export type FileUploadHandler<T> = (props: UploadProps<T>) => void;
export const driverTypeSchema = z.enum(["DRIVER", "TEMP"]);

export const jobTypeSchema = z.enum(["DELIVERY", "PICKUP"]);

const clientSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z
    .object({
      formatted: z.string(),
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
  email: z.string().email().optional(),
  phone: z.coerce.string().optional(),
});

const jobSchema = z.object({
  id: z.string(),
  address: z.object({
    formatted: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  type: jobTypeSchema,
  serviceTime: z.number(),
  prepTime: z.number(),
  priority: z.number(),
  timeWindowStart: z.number(),
  timeWindowEnd: z.number(),
  notes: z.string().optional(),
  order: z.string().optional(),
});

//zod validation for DriverType from prisma

export const driverSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(DBDriverType),
  name: z.string(),
  address: z.object({
    formatted: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  email: z.string().email(),
  phone: z.coerce.string(),
});

export const vehicleSchema = z.object({
  id: z.string(),
  type: driverTypeSchema,
  startAddress: z.object({
    formatted: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),

  capacity: z.number().optional(),
  maxTasks: z.number().optional(),
  maxTravelTime: z.number().optional(),
  maxDistance: z.number().optional(),
  shiftStart: z.number(),
  shiftEnd: z.number(),
  notes: z.string().optional(),
  cargo: z.string().optional(),
  breaks: z
    .array(
      z.object({
        id: z.number(),
        duration: z.number(),
        start: z.number().optional(),
        end: z.number().optional(),
      })
    )
    .optional(),
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
  id: z.string(),
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
  phone: z.string().regex(/^\d{3}-\d{3}-\d{4}$/, {
    message: "Phone number must be in the format XXX-XXX-XXXX.",
  }),
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

  shiftStart: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Invalid time format. Time must be in 24hr HH:MM format.",
  }),
  shiftEnd: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Invalid time format. Time must be in 24hr  HH:MM format.",
  }),
  capacity: z.coerce.number().min(0).optional(),
});

export const stopFormSchema = z.object({
  id: z.string(),
  type: jobTypeSchema,
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),

  address: z.object({
    formatted: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  email: z.string().email().optional(),
  phone: z
    .string()
    .regex(/^\d{3}-\d{3}-\d{4}$/, {
      message: "Phone number must be in the format XXX-XXX-XXXX.",
    })
    .optional(),

  timeWindowStart: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Invalid time format. Time must be in HH:MM format.",
  }),

  timeWindowEnd: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Invalid time format. Time must be in HH:MM format.",
  }),

  serviceTime: z.number().min(0),
  prepTime: z.coerce.number().min(0),
  priority: z.coerce.number().min(0),

  notes: z.string().optional(),
  order: z.string().optional(),
});

export type StopFormValues = z.infer<typeof stopFormSchema>;

export type DriverType = DBDriverType;
export type DriverFormValues = z.infer<typeof driverFormSchema>;

export type DriverVehicleBundle = z.infer<typeof driverVehicleSchema>;

export type ClientJobBundle = z.infer<typeof clientJobSchema>;

export type Driver = Prisma.DriverGetPayload<{
  include: {
    address: true;
    vehicles: {
      include: {
        startAddress: true;
        breaks: true;
      };
    };
  };
}>;
