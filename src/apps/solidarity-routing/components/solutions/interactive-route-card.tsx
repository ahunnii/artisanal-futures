import { useMemo, useState, type FC } from "react";

import { MessageCircle } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "~/components/ui/map-sheet";

import { cn } from "~/utils/styles";

import Link from "next/link";
import { OptimizedRouteHeaderCard } from "~/apps/solidarity-routing/components/solutions/optimized-route-header-card";
import RouteBreakdown from "~/apps/solidarity-routing/components/solutions/route-breakdown";
import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";
import type {
  OptimizedRoutePath,
  OptimizedStop,
} from "~/apps/solidarity-routing/types.wip";
import { getColor } from "~/apps/solidarity-routing/utils/generic/color-handling";
import { cuidToIndex } from "~/apps/solidarity-routing/utils/generic/format-utils.wip";
import { ScrollArea } from "~/components/ui/scroll-area";

type TInteractiveProps = {
  data: OptimizedRoutePath;
  textColor?: number;
  isOnline?: boolean;
  isTracking?: boolean;
} & React.ComponentProps<typeof Card>;

const InteractiveRouteCard: FC<TInteractiveProps> = ({
  data,
  className,
  ...props
}) => {
  const [onOpen, setOnOpen] = useState<boolean>(false);

  const driverBundles = useDriverVehicleBundles();

  const driver = driverBundles.getVehicleById(data.vehicleId);

  const color = useMemo(() => getColor(cuidToIndex(data.vehicleId)), [data]);

  return (
    <>
      <Sheet onOpenChange={setOnOpen} open={onOpen}>
        <SheetTrigger asChild>
          <Button
            variant={"ghost"}
            className="my-2 ml-auto  flex h-auto  w-full p-0 text-left"
          >
            <Card
              className={cn("w-full hover:bg-slate-50", className)}
              {...props}
            >
              <OptimizedRouteHeaderCard
                route={data}
                textColor={color?.text ?? "text-black"}
                isButton={true}
                isOnline={false}
              />
            </Card>
          </Button>
        </SheetTrigger>
        <SheetContent className="radix-dialog-content flex w-full  max-w-full flex-col sm:w-full sm:max-w-full md:max-w-md lg:max-w-lg">
          <SheetHeader className="text-left">
            <OptimizedRouteHeaderCard
              route={data}
              textColor={color?.text ?? "text-black"}
              className="shadow-none"
            />
          </SheetHeader>
          <RouteBreakdown
            steps={data.stops as OptimizedStop[]}
            color={color.background}
            driver={driver}
          />
          <SheetFooter className="flex flex-row gap-2">
            <MessagingSheet name={driver?.driver?.name ?? ""} />
            <Link
              href={`/tools/solidarity-pathways/1/route/${data.routeId}/path/${data.id}`}
            >
              <Button className="">View Route</Button>
            </Link>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default InteractiveRouteCard;

const MessagingSheet = ({ name }: { name: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="flex flex-1 gap-2" variant={"outline"}>
          <MessageCircle /> Send Message to {name}
        </Button>
      </SheetTrigger>
      <SheetContent className="radix-dialog-content flex w-full  max-w-full flex-col sm:w-full sm:max-w-full md:max-w-md lg:max-w-lg">
        <SheetHeader>
          <h3>Message Thread with {name}</h3>
        </SheetHeader>

        <ScrollArea className="flex-1 bg-slate-50 shadow-inner"></ScrollArea>
        <SheetFooter>
          <Button>Close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
