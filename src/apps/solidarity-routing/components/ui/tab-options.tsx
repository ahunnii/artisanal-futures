import { Listbox, Transition } from "@headlessui/react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { Fragment, useState, type FC, type HTMLAttributes } from "react";

import { Button } from "~/components/ui/button";

// import useTabOptions from "~/apps/solidarity-routing/hooks/use-tab-options";

import { cn } from "~/utils/styles";

import UploadBtn from "./upload-btn";

type TTabOptions = HTMLAttributes<HTMLDivElement> & { type: "stop" | "driver" };

import { CheckIcon, ChevronDownIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/utils/api";
import { useDriverVehicleBundles } from "../../hooks/drivers/use-driver-vehicle-bundles";
import { parseSpreadSheet } from "../../libs/parse-csv.wip";
import { DriverVehicleBundle, VersionOneDriverCSV } from "../../types.wip";
import { DriverDBSelect } from "../drivers/driver-db-select.wip";
import { FileUploadHandler } from "../homepage-onboarding.wip";

const TabOptions: FC<TTabOptions> = ({ type, className }) => {
  const { status } = useSession();
  const [open, setOpen] = useState(false);

  const [driverBundles, setDriverBundles] = useState<DriverVehicleBundle[]>([]);

  const { data: depotDrivers } =
    api.drivers.getCurrentDepotDriverVehicleBundles.useQuery(
      { depotId: 1 },
      { enabled: status === "authenticated" }
    );
  //   <Button variant="outline" className="basis-1/4 capitalize">
  //   Add {type} from Database
  // </Button>
  // const {
  //   populateFromDatabase,
  //   populateCustomerCSV,
  //   handleCSVUpload,
  //   addNewItem,
  //   isUserArtisan,
  //   DatabaseSelect,
  //   handleAddFromDatabase,
  // } = useTabOptions(type);

  //   const handleDriverFileUpload:FileUploadHandler = (event) => {
  //     parseSpreadSheet<VersionOneDriverCSV, DriverVehicleBundle>(
  // {

  //     }

  //   })

  return (
    <></>
    // <>
    //   <div
    //     className={cn(
    //       "mx-auto my-2 flex w-full flex-row items-center justify-center gap-4 bg-white p-3 shadow ",
    //       className
    //     )}
    //   >
    //     <Button onClick={addNewItem} className="basis-1/4capitalize">
    //       Add {type}
    //     </Button>

    //     {status === "authenticated" && depotDrivers && (
    //       <DatabaseSelect handleAddToRoute={handleAddFromDatabase}>
    //         <Button variant={"secondary"} className="basis-1/4">
    //           Add {type} from Database
    //         </Button>
    //       </DatabaseSelect>
    //     )}

    //     {/* <Button
    //       variant={"secondary"}
    //       className="basis-1/4"
    //       onClick={isUserArtisan ? populateCustomerCSV : populateFromDatabase}
    //       disabled={status === "loading"}
    //     >
    //       {status === "loading" && (
    //         <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
    //       )}
    //       {isUserArtisan ? "Import " : "Autofill"}
    //     </Button> */}

    //     <UploadBtn handleOnChange={handleCSVUpload} className="basis-1/4" />
    //   </div>
    // </>
  );
};

export default TabOptions;
