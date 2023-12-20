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

import axios from "axios";
import { useDriverRoute } from "~/hooks/routing/use-driver-routes";
import { api } from "~/utils/api";
import { sendMessage } from "~/utils/routing/realtime-utils";
import type { ExpandedRouteData, RouteData } from "../types";

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  routeData?: RouteData;
}

// Details as part of the individual driver route view. On click, the driver can edit
// basic information about the stop, such as the status and delivery notes.
const StopDetails: FC<IProps> = ({ open, setOpen, routeData }) => {
  const driverRoute = useDriverRoute((state) => state);
  const apiContext = api.useContext();
  // const pain = api.useUtils();

  const { address } = JSON.parse(driverRoute.selectedStop!.description ?? "{}");

  const { mutate } = api.finalizedRoutes.updateFinalizedRoute.useMutation({
    onSettled: () => {
      void apiContext.finalizedRoutes.getAllFormattedFinalizedRoutes.invalidate();
      void apiContext.finalizedRoutes.getFinalizedRoute.invalidate();

      void axios.post("/api/realtime/test-message");
      // void apiContext.invalidate();
    },
    onSuccess: () => {
      // toast.success("Successfully updated stop!");
    },
  });
  const { route } = useParams();

  const contactDispatch = (data: EditStopFormValues) => {
    const updatedSteps = routeData?.steps.map((step) => {
      if (step.id === driverRoute?.selectedStop?.id) {
        return {
          ...step,
          status: data.status,
          deliveryNotes: data.deliveryNotes,
        };
      }

      return step;
    });

    const updatedRoute = {
      ...routeData,
      steps: updatedSteps,
      routeId: route as string,
    };

    mutate({
      routeId: route as string,
      route: updatedRoute as ExpandedRouteData,
    });

    sendMessage(data, driverRoute, route as string, routeData).finally(() => {
      handleOnOpenChange(false);
    });
  };

  const handleOnOpenChange = (toggle: boolean) => {
    driverRoute.setSelectedStop(null);
    setOpen(toggle);
  };

  return (
    <Sheet open={open} onOpenChange={handleOnOpenChange}>
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
