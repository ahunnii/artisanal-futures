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

  return (
    <>
      <div onClick={() => openDialog()} className="w-full">
        {children}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
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
                <p>
                  Only clients with valid emails will be saved to the depot for
                  future use.{" "}
                </p>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="grid w-full max-w-sm items-center gap-1.5 py-5">
            <Label htmlFor="csvFile">CSV File</Label>
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              ref={inputRef}
              onChange={handleFileUpload}
            />
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
              <div className="flex  gap-4  ">
                <div className="flex w-1/3 flex-col ">
                  <p className="text-lg font-semibold">Name</p>
                </div>
                <div className="flex w-1/3 flex-col ">
                  <p className="text-lg font-semibold">Email</p>
                </div>
                <div className="flex w-2/3 flex-col text-left">
                  <p className="text-lg font-semibold">Address</p>
                </div>
              </div>

              <ScrollArea className="grid h-96 w-full gap-4">
                {tableData.map((bundle, idx) => {
                  return (
                    <div className="flex gap-4 p-4 odd:bg-muted" key={idx}>
                      <div className="flex w-1/3 flex-col">
                        <p className="capitalize">{bundle.name}</p>
                      </div>
                      <div className="flex w-1/3 flex-col">
                        <p className="capitalize">{bundle?.email ?? ""}</p>
                      </div>
                      <div className="flex w-2/3 flex-col">
                        <p>{bundle.address}</p>
                      </div>
                    </div>
                  );
                })}
              </ScrollArea>
            </>
          )}

          <DialogFooter>
            <TooltipProvider>
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
            </TooltipProvider>

            <Button
              type="button"
              onClick={handleOnClear}
              disabled={isLoading}
              variant="outline"
            >
              Clear
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
