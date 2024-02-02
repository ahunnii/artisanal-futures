import { useMemo, type FC } from "react";

import { useStops } from "~/apps/solidarity-routing/hooks/use-stops";

import DepotCard from "~/apps/solidarity-routing/components/ui/depot-card";

type TStopCard = { id: string; name: string; address: string };

const StopCard: FC<TStopCard> = ({ id, name, address }) => {
  const { activeLocation, setIsStopSheetOpen, setActiveLocationById } =
    useStops((state) => state);

  const onEdit = () => {
    setActiveLocationById(id);
    setIsStopSheetOpen(true);
  };

  const isActive = useMemo(
    () => activeLocation?.job.id === id,
    [activeLocation, id]
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
