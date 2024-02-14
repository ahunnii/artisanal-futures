import CurrentStopForm from "~/apps/solidarity-routing/components/tracking/current-stop-form";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { useClientJobBundles } from "../../hooks/jobs/use-client-job-bundles";
import { useOptimizedRoutePlan } from "../../hooks/optimized-data/use-optimized-route-plan";

import * as React from "react";

import { MapPin } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";

import { useMediaQuery } from "~/hooks/use-media-query";
import { api } from "~/utils/api";

export default function FieldJobSheet() {
  const jobBundles = useClientJobBundles();
  const optimizedRoutePlan = useOptimizedRoutePlan();

  const currentStop = optimizedRoutePlan?.data?.stops.find(
    (stop) => stop?.jobId === jobBundles.active?.job.id
  );

  const currentJob = jobBundles.active?.job;

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const stopsByAddress = api.routePlan.getOptimizedStopsByAddress.useQuery({
    optimizedRouteId: optimizedRoutePlan.data?.id ?? "",
    address: currentJob?.address.formatted ?? "",
  });

  const activeStop = stopsByAddress.data?.find(
    (stop) => stop.jobId === currentJob?.id
  );

  if (isDesktop) {
    return (
      <Dialog
        open={jobBundles.isFieldJobSheetOpen}
        onOpenChange={jobBundles.onFieldJobSheetOpen}
      >
        <DialogContent className="lg sm:max-w-[620px]">
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
            {activeStop && <CurrentStopForm initialData={activeStop} />}
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
