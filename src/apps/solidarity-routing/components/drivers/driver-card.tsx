import { useMemo, type FC } from "react";

import DepotCard from "~/apps/solidarity-routing/components/ui/depot-card";

import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";

type TDriverCard = { id: string; name: string };

const DriverCard: FC<TDriverCard> = ({ id, name }) => {
  const drivers = useDriverVehicleBundles();

  const onEdit = () => drivers.edit(id);

  const isActive = useMemo(() => drivers.isActive(id), [drivers, id]);

  return (
    <DepotCard
      isActive={isActive}
      title={name ?? "New Driver"}
      onEdit={onEdit}
    />
  );
};

export default DriverCard;
