import { type FC } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/map-sheet";

import {
  CurrentStopForm,
  type EditStopFormValues,
} from "~/components/tools/routing/tracking/current-stop-form";

import { useParams } from "next/navigation";
import { useDriverRoute } from "~/hooks/routing/use-driver-routes";
import { sendMessage } from "~/utils/routing/realtime-utils";
import type { RouteData } from "../types";

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  routeData?: RouteData;
}

// Details as part of the individual driver route view. On click, the driver can edit
// basic information about the stop, such as the status and delivery notes.
const StopDetails: FC<IProps> = ({ open, setOpen, routeData }) => {
  const driverRoute = useDriverRoute((state) => state);

  const { address } = JSON.parse(driverRoute.selectedStop!.description ?? "{}");
  const { route } = useParams();
  const contactDispatch = (data: EditStopFormValues) => {
    sendMessage(data, driverRoute, route as string, routeData).finally(() => {
      setOpen(false);
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side={"bottom"}>
        <SheetHeader>
          <SheetTitle>{address}</SheetTitle>
        </SheetHeader>
        <div className=" relative flex-1 overflow-y-scroll  py-2">
          <CurrentStopForm callback={contactDispatch} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default StopDetails;
