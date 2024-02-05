import { format } from "date-fns";
import {
  CheckCircleIcon,
  FilePlus,
  PersonStanding,
  Plus,
  Truck,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useRef, useState, type ChangeEvent } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";

import {
  formatClientSheetRow,
  formatDriverSheetRow,
} from "../libs/format-csv.wip";
import geocodingService from "../services/autocomplete";
import type {
  ClientJobBundle,
  DriverVehicleBundle,
  VersionOneClientCSV,
  VersionOneDriverCSV,
} from "../types.wip";
import { formatClientSheetRowToBundle } from "../utils/client-job/format-clients.wip";
import { parseSpreadSheet } from "../utils/generic/parse-csv.wip";
import { ClientsPreviewModal } from "./clients-preview-modal.wip";
import { DriversPreviewModal } from "./drivers-preview-modal.wip";
import { HomePageOverviewImportBtn } from "./homepage-overview-import-btn";

export type FileUploadHandler = (
  event: React.ChangeEvent<HTMLInputElement>
) => void;

export const UnauthenticatedDisclaimer = ({ date }: { date: Date }) => {
  const searchParams = useSearchParams();
  const params = useParams();

  const depotId = params?.depotId as string;

  const [driverModalOpen, setDriverModalOpen] = useState(false);
  const [clientModalOpen, setClientModalOpen] = useState(false);

  const [isFileDriverUploading, setIsFileDriverUploading] = useState(false);
  const [isFileClientUploading, setIsFileClientUploading] = useState(false);
  const [isFileRouteUploading, setIsFileRouteUploading] = useState(false);

  const [drivers, setDrivers] = useState<DriverVehicleBundle[]>([]);
  const [clients, setClients] = useState<ClientJobBundle[]>([]);

  const isFirstTime = searchParams.get("welcome");
  const apiContext = api.useContext();

  const inputDriverRef = useRef<HTMLInputElement | null>(null);
  const inputClientRef = useRef<HTMLInputElement | null>(null);
  const inputRouteRef = useRef<HTMLInputElement | null>(null);

  const clearDriverInput = () => {
    if (inputDriverRef.current) inputDriverRef.current.value = "";
    setDriverModalOpen(false);
  };

  const clearClientInput = () => {
    if (inputClientRef.current) inputClientRef.current.value = "";
    setClientModalOpen(false);
  };

  const clearRoutesInput = () => {
    if (inputRouteRef.current) inputRouteRef.current.value = "";
  };

  const { mutate: createDrivers, isLoading: isDriverMutationLoading } =
    api.drivers.createManyDriverAndVehicle.useMutation({
      onSuccess: () => {
        toast.success("Woohoo! Drivers created!");
      },
      onError: (e) => {
        console.log(e);
        toast.error("Oops! Something went wrong!");
      },
      onSettled: () => {
        clearDriverInput();
        void apiContext.drivers.invalidate();
      },
    });

  const { mutate: createClients, isLoading: isClientMutationLoading } =
    api.clients.createManyClientAndJob.useMutation({
      onSuccess: () => {
        toast.success("Woohoo! Clients created!");
      },
      onError: (e) => {
        console.log(e);
        toast.error("Oops! Something went wrong!");
      },
      onSettled: () => {
        clearClientInput();
        void apiContext.clients.invalidate();
      },
    });

  const { data: depotDrivers } = api.drivers.getCurrentDepotDrivers.useQuery({
    depotId: depotId as unknown as number,
  });

  const { data: depotClients } = api.clients.getCurrentDepotClients.useQuery({
    depotId: depotId as unknown as number,
  });

  const handleDriverSheetUpload: FileUploadHandler = (event) => {
    setIsFileDriverUploading(true);
    parseSpreadSheet<VersionOneDriverCSV, DriverVehicleBundle>({
      file: event.target.files![0]!,
      parser: formatDriverSheetRow,
      onComplete: async (data: DriverVehicleBundle[]) => {
        const revisedDrivers = await Promise.all(
          data.map(async (driverVehicleBundle) => {
            const address = await geocodingService.geocodeByAddress(
              driverVehicleBundle.driver.address.formatted
            );

            return {
              ...driverVehicleBundle,
              driver: {
                ...driverVehicleBundle.driver,
                address: {
                  // ...driverVehicleBundle.driver.address,
                  ...address,
                },
              },
            };
          })
        ).catch((err) => {
          console.log(err);
        });

        console.log(revisedDrivers);
        setIsFileDriverUploading(false);
        setDrivers(revisedDrivers ?? []);
        setDriverModalOpen(true);
      },
    });
  };

  const handleClientSheetUpload: FileUploadHandler = (event) => {
    setIsFileClientUploading(true);
    parseSpreadSheet<VersionOneClientCSV, ClientJobBundle>({
      file: event.target.files![0]!,
      parser: formatClientSheetRowToBundle,
      onComplete: async (data: ClientJobBundle[]) => {
        const revisedClients = await Promise.all(
          data.map(async (clientJobBundle) => {
            const address = await geocodingService.geocodeByAddress(
              clientJobBundle.client.address.formatted
            );

            return {
              ...clientJobBundle,
              client: {
                ...clientJobBundle.client,
                address: {
                  ...address,
                },
              },
            };
          })
        ).catch((err) => {
          console.log(err);
        });
        setIsFileClientUploading(false);
        console.log(revisedClients);
        setClients(revisedClients ?? []);
        setClientModalOpen(true);
      },
    });
  };

  const overviewUploadOptions = [
    {
      Icon: Truck,
      caption: "Add your drivers from spreadsheet",
      handleFileUpload: handleDriverSheetUpload,
      text: "Add your drivers from spreadsheet",
      isProcessed:
        drivers?.length > 0 || (depotDrivers && depotDrivers?.length > 0),
      ref: inputDriverRef,
      isProcessing: isFileDriverUploading,
    },
    {
      Icon: PersonStanding,
      caption: "Add your customers from spreadsheet",
      handleFileUpload: handleClientSheetUpload,
      text: "Add your customers from spreadsheet",
      ref: inputClientRef,
      isProcessing: isFileClientUploading,
      isProcessed:
        clients?.length > 0 || (depotClients && depotClients?.length > 0),
    },
    {
      Icon: Upload,
      caption: "Crete your route from spreadsheet",
      handleFileUpload: handleClientSheetUpload,
      text: "Crete your route from spreadsheet",
      ref: inputRouteRef,
      isProcessing: false,
    },
  ];
  return (
    <>
      <DriversPreviewModal
        open={driverModalOpen}
        setOpen={setDriverModalOpen}
        driverVehicleBundles={drivers ?? []}
        loading={isDriverMutationLoading}
        handleAcceptDrivers={() => {
          createDrivers({
            data: drivers,
            depotId: depotId as unknown as number,
          });
        }}
        handleClear={clearDriverInput}
      />

      <ClientsPreviewModal
        open={clientModalOpen}
        setOpen={setClientModalOpen}
        clientJobBundles={clients ?? []}
        loading={isClientMutationLoading}
        handleAcceptClients={() => {
          createClients({
            data: clients,
            depotId: depotId as unknown as number,
          });
        }}
        handleClear={clearClientInput}
      />
      <Card className="w-2/4">
        <CardHeader>
          <CardTitle>Today&apos;s Overview</CardTitle>
          <CardDescription>{format(date, "MMMM dd yyyy")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            It looks like you are not logged in. You can continue to create a
            route plan, but you won&apos;t be able to save your progress.
          </p>
          <div className="flex w-full  flex-col  items-center gap-4 ">
            <Button className="w-full gap-2">
              <FilePlus /> Create a route using a spreadsheet
            </Button>
            <Button className="w-full  gap-2" variant={"outline"}>
              <Plus /> Manually create a route
            </Button>
          </div>

          <div className="mt-10 flex  w-full  flex-col items-center gap-4">
            <p>
              Need help with your spreadsheet formatting? Check out our guide on
              it here, or click here for a sample file.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
