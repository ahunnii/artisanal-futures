import { useMemo, type FC } from "react";

import { DepotCard } from "~/apps/solidarity-routing/components/shared";

import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";

type Props = {
  id: string;
  name: string;
};

export const DriverCard: FC<Props> = ({ id, name }) => {
  const { edit, isActive } = useDriverVehicleBundles();

  const onDriverEdit = () => edit(id);

  const isDriverActive = useMemo(() => isActive(id), [isActive, id]);

  return (
    <DepotCard
      isActive={isDriverActive}
      title={name ?? "Route Driver"}
      onEdit={onDriverEdit}
    />
  );
};
