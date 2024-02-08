import StopForm from "~/apps/solidarity-routing/components/stops/stop-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/map-sheet";

import { Home, Mail, MapPin } from "lucide-react";
import { Button } from "~/components/ui/button";
import { SheetTrigger } from "~/components/ui/sheet";
import { useClientJobBundles } from "../../hooks/jobs/use-client-job-bundles";

const StopSheet = ({ standalone }: { standalone?: boolean }) => {
  // const { activeStop, setActiveStopById, isStopSheetOpen, setStopSheetState } =
  //   useClientJobBundles();
  const jobs = useClientJobBundles();

  // const handleOnOpenChange = (state: boolean) => {
  //   if (!state) setActiveStopById(null);
  //   setStopSheetState(state);
  // };

  return (
    <Sheet open={jobs.isSheetOpen} onOpenChange={jobs.onSheetOpenChange}>
      {!standalone && (
        <SheetTrigger asChild>
          <Button variant="outline" className="border-0 px-3 shadow-none">
            <MapPin className="mr-2 h-4 w-4" />
            Add Stop
          </Button>
        </SheetTrigger>
      )}
      <SheetContent
        side={"left"}
        className="radix-dialog-content flex w-full  max-w-full flex-col sm:w-full sm:max-w-full md:max-w-md lg:max-w-lg"
      >
        <SheetHeader>
          <SheetTitle className="text-center md:text-left">
            {jobs.active
              ? `${
                  jobs.active?.client?.name ??
                  jobs.active?.job?.address?.formatted
                }`
              : "Add Stop"}
          </SheetTitle>
          <SheetDescription className="text-center md:text-left">
            {jobs.active ? (
              <>
                <div className="flex w-full flex-1 flex-col border-b border-t py-4 text-sm">
                  {/* <p className="flex items-center gap-2 text-black ">
                    <User size={15} /> {drivers.active.driver.name}
                  </p> */}
                  <p className="flex items-center gap-2 font-light text-muted-foreground ">
                    <MapPin size={15} /> {jobs.active.job.address?.formatted}
                  </p>
                  {/* <p className="flex items-center gap-2 font-light text-muted-foreground ">
                    <Phone size={15} />{" "}
                    {numberStringToPhoneFormat(drivers.active.driver.phone)}
                  </p> */}
                  <p className="flex items-center gap-2 font-light text-muted-foreground ">
                    <Mail size={15} /> {jobs?.active?.client?.email}
                  </p>
                </div>
              </>
            ) : (
              "Fill out the table below to start adding destinations to the map."
            )}
            {/* {jobs.active
              ? `Changes made will only apply to this route.`
              : "Fill out the table below to start adding destinations to the map."} */}
          </SheetDescription>
        </SheetHeader>

        <StopForm
          handleOnOpenChange={jobs.onSheetOpenChange}
          activeLocation={jobs.active}
        />
      </SheetContent>
    </Sheet>
  );
};

export default StopSheet;
