//With two ways to use the application, this manages the state of the depot either from zustand or from the database
export const useDepot = () => {
  return {};
};

type DriverVehicleDefaults = {
  id: number;
  name: string;
  address: string;
  maxTravelTime: number;
  maxTasks: number;
  maxDistance: number;
  shift: {
    start: string;
    end: string;
  };
  breaks: Array<{ id: number; duration: number }>;
};

type Controller<Defaults, Data> = {
  defaults: Defaults;
  add: (data: Data) => void;
  update: (id: number | string, data: Partial<Data>) => void;
  remove: (id: number | string) => void;
  get: (id: number | string) => Data | undefined;
  getAll: () => Data[];
  active: Data | undefined;
  setActive: (id: number | string) => void;
};

const localStateDriverController = {
  defaults: {
    shiftStart: "09:00",
    shiftEnd: "17:00",
    maxTravelTime: 100, //minutes
    maxTasks: 100,
    maxDistance: 100, //miles
    breaks: [
      {
        duration: 30, //minutes,
      },
    ],
  },
};
