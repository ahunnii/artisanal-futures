import { useSession } from "next-auth/react";

import toast from "react-hot-toast";

import locationData from "~/data/addresses.json";

import driverData from "~/data/drivers.json";

import { useDrivers } from "~/apps/solidarity-routing/hooks/use-drivers";

import { useStops } from "~/apps/solidarity-routing/hooks/use-stops";

import { handleIncomingData } from "~/apps/solidarity-routing/libs/file-handling";

import type { Driver, Stop } from "~/components/tools/routing/types";

const useTabOptions = (type: "stop" | "driver") => {
  const { setLocations, setActiveLocation, setIsStopSheetOpen } = useStops(
    (state) => state
  );
  const { setDrivers, setActiveDriver, setIsDriverSheetOpen } = useDrivers(
    (state) => state
  );
  const { data: session } = useSession();

  const typeData = {
    stop: {
      setType: setLocations,
      setActive: setActiveLocation,
      db: "/api/db-fetch?dataType=customers",
      autofill: locationData,
    },
    driver: {
      setType: setDrivers,
      setActive: setActiveDriver,
      db: "/api/db-fetch?dataType=drivers",
      autofill: driverData,
    },
  };

  // Based on type, auto populate some data for demo purposes
  const populateFromDatabase = <T extends Driver | Stop>() => {
    handleIncomingData(
      typeData[type].autofill,
      type,
      typeData[type].setType as (data: T[]) => void
    ).catch((err) => {
      toast.error("Something went wrong with test data import.");
      console.error(err);
    });
  };

  // Based on type, pulls data from Supabase data upload (to be replaced with dedicated api)
  const populateCustomerCSV = <T extends Driver | Stop>() => {
    handleIncomingData(
      typeData[type].db,
      type,
      typeData[type].setType as (data: T[]) => void
    )
      .then(() => toast.success(`Successfully imported ${type}s from database`))
      .catch((err) => {
        toast.error(`Something went wrong with importing your ${type}s`);
        console.error(err);
      });
  };

  // Based on type, parses incoming CSV file and updates state
  const handleCSVUpload = <T extends Driver | Stop>(
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleIncomingData(
      event.target.files![0]!,
      type,
      typeData[type].setType as (data: T[]) => void
    )
      .then(() => toast.success(`Successfully uploaded ${type}s`))
      .catch((err) => {
        toast.error("Something went wrong uploading your file.");
        console.error(err);
      });
  };

  const addNewItem = () => {
    typeData[type].setActive(null);

    if (type === "driver") setIsDriverSheetOpen(true);
    else setIsStopSheetOpen(true);
  };

  const isUserArtisan =
    session?.user &&
    (session?.user.role === "ARTISAN" || session?.user.role === "ADMIN");

  return {
    populateFromDatabase,
    populateCustomerCSV,
    handleCSVUpload,
    addNewItem,
    isUserArtisan,
  };
};

export default useTabOptions;
