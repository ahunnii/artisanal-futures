import { Bell, Car } from "lucide-react";

import { useMemo } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { api } from "~/utils/api";
import { useDriverVehicleBundles } from "../../hooks/drivers/use-driver-vehicle-bundles";
import { useSolidarityState } from "../../hooks/optimized-data/use-solidarity-state";

export const PathwaysNotifications = () => {
  const { routeId } = useSolidarityState();
  const apiContext = api.useContext();
  const { data: notifications } = api.routeMessaging.getMessageProfile.useQuery(
    { routeId: routeId as string },
    {
      enabled: routeId !== undefined,
    }
  );

  const { mutate: updateMessages } =
    api.routeMessaging.updateMessageReadState.useMutation({
      onError: (e) => {
        console.log(e);
      },
      onSettled: () => {
        void apiContext.routeMessaging.invalidate();
      },
    });

  const driverBundles = useDriverVehicleBundles();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size={"icon"} className="relative">
          <Bell />{" "}
          {notifications?.length > 0 && (
            <span className="absolute right-0 top-0 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Notifications</h4>
            <p className="text-sm text-muted-foreground">
              Set the dimensions for the layer.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {notifications &&
              notifications.length > 0 &&
              notifications.map((notification) => (
                <Button
                  className="flex space-x-1"
                  key={notification.id}
                  variant={"ghost"}
                  onClick={() => {
                    updateMessages({ channelId: notification.id });
                    driverBundles.message(notification.driverId as string);
                  }}
                >
                  <span className="aspect-square h-fit rounded-full bg-slate-100 p-2">
                    <Car className="h-6 w-6" />
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold">
                      You have {notification.messages} new messages from{" "}
                      {notification.channel}
                    </h4>
                    {/* <p className="text-xs text-muted-foreground">
                      3 minutes ago
                    </p> */}
                  </div>
                </Button>
              ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
