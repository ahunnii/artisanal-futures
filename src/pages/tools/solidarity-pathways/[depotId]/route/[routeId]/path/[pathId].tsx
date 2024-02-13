import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState, type FC } from "react";

import { Beforeunload } from "react-beforeunload";

import { Button } from "~/components/ui/button";
import PageLoader from "~/components/ui/page-loader";

import type { RouteData, StepData } from "~/apps/solidarity-routing/types";

import axios from "axios";
import { useSession } from "next-auth/react";
import { MobileDrawer } from "~/apps/solidarity-routing/components/mobile-drawer.wip";
import RouteBreakdown from "~/apps/solidarity-routing/components/solutions/route-breakdown";
import FieldJobSheet from "~/apps/solidarity-routing/components/tracking/field-job-sheet.wip";
import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";
import { useOptimizedRoutePlan } from "~/apps/solidarity-routing/hooks/optimized-data/use-optimized-route-plan";
import RouteLayout from "~/apps/solidarity-routing/route-layout";
import type { OptimizedStop } from "~/apps/solidarity-routing/types.wip";
import { getColor } from "~/apps/solidarity-routing/utils/generic/color-handling";
import { cuidToIndex } from "~/apps/solidarity-routing/utils/generic/format-utils.wip";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

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

import * as crypto from "crypto";
import { useSearchParams } from "next/navigation";

function generatePasscode(email: string): string {
  // Create a SHA-256 hash
  const hash = crypto.createHash("sha256");
  // Update the hash with the email
  hash.update(email);
  // Get the hashed value as a hexadecimal string
  const hashedEmail = hash.digest("hex");
  // Take the first 6 characters of the hashed email
  const passcode = hashedEmail.substring(0, 6);
  return passcode;
}

const OptimizedPathPage: FC<IProps> = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [approval, setApproval] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const optimizedRoutePlan = useOptimizedRoutePlan();
  const driverRoute = useDriverVehicleBundles();

  const driver = driverRoute.getVehicleById(
    optimizedRoutePlan?.data?.vehicleId
  );
  // session?.user?.role != "ADMIN" &&
  useEffect(() => {
    if (!approval) {
      setOpen(true);
    }
  }, [session, approval]);

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

  // session?.user?.role !== "ADMIN" &&
  if (!approval && !session?.user) {
    return (
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Verify Driver</DialogTitle>
            <DialogDescription>
              Enter the email the depot has of you to verify your identity
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="z-[1000] grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                ref={inputRef}
                placeholder="e.g. awesome@test.com"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="disabled:cursor-not-allowed"
              type="button"
              // disabled={inputRef?.current?.value === ""}
              onClick={() => {
                // TODO: Add cookie verifying this page is good
                const temp = inputRef?.current?.value
                  ? generatePasscode(inputRef.current.value)
                  : "";
                if (temp === searchParams.get("pc")) {
                  setApproval(true);
                } else {
                  alert("Invalid passcode");
                }
              }}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // session?.user?.role === "ADMIN" ||
  if (approval || session?.user) {
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
                          getColor(
                            cuidToIndex(optimizedRoutePlan.data.vehicleId)
                          ).background
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
  }
};

export default OptimizedPathPage;
