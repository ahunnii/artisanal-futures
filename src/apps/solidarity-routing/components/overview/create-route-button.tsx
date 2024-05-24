import { useMemo } from "react";

import { FilePlus } from "lucide-react";

import { Button } from "~/components/ui/button";

import { FileUploadModal } from "~/apps/solidarity-routing/components/shared/file-upload-modal.wip";

import { clientJobUploadOptions } from "~/apps/solidarity-routing/data/stop-data";

import { useClientJobBundles } from "~/apps/solidarity-routing/hooks/jobs/use-client-job-bundles";

import type { ClientJobBundle } from "~/apps/solidarity-routing/types.wip";

export const CreateRouteButton = () => {
  const { data, createMany } = useClientJobBundles();

  const clientJobImportOptions = useMemo(() => {
    return clientJobUploadOptions({
      jobs: data,
      setJobs: createMany,
    });
  }, [data, createMany]);

  return (
    <FileUploadModal<ClientJobBundle> {...clientJobImportOptions}>
      <Button
        variant="outline"
        className="flex w-full flex-1 items-center gap-2"
      >
        <FilePlus className="h-5 w-5" /> Create a route using a spreadsheet
      </Button>
    </FileUploadModal>
  );
};
