import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
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
import { generatePassCode } from "../utils/generic/generate-passcode";

export const DriverVerificationDialog = ({
  approval,
  setApproval,
}: {
  approval: boolean;
  setApproval: (approval: boolean) => void;
}) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  useEffect(() => {
    if (!approval) {
      setOpen(true);
    }
  }, [session, approval, open]);

  const verifyPassCode = () => {
    // TODO: Add cookie verifying this page is good
    const temp = inputRef?.current?.value
      ? generatePassCode(inputRef.current.value)
      : "";
    if (temp === searchParams.get("pc")) {
      setApproval(true);
    } else {
      alert("Invalid passcode");
    }
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
