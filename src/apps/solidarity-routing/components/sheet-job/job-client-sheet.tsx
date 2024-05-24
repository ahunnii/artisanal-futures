import StopForm from "~/apps/solidarity-routing/components/stops-section/stop-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/map-sheet";

import { Mail, MapPin } from "lucide-react";

import { useState } from "react";
import { Button } from "~/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { useClientJobBundles } from "~/apps/solidarity-routing/hooks/jobs/use-client-job-bundles";
import { useSolidarityState } from "~/apps/solidarity-routing/hooks/optimized-data/use-solidarity-state";
import type { ClientJobBundle } from "~/apps/solidarity-routing/types.wip";
import { api } from "~/utils/api";

import {
  JobDepotDataTable,
  JobDepotPreviousRouteSelect,
} from "~/apps/solidarity-routing/components/sheet-job";
const JobClientSheet = ({ standalone }: { standalone?: boolean }) => {
  const { depotId, sessionStatus } = useSolidarityState();
  const jobBundles = useClientJobBundles();

  const [selectedData, setSelectedData] = useState<ClientJobBundle[]>([]);
  const [date, setDate] = useState<Date>();

  const getStopsByDate = api.routePlan.getStopsByDate.useQuery(
    { date: date!, depotId },
    { enabled: !!date && !!depotId }
  );

  const title = jobBundles?.active
    ? `${
        jobBundles?.active?.client?.name ??
        `Job #${jobBundles?.active?.job?.id}`
      }`
    : "Add Stop";

  const areDepotOptionsVisible =
    jobBundles?.active === null &&
    sessionStatus === "authenticated" &&
    !standalone;

  const areStorageOptionsVisible =
    jobBundles?.active !== null ||
    sessionStatus === "unauthenticated" ||
    standalone;

  const assignPreviousJobsToRoute = () => {
    jobBundles?.createMany({
      jobs: selectedData,
      addToRoute: true,
    });
  };

  return (
    <Sheet
      open={jobBundles.isSheetOpen}
      onOpenChange={jobBundles.onSheetOpenChange}
    >
      <SheetContent
        side={"left"}
        className="radix-dialog-content flex w-full  max-w-full flex-col sm:w-full sm:max-w-full md:max-w-md lg:max-w-lg"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle className="text-center md:text-left">{title}</SheetTitle>
          <SheetDescription className="text-center md:text-left">
            {jobBundles?.active ? (
              <>
                <p className="flex w-full flex-1 flex-col border-b border-t py-4 text-sm">
                  <span className="flex items-center gap-2 font-light text-muted-foreground ">
                    <MapPin size={15} />{" "}
                    {jobBundles?.active.job.address?.formatted}
                  </span>

                  {jobBundles?.active?.client && (
                    <span className="flex items-center gap-2 font-light text-muted-foreground ">
                      <Mail size={15} /> {jobBundles?.active?.client?.email}
                    </span>
                  )}
                </p>
              </>
            ) : (
              "Fill out the table below to start adding destinations to the map."
            )}
          </SheetDescription>
        </SheetHeader>

        {/* Option 1: user is not logged in, can still add via session state */}

        {sessionStatus === "loading" && <p>Loading...</p>}

        {areDepotOptionsVisible && (
          <>
            <Tabs
              className="z-0 w-full"
              value={jobBundles?.sheetState}
              onValueChange={jobBundles?.setSheetState}
            >
              <TabsList className="flex w-full items-center justify-between">
                <TabsTrigger value="add-previous" className="flex-1">
                  Add Previous
                </TabsTrigger>
                <TabsTrigger value="create-new" className="flex-1">
                  Create New
                </TabsTrigger>
              </TabsList>

              <TabsContent value="add-previous">
                <div className="flex w-full flex-col  gap-3  border-b bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Button
                      className="flex-1"
                      onClick={assignPreviousJobsToRoute}
                    >
                      Update route jobs
                    </Button>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium text-muted-foreground">
                    Select a date to add previous stops
                  </h3>
                  <JobDepotPreviousRouteSelect date={date} setDate={setDate} />
                </div>

                {date && (
                  <JobDepotDataTable
                    storeData={jobBundles?.data}
                    data={getStopsByDate.data ?? []}
                    setSelectedData={setSelectedData}
                  />
                )}
              </TabsContent>
              <TabsContent value="create-new">
                <StopForm
                  handleOnOpenChange={jobBundles.onSheetOpenChange}
                  activeLocation={jobBundles.active}
                />
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Option 2: use is logged in and allows for user to select existing drivers
          as well as add new drivers to the database
        */}
        {areStorageOptionsVisible && (
          <StopForm
            handleOnOpenChange={jobBundles?.onSheetOpenChange}
            activeLocation={jobBundles?.active}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default JobClientSheet;
