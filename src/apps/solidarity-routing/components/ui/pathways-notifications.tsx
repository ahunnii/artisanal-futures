import { Bell, Car } from "lucide-react";

import { Button } from "~/components/ui/button";

import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";
import { useSolidarityMessaging } from "~/apps/solidarity-routing/hooks/use-solidarity-messaging";
import { useSolidarityNotifications } from "~/apps/solidarity-routing/hooks/use-solidarity-notifications";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export const PathwaysNotifications = () => {
  const solidarityNotifications = useSolidarityNotifications();
  const { setActive: setActiveDriver, findDriverByEmail } =
    useDriverVehicleBundles();
  const { messageDriverById } = useSolidarityMessaging();

  const updateMessageThread = ({
    id,
    channel,
  }: {
    id: string;
    channel: string;
  }) => {
    solidarityNotifications.updateMessagingStatus({ channelId: id });
    setActiveDriver(findDriverByEmail(channel)?.vehicle.id ?? null);
    messageDriverById(id);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size={"icon"}
          className="relative aspect-square"
        >
          <Bell />{" "}
          {solidarityNotifications.notifications?.length > 0 && (
            <span className="absolute right-0 top-0 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Notifications</h4>
            <p className="text-sm text-muted-foreground">
              Messages from drivers and other important stuff
            </p>
          </div>{" "}
        </div>
        <div className="flex flex-col space-y-4 py-4">
          {solidarityNotifications.notifications?.length > 0 &&
            solidarityNotifications.notifications.map((notification) => (
              <Button
                className="flex justify-between gap-2 text-sm font-semibold"
                key={notification.id}
                variant={"ghost"}
                onClick={() => updateMessageThread({ ...notification })}
              >
                <span className="aspect-square h-fit rounded-full bg-slate-100 p-2 ">
                  <Car className="h-6 w-6" />
                </span>

                <p className="flex flex-col">
                  <span>
                    You have {notification.messages} new messages from{" "}
                  </span>
                  <span> {notification.channel}</span>
                </p>
              </Button>
            ))}
          {solidarityNotifications.notifications.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No new notifications
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
