import { useMemo, type FC } from "react";

import DepotCard from "~/apps/solidarity-routing/components/shared/depot-card";
import { useClientJobBundles } from "../../hooks/jobs/use-client-job-bundles";

type TStopCard = { id: string; name: string; address: string };

const StopCard: FC<TStopCard> = ({ id, name, address }) => {
  const jobs = useClientJobBundles();

  const onEdit = () => jobs.edit(id);

  const isActive = useMemo(() => jobs.isActive(id), [jobs, id]);

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
