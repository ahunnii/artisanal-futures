import { format } from "date-fns";
import { Truck } from "lucide-react";
import { useParams } from "next/navigation";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import type { DriverVehicleBundle, UploadOptions } from "../types.wip";

import { useDriverVehicleBundles } from "../hooks/drivers/use-driver-vehicle-bundles";
import { handleDriverSheetUpload } from "../utils/driver-vehicle/parse-drivers.wip";
import { FileUploadModal } from "./file-upload-modal.wip";

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
  const params = useParams();
  const depotId = params?.depotId as string;

  const { drivers } = useDriverVehicleBundles();

  const driverImportButtonProps = {
    button: {
      Icon: Truck,
      caption: "Add your drivers from spreadsheet",
      isProcessed: drivers?.all?.length > 0,
    },
    fileUpload: {
      type: "driver" as keyof DriverVehicleBundle,
      parseHandler: handleDriverSheetUpload,
      handleAccept: ({ data, saveToDB }) => {
        console.log("data", data);
        console.log("saveToDB", saveToDB);
        drivers.setDrivers({
          drivers: data,
          saveToDB: status === "authenticated" && saveToDB,
        });
      },
      currentData: drivers.all,
    },
  } as UploadButtonOptions<DriverVehicleBundle>;

  return (
    <>
      <Card className="w-3/4">
        <CardHeader>
          <CardTitle>
            {date.getDate() === new Date().getDate()
              ? "Today's Overview"
              : `Overview`}
          </CardTitle>

          {status === "authenticated" && (
            <>
              <CardDescription>
                {format(date, "MMMM dd yyyy")} * Depot{" "}
                {depotId as unknown as number} * No finalized routes yet
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
              after you close the page.{" "}
            </p>
          )}{" "}
          <div className="grid  w-full grid-cols-1 items-center gap-4 md:grid-cols-3">
            <FileUploadModal<DriverVehicleBundle>
              {...driverImportButtonProps.fileUpload!}
            >
              <span>
                <HomePageOverviewImportBtn
                  {...driverImportButtonProps.button}
                />
              </span>
            </FileUploadModal>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline">Nah, I&apos;ll just do it later </Button>
          <Button>Upload data and continue </Button>

          <Button></Button>
        </CardFooter>
      </Card>
    </>
  );
};
