import Link from "next/link";
import { useState } from "react";

import axios from "axios";
import { ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";

import "react-phone-number-input/style.css";

import LoadingIndicator from "~/components/tools/routing/solutions/loading-indicator";
import type { RouteData } from "~/components/tools/routing/types";
import RouteQRCode from "~/components/tools/routing/ui/RouteQRCode";
import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dialog as ShadDialog,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";

import { api } from "~/utils/api";
interface IProps {
  data: RouteData;
}

const sendEmail = async (value: string | undefined, fileID: string) => {
  if (!value) return;

  const res = await axios.post("/api/routing/send-route", {
    email: value,
    body: `Here is your route for today: https://artisanalfutures.org/tools/routing/${fileID}`,
  });

  if (res.data.id) {
    toast.success("Message was sent successfully!");
  } else {
    console.error(res.data);
    toast.error("There seems to be an error. Please try again later.");
  }
};

export const DynamicRouteQRModal = ({ data }: IProps) => {
  const { name: driverName } = JSON.parse(data.description ?? "{}");

  const [, setIsOpen] = useState(false);

  const [value, setValue] = useState<string | undefined>(undefined);
  const [fileID, setFileID] = useState<string>("");

  const successCallback = (filename: string) => {
    setFileID(filename);
    setIsOpen(true);
  };

  const errorCallback = (error: string) => {
    console.error("Error uploading files:", error);
    setFileID("");
    setIsOpen(false);
  };

  const { mutate } = api.finalizedRoutes.createFinalizedRoute.useMutation({
    onError: (error) => {
      toast.error(error.message);
      errorCallback(error.message);
    },
    onSuccess: (data) => {
      if (data?.id) successCallback(data?.id);
    },
  });

  const openModal = () => {
    if (!data) return;
    mutate(data);
  };

  return (
    <>
      <ShadDialog>
        <DialogTrigger asChild>
          <Button
            type="button"
            onClick={() => void openModal()}
            className="gap-2 "
          >
            Send to Driver <ArrowRight />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle> Route QR Code for {driverName}</DialogTitle>
            <DialogDescription>
              <Link
                href={`/tools/routing/${encodeURIComponent(fileID)}`}
                target="_blank"
              >
                Link to generated route
              </Link>
            </DialogDescription>
          </DialogHeader>{" "}
          <div className="mt-2 h-full w-full">
            {fileID && <RouteQRCode url={fileID} />}
            {!fileID && <LoadingIndicator />}
          </div>{" "}
          <div className="py-5">
            <label className="block py-2 text-lg font-medium text-slate-700">
              Driver&apos;s Email
            </label>

            <div className=" flex  w-full flex-row  gap-4 rounded-md   text-lg sm:text-sm">
              <Input
                className="flex flex-1 text-sm"
                placeholder="Enter email address"
                type="email"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <Button
                className="rounded bg-green-500 px-2 font-semibold text-white"
                onClick={() => void sendEmail(value, fileID)}
              >
                Send Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </ShadDialog>
    </>
  );
};
