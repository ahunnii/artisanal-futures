"use client";

import type { DialogProps } from "@radix-ui/react-dialog";

import * as React from "react";

import { Dialog, DialogContent } from "~/components/ui/dialog";

import { Command } from "~/components/ui/command";

const CommandAdvancedDialog = ({
  children,
  shouldFilter,
  ...props
}: DialogProps & {
  shouldFilter?: boolean;
}) => {
  return (
    <Dialog {...props}>
      <DialogContent className="w-full max-w-[640px] overflow-hidden p-0 shadow-lg">
        <Command
          shouldFilter={shouldFilter}
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
        >
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export { CommandAdvancedDialog };
