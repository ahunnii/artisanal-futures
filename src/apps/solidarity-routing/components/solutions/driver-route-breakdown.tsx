import type { FC } from "react";

import RouteBreakdown from "~/apps/solidarity-routing/components/ui/cards/route-breakdown";
import RouteHeaderCard from "~/apps/solidarity-routing/components/ui/cards/route-header-card";
import { getColor } from "~/apps/solidarity-routing/libs/color-handling";
import type {
  ExpandedRouteData,
  ExtendedStepData,
} from "~/apps/solidarity-routing/types";

type TBreakdown = {
  data: ExpandedRouteData;
  steps: ExtendedStepData[];
  textColor?: number;
};

const DriverRouteBreakdown: FC<TBreakdown> = ({ data, steps, textColor }) => {
  const { address: startingAddress } = JSON.parse(data.description ?? "{}");

  const color = getColor(textColor!).background;

  return (
    <>
      <RouteHeaderCard data={data} textColor={textColor} />
      <RouteBreakdown
        steps={steps}
        color={color}
        startingAddress={startingAddress}
      />
    </>
  );
};

export default DriverRouteBreakdown;
