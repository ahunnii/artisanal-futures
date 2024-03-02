import {
  DriverType as DBDriverType,
  JobType as DBJobType,
  type Prisma,
} from "@prisma/client";

import * as z from "zod";
import { driverFormSchema } from "./schemas.wip";

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
  prep_time?: number;
  service_time?: number;
  priority?: number;

  time_start?: string;
  time_end?: string;

  notes?: string;
  order?: string;

  default_order?: boolean;
};

export type UploadOptions<T> = {
  type: keyof T;
  parseHandler: FileUploadHandler<T>;
  handleAccept: ({ data, saveToDB }: { data: T[]; saveToDB?: boolean }) => void;
  currentData?: T[] | null;
};

export type FetchOptions<T> = {
  type: keyof T;
  parseHandler: FileUploadFetch<T>;
  handleAccept: ({ data, saveToDB }: { data: T[]; saveToDB?: boolean }) => void;
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
    tableData: { name: string; address: string; email?: string }[];
  }) => void;
};

type FetchProps<T> = {
  csvData: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  callback: ({
    data,
    tableData,
  }: {
    data: T[];
    tableData: { name: string; address: string; email?: string }[];
  }) => void;
};

export type FileUploadHandler<T> = (props: UploadProps<T>) => void;
export type FileUploadFetch<T> = (props: FetchProps<T>) => void;

export const driverTypeSchema = z.enum(["DRIVER", "TEMP"]);

export const jobTypeSchema = z.enum(["DELIVERY", "PICKUP"]);

export const clientSchema = z.object({
  id: z.string(),
  name: z.string(),
  addressId: z.string().optional(),
  address: z
    .object({
      formatted: z.string(),
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
  email: z.string().email(),
  phone: z.coerce.string().optional(),
  defaultJobId: z.string().optional().nullish(),
});

export const jobSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(DBJobType),
  addressId: z.string().optional(),
  address: z.object({
    formatted: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  clientId: z.string().optional().nullish(),

  serviceTime: z.number(),
  prepTime: z.number(),
  priority: z.number(),
  timeWindowStart: z.number(),
  timeWindowEnd: z.number(),
  notes: z.string().optional(),
  order: z.string().optional(),
  isOptimized: z.boolean().optional(),
});

//zod validation for DriverType from prisma

export const driverSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(DBDriverType),
  name: z.string(),
  addressId: z.string().optional(),
  address: z.object({
    formatted: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  email: z.string().email(),
  phone: z.coerce.string(),
  defaultVehicleId: z.string().optional(),
});

export const vehicleSchema = z.object({
  id: z.string(),
  type: z.string().optional(),

  startAddressId: z.string().optional(),
  endAddressId: z.string().optional(),

  startAddress: z.object({
    formatted: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  endAddress: z
    .object({
      formatted: z.string(),
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
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


// actual RoadPoint
export const roadPointSchema = z.object({
  id: z.string(),
  roadId: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  order: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type RoadPoint = z.infer<typeof roadPointSchema>;

// actual Road
export const roadSchema = z.object({
  id: z.string(),
  name: z.string(),
  points: z.array(roadPointSchema),
  depotId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Road = z.infer<typeof roadSchema>;

// for Road ; don't need
export const driverVehicleSchema2 = z.object({
  driver: driverSchema,
  vehicle: vehicleSchema,
});


export const clientJobSchema = z.object({
  client: clientSchema.optional(),
  job: jobSchema,
});


export const stopFormSchema = z
  .object({
    id: z.string(),
    clientId: z.string().optional(),

    clientAddressId: z.string().optional(),
    addressId: z.string().optional(),

    type: z.nativeEnum(DBJobType),
    name: z
      .string()
      .min(2, {
        message: "Name must be at least 2 characters.",
      })
      .max(30, {
        message: "Name must not be longer than 30 characters.",
      }),
    clientAddress: z
      .object({
        formatted: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      })
      .optional(),

    address: z.object({
      formatted: z.string(),
      latitude: z.number(),
      longitude: z.number(),
    }),
    email: z.string().email().optional(),
    phone: z
      .string()
      .regex(/^\d{3}\d{3}\d{4}$/, {
        message: "Phone number must be in the format XXXXXXXXXX.",
      })
      .optional()
      .nullish(),

    timeWindowStart: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Invalid time format. Time must be in HH:MM format.",
    }),

    timeWindowEnd: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Invalid time format. Time must be in HH:MM format.",
    }),

    serviceTime: z.coerce.number().min(0),
    prepTime: z.coerce.number().min(0),
    priority: z.coerce.number().min(0),

    notes: z.string().optional(),
    order: z.string().optional(),
  })
  .refine((input) => {
    // allows bar to be optional only when foo is 'foo'
    if (
      input.clientId !== undefined &&
      (input.email === undefined || input.email === null || input.email === "")
    )
      return false;

    return true;
  });

export type StopFormValues = z.infer<typeof stopFormSchema>;

export type DriverType = DBDriverType;
export type JobType = DBJobType;

export type DriverFormValues = z.infer<typeof driverFormSchema>;

export type DriverVehicleBundle = z.infer<typeof driverVehicleSchema>;

// for Road
export type RoadBundle = z.infer<typeof roadSchema>;

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

export type DepotValues = Prisma.DepotGetPayload<{
  include: {
    address: true;
  };
}>;

export const optimizationPlanSchema = z.object({
  geometry: z.array(
    z.object({
      type: z.string(),
      coordinates: z.array(z.array(z.number(), z.number())),
      properties: z
        .object({
          color: z.number().optional(),
        })
        .optional(),
    })
  ),
  data: z.object({
    code: z.number(),
    routes: z.array(
      z.object({
        amount: z.array(z.number()),
        cost: z.number(),
        delivery: z.array(z.number()),
        description: z.string(),
        distance: z.number(),
        duration: z.number(),
        geometry: z.string(),
        pickup: z.array(z.number()),
        priority: z.number(),
        service: z.number(),
        setup: z.number(),
        vehicle: z.number(),
        violations: z.array(z.unknown()),
        waiting_time: z.number(),
        steps: z.array(
          z.object({
            arrival: z.number(),
            distance: z.number(),
            duration: z.number(),
            load: z.array(z.number()),
            location: z.array(z.number(), z.number()).optional(),
            service: z.number(),
            setup: z.number(),
            type: z.string(),
            violations: z.array(z.unknown()),
            waiting_time: z.number(),
            description: z.string().optional(),
            id: z.number().optional(),
            job: z.number().optional(),
          })
        ),
      })
    ),
    summary: z.object({
      amount: z.array(z.number()),
      computing_times: z.object({
        loading: z.number(),
        solving: z.number(),
        routing: z.number(),
      }),
      cost: z.number(),
      delivery: z.array(z.number()),
      distance: z.number(),
      duration: z.number(),
      pickup: z.array(z.number()),
      priority: z.number(),
      routes: z.number(),
      service: z.number(),
      setup: z.number(),
      unassigned: z.number(),
      violations: z.array(z.unknown()),
      waiting_time: z.number(),
    }),
    unassigned: z.array(
      z.object({
        id: z.number(),
        location: z.array(z.number(), z.number()),
        description: z.string(),
        type: z.string(),
      })
    ),
  }),
});

export type OptimizationPlan = z.infer<typeof optimizationPlanSchema>;

// export type OptimizedStop = {
//   id: string;
//   jobId: string | undefined | null;
//   job: Job | null | undefined;
//   arrival: number;
//   distance?: number;
//   duration?: number;
//   departure?: number;
//   prep: number;
//   type: string;
//   notes?: string;
//   order?: string;
//   status: RouteStatus;
// };
// export type OptimizedRoutePath = {
//   vehicleId: string;
//   stops: OptimizedStop[];
//   geoJson: string;
// };

export type OptimizedStop = Prisma.OptimizedStopGetPayload<{
  include: {
    job: {
      include: {
        client: true;
        address: true;
      };
    };
  };
}>;

export type OptimizedRoutePath = Prisma.OptimizedRoutePathGetPayload<{
  include: {
    stops: true;
  };
}>;

export type OptimizedResponseData = {
  summary: {
    totalDistance: number;
    totalDuration: number;
    totalPrepTime: number;
    totalServiceTime: number;
    unassigned: string[];
  };
  routes: {
    vehicleId: string;
    geometry: string;
    totalDistance: number;
    totalDuration: number;
    totalPrepTime: number;
    totalServiceTime: number;
    startTime: number;
    endTime: number;
    stops: {
      jobId: string;
      arrival: number;
      departure: number;
      serviceTime: number;
      prepTime: number;
      type:
        | "job"
        | "pickup"
        | "delivery"
        | "shipment"
        | "break"
        | "start"
        | "end";
    }[];
  }[];
};

export type Coordinates = {
  lat: number;
  lng: number;
};

export type AutoCompleteCoordinates = {
  latitude: number;
  longitude: number;
};

export type Channel = Prisma.ChannelGetPayload<{
  include: {
    messages: true;
  };
}>;

export type Member = Prisma.MemberGetPayload<{
  include: {
    profile: true;
  };
}>;
