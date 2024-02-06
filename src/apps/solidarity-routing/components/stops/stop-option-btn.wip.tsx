import { ReloadIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";

import { Button } from "~/components/ui/button";

import {
  ChevronDownIcon,
  DownloadCloud,
  FilePlus,
  FilePlus2,
  Pencil,
  Plus,
  Upload,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import { clientJobUploadOptions } from "../../data/stops/stop-data";
import { useClientJobBundles } from "../../hooks/jobs/use-client-job-bundles";
import { ClientJobBundle } from "../../types.wip";
import { FileUploadModal } from "../file-upload-modal.wip";
import { StopAddSheet } from "./stop-add-sheet";

// import useTabOptions from "~/apps/solidarity-routing/hooks/use-tab-options";

const StopOptionBtn = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { stops, setStops, setStopSheetState, setActiveStopById } =
    useClientJobBundles();
  const { status } = useSession();

  const fileUploadOptions = useMemo(
    () =>
      clientJobUploadOptions({
        jobs: stops,
        setJobs: setStops,
        status,
      }),
    [stops, status, setStops]
  );

  // const {
  //   // handleCSVUpload,
  //   addNewItem,
  //   DatabaseSelect,
  //   handleAddFromDatabase,
  // } = useTabOptions(type);

  const closeSheetFirst = () => {
    setIsOpen(false);
  };

  return (
    <div className="z-30 flex items-center rounded-md border bg-white text-secondary-foreground">
      <StopAddSheet />

      <Separator orientation="vertical" className="h-[20px]" />
      <FileUploadModal<ClientJobBundle>
        {...fileUploadOptions}
        handleOnClick={closeSheetFirst}
      >
        <DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              size={"icon"}
              variant={"outline"}
              className="rounded-l-none border-0"
            >
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <FilePlus2 className="mr-2 h-4 w-4 " />
                Import from CSV
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </FileUploadModal>
    </div>
  );
};

export default StopOptionBtn;
