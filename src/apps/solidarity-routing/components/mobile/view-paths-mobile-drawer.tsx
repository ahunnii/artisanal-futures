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

import axios from "axios";
import { ArrowRight, Eye, Send } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useUrlParams } from "~/hooks/use-url-params";
import { notificationService } from "~/services/notification";
import { useRoutePlans } from "../../hooks/plans/use-route-plans";
import CalculationsTab from "../route-plan-section/calculations-tab";

export const ViewPathsMobileDrawer = () => {
  const { updateUrlParams } = useUrlParams();
  const { getRoutePlanData, calculate, emailBundles } = useRoutePlans();

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

  const massSendRouteEmails = () => {
    axios
      .post("/api/routing/send-route", { emailBundles })
      .then((res) => {
        if (res.status === 200) {
          notificationService.notifySuccess({
            message: "Route sent to drivers successfully",
          });
          return;
        }

        notificationService.notifyError({
          message: "Error sending route to drivers",
          error: res.data,
        });
      })
      .catch((error: unknown) => {
        notificationService.notifyError({
          message: "Error sending route to drivers",
          error,
        });
      });
  };

  return (
    <Drawer open={editDrawerOpen} onOpenChange={onEditDrawerClose}>
      <DrawerTrigger asChild>
        <Button
          variant="default"
          disabled={optimized.length === 0}
          className="w-full gap-2"
          onClick={() => void getRoutePlanData.refetch()}
        >
          <Eye /> View Routes
        </Button>
      </DrawerTrigger>
      <DrawerContent className=" max-h-screen ">
        <DrawerHeader />
        <ScrollArea className="mx-auto flex w-full  max-w-sm flex-col">
          <CalculationsTab />
        </ScrollArea>

        <DrawerFooter>
          <Button className="w-full flex-1 gap-2" onClick={massSendRouteEmails}>
            <Send /> Send to Driver(s)
          </Button>

          {optimized.length === 0 && (
            <Button
              onClick={calculateOptimalPaths}
              className="w-full gap-2"
              disabled={isRouteDataMissing}
            >
              Calculate Routes <ArrowRight />
            </Button>
          )}
          <DrawerClose>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
