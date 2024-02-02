import { format } from "date-fns";
import { PersonStanding, Truck, Upload, type LucideIcon } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import {
  Children,
  useRef,
  useState,
  type ChangeEvent,
  type MutableRefObject,
  type ReactNode,
} from "react";
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

import { api } from "~/utils/api";

import { useSession } from "next-auth/react";

import type { ClientJobBundle, DriverVehicleBundle } from "../types.wip";

import { useDriverVehicleBundles } from "../hooks/drivers/use-driver-vehicle-bundles";
import { handleClientSheetUpload } from "../utils/client-job/parse-clients.wip";
import { handleDriverSheetUpload } from "../utils/driver-vehicle/parse-drivers.wip";
import { FileUploadPreviewModal } from "./file-upload-preview-modal.wip";
import { HomePageOverviewImportBtn } from "./homepage-overview-import-btn";

export type UploadOptions = {
  type: keyof ClientJobBundle | keyof DriverVehicleBundle;
  open: boolean;
  loading: boolean;
  setOpen: (open: boolean) => void;
  bundles: DriverVehicleBundle[] | ClientJobBundle[];
  handleAccept: () => void;
  handleClear: () => void;
};

export type UploadButtonProps = {
  Icon: LucideIcon;
  caption: string;
  handleFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  text: string;
  isProcessed?: boolean;
  isProcessing?: boolean;
};

type UploadButtonOptions = {
  props: UploadButtonProps;
  ref: MutableRefObject<HTMLInputElement | null>;
  options: UploadOptions | null;
};
export const HomePageOnboarding = ({ date }: { date: Date }) => {
  const searchParams = useSearchParams();
  const params = useParams();

  const depotId = params?.depotId as string;

  const { drivers: driverBundles } = useDriverVehicleBundles();

  const [driverModalOpen, setDriverModalOpen] = useState(false);
  const [clientModalOpen, setClientModalOpen] = useState(false);

  const [isFileDriverUploading, setIsFileDriverUploading] = useState(false);
  const [isFileClientUploading, setIsFileClientUploading] = useState(false);

  const [drivers, setDrivers] = useState<DriverVehicleBundle[]>([]);
  const [clients, setClients] = useState<ClientJobBundle[]>([]);

  const apiContext = api.useContext();

  const inputDriverRef = useRef<HTMLInputElement | null>(null);
  const inputClientRef = useRef<HTMLInputElement | null>(null);
  const inputRouteRef = useRef<HTMLInputElement | null>(null);

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

  const clearDriverInput = () => {
    if (inputDriverRef.current) inputDriverRef.current.value = "";
    setDriverModalOpen(false);
    setDrivers([]);
  };

  const clearClientInput = () => {
    if (inputClientRef.current) inputClientRef.current.value = "";
    setClientModalOpen(false);
    setClients([]);
  };

  const overviewUploadOptions: UploadButtonOptions[] = [
    {
      props: {
        Icon: Truck,
        caption: "Add your drivers from spreadsheet",
        handleFileUpload: (e) =>
          handleDriverSheetUpload({
            event: e,
            setIsLoading: setIsFileDriverUploading,
            callback: (data) => {
              setDrivers(data);
              setDriverModalOpen(true);
            },
          }),
        text: "Add your drivers from spreadsheet",
        isProcessed:
          drivers?.length > 0 || (depotDrivers && depotDrivers?.length > 0),
        isProcessing: isFileDriverUploading,
      },
      ref: inputDriverRef,
      options: {
        type: "driver" as keyof DriverVehicleBundle,
        open: driverModalOpen,
        setOpen: setDriverModalOpen,
        bundles: drivers ?? [],
        loading: isDriverMutationLoading,
        handleAccept: () => {
          driverBundles.setDrivers({
            drivers: drivers,
            saveToDB: false,
          });
          createDrivers({
            data: drivers,
            depotId: depotId as unknown as number,
          });
        },
        handleClear: clearDriverInput,
      },
    },
    {
      props: {
        Icon: PersonStanding,
        caption: "Add your customers from spreadsheet",
        handleFileUpload: (e) =>
          handleClientSheetUpload({
            event: e,
            setIsLoading: setIsFileClientUploading,
            callback: (data) => {
              setClients(data);
              setClientModalOpen(true);
            },
          }),
        text: "Add your customers from spreadsheet",

        isProcessing: isFileClientUploading,
        isProcessed:
          clients?.length > 0 || (depotClients && depotClients?.length > 0),
      },
      ref: inputClientRef,
      options: {
        type: "client" as keyof ClientJobBundle,
        open: clientModalOpen,
        setOpen: setClientModalOpen,
        bundles: clients ?? [],
        loading: isClientMutationLoading,
        handleAccept: () => {
          createClients({
            data: clients,
            depotId: depotId as unknown as number,
          });
        },
        handleClear: clearClientInput,
      },
    },
  ];

  // const urlDate = searchParams.get("date");

  // const currentDate = urlDate
  //   ? new Date(urlDate.replace(/\+/g, " "))
  //   : new Date();

  const { status } = useSession();

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
            {overviewUploadOptions.map((option, idx) => (
              <UploadFileModal data={option?.options ?? null} key={idx}>
                <HomePageOverviewImportBtn {...option.props} ref={option.ref} />
              </UploadFileModal>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline">Nah, I&apos;ll just do it later </Button>
          <Button>Upload data and continue </Button>
        </CardFooter>
      </Card>
    </>
  );
};

const UploadFileModal = ({
  data,
  children,
}: {
  data: UploadOptions | null;
  children: ReactNode;
}) => {
  const element = Children.only(children);

  if (element) {
    return (
      <>
        {data && <FileUploadPreviewModal {...data} />}
        {element}
      </>
    );
  }

  throw new Error("UploadFileModal must have a single child");
};
