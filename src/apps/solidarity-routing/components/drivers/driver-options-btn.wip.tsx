import { ReloadIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";

import { Button } from "~/components/ui/button";

import {
  ChevronDownIcon,
  DownloadCloud,
  FilePlus,
  Pencil,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";

import { driverVehicleUploadOptions } from "../../data/drivers/driver-data";
import { useDriverVehicleBundles } from "../../hooks/drivers/use-driver-vehicle-bundles";
import { DriverVehicleBundle } from "../../types.wip";
import { FileUploadModal } from "../file-upload-modal.wip";
import { DriverAddSheet } from "./driver-add-sheet";
import { DriverDBSelect } from "./driver-db-select.wip";

export const DriverOptionsBtn = () => {
  const { drivers } = useDriverVehicleBundles();

  return (
    <div className="z-30 flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
      <DriverAddSheet />
    </div>
  );
};
