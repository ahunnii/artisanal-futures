import { useSession } from "next-auth/react";

import toast from "react-hot-toast";

import locationData from "~/data/addresses.json";

import driverData from "~/data/drivers.json";
import { useDriverSheet } from "~/hooks/routing/use-driver-sheet";
import { useDrivers } from "~/hooks/routing/use-drivers";

import { useSheet } from "~/hooks/routing/use-sheet";
import { useStops } from "~/hooks/routing/use-stops";
import { handleIncomingData } from "~/utils/routing/file-handling";

import type { Driver, Stop } from "~/components/tools/routing/types";

const useTabOptions = (type: "stop" | "driver") => {
  const { setLocations, setActiveLocation } = useStops((state) => state);
  const { setDrivers, setActiveDriver } = useDrivers((state) => state);
  const { data: session } = useSession();
  const { onOpen } = useSheet();
  const { onOpen: onDriverOpen } = useDriverSheet();

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

    if (type === "driver") onDriverOpen();
    else onOpen();
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
