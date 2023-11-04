import { ReloadIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import type { FC, HTMLAttributes } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import locationData from "~/data/addresses.json";

import { ChevronDownIcon, PlusIcon, StarIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
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
      <Button onClick={addStop} className="basis-1/3 capitalize">
        Add {type}
      </Button>

      <Button
        variant={"secondary"}
        className="basis-1/3 "
        onClick={isUserArtisan ? populateCustomerCSV : populateFromDatabase}
        disabled={status === "loading"}
      >
        {status === "loading" && (
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        )}
        {isUserArtisan ? "Import " : "Autofill"}
      </Button>

      <UploadBtn handleOnChange={handleCSVUpload} className="basis-1/3 " />

      {children}
    </div>
  );
};

export const ImportOptionsBtn: FC<IProps> = ({ type, className, children }) => {
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
    <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
      <Button
        variant="secondary"
        disabled={status === "loading"}
        className="px-3 shadow-none"
        onClick={isUserArtisan ? populateCustomerCSV : populateFromDatabase}
      >
        <StarIcon className="mr-2 h-4 w-4" />
        {status === "loading" && (
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        )}
        {isUserArtisan ? "Import " : "Autofill"}
      </Button>
      <Separator orientation="vertical" className="h-[20px]" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="px-2 shadow-none">
            <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          alignOffset={-5}
          className="w-[200px]"
          forceMount
        >
          <DropdownMenuLabel>Suggested Lists</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <label
              className={cn(
                "flex w-full cursor-pointer text-center",
                className
              )}
            >
              <span className="inline-flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                Upload...
              </span>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleCSVUpload}
              />
            </label>
          </DropdownMenuItem>

          <DropdownMenuCheckboxItem>
            {" "}
            <Button
              variant={"secondary"}
              className="basis-1/3 "
              onClick={
                isUserArtisan ? populateCustomerCSV : populateFromDatabase
              }
              disabled={status === "loading"}
            >
              {status === "loading" && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isUserArtisan ? "Import " : "Autofill"}
            </Button>
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <PlusIcon className="mr-2 h-4 w-4" />{" "}
            <Button onClick={addStop} className="basis-1/3 capitalize">
              Add {type}
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>{" "}
    </div>

    // <div
    //   className={cn(
    //     "mx-auto my-2 flex w-full items-center justify-center gap-4 bg-white p-3 shadow ",
    //     className
    //   )}
    // >
    //   <Button onClick={addStop} className="basis-1/3 capitalize">
    //     Add {type}
    //   </Button>

    //   <Button
    //     variant={"secondary"}
    //     className="basis-1/3 "
    //     onClick={isUserArtisan ? populateCustomerCSV : populateFromDatabase}
    //     disabled={status === "loading"}
    //   >
    //     {status === "loading" && (
    //       <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
    //     )}
    //     {isUserArtisan ? "Import " : "Autofill"}
    //   </Button>

    //   <UploadBtn handleOnChange={handleCSVUpload} className="basis-1/3 " />

    //   {children}
    // </div>
  );
};
export default TabOptions;
