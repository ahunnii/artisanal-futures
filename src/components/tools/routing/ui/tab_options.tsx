import { ReloadIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import type { FC, HTMLAttributes } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import locationData from "~/data/addresses.json";

import driverData from "~/data/drivers.json";
import { useDrivers } from "~/hooks/routing/use-drivers";
import { useModifyModal } from "~/hooks/routing/use-modify-modal";
import { useSheet } from "~/hooks/routing/use-sheet";
import { useStops } from "~/hooks/routing/use-stops";
import { handleIncomingData } from "~/utils/routing/file-handling";
import { cn } from "~/utils/styles";
import type { Driver, Stop } from "../types";
import UploadBtn from "./upload-btn";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  type: "stop" | "driver";
}

const TabOptions: FC<IProps> = ({ type, className, children }) => {
  const { onOpen: onModifyOpen } = useModifyModal();
  const { setLocations, setActiveLocation } = useStops((state) => state);
  const { setDrivers, setActiveDriver } = useDrivers((state) => state);
  const { data: session, status } = useSession();
  const { onOpen, setIsViewOnly } = useSheet();

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

  const populateCustomerCSV = <T extends Driver | Stop>() => {
    handleIncomingData(
      typeData[type].db,
      type,
      typeData[type].setType as (data: T[]) => void
    )
      .then(() => {
        toast.success(`Successfully imported ${type}s from database`);
      })
      .catch((err) => {
        toast.error(`Something went wrong with importing your ${type}s`);
        console.error(err);
      });
  };

  const handleCSVUpload = <T extends Driver | Stop>(
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleIncomingData(
      event.target.files![0]!,
      type,
      typeData[type].setType as (data: T[]) => void
    )
      .then(() => {
        toast.success(`Successfully uploaded ${type}s`);
      })
      .catch((err) => {
        toast.error("Something went wrong uploading your file.");
        console.error(err);
      });
  };

  const addStop = () => {
    typeData[type].setActive(null);
    setIsViewOnly(false);
    onOpen();
  };

  const isUserArtisan =
    session?.user &&
    (session?.user.role === "ARTISAN" || session?.user.role === "ADMIN");
  return (
    <div
      className={cn(
        "mx-auto my-2 flex w-full items-center justify-center gap-4 bg-white p-3 shadow ",
        className
      )}
    >
      <Button onClick={addStop} className="basis-1/4 capitalize">
        Add {type}
      </Button>

      <Button
        variant={"secondary"}
        className="basis-1/4 "
        // onClick={isUserArtisan ? populateCustomerCSV : populateFromDatabase}
        onClick={populateFromDatabase}
        disabled={status === "loading"}
      >
        {status === "loading" && (
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        )}
        {"Autofill"}
        {/* {isUserArtisan ? "Import " : "Autofill"} */}
      </Button>

      <UploadBtn handleOnChange={handleCSVUpload} className="basis-1/4 " />

      {/* <Button
        className="basis-1/4"
        variant={"secondary"}
        onClick={onModifyOpen}
      >
        Modify...
      </Button> */}

      {children}
    </div>
  );
};

export default TabOptions;
