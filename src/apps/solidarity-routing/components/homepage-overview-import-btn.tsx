import { ReloadIcon } from "@radix-ui/react-icons";

import { CheckCircleIcon } from "lucide-react";

import { forwardRef } from "react";

import { Input } from "~/components/ui/input";

import { cn } from "~/utils/styles";
import type { UploadButtonProps } from "./homepage-onboarding.wip";

export const HomePageOverviewImportBtn = forwardRef<
  HTMLInputElement,
  UploadButtonProps
>(({ Icon, caption, handleFileUpload, isProcessed, isProcessing }, ref) => {
  return (
    <>
      <label
        className={cn(
          "relative flex w-full cursor-default flex-col items-center rounded-xl border  bg-muted text-card-foreground shadow transition-colors first-line:p-6 sm:p-10",
          !isProcessed && "cursor-pointer bg-card hover:bg-muted/50"
        )}
      >
        {isProcessing && <ReloadIcon className="h-10 w-10 animate-spin" />}

        {!isProcessed && (
          <Input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
            ref={ref}
          />
        )}

        {!isProcessing && <Icon className="h-10 w-10" />}

        {isProcessed && (
          <CheckCircleIcon className="h-15 w-15 absolute right-3 top-3 fill-green-500 text-white" />
        )}

        <p className="mt-2 text-center font-medium">{caption}</p>
      </label>
    </>
  );
});

HomePageOverviewImportBtn.displayName = "HomePageOverviewImportBtn";
