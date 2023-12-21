import { type Card } from "~/components/ui/card";

import RouteBreakdown from "./route-breakdown";
import RouteHeaderCard from "./route-header-card";

import { getColor } from "~/utils/routing/color-handling";

import type { ExpandedRouteData, ExtendedStepData, StepData } from "../types";

interface CardProps extends React.ComponentProps<typeof Card> {
  data: ExpandedRouteData;
  handleOnStopClick?: (stop: StepData | null) => void;
}

interface MinimalCardProps extends CardProps {
  textColor?: number;
  isOnline?: boolean;
  isTracking?: boolean;
  steps: ExtendedStepData[];
  isButton?: boolean;
}

export function DriverRouteBreakdown({
  data,
  steps,
  textColor,
}: MinimalCardProps) {
  const { address: startingAddress } = JSON.parse(data.description ?? "{}");

  const color = getColor(textColor!).background;

  return (
    <>
      {/* <div className="flex w-full items-center justify-between pr-5"> */}
      <RouteHeaderCard data={data} textColor={textColor} />
      {/* <DriverDispatchMessaging recipient="Dispatch" route={data} />
      </div> */}
      <RouteBreakdown
        steps={steps}
        color={color}
        startingAddress={startingAddress}
      />
    </>
  );
}
