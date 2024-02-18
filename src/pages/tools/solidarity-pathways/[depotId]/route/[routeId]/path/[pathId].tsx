import dynamic from "next/dynamic";
import React, { useEffect, useState, type FC } from "react";

import { Beforeunload } from "react-beforeunload";

import { Button } from "~/components/ui/button";
import PageLoader from "~/components/ui/page-loader";

import type { RouteData, StepData } from "~/apps/solidarity-routing/types";

import axios from "axios";
import { useSession } from "next-auth/react";
import RouteLayout from "~/apps/solidarity-routing/components/layout/route-layout";
import { MobileDrawer } from "~/apps/solidarity-routing/components/mobile/mobile-drawer.wip";
import RouteBreakdown from "~/apps/solidarity-routing/components/route-plan-section/route-breakdown";
import FieldJobSheet from "~/apps/solidarity-routing/components/tracking/field-job-sheet.wip";
import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";
import { useOptimizedRoutePlan } from "~/apps/solidarity-routing/hooks/optimized-data/use-optimized-route-plan";
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

import { useSearchParams } from "next/navigation";
import { DriverVerificationDialog } from "~/apps/solidarity-routing/components/driver-verification-dialog.wip";
import { MessageSheet } from "~/apps/solidarity-routing/components/messaging/message-sheet";
import { useUrlParams } from "~/hooks/use-url-params";

const OptimizedPathPage: FC<IProps> = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [approval, setApproval] = useState(false);
  const { updateUrlParams, testUrlParams, pathname } = useUrlParams();

  const [notificationSent, setNotificationSent] = useState(false);
  const optimizedRoutePlan = useOptimizedRoutePlan();
  const driverRoute = useDriverVehicleBundles();

  const driver = driverRoute.getVehicleById(
    optimizedRoutePlan?.data?.vehicleId
  );

  const routeColor = getColor(
    cuidToIndex(optimizedRoutePlan?.data?.vehicleId ?? "")
  );

  // useEffect(() => {
  //   if (pathname)
  //     axios
  //       .get("/api/routing/auth-driver")
  //       .then((res) => {
  //         updateUrlParams({
  //           key: "magicCode",
  //           value: res.data?.magicCode ?? null,
  //         });
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       });
  // }, [pathname]);

  useEffect(() => {
    if (!searchParams.get("vehicle") && optimizedRoutePlan?.data?.vehicleId) {
      updateUrlParams({
        key: "vehicle",
        value: optimizedRoutePlan?.data?.vehicleId,
      });
    }
    if (
      driver?.driver.name &&
      !notificationSent &&
      searchParams.get("vehicle")
    ) {
      setNotificationSent(true);

      axios
        .post("/api/routing/online-driver", {
          depotId: 1,
          vehicleId: searchParams.get("vehicle"),
        })
        .catch((e) => {
          console.log(e);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driver, notificationSent, searchParams]);

  if (!approval && !session?.user)
    return (
      <DriverVerificationDialog approval={approval} setApproval={setApproval} />
    );

  if (approval || session?.user)
    return (
      <>
        <FieldJobSheet />
        <MessageSheet />
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
                        color={routeColor.background}
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
