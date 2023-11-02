import { Car, Home } from "lucide-react";
import { useState, type ReactNode } from "react";
import FileUpload from "~/components/tools/routing/ui/FileUpload";
import TabOptions from "~/components/tools/routing/ui/tab_options";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { useDrivers } from "~/hooks/routing/use-drivers";
import { useStops } from "~/hooks/routing/use-stops";
import { api } from "~/utils/api";
import { DriverInitForm } from "../drivers/driver-init-form";

const AddInfoSheet = ({
  type,
  children,
}: {
  type: "stop" | "driver";
  children: ReactNode;
}) => {
  //   const { locations, activeLocation } = useStops((state) => state);
  //   const { drivers, activeDriver } = useDrivers((state) => state);

  const { data: depotDrivers } = api.driver.getCurrentDepotDrivers.useQuery();

  const [isOpen, setIsOpen] = useState(false);

  const [addDriver, setAddDriver] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="flex-1">
        <Card className="flex-1 cursor-pointer bg-transparent hover:bg-accent">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Add {type} {type === "driver" ? <Car /> : <Home />}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {type === "driver" && depotDrivers && depotDrivers?.length > 0
              ? `You currently have ${depotDrivers?.length} ${type}s to choose from. Click here to
                add more to your depot`
              : `Look's like you have no ${type}s to choose from. Click here to
                add your ${type}s.`}
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add {type}s</SheetTitle>
          <SheetDescription>
            <div className="flex w-full flex-col space-y-4">
              <Button onClick={() => setAddDriver((value) => !value)}>
                Add available driver to depot
              </Button>
              <Button>Import from database</Button>
            </div>

            {addDriver && <DriverInitForm callback={() => setIsOpen(false)} />}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default AddInfoSheet;
