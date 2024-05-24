import { useState } from "react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { ScrollArea } from "~/components/ui/scroll-area";

import { DriversTab } from "~/apps/solidarity-routing/components/drivers-section";
import { StopsTab } from "~/apps/solidarity-routing/components/stops-section";

import { ArrowRight, Pencil } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useUrlParams } from "~/hooks/use-url-params";
import { useRoutePlans } from "../../hooks/plans/use-route-plans";

export const PlanMobileDrawer = () => {
  const { updateUrlParams } = useUrlParams();
  const { getRoutePlanData, calculate } = useRoutePlans();

  const optimized = getRoutePlanData.data?.optimizedRoute ?? [];

  const isRouteDataMissing =
    getRoutePlanData.data?.jobs.length === 0 ||
    getRoutePlanData.data?.vehicles.length === 0;

  const [editDrawerOpen, setEditDrawerOpen] = useState<boolean>(false);

  const onEditDrawerClose = (state: boolean) => {
    if (!state) {
      updateUrlParams({
        key: "mode",
        value: isRouteDataMissing || optimized ? "plan" : "calculate",
      });
    } else {
      updateUrlParams({ key: "mode", value: "plan" });
    }
    setEditDrawerOpen(state);
  };

  const calculateOptimalPaths = () => {
    void calculate();
    onEditDrawerClose(false);
  };

  return (
    <Drawer open={editDrawerOpen} onOpenChange={onEditDrawerClose}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => void getRoutePlanData.refetch()}
        >
          <Pencil /> Edit Routes
        </Button>
      </DrawerTrigger>
      <DrawerContent className=" max-h-screen ">
        <DrawerHeader />
        <ScrollArea className="mx-auto flex w-full  max-w-sm flex-col">
          <DriversTab />
          <StopsTab />
          <div className=" flex h-16 items-center justify-end bg-white p-4"></div>
        </ScrollArea>
        <DrawerFooter>
          <>
            <DrawerClose className="flex-1 gap-2" asChild>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </DrawerClose>

            {optimized.length === 0 && (
              <Button
                onClick={calculateOptimalPaths}
                className="gap-2"
                disabled={isRouteDataMissing}
              >
                Calculate Routes <ArrowRight />
              </Button>
            )}
            {optimized.length !== 0 && (
              <Button
                onClick={calculateOptimalPaths}
                className="flex-1 gap-2"
                disabled={isRouteDataMissing}
              >
                Recalculate Routes <ArrowRight />
              </Button>
            )}
          </>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
