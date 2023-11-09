import { Dialog, Transition } from "@headlessui/react";

import { X } from "lucide-react";
import { Fragment, useEffect, type FC } from "react";

import { Separator } from "~/components/ui/separator";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/map-sheet";
import { useDriverSheet } from "~/hooks/routing/use-driver-sheet";
import { useDrivers } from "~/hooks/routing/use-drivers";
import { useSheet } from "~/hooks/routing/use-sheet";
import type { Driver, TimeWindow } from "../types";
import { DriverForm } from "./driver_form";
interface IProps {
  driver?: Driver | null;
}
const DriverSheet: FC<IProps> = ({ driver }) => {
  const { isOpen, onClose, setIsOpen } = useDriverSheet();
  const { activeDriver, setActiveDriver } = useDrivers((state) => state);

  const handleOnClose = () => {
    onClose();
  };

  useEffect(() => {
    if (!isOpen) setActiveDriver(null);
  }, [isOpen]);
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side={"left"}
        className="flex w-full max-w-full flex-col  sm:w-full sm:max-w-full md:max-w-md lg:max-w-lg"
      >
        <SheetHeader>
          <SheetTitle className="text-center md:text-left">
            {" "}
            {activeDriver ? "Edit Driver" : "Add Driver"}
          </SheetTitle>
          <SheetDescription className="text-center md:text-left">
            Fill out the table below to start adding destinations to the map.
          </SheetDescription>
        </SheetHeader>

        <DriverForm callback={handleOnClose} />
      </SheetContent>
    </Sheet>
  );
};
export default DriverSheet;
