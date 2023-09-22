import locationData from "~/data/addresses.json";

import { useRouteStore } from "~/store";

import {
  FileUpload,
  PrimaryBtn,
  SecondaryBtn,
  UploadBtn,
} from "~/components/tools/routing/atoms/";
import { AddStop, EditStop } from "~/components/tools/routing/molecules";

import type { Location } from "~/types";
import { parseStopCSVFile } from "~/utils/routing";

import { uniqueId } from "lodash";

import { useState } from "react";
import StopListingCard from "~/components/tools/routing/molecules/cards/StopListingCard";
import ViewStop from "../molecules/slides/ViewStop";

/**
 * Tab container component that allows users to add, edit, and delete stops.
 */
const StopsTab = () => {
  const locations = useRouteStore((state) => state.locations);
  const [editStop, setEditStop] = useState(false);
  const [viewStop, setViewStop] = useState(false);
  const [current, setCurrent] = useState<Location | null>(null);
  const [createNewStop, setCreateNewStop] = useState(false);

  const setLocations = useRouteStore((state) => state.setLocations);

  const populateFromDatabase = () => {
    const data = locationData.map((location) => {
      return {
        ...location,
        id: parseInt(uniqueId()),
      };
    });

    setLocations(data);
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    parseStopCSVFile(event.target.files![0]!, setLocations);
  };

  return (
    <>
      <div className="mx-auto my-2 flex w-full items-center justify-center gap-4 bg-white p-3 shadow">
        <PrimaryBtn clickHandler={() => setCreateNewStop(true)}>
          Add Stop
        </PrimaryBtn>
        <SecondaryBtn clickHandler={populateFromDatabase}>
          Autofill
        </SecondaryBtn>
        <UploadBtn handleOnChange={handleCSVUpload} />
      </div>
      <AddStop open={createNewStop} setOpen={setCreateNewStop} />

      {locations.length == 0 && (
        <FileUpload dataType="stop" autofillDemo={populateFromDatabase} />
      )}
      <div className="flex flex-grow ">
        {current?.address && (
          <EditStop open={editStop} setOpen={setEditStop} stop={current} />
        )}
        {current?.address && (
          <ViewStop open={viewStop} setOpen={setViewStop} stop={current} />
        )}

        {locations.length > 0 && (
          <div className="my-5 flex h-full overflow-y-auto text-center">
            <section className="w-full ">
              {locations[0]?.address != "" &&
                locations.map((listing, idx) => {
                  const { id } = listing;
                  return (
                    <StopListingCard
                      key={idx}
                      stop={listing}
                      onEdit={() => {
                        const temp = locations.find((loc) => loc.id === id);
                        if (temp) setCurrent(temp);
                        setEditStop(true);
                      }}
                      onView={() => {
                        const temp = locations.find((loc) => loc.id === id);
                        if (temp) setCurrent(temp);
                        setViewStop(true);
                      }}
                    />
                  );
                })}
            </section>
          </div>
        )}
      </div>
    </>
  );
};

export default StopsTab;
