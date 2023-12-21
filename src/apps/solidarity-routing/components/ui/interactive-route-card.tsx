// import type { FC } from "react";

// import {
//   Sheet,
//   SheetContent,
//   SheetFooter,
//   SheetHeader,
// } from "~/components/ui/map-sheet";

// import { Check } from "lucide-react";
// import type { ExpandedRouteData } from "~/apps/solidarity-routing/types";
// import RouteBreakdown from "~/components/tools/routing/solutions/route-breakdown";
// import RouteHeaderCard from "~/components/tools/routing/solutions/route-header-card";
// import { Button } from "~/components/ui/button";
// import { Card } from "~/components/ui/card";
// import { RouteQRDialog } from "../dialogs/qr/route-qr-dialog";

// type TCardProps =
//   | {
//       textColor?: number;
//       isOnline?: boolean;
//       isTracking?: boolean;
//       data: ExpandedRouteData;
//     } & React.ComponentProps<typeof Card>;

// const InteractiveRouteCard: FC<TCardProps> = ({
//   textColor,
//   isOnline,
//   isTracking,
//   className,
//   data,
// }) => {
//   return (
//     <>
//       <Button
//         variant={"ghost"}
//         className="my-2 ml-auto  flex h-auto  w-full p-0 text-left"
//         onClick={handleOnOpen}
//       >
//         <Card className={cn("w-full hover:bg-slate-50", className)} {...props}>
//           <RouteHeaderCard
//             data={data}
//             textColor={textColor}
//             isButton={true}
//             isOnline={isOnline}
//           />
//         </Card>
//       </Button>
//       <Sheet onOpenChange={handleOnOpenChange} open={onOpen}>
//         <SheetContent className="radix-dialog-content flex w-full  max-w-full flex-col sm:w-full sm:max-w-full md:max-w-md lg:max-w-lg">
//           <SheetHeader className="text-left">
//             <RouteHeaderCard
//               data={data}
//               textColor={textColor}
//               className="shadow-none"
//             />
//           </SheetHeader>
//           <RouteBreakdown
//             steps={routeSteps}
//             color={color}
//             startingAddress={startingAddress}
//           />
//           <SheetFooter>
//             {isTracking ? (
//               <Button
//                 className={cn(
//                   "flex w-full items-center gap-1",
//                   routeStatus && "bg-green-500"
//                 )}
//                 onClick={archiveRouteAndRefetch}
//               >
//                 <Check className="h-5 w-5 " />
//                 Mark Route as Complete
//               </Button>
//             ) : (
//               <RouteQRDialog data={data} />
//             )}{" "}
//           </SheetFooter>
//         </SheetContent>
//       </Sheet>
//     </>
//   );
// };
