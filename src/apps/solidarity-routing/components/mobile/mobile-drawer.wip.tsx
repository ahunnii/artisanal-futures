import { RouteStatus } from "@prisma/client";
import { 
  Check, 
  MessageSquare,
  LocateOffIcon,
  LocateFixedIcon,
  LocateIcon,
  MapPinIcon,
  MapIcon,
  ChevronFirstIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  XIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "~/components/ui/drawer";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useClientJobBundles } from "../../hooks/jobs/use-client-job-bundles";

import { notificationService } from "~/services/notification";
import { api } from "~/utils/api"; // ?

import { Separator } from "~/components/ui/separator";
import { cn } from "~/utils/styles";
import { useDriverVehicleBundles } from "../../hooks/drivers/use-driver-vehicle-bundles";
import { useOptimizedRoutePlan } from "../../hooks/optimized-data/use-optimized-route-plan";

import { useSolidarityMessaging } from "../../hooks/use-solidarity-messaging";
import type { OptimizedStop } from "../../types.wip";
import { getColor } from "../../utils/generic/color-handling";
import {
  cuidToIndex,
  metersToMiles,
  unixSecondsToStandardTime,
} from "../../utils/generic/format-utils.wip";
import { FieldJobSearch } from "../field-job-search.wip";

import { useMediaQuery } from "~/hooks/use-media-query";
import RouteBreakdown from "../route-plan-section/route-breakdown";

import { Expand, Locate } from "lucide-react";
import { useMapStore } from '~/apps/solidarity-routing/stores/use-map-store';

const notificationsFormSchema = z.object({
  status: z.nativeEnum(RouteStatus, {
    required_error: "You need to select a notification type.",
  }),
  deliveryNotes: z.string().optional(),
});

export type EditStopFormValues = z.infer<typeof notificationsFormSchema>;

export const MobileDrawer = ({}: // snap,
// setSnap,
{
  // snap: number | string | null;
  // setSnap: (snap: number | string | null) => void;
}) => {
  const { 
    flyToDriver, 
    setFlyToDriver, 
    constantTracking, 
    setConstantTracking,
    locationMessage // use-map.tsx uses setLocationMessage
  } = useMapStore();

  const toggleFlyToTimer = () => {
    console.log("Should be changing the button text!")
    setFlyToDriver(!flyToDriver)
  };

  const toggleConstantTracking = () => {
    setConstantTracking(!constantTracking)
  };

  const [snap, setSnap] = useState<number | string | null>(0.25);

  const optimizedRoutePlan = useOptimizedRoutePlan();
  const solidarityMessaging = useSolidarityMessaging();

  const [open, setOpen] = useState(false);

  const driverBundles = useDriverVehicleBundles();

  const driver = driverBundles.getVehicleById(
    optimizedRoutePlan?.data?.vehicleId
  );


  const apiContext = api.useContext();

  const updateStopStatus = api.routePlan.updateOptimizedStopState.useMutation({
    onSuccess: () => {
      notificationService.notifySuccess({
        message: "Stop status was successfully updated.",
      });
    },
    onError: (error: unknown) => {
      notificationService.notifyError({
        message: "There was an issue updating the stop status.",
        error,
      });
    },
    onSettled: () => {
      jobBundles.onFieldJobSheetOpen(false);
      void apiContext.routePlan.invalidate();
    },
  });

  const routeId = window.location.pathname.split("/routeId/")[1];
  const { data: routePlan } = useOptimizedRoutePlan(routeId);

  const jobBundles = useClientJobBundles();

  const jobsForRoute = routePlan?.stops.map(stop => {
    const jobBundle = jobBundles.data.find(jobBundle => jobBundle.job.id === stop.jobId);
    return jobBundle ? jobBundle.job : undefined;
  }).filter(job => job !== undefined);



  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const [hasPriorSuccess, setHasPriorSuccess] = useState(false);

  useEffect(() => {
    if (locationMessage.message === "success" && !locationMessage.error) {
      setHasPriorSuccess(true);
    }
  }, [locationMessage]);

  // Exporting a message for @map-view-button to display the Location Services state
  const exportLocationServiceMessage = () => {
    if (!constantTracking) {
      return "GPS";
    } 
    if (locationMessage.message.includes("initial")) {
      return "🏁 GPS";
    } else if (locationMessage.message.includes("timed out")) {
      return "GPS 👀 ";
    } else if (locationMessage.message.includes("success")) {
      if (!locationMessage.error && !hasPriorSuccess) {
        setHasPriorSuccess(true);
        return "GPS 🤷🏾 ";
      } else if (!locationMessage.error && hasPriorSuccess) {
        return "GPS 👍🏾";
      }
    } else {
      return "Locating GPS...";
    }
  };

  
  // routePlan?.stops?.forEach((stop, index) => {
  //   console.log(`Stop ${index + 1}:`, stop);
  // });

  const [carouselIndex, setCarouselIndex] = useState(0); // To track the current index of the carousel

  const currentJob = jobBundles.active?.job;

  // Assuming `route?.stops` is an array of stops for the route
  const route = optimizedRoutePlan?.data;  
  const totalStops = route?.stops?.length ?? 0; // Total number of stops

  // Function to move to the next stop
  const nextStop = () => {
    if (carouselIndex < totalStops) { // Check to prevent going beyond the last stop
      setCarouselIndex((carouselIndex + 1) % totalStops);
    }
  };

  // Function to move to the previous stop
  const prevStop = () => {
    setCarouselIndex((carouselIndex - 1 + totalStops) % totalStops);
  };

  const [selectedButton, setSelectedButton] = useState<{[key: number]: 'complete' | 'failed'}>({});

  const onSubmit = (status: 'COMPLETED' | 'FAILED' | 'PENDING', activeStop: OptimizedStop) => {
    const data: Partial<EditStopFormValues> = {
      status: status,
      deliveryNotes: activeStop?.notes ?? undefined,
    };
  
    if (activeStop) {
      updateStopStatus.mutate({
        state: status,
        stopId: activeStop.id,
        notes: data.deliveryNotes,
      });
    }
  };

  const renderCarouselContent = () => {
    const activeStop = routePlan?.stops[carouselIndex];
  
    const handleStopUpdate = (status: 'COMPLETED' | 'FAILED') => {
      if (activeStop?.jobId) {
        console.log(`Updating stop ${activeStop.jobId} to ${status}`);
        // Find the job related to the activeStop
        const job = jobsForRoute.find(job => job.id === activeStop.jobId);
        if (job) {
          // Assuming onSubmit can accept an object with both job and activeStop information
          onSubmit(status, { ...activeStop, job });
        } else {
          console.error("Job not found for activeStop", activeStop);
          // Handle the case where the job is not found
        }
      }
      // Update the selectedButton state for the current stop
      setSelectedButton(prevState => ({ ...prevState, [carouselIndex]: status === 'COMPLETED' ? 'complete' : 'failed' }));

      setTimeout(() => nextStop(), 1000);
  };

  
    return (
      <>
{activeStop?.type === 'break' ? (
  
  <div>
    <span className="text-sm font-medium text-gray-700 text-center w-full">
      <button onClick={() => handleStopUpdate('COMPLETED')}>Take a Break</button>
    </span>
  </div>

) : activeStop?.type === 'start' ? (

  <div className="flex flex-1 justify-center">
    <Button 
      size={"lg"}
      variant="ghost"
      className="w-full"
    >
      <span className="text-sm font-medium text-gray-700 text-center w-full">
       <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (optimizedRoutePlan?.data?.id) {
              optimizedRoutePlan.updateRoutePathStatus({
                pathId: optimizedRoutePlan.data.id,
                state: RouteStatus.IN_PROGRESS,
              });
            }
          }}
        >
        Start Driving
        </a>
      </span>
    </Button>
  </div>


  // <div>
  //   <a
  //     href="#"
  //     onClick={(e) => {
  //       e.preventDefault();
  //       if (optimizedRoutePlan?.data?.id) {
  //         optimizedRoutePlan.updateRoutePathStatus({
  //           pathId: optimizedRoutePlan.data.id,
  //           state: RouteStatus.IN_PROGRESS,
  //         });
  //       }
  //     }}
  //     style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
  //   >
  //     Start route
  //   </a>
  // </div>

) : activeStop?.type === 'end' ? (
  <div>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        if (optimizedRoutePlan?.data?.id) {
          optimizedRoutePlan.updateRoutePathStatus({
            pathId: optimizedRoutePlan.data.id,
            state: RouteStatus.COMPLETED,
          });
        }
      }}
      style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
    >
      Complete route
    </a>
  </div>
) : activeStop?.type !== 'end' ? ( // a typical stop

  <div className="flex flex-1 justify-center">
    <Button 
      size={"lg"}
      variant="ghost"
      className="border border-gray-300"
      style={{ backgroundColor: selectedButton[carouselIndex] === 'complete' ? 'lightgreen' : 'initial' }}
      onClick={() => handleStopUpdate('COMPLETED')}
    >
      <span className="text-sm font-medium text-gray-700 text-center w-full">
        Dropped Off
      </span>
    </Button>

    <Button 
      size={"lg"}
      variant="ghost"
      className="border border-gray-200"
      style={{ backgroundColor: selectedButton[carouselIndex] === 'failed' ? 'tomato' : 'initial' }}
      onClick={() => handleStopUpdate('FAILED')}      
    >
      <span className="text-sm font-medium text-gray-500 text-center w-full">
        Had an Issue
      </span>
    </Button>

  </div>


) : null}
      </>
    );
  };  

  const renderStopAddress = () => {
    const activeStop = routePlan?.stops[carouselIndex];
  
    let stopDetails = <div>Address not available</div>;
    if (activeStop?.jobId) {
      const job = jobsForRoute.find((job) => job.id === activeStop.jobId);
      if (job) {
        const clientName = job.client?.name;
        const address = job.address.formatted.split(',')[0] ?? "Address not available";
        stopDetails = clientName ? (
          <>
            <div style={{ fontSize: 'larger' }}>{clientName}</div>
            <div style={{ fontSize: 'smaller' }}>{address}</div>
          </>
        ) : (
          <div>{address}</div>
        );
      }
    } else {
      //stopDetails = <div>{activeStop?.type ?? "Stop type not available"}</div>;
      // I think we can let the renderCarouselContent handle
      // non stop related actions, like Start, Break, and End. Otherwise
      // we're kidn of duplicating information?
      stopDetails = ''; 
    }
  
    return (
      <div>
        {stopDetails}
      </div>
    );
  }

  // const renderStopAddress = () => {
  //   const activeStop = routePlan?.stops[carouselIndex]

  //   let stopAddress = "Address not available";
  //   if (activeStop?.jobId) {
  //     const job = jobsForRoute.find((job) => job.id === activeStop.jobId);
  //     if (job) {
  //       stopAddress = job.address.formatted.split(',')[0] ?? "Address not available";
  //     }
  //   }
  //   else {
  //     stopAddress = activeStop?.type ?? "Stop type not available";
  //   }

  //   return (
  //     <div>
  //       {stopAddress}
  //     </div>
  //   )
  // }

  return (
    <>
    {/*className="flex w-full bg-white lg:hidden"*/}

      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ width: '10%', textAlign: 'left' }}>
              <Button
              className={cn(
                locationMessage.error && "bg-red-150",
                locationMessage.message.includes("timed") && "animate-pulse"
              )}
              variant={constantTracking ? "secondary" : "default"}
              onClick={() => {
                toggleConstantTracking()
              }}
            >
              {exportLocationServiceMessage()}
            </Button>
          </div>


          <div style={{ flex: 1, textAlign: 'center' }}>
            {renderStopAddress()}
          </div>


          <div style={{ width: '10%', textAlign: 'right' }}>
            <Button
              className=""
              onClick={toggleFlyToTimer}
            >
            {flyToDriver ? <LocateFixedIcon/> : <LocateOffIcon />}
            </Button>
          </div>
        </div>

        {/* Carousel */}
        <div style={{ display: 'flex', width: '100%' }}>
          <div style={{ width: '10%', textAlign: 'center'}}>
            <Button
              size={"lg"}
              variant="ghost"
              className="flex-1"
            >
              <ChevronLeftIcon
                onClick={prevStop}
                className="h-6 w-6 text-gray-600"
              />
            </Button>
          </div>

          <div style={{ flex: 1, textAlign: 'center'}}>
            {renderCarouselContent()}
          </div>
          <div style={{ width: '10%', textAlign: 'center'}}>
            <Button
              size={"lg"}
              variant="ghost"
              className="flex-1"
            >
              <ChevronRightIcon
                onClick={nextStop}
                className="h-6 w-6 text-gray-600"
              />
            </Button>
          </div>
          <div style={{ width: '10%', textAlign: 'center'}}>
            <button>
              <MapIcon/>
            </button>
          </div>
        </div>
      </div>

      <div className="w-full bg-white lg:hidden"> 



        {/* <Button
          size={"lg"}
          variant="ghost"
          className="flex-1"
          onClick={() => setOpen(true)}
        >
 
          <p className="text-sm font-normal text-muted-foreground">
            Shift: {unixSecondsToStandardTime(route?.startTime ?? 0)} -{" "}
            {unixSecondsToStandardTime(route?.endTime ?? 0)} •{" "}
            {route?.stops?.length} stops •{" "}
            {Math.round(metersToMiles(route?.distance ?? 0))}mi
          </p>

        </Button> */}

        {/* <FieldJobSearch isIcon={true} />{" "} */}



      </div>
      <Drawer
        snapPoints={[0.1, 0.25, 0.75, 1]}
        activeSnapPoint={snap}
        setActiveSnapPoint={setSnap}
        open={isDesktop ? false : open}
        // dismissible={false}
        modal={false}
        onOpenChange={setOpen}
      >
        <DrawerContent
          className="h-screen"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className="mx-auto w-full max-w-sm">


            <DrawerHeader className="flex flex-1 items-center justify-between">
              {snap === 0.1 ? (
                <>
                  <p className="text-sm font-normal text-muted-foreground">
                    Shift: {unixSecondsToStandardTime(route?.startTime ?? 0)} -{" "}
                    {unixSecondsToStandardTime(route?.endTime ?? 0)} •{" "}
                    {route?.stops?.length} stops •{" "}
                    {Math.round(metersToMiles(route?.distance ?? 0))}mi
                  </p>
                  <FieldJobSearch isIcon={true} />{" "}

                </>
              ) : (
                <FieldJobSearch isIcon={false} />
              )}
              {/* <FieldJobSearch isIcon={false} /> */}

              {/* <Button
                size="icon"
                variant={"ghost"}
                className="font-normal text-muted-foreground "
              >
                <MoreVertical className="h-4 w-4" />
              </Button> */}
            </DrawerHeader>

            <div
              className={cn(
                "mx-auto flex h-[50vh] w-full max-w-md flex-col px-4  pb-4",
                {
                  "overflow-y-auto": snap === 1,
                  "overflow-hidden": snap !== 1,
                }
              )}
            >
              <p className="text-xs font-normal text-muted-foreground">
                Shift: {unixSecondsToStandardTime(route?.startTime ?? 0)} -{" "}
                {unixSecondsToStandardTime(route?.endTime ?? 0)} •{" "}
                {route?.stops?.length} stops •{" "}
                {Math.round(metersToMiles(route?.distance ?? 0))}mi
              </p>
              <h2 className="text-xl font-semibold">
                {optimizedRoutePlan.routeDetails?.deliveryAt.toDateString() ??
                  ""}
              </h2>
              <div className="flex py-1">
                {/* <Button className="flex items-center gap-2" variant={"outline"}>
                  <Car />
                  Load vehicle
                </Button> */}


                {/* 
<Button
              className="flex flex-1 gap-2"
              variant={"outline"}
              onClick={() => driverBundles.message(data.vehicleId)}
            >
              <MessageCircle /> Send Message to {driver?.driver?.name}
            </Button> */}

                <Button
                  variant="outline"
                  className="px-3 shadow-none"
                  disabled={!driver?.driver?.email}
                  onClick={() => {
                    console.log(driver?.driver?.email);
                    if (!driver?.driver?.email) return;
                    solidarityMessaging.messageDepot(driver?.driver?.email);
                  }}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Open Messaging
                </Button>
              </div>

              <Separator className="my-4" />
              {optimizedRoutePlan.data && (
                <RouteBreakdown
                  className="h-96 flex-none pb-5"
                  steps={optimizedRoutePlan.data.stops as OptimizedStop[]}
                  driver={driver}
                  color={
                    getColor(cuidToIndex(optimizedRoutePlan.data.vehicleId))
                      .background
                  }
                />
              )}
            </div>

            <DrawerFooter>
              {optimizedRoutePlan?.data?.status === RouteStatus.NOT_STARTED && (
                <Button
                  onClick={() => {
                    if (optimizedRoutePlan?.data?.id)
                      optimizedRoutePlan.updateRoutePathStatus({
                        pathId: optimizedRoutePlan.data.id,
                        state: RouteStatus.IN_PROGRESS,
                      });
                  }}
                >
                  Start route
                </Button>
              )}

              {optimizedRoutePlan?.data?.status === RouteStatus.IN_PROGRESS && (
                <Button
                  onClick={() => {
                    if (optimizedRoutePlan?.data?.id)
                      optimizedRoutePlan.updateRoutePathStatus({
                        pathId: optimizedRoutePlan.data.id,
                        state: RouteStatus.COMPLETED,
                      });
                  }}
                >
                  <Check /> Mark route as complete
                </Button>
              )}

              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
