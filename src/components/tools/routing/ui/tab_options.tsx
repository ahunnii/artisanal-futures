import { ReloadIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useState, type FC, type HTMLAttributes } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import locationData from "~/data/addresses.json";

import {
  ChevronDown,
  ChevronDownIcon,
  DownloadCloud,
  File,
  FilePlus,
  Plus,
  PlusIcon,
  StarIcon,
} from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import driverData from "~/data/drivers.json";
import { useDriverSheet } from "~/hooks/routing/use-driver-sheet";
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
  const { onOpen: onDriverOpen, setIsViewOnly: setDriverIsViewOnly } =
    useDriverSheet();
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

    if (type === "driver") {
      setDriverIsViewOnly(false);
      onDriverOpen();
    } else {
      setIsViewOnly(false);
      onOpen();
    }
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
  const { onOpen: onDriverOpen, setIsViewOnly: setDriverIsViewOnly } =
    useDriverSheet();
  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(false);
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
    setIsOpen(false);
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
    setIsOpen(false);
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
    setIsOpen(false);
    typeData[type].setActive(null);

    if (type === "driver") {
      setDriverIsViewOnly(false);
      onDriverOpen();
    } else {
      setIsViewOnly(false);
      onOpen();
    }
  };
  const isUserArtisan =
    session?.user &&
    (session?.user.role === "ARTISAN" || session?.user.role === "ADMIN");
  return (
    <div className="z-30 flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
      <Button
        variant="secondary"
        className="px-3 shadow-none"
        onClick={addStop}
      >
        {status !== "loading" && <Plus className="mr-2 h-4 w-4 " />}
        {status === "loading" && (
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        )}
        Add {type}
      </Button>
      <Separator orientation="vertical" className="h-[20px]" />
      <DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
        <DropdownMenuTrigger asChild>
          <ChevronDownIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem
              disabled={status === "loading"}
              className={"flex w-full cursor-pointer "}
              onClick={
                isUserArtisan ? populateCustomerCSV : populateFromDatabase
              }
            >
              <DownloadCloud className="mr-2 h-4 w-4 " />
              {isUserArtisan ? "Import from DB" : "Autofill Example"}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <label className={"flex w-full cursor-pointer "}>
                {" "}
                <FilePlus className="mr-2 h-4 w-4 " />
                Upload CSV file
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleCSVUpload}
                />
              </label>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default TabOptions;
