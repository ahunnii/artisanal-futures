import Link from "next/link";

import { MapPin, Target, Truck } from "lucide-react";

import { Badge } from "~/components/ui/badge";

import type { OptimizedRoutePath } from "@prisma/client";

import type { FC } from "react";

type Props = {
  baseRouteUrl: string;
  routeId: string;
  optimizedRoutes: OptimizedRoutePath[];
  jobLength: number;
  vehicleLength: number;
};
export const HomepageRouteCard: FC<Props> = ({
  baseRouteUrl,
  routeId,
  optimizedRoutes,
  jobLength,
  vehicleLength,
}) => {
  return (
    <li className=" my-2 rounded-md border  p-2 hover:bg-gray-100 hover:shadow-inner">
      <Link
        href={`${baseRouteUrl}${routeId}?${
          optimizedRoutes.length > 0 ? "mode=calculate" : "mode=plan"
        }`}
      >
        <div>
          <p className="text-sm font-semibold">Route Plan #{routeId}</p>

          {optimizedRoutes?.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Routes were{" "}
              {optimizedRoutes?.find((r) => r.status === "IN_PROGRESS")
                ? "initiated"
                : optimizedRoutes?.filter((r) => r.status === "COMPLETED")
                    .length === optimizedRoutes?.length &&
                  optimizedRoutes?.length > 0
                ? "finished"
                : "not started"}
            </p>
          )}

          {optimizedRoutes?.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Routes still being drafted
            </p>
          )}

          <div className="flex w-full space-x-2">
            <Badge className="gap-1" variant={"outline"}>
              <Truck className="h-4 w-4" />
              <span className="hidden md:flex">Vehicles</span> {vehicleLength}
            </Badge>
            <Badge className="gap-1" variant={"outline"}>
              <MapPin className="h-4 w-4" />{" "}
              <span className="hidden md:flex">Jobs</span> {jobLength}
            </Badge>

            <Badge className="gap-1" variant={"default"}>
              <Target className="h-4 w-4" />{" "}
              {optimizedRoutes?.length > 0
                ? `${optimizedRoutes?.length} path(s) optimized`
                : "Draft"}
            </Badge>
          </div>
        </div>
      </Link>
    </li>
  );
};
