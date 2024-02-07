import { faker } from "@faker-js/faker";
import { DriverType } from "@prisma/client";
import type { DriverVehicleBundle } from "~/apps/solidarity-routing/types.wip";
import {
  milesToMeters,
  minutesToSeconds,
} from "~/apps/solidarity-routing/utils/generic/format-utils.wip";

function getRandomStartTimeAndEndTime() {
  // Generate random start time between 0 and 79200 seconds (22 hours)
  const startTime = Math.floor(Math.random() * 79200);

  // Generate random duration between 10800 seconds (3 hours) and 57600 seconds (16 hours)
  const duration = Math.floor(Math.random() * (57600 - 10800)) + 10800;

  // Calculate end time based on start time and duration
  const endTime = startTime + duration;

  return { startTime, endTime };
}

export const createRandomDriverVehicleBundle = (): DriverVehicleBundle => {
  const shift = getRandomStartTimeAndEndTime();

  const coordinateA = faker.location.nearbyGPSCoordinate({
    origin: [42.4600972790319, -83.13527623367753],
    radius: 100,
  });
  const coordinateB = faker.location.nearbyGPSCoordinate({
    origin: [42.4600972790319, -83.13527623367753],
    radius: 100,
  });
  const coordinateC = faker.location.nearbyGPSCoordinate({
    origin: [42.4600972790319, -83.13527623367753],
    radius: 100,
  });

  const homeAddress = {
    formatted: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.stateAbbr()} ${faker.location.zipCode()}`,
    latitude: coordinateA[0],
    longitude: coordinateA[1],
  };

  const startAddress = {
    formatted: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.stateAbbr()} ${faker.location.zipCode()}`,
    latitude: coordinateB[0],
    longitude: coordinateB[1],
  };

  const endAddress = {
    formatted: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.stateAbbr()} ${faker.location.zipCode()}`,
    latitude: coordinateC[0],
    longitude: coordinateC[1],
  };

  const addresses = [homeAddress, startAddress, endAddress];

  return {
    driver: {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      address: homeAddress,
      addressId: faker.string.uuid(),
      type: faker.helpers.enumValue(DriverType),
    },
    vehicle: {
      id: faker.string.uuid(),
      shiftStart: shift.startTime,
      shiftEnd: shift.endTime,
      startAddress: faker.helpers.arrayElement(addresses),
      capacity: 100,
      maxDistance: milesToMeters(faker.number.float({ min: 30, max: 100 })),
      maxTasks: faker.number.int({ min: 1, max: 15 }),
      maxTravelTime: minutesToSeconds(
        faker.number.float({ min: 30, max: 120 })
      ),
      startAddressId: faker.string.uuid(),
      breaks: [
        {
          id: faker.number.int(),
          duration: minutesToSeconds(faker.number.int({ min: 15, max: 30 })),
        },
        {
          id: faker.number.int(),
          duration: minutesToSeconds(faker.number.int({ min: 15, max: 30 })),
        },
        {
          id: faker.number.int(),
          duration: minutesToSeconds(faker.number.int({ min: 15, max: 30 })),
        },
      ],
    },
  };
};
