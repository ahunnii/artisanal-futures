import { ReloadIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { type FC, type HTMLAttributes } from "react";

import { Button } from "~/components/ui/button";

import useTabOptions from "~/hooks/routing/use-tab-options";

import { cn } from "~/utils/styles";

import UploadBtn from "./upload-btn";

type TTabOptions = HTMLAttributes<HTMLDivElement> & { type: "stop" | "driver" };

const TabOptions: FC<TTabOptions> = ({ type, className }) => {
  const { status } = useSession();

  const {
    populateFromDatabase,
    populateCustomerCSV,
    handleCSVUpload,
    addNewItem,
    isUserArtisan,
  } = useTabOptions(type);

  return (
    <div
      className={cn(
        "mx-auto my-2 flex w-full items-center justify-center gap-4 bg-white p-3 shadow ",
        className
      )}
    >
      <Button onClick={addNewItem} className="basis-1/3 capitalize">
        Add {type}
      </Button>

      <Button
        variant={"secondary"}
        className="basis-1/3 "
        onClick={isUserArtisan ? populateCustomerCSV : populateFromDatabase}
        disabled={status === "loading"}
      >
        {status === "loading" && (
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        )}
        {isUserArtisan ? "Import " : "Autofill"}
      </Button>

      <UploadBtn handleOnChange={handleCSVUpload} className="basis-1/3 " />
    </div>
  );
};

export default TabOptions;
