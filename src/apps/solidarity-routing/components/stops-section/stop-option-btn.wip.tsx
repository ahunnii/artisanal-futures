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

import { LocallineFileUploadModal } from '../shared/localline-upload-modal.wip';
import { FileUploadModal } from "../shared/file-upload-modal.wip";

import { JobClientSheetBtn } from "../sheet-job/job-client-sheet-btn";

const StopOptionBtn = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('none');
  const [showModal, setShowModal] = useState(false);

  const jobs = useClientJobBundles();

  const fileUploadOptions = useMemo(
    () =>
      clientJobUploadOptions({
        jobs: jobs.data,
        setJobs: jobs.createMany,
      }),
    [jobs]
  );

  const handleOpenModal = () => {
    console.log("Opening modal for option:", selectedOption, showModal);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log("Closing modal");
    setShowModal(false);
    setSelectedOption('none'); // Reset selection on modal close
  };
 
  const closeSheetFirst = () => {
    setIsOpen(false);
  };

  return (
    <div className="z-30 flex w-auto items-center justify-between rounded-md border bg-white text-secondary-foreground">
      <JobClientSheetBtn />

      <DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="outline" className="rounded-l-none border-0">
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem 
              onSelect={() => {
                console.log("Selected option: default");
                setSelectedOption('default');
                handleOpenModal();
              }}
            >
              <FilePlus2 className="mr-2 h-4 w-4" />
              Import Solidarity Routing formatted data
            </DropdownMenuItem>
            <DropdownMenuItem 
              onSelect={() => {
                console.log("Selected option: localline");
                setSelectedOption('localline');
                handleOpenModal();
              }}
            >
              <FilePlus2 className="mr-2 h-4 w-4" />
              Import from &nbsp; <em>Localline.ca</em>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Conditional rendering of the appropriate modal based on the selected option */}
      {showModal && selectedOption === 'localline' && (
        <LocallineFileUploadModal<ClientJobBundle>
         {...fileUploadOptions}
         handleOnClick={closeSheetFirst}
        >
          &nbps;
        </LocallineFileUploadModal>
      )}
      
      {showModal && selectedOption === 'default' && (
        <FileUploadModal<ClientJobBundle>
         {...fileUploadOptions}
         handleOnClick={closeSheetFirst}
         isOpen={showModal}
        >
        <div style={{ width: '0px', height: '0px' }}></div>
        </FileUploadModal>
      )}
    </div>
  );
};

export default StopOptionBtn;


//   <FileUploadModal<ClientJobBundle>
//   {...fileUploadOptions}
//   handleOnClick={closeSheetFirst}
// >


//   return (
//     <div className="z-30 flex w-auto  items-center 
//       <JobClientSheetBtn />

//       <Separator orientation="vertical" className="h-[20px]
//       <FileUploadModal<ClientJobBundle>
//         {...fileUploadOptions}
//         handleOnClick={closeSheetFirst}
//       >
//         <DropdownMenu onOpenChange={setIsOpen} open={isOpen}
//           <DropdownMenuTrigger asChild>
//             <Button
//               size={"icon"}
//               variant={"outline"}
//               className="rounded-l-none border-0 "
//             >
//               <ChevronDownIcon className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent className="w-56">
//             <DropdownMenuGroup>
//               <DropdownMenuItem>
//                 <FilePlus2 className="mr-2 h-4 w-4 " />
//                 Import from CSV
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <FilePlus2 className="mr-2 h-4 w-4 " />
//                 Import from &nbsp; <em>Localline.ca</em>
//               </DropdownMenuItem>
//             </DropdownMenuGroup>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </FileUploadModal>
//     </div>
//   );
// };

// export default StopOptionBtn;
