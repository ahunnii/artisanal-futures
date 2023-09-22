import {
  FileUpload,
  PrimaryBtn,
  SecondaryBtn,
  UploadBtn,
} from "~/components/tools/routing/atoms/";
import { AddDriver, EditDriver } from "~/components/tools/routing/molecules";
import driverData from "~/data/drivers.json";
import type { Driver } from "~/types";

import { uniqueId } from "lodash";

import { useState } from "react";
import { useRouteStore } from "~/store";

import { parseDriverCSVFile } from "~/utils/routing";

import DriverListingCard from "~/components/tools/routing/molecules/cards/DriverListingCard";
import ViewDriver from "../molecules/slides/ViewDriver";

/**
 * Tab container component that allows users to add, edit, and delete drivers.
 */
const DriversTab = () => {
  const [createDriver, setCreateDriver] = useState(false);
  const drivers = useRouteStore((state) => state.drivers);
  const setDrivers = useRouteStore((state) => state.setDrivers);
  const [editDriver, setEditDriver] = useState(false);
  const [viewDriver, setViewDriver] = useState(false);
  const [current, setCurrent] = useState<Driver | null>(null);

  const populateFromDatabase = () => {
    const data = driverData.map((driver) => {
      return {
        ...driver,
        id: parseInt(uniqueId()),
        break_slots: driver.break_slots.map((slot) => {
          return {
            ...slot,
            id: parseInt(uniqueId()),
          };
        }),
      };
    });

    setDrivers(data);
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    parseDriverCSVFile(event.target.files![0]!, setDrivers);
  };
  return (
    <>
      <div className="mx-auto my-2 flex w-full items-center justify-center gap-4 bg-white p-3 shadow">
        <PrimaryBtn clickHandler={() => setCreateDriver(true)}>
          Add Driver
        </PrimaryBtn>
        <SecondaryBtn clickHandler={populateFromDatabase}>
          Autofill
        </SecondaryBtn>
        <UploadBtn handleOnChange={handleCSVUpload} />
      </div>
      <AddDriver open={createDriver} setOpen={setCreateDriver} />

      {drivers.length == 0 && <FileUpload dataType="driver" />}

      {current?.address && (
        <EditDriver open={editDriver} setOpen={setEditDriver} stop={current} />
      )}

      {current?.address && (
        <ViewDriver open={viewDriver} setOpen={setViewDriver} stop={current} />
      )}

      {drivers.length !== 0 && (
        <div className="my-5 flex h-full overflow-y-auto text-center">
          <section className="w-full ">
            {drivers.length > 0 &&
              drivers[0]?.address != "" &&
              drivers.map((driver, idx) => (
                <DriverListingCard
                  key={idx}
                  driver={driver}
                  onEdit={() => {
                    const temp = drivers.filter(
                      (loc) => loc.id == driver.id
                    )[0];
                    if (temp) setCurrent(temp);
                    setEditDriver(true);
                  }}
                  onView={() => {
                    const temp = drivers.filter(
                      (loc) => loc.id == driver.id
                    )[0];
                    if (temp) setCurrent(temp);
                    setViewDriver(true);
                  }}
                />
              ))}
          </section>
        </div>
      )}
    </>
  );
};

export default DriversTab;
