import { useMemo, type FC } from "react";

import DepotCard from "~/apps/solidarity-routing/components/ui/depot-card";

import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";

type TDriverCard = { id: string; name: string };

const DriverCard: FC<TDriverCard> = ({ id, name }) => {
  const driverBundles = useDriverVehicleBundles();

  const onEdit = () => driverBundles.edit(id);

  const isActive = useMemo(
    () => driverBundles.isActive(id),
    [driverBundles, id]
  );

  return (
    <DepotCard
      isActive={isActive}
      title={name ?? "Route Driver"}
      onEdit={onEdit}
    />
  );
};

export default DriverCard;
