import { format } from "date-fns";
import { MapPin, Truck } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import type {
  ClientJobBundle,
  DriverVehicleBundle,
  UploadOptions,
} from "../types.wip";

import { FileUploadModal } from "~/apps/solidarity-routing/components/file-upload-modal.wip";
import { driverVehicleUploadOptions } from "~/apps/solidarity-routing/data/driver-data";
import { clientJobUploadOptions } from "~/apps/solidarity-routing/data/stop-data";
import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";
import { useClientJobBundles } from "~/apps/solidarity-routing/hooks/jobs/use-client-job-bundles";
import { useSolidarityState } from "~/apps/solidarity-routing/hooks/optimized-data/use-solidarity-state";
import { useRoutePlans } from "~/apps/solidarity-routing/hooks/plans/use-route-plans";
import { nthNumber } from "../utils/generic/nth-date";
import {
  HomePageOverviewImportBtn,
  type HomePageImportBtnProps,
} from "./homepage-overview-import-btn";

type UploadButtonOptions<T> = {
  button: HomePageImportBtnProps;
  fileUpload: UploadOptions<T> | null;
};

interface IProps {
  date: Date;
  status: "authenticated" | "loading" | "unauthenticated";
}
export const HomePageOnboardingCard = ({ date, status }: IProps) => {
  const { depotId } = useSolidarityState();

  const routePlan = useRoutePlans();

  const driverBundles = useDriverVehicleBundles();
  const jobs = useClientJobBundles();

  const driverImportButtonProps = {
    button: {
      Icon: Truck,
      caption: "Add your drivers from spreadsheet",
      isProcessed: driverBundles.depot.length > 0,
    },
    fileUpload: driverVehicleUploadOptions({
      drivers: driverBundles.data,
      setDrivers: driverBundles.createMany,
    }),
  } as UploadButtonOptions<DriverVehicleBundle>;

  const jobImportButtonProps = {
    button: {
      Icon: MapPin,
      caption: "Add your stops from spreadsheet",
      isProcessed: false,
    },
    fileUpload: clientJobUploadOptions({
      jobs: jobs.data,
      setJobs: jobs.createMany,
    }),
  } as UploadButtonOptions<ClientJobBundle>;

  const manuallyCreateRoute = () => routePlan.create({ depotId, date });

  const todayDate =
    format(date, "MMMM dd yyyy") === format(new Date(), "MMMM dd yyyy");

  const dateTitle = todayDate
    ? "Today's"
    : `${format(date, "MMMM d")}${nthNumber(Number(format(date, "d")))}`;

  return (
    <>
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>{dateTitle} Overview</CardTitle>

          {status === "authenticated" && (
            <>
              <CardDescription>
                {format(date, "MMMM dd yyyy")} * Depot {depotId}
              </CardDescription>
            </>
          )}
          {status === "unauthenticated" && (
            <>
              <CardDescription>
                {format(date, "MMMM dd yyyy")} * Sandbox Mode
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent>
          {status === "unauthenticated" && (
            <p className="mb-6 leading-7 [&:not(:first-child)]:mt-6">
              It looks like you are not logged in. You can still continue to use
              Solidarity Pathways, but all routes and data will be discarded
              after you close the page.
            </p>
          )}{" "}
          <div className="grid  w-full grid-cols-1 items-center gap-4 md:grid-cols-2">
            <FileUploadModal<DriverVehicleBundle>
              {...driverImportButtonProps.fileUpload!}
            >
              <span>
                <HomePageOverviewImportBtn
                  {...driverImportButtonProps.button}
                />
              </span>
            </FileUploadModal>

            <FileUploadModal<ClientJobBundle>
              {...jobImportButtonProps.fileUpload!}
            >
              <span>
                <HomePageOverviewImportBtn {...jobImportButtonProps.button} />
              </span>
            </FileUploadModal>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="secondary" onClick={manuallyCreateRoute}>
            Nah, I&apos;ll just do it later{" "}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};
