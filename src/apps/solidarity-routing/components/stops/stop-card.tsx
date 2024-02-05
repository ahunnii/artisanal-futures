import { useMemo, type FC } from "react";

import { useStopsStore } from "~/apps/solidarity-routing/hooks/use-stops-store";

import DepotCard from "~/apps/solidarity-routing/components/ui/depot-card";
import { useClientJobBundles } from "../../hooks/jobs/use-client-job-bundles";

type TStopCard = { id: string; name: string; address: string };

const StopCard: FC<TStopCard> = ({ id, name, address }) => {
  const { editStop, isStopActive } = useClientJobBundles();

  const onEdit = () => editStop(id);

  const isActive = useMemo(() => isStopActive(id), [isStopActive, id]);

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
