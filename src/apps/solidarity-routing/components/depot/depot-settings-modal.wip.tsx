import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import DepotForm from "./depot-form.wip";

export function DepotSettingsModal() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Depot</Button>
      </DialogTrigger>
      <DialogContent className="h-3/4">
        <DialogHeader>
          <DialogTitle>Edit depot</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <div className="h-full overflow-scroll">
          <DepotForm handleOnOpenChange={setOpen} activeDriver={null} />
        </div>

        <DialogFooter>
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
