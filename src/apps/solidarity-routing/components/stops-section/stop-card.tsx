import { useMemo, type FC } from "react";

import DepotCard from "~/apps/solidarity-routing/components/shared/depot-card";
import { useClientJobBundles } from "../../hooks/jobs/use-client-job-bundles";

type TStopCard = { id: string; name: string; address: string };

const StopCard: FC<TStopCard> = ({ id, name, address }) => {
  const { edit, isActive } = useClientJobBundles();

  const onJobEdit = () => edit(id);

  const isJobActive = useMemo(() => isActive(id), [isActive, id]);

  return (
    <DepotCard
      isActive={isJobActive}
      title={name ?? "New Stop"}
      subtitle={address}
      onEdit={onJobEdit}
    />
  );
};

export default StopCard;
