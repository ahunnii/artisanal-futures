import { useClientJobBundles } from "~/apps/solidarity-routing/hooks/jobs/use-client-job-bundles";
import type { ClientJobBundle } from "~/apps/solidarity-routing/types.wip";

type Props = { row: ClientJobBundle };
export const JobDepotEditOption = ({ row }: Props) => {
  const jobs = useClientJobBundles();

  const editPost = (id: string) => {
    jobs.edit(id);
  };

  return <p onClick={() => editPost(row.job.id)}>Edit</p>;
};
