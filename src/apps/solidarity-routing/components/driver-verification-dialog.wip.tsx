import axios from "axios";
import { useSession } from "next-auth/react";

import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useUrlParams } from "~/hooks/use-url-params";
import { notificationService } from "~/services/notification";
import { useSolidarityState } from "../hooks/optimized-data/use-solidarity-state";

export const DriverVerificationDialog = ({
  approval,
  setApproval,
}: {
  approval: boolean;
  setApproval: (approval: boolean) => void;
}) => {
  const { depotId, driverId, pathId } = useSolidarityState();
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const magicRef = useRef<HTMLInputElement>(null);

  const { data: session } = useSession();

  useEffect(() => {
    if (!approval) {
      setOpen(true);
    }
  }, [session, approval, open]);

  const verifyPassCode = () => {
    axios
      .post("/api/routing/auth-driver", {
        depotId,
        driverId: driverId,
        email: inputRef?.current?.value,
        magicCode: magicRef?.current?.value,
        pathId,
      })
      .then((res) => {
        if (res.status === 200) {
          setApproval(true);
        }
      })
      .catch((err) => {
        notificationService.notifyError({
          message: "Invalid email or magic code. Please try again",
          error: err,
        });
        console.error(err);
      });
  };

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
          <div className="z-[1000] grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Magic Code
            </Label>
            <Input
              id="magicCode"
              ref={magicRef}
              placeholder="e.g. super-secret-123"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            className="disabled:cursor-not-allowed"
            type="button"
            onClick={verifyPassCode}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
