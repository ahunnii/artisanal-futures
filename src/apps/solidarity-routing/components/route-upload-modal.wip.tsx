import { DialogTrigger } from "@radix-ui/react-dialog";
import { FilePlus } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

export const RouteUploadModal = ({
  // open,
  // setOpen,
  variant = "default",
}: {
  // open: boolean;
  variant?: "outline" | "default" | "secondary" | "ghost";

  // setOpen: (open: boolean) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} className="flex w-full items-center gap-2">
          <FilePlus className="h-5 w-5" /> Create a route using a spreadsheet
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create a route using a spreadsheet</DialogTitle>
          <DialogDescription>Here are the clients we found.</DialogDescription>
        </DialogHeader>

        <p>WIP</p>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
