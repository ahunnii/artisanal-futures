import Link from "next/link";
import { useMemo, useState, type FC } from "react";

import { ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";

import "react-phone-number-input/style.css";

import QRCode from "~/apps/solidarity-routing/components/qr/route-qr-code";
import type { ExpandedRouteData } from "~/apps/solidarity-routing/types";

import LoadingIndicator from "~/apps/solidarity-routing/components/solutions/loading-indicator";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";

import { env } from "~/env.mjs";

import { sendEmail } from "~/utils/email";

type TProps = { data: ExpandedRouteData };

export const RouteQRDialog: FC<TProps> = ({ data }) => {
  // const { name: driverName } = JSON.parse(data.description ?? "{}");

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [emailAddress, setEmailAddress] = useState<string | undefined>(
    undefined
  );
  const [fileID] = useState<string>("");

  const emailPayload = useMemo(() => {
    return {
      email: emailAddress,
      message: `Here is your route for today: ${env.NEXT_PUBLIC_APP_URL}/tools/routing/${fileID}`,
      endpoint: "/api/routing/send-route",
      success: () => toast.success("Message was sent successfully!"),
      error: (data: unknown) => {
        console.error(data);
        toast.error("There seems to be an error. Please try again later.");
      },
    };
  }, [fileID, emailAddress]);

  const openModal = () => {
    if (!data) return;
    // mutate(data);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button type="button" onClick={openModal} className="gap-2 ">
            Send to Driver <ArrowRight />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle> Route QR Code for DriverName</DialogTitle>
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
            {fileID ? <QRCode url={fileID} /> : <LoadingIndicator />}
          </div>
          <div className="py-5">
            <label className="block py-2 text-lg font-medium text-slate-700">
              Driver&apos;s Email
            </label>

            <div className=" flex w-full flex-row gap-4 rounded-md text-lg sm:text-sm">
              <Input
                className="flex flex-1 text-sm"
                placeholder="Enter email address"
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
              <Button
                className="rounded bg-green-500 px-2 font-semibold text-white"
                onClick={() => void sendEmail(emailPayload)}
              >
                Send Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
