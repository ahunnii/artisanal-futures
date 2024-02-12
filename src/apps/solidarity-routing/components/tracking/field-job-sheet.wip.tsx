import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/map-sheet";

import CurrentStopForm from "~/apps/solidarity-routing/components/tracking/current-stop-form";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { useClientJobBundles } from "../../hooks/jobs/use-client-job-bundles";
import { useOptimizedRoutePlan } from "../../hooks/optimized-data/use-optimized-route-plan";
import type { OptimizedStop } from "../../types.wip";

import * as React from "react";

import { RouteStatus } from "@prisma/client";
import { MapPin } from "lucide-react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useMediaQuery } from "~/hooks/use-media-query";
import { api } from "~/utils/api";
import { cn } from "~/utils/styles";

export default function FieldJobSheet() {
  const params = useSearchParams();
  const jobBundles = useClientJobBundles();
  const optimizedRoutePlan = useOptimizedRoutePlan();
  const apiContext = api.useContext();

  const currentStop = optimizedRoutePlan?.data?.stops.find(
    (stop) => stop?.jobId === jobBundles.active?.job.id
  );

  const currentJob = jobBundles.active?.job;

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const stopsByAddress = api.routePlan.getOptimizedStopsByAddress.useQuery(
    {
      optimizedRouteId: optimizedRoutePlan.data?.id ?? "",
      address: currentJob?.address.formatted ?? "",
    }
    // {
    //   enabled:
    //     !currentJob?.address.formatted === undefined &&
    //     optimizedRoutePlan.data?.id !== undefined,
    // }
  );

  // console.log(stopsByAddress.data);

  // const completedStopsAtAddress = stopsByAddress.data?.filter(
  //   (stop) =>
  //     stop.status === RouteStatus.COMPLETED ||
  //     stop.status === RouteStatus.FAILED
  // );

  // const pendingStopsAtAddress = stopsByAddress.data?.filter(
  //   (stop) =>
  //     stop.status !== RouteStatus.COMPLETED &&
  //     stop.status !== RouteStatus.FAILED
  // );

  const activeStop = stopsByAddress.data?.find(
    (stop) => stop.jobId === currentJob?.id
  );

  console.log(activeStop);
  if (isDesktop) {
    return (
      <Dialog
        open={jobBundles.isFieldJobSheetOpen}
        onOpenChange={jobBundles.onFieldJobSheetOpen}
      >
        {/* <DialogTrigger asChild>
          <Button variant="outline">Edit Profile</Button>
        </DialogTrigger> */}
        <DialogContent className="sm:max-w-[620px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-4">
              {" "}
              {currentJob?.address.formatted}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              1/3 stops at this location <Badge>{currentJob?.type}</Badge>{" "}
              <Badge>{currentStop?.status}</Badge>
            </DialogDescription>
          </DialogHeader>{" "}
          <div className=" relative flex-1 overflow-y-scroll  py-2">
            {/* <CurrentStopForm initialData={activeStop ?? null} /> */}
            <Button>Prev</Button> <Button>Next</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={jobBundles.isFieldJobSheetOpen}
      onOpenChange={jobBundles.onFieldJobSheetOpen}
    >
      {/* <DrawerTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DrawerTrigger> */}
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="text-left">
            <DrawerTitle> {currentJob?.address.formatted}</DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <DrawerDescription className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            0/0 stops at this location <Badge>{currentJob?.type}</Badge>{" "}
            <Badge>{currentStop?.status}</Badge>
          </DrawerDescription>
          <div className=" relative flex-1 overflow-y-scroll  py-4">
            {activeStop && (
              <CurrentStopForm
                initialData={activeStop}
                // job={(currentStop as OptimizedStop) ?? null}
              />
            )}
          </div>

          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
