import { useMemo, useState } from "react";

import { Button } from "~/components/ui/button";

import { ChevronDownIcon, FilePlus2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import { clientJobUploadOptions } from "../../data/stop-data";
import { useClientJobBundles } from "../../hooks/jobs/use-client-job-bundles";
import type { ClientJobBundle } from "../../types.wip";
import { FileUploadModal } from "../shared/file-upload-modal.wip";

import { JobClientSheetBtn } from "../sheet-job/job-client-sheet-btn";

const StopOptionBtn = () => {
  const [isOpen, setIsOpen] = useState(false);
  const jobs = useClientJobBundles();

  const fileUploadOptions = useMemo(
    () =>
      clientJobUploadOptions({
        jobs: jobs.data,
        setJobs: jobs.createMany,
      }),
    [jobs]
  );

  const closeSheetFirst = () => {
    setIsOpen(false);
  };

  return (
    <div className="z-30 flex w-auto  items-center justify-between rounded-md border bg-white text-secondary-foreground">
      <JobClientSheetBtn />

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
              className="rounded-l-none border-0 "
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
