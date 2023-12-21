import { useMemo, type FC } from "react";

import { useStops } from "~/apps/solidarity-routing/hooks/use-stops";

import DepotCard from "~/apps/solidarity-routing/components/ui/depot-card";
import { parseDataFromStop } from "~/apps/solidarity-routing/libs/data-formatting";
import type { Stop } from "~/apps/solidarity-routing/types";

type TStopCard = { stop: Stop };

const StopCard: FC<TStopCard> = ({ stop }) => {
  const { setActiveLocation, activeLocation, setIsStopSheetOpen } = useStops(
    (state) => state
  );
  const { name, address } = useMemo(() => parseDataFromStop(stop), [stop]);

  const onEdit = () => {
    setActiveLocation(stop);
    setIsStopSheetOpen(true);
  };

  const isActive = useMemo(
    () => activeLocation?.id === stop.id,
    [activeLocation, stop]
  );

  return (
    <DepotCard
      isActive={isActive}
      title={name ?? "New Stop"}
      subtitle={address}
      onEdit={onEdit}
    />
  );
};

export default StopCard;
