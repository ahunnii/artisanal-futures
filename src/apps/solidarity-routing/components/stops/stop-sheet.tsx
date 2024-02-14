import StopForm from "~/apps/solidarity-routing/components/stops/stop-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/map-sheet";

import { Mail, MapPin } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "~/components/ui/button";

import { SheetTrigger } from "~/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/utils/api";
import { useClientJobBundles } from "../../hooks/jobs/use-client-job-bundles";
import type { ClientJobBundle } from "../../types.wip";
import { JobDepotSelect } from "./job-depot-select";
import { PickJobsByDateBtn } from "./pick-jobs-by-date-btn.wip";
const StopSheet = ({ standalone }: { standalone?: boolean }) => {
  const jobs = useClientJobBundles();

  const [, setSelectedData] = useState<ClientJobBundle[]>([]);
  const [tabValue, setTabValue] = useState<string>("account");

  const { status } = useSession();
  const router = useRouter();
  const { depotId } = router.query;

  const [date, setDate] = useState<Date>();

  const getStopsByDate = api.routePlan.getStopsByDate.useQuery(
    {
      date: date!,
      depotId: Number(depotId),
    },
    {
      enabled: !!date,
    }
  );

  return (
    <Sheet open={jobs.isSheetOpen} onOpenChange={jobs.onSheetOpenChange}>
      {!standalone && (
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="w-full whitespace-nowrap border-0 px-3 shadow-none"
          >
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
                  jobs.active?.client?.name ?? `Job #${jobs.active?.job?.id}`
                  // jobs.active?.job?.address?.formatted
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
                  {jobs?.active?.client && (
                    <p className="flex items-center gap-2 font-light text-muted-foreground ">
                      <Mail size={15} /> {jobs?.active?.client?.email}
                    </p>
                  )}
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

        {/* Option 1: user is not logged in, can still add via session state */}

        {status === "loading" && <p>Loading...</p>}

        {jobs?.active === null && status === "authenticated" && !standalone && (
          <>
            <Tabs
              defaultValue="account"
              className="z-0 w-full"
              value={tabValue}
              onValueChange={setTabValue}
            >
              <div className="flex w-full items-center justify-between">
                <TabsList>
                  <TabsTrigger value="account">Add Previous</TabsTrigger>
                  <TabsTrigger value="password">Create New</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="account">
                <div className="flex w-full flex-col  gap-3  border-b bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Button
                      className="flex-1"
                      onClick={() => {
                        // drivers.assign({
                        //   drivers: selectedData,
                        // });
                      }}
                    >
                      Update route jobs
                    </Button>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium text-muted-foreground">
                    Select a date to add previous stops
                  </h3>
                  <PickJobsByDateBtn date={date} setDate={setDate} />
                </div>

                {date && (
                  <JobDepotSelect
                    storeData={jobs.data}
                    data={getStopsByDate.data ?? []}
                    setSelectedData={setSelectedData}
                  />
                )}
              </TabsContent>
              <TabsContent value="password">
                <StopForm
                  handleOnOpenChange={jobs.onSheetOpenChange}
                  activeLocation={jobs.active}
                />
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Option 2: use is logged in and allows for user to select existing drivers
          as well as add new drivers to the database
        */}
        {(jobs?.active !== null ||
          status === "unauthenticated" ||
          standalone) && (
          <StopForm
            handleOnOpenChange={jobs.onSheetOpenChange}
            activeLocation={jobs.active}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default StopSheet;
