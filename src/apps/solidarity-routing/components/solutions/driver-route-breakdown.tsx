import type { FC } from "react";

import RouteBreakdown from "~/apps/solidarity-routing/components/ui/cards/route-breakdown";

import { getColor } from "~/apps/solidarity-routing/libs/color-handling";
import type {
  ExpandedRouteData,
  ExtendedStepData,
} from "~/apps/solidarity-routing/types";
import { OptimizedRoutePath } from "../../types.wip";
import { OptimizedRouteHeaderCard } from "../ui/cards/optimized-route-header-card";

type TBreakdown = {
  data: OptimizedRoutePath;
  steps: ExtendedStepData[];
  textColor?: number;
};

const DriverRouteBreakdown: FC<TBreakdown> = ({ data, steps, textColor }) => {
  // const { address: startingAddress } = JSON.parse(data.description ?? "{}");

  const color = getColor(textColor!).background;

  return (
    <>
      <OptimizedRouteHeaderCard route={data} textColor={textColor} />
      <RouteBreakdown
        steps={steps}
        color={color}
        startingAddress={"startingAddress"}
      />
    </>
  );
};

export default DriverRouteBreakdown;
