import { useMemo, type FC } from "react";

import { useDrivers } from "~/apps/solidarity-routing/hooks/use-drivers";

import DepotCard from "~/apps/solidarity-routing/components/ui/depot-card";
import { parseDataFromDriver } from "~/apps/solidarity-routing/libs/data-formatting";
import type { Driver } from "~/apps/solidarity-routing/types";

type TDriverCard = { driver: Driver };

const DriverCard: FC<TDriverCard> = ({ driver }) => {
  const { setActiveDriver, activeDriver, setIsDriverSheetOpen } = useDrivers(
    (state) => state
  );
  const { name } = useMemo(() => parseDataFromDriver(driver), [driver]);

  const onEdit = () => {
    setActiveDriver(driver);
    setIsDriverSheetOpen(true);
  };

  const isActive = useMemo(
    () => activeDriver?.id === driver.id,
    [activeDriver, driver]
  );

  return (
    <DepotCard
      isActive={isActive}
      title={name ?? "New Driver"}
      onEdit={onEdit}
    />
  );
};

export default DriverCard;
