import dynamic from "next/dynamic";
import React, { useEffect, useState, type FC } from "react";

import { Beforeunload } from "react-beforeunload";

import { Button } from "~/components/ui/button";
import PageLoader from "~/components/ui/page-loader";

import type { RouteData, StepData } from "~/apps/solidarity-routing/types";

import axios from "axios";
import { MobileDrawer } from "~/apps/solidarity-routing/components/mobile-drawer.wip";
import RouteBreakdown from "~/apps/solidarity-routing/components/solutions/route-breakdown";
import FieldJobSheet from "~/apps/solidarity-routing/components/tracking/field-job-sheet.wip";
import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";
import { useOptimizedRoutePlan } from "~/apps/solidarity-routing/hooks/optimized-data/use-optimized-route-plan";
import RouteLayout from "~/apps/solidarity-routing/route-layout";
import type { OptimizedStop } from "~/apps/solidarity-routing/types.wip";
import { getColor } from "~/apps/solidarity-routing/utils/generic/color-handling";
import { cuidToIndex } from "~/apps/solidarity-routing/utils/generic/format-utils.wip";

interface IProps {
  data: RouteData;
  steps: StepData[];
}

const LazyRoutingMap = dynamic(
  () => import("~/apps/solidarity-routing/components/map/routing-map"),
  {
    ssr: false,
    loading: () => <PageLoader />,
  }
);

const OptimizedPathPage: FC<IProps> = () => {
  const [notificationSent, setNotificationSent] = useState(false);
  const optimizedRoutePlan = useOptimizedRoutePlan();
  const driverRoute = useDriverVehicleBundles();

  const driver = driverRoute.getVehicleById(
    optimizedRoutePlan?.data?.vehicleId
  );

  useEffect(() => {
    if (driver && !notificationSent) {
      void axios.post("/api/realtime/online-driver", {
        depotId: 1,
        driverId: driver?.driver.id,
        vehicleId: driver?.vehicle.id,
      });
      setNotificationSent(true);
    }
  }, [driver, notificationSent]);

  return (
    <>
      <FieldJobSheet />
      <RouteLayout>
        {optimizedRoutePlan.isLoading ? (
          <PageLoader />
        ) : (
          <>
            {optimizedRoutePlan.data && (
              <section className="flex flex-1  flex-col-reverse border-2 max-md:h-full lg:flex-row">
                <div className="flex w-full flex-col gap-4 max-lg:hidden max-lg:h-4/6 lg:w-5/12 xl:w-3/12">
                  <>
                    <Beforeunload
                      onBeforeunload={(event) => {
                        event.preventDefault();
                      }}
                    />

                    <RouteBreakdown
                      steps={optimizedRoutePlan.data.stops as OptimizedStop[]}
                      driver={driver}
                      color={
                        getColor(cuidToIndex(optimizedRoutePlan.data.vehicleId))
                          .background
                      }
                    />

                    <Button>Start route</Button>
                  </>
                </div>
                <MobileDrawer />

                <LazyRoutingMap className="max-md:aspect-square lg:w-7/12 xl:w-9/12" />
              </section>
            )}
          </>
        )}
      </RouteLayout>
    </>
  );
};

export default OptimizedPathPage;
