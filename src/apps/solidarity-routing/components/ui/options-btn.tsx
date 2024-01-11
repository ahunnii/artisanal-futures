import { ReloadIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { Button } from "~/components/ui/button";

import { ChevronDownIcon, DownloadCloud, FilePlus, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";

import useTabOptions from "~/apps/solidarity-routing/hooks/use-tab-options";

const OptionsBtn = ({ type }: { type: "stop" | "driver" }) => {
  const { status } = useSession();

  const [isOpen, setIsOpen] = useState(false);

  const {
    populateFromDatabase,
    populateCustomerCSV,
    handleCSVUpload,
    addNewItem,
    isUserArtisan,
  } = useTabOptions(type);

  return (
    <div className="z-30 flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
      <Button
        variant="secondary"
        className="px-3 shadow-none"
        onClick={addNewItem}
      >
        {status !== "loading" && <Plus className="mr-2 h-4 w-4 " />}
        {status === "loading" && (
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        )}
        Add {type}
      </Button>
      <Separator orientation="vertical" className="h-[20px]" />
      <DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
        <DropdownMenuTrigger asChild>
          <ChevronDownIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem
              disabled={status === "loading"}
              className={"flex w-full cursor-pointer "}
              onClick={
                isUserArtisan ? populateCustomerCSV : populateFromDatabase
              }
            >
              <DownloadCloud className="mr-2 h-4 w-4 " />
              {isUserArtisan ? "Import from DB" : "Autofill Example"}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <label className={"flex w-full cursor-pointer "}>
                {" "}
                <FilePlus className="mr-2 h-4 w-4 " />
                Upload CSV file
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleCSVUpload}
                />
              </label>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default OptionsBtn;
