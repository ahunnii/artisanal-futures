import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import { useSession } from "next-auth/react";
import { useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Switch } from "~/components/ui/switch";
import type { UploadOptions } from "../../types.wip";

export const FileUploadModal = <T,>({
  handleOnClick,
  handleAccept,
  parseHandler,
  type,
  currentData,
  children,
}: UploadOptions<T> & {
  children: ReactNode;
  handleOnClick?: () => void;
}) => {
  const { status } = useSession();

  const [open, setOpen] = useState(false);

  const [saveToDB, setSaveToDB] = useState(status === "authenticated");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T[]>([]);

  const [tableData, setTableData] = useState<
    { name: string; address: string; email?: string }[]
  >([]);

  const handleOnAccept = () => {
    handleAccept({ data, saveToDB });
    setOpen(false);
  };

  const handleOnClear = () => {
    if (inputRef.current) inputRef.current.value = "";
    setData([]);
    setTableData([]);
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    parseHandler({
      event,
      setIsLoading,
      callback: (bundle) => {
        setData(bundle.data);
        setTableData(bundle.tableData);
      },
    });
  };

  const openDialog = () => {
    if (handleOnClick) handleOnClick();
    setOpen(true);
  };

  const onOpenChange = (value: boolean) => {
    if (!value) handleOnClear();
    setOpen(value);
  };

  return (
    <>
      <div onClick={() => openDialog()} className="w-full">
        {children}
      </div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-2xl capitalize">
              {type as string} Import
            </DialogTitle>
            <DialogDescription>
              Add your {type as string}s from a CSV spreadsheet. You can click
              here to see a sample or here to take a look at our format guide.
            </DialogDescription>

            <DialogDescription className="pt-4 font-bold">
              {((type as string) === "client" ||
                (type as string) === "job") && (
                <span>
                  Only clients with valid emails will be saved to the depot for
                  future use.{" "}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="grid w-full max-w-sm items-center gap-1.5 py-5">
            <Label htmlFor="csvFile">CSV File</Label>
            <div className="flex gap-2">
              <Input
                id="csvFile"
                type="file"
                accept=".csv"
                ref={inputRef}
                onChange={handleFileUpload}
              />
              <Button
                type="button"
                onClick={handleOnClear}
                disabled={isLoading}
                className="mr-auto"
                variant="outline"
              >
                Clear
              </Button>
            </div>
          </div>

          {currentData &&
            currentData?.length > 0 &&
            data?.length === 0 &&
            type !== "job" && (
              <p className="py-2 font-bold ">
                You currently have {currentData.length} {type as string}s
                available. You can always add more.
              </p>
            )}

          {isLoading && (
            <div className="flex-center flex h-96 items-center justify-center">
              <ReloadIcon className="h-10 w-10 animate-spin" />
            </div>
          )}
          {data?.length > 0 && tableData?.length > 0 && (
            <>
              <div className="flex gap-4 px-4 ">
                <div className="flex w-1/4 flex-col ">
                  <p className="text-lg font-semibold">Name</p>
                </div>
                <div className="flex w-1/4 flex-col ">
                  <p className="text-lg font-semibold">Email</p>
                </div>
                <div className="flex w-2/4 flex-col ">
                  <p className="text-lg font-semibold">Address</p>
                </div>
              </div>

              <ScrollArea className="grid h-96 w-full gap-4">
                {tableData.map((bundle, idx) => {
                  return (
                    <div className="flex gap-4 p-4 odd:bg-muted" key={idx}>
                      <p className=" w-1/4 capitalize">{bundle.name}</p>

                      <p className="w-1/4 overflow-hidden text-ellipsis ">
                        {bundle?.email ?? ""}
                      </p>

                      <p className=" w-2/4 ">{bundle.address}</p>
                    </div>
                  );
                })}
              </ScrollArea>
            </>
          )}

          <DialogFooter>
            {/* <TooltipProvider>
              <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>
                  <div className="mr-auto flex items-center space-x-2">
                    <Switch
                      id="save-to-depot-mode"
                      defaultChecked={status === "authenticated"}
                      disabled={status === "unauthenticated"}
                      onCheckedChange={setSaveToDB}
                    />
                    <Label htmlFor="save-to-depot-mode">
                      Save data to depot
                    </Label>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Login to save your progress</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider> */}

            <Button
              type="button"
              onClick={() => {
                onOpenChange(false);
              }}
              disabled={isLoading}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleOnAccept} disabled={isLoading}>
              {isLoading && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Look&apos;s good, save them
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
