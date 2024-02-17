import { MapPin } from "lucide-react";
import type { FC } from "react";

import { clientJobUploadOptions } from "../../data/stop-data";
import { useCreateJob } from "../../hooks/jobs/CRUD/use-create-job";
import { useReadJob } from "../../hooks/jobs/CRUD/use-read-job";
import type { ClientJobBundle, UploadOptions } from "../../types.wip";
import { FileUploadModal } from "../shared/file-upload-modal.wip";
import {
  HomePageOverviewImportBtn,
  type HomePageImportBtnProps,
} from "../shared/homepage-overview-import-btn";

type UploadButtonOptions<T> = {
  button: HomePageImportBtnProps;
  fileUpload: UploadOptions<T> | null;
};

export const HomepageJobImportCard: FC = () => {
  const { routeJobs, depotClients } = useReadJob();
  const { createNewJobs } = useCreateJob();

  const jobImportButtonProps = {
    button: {
      Icon: MapPin,
      caption: "Add your stops from spreadsheet",
      isProcessed: depotClients.length > 0,
    },
    fileUpload: clientJobUploadOptions({
      jobs: routeJobs,
      setJobs: createNewJobs,
    }),
  } as UploadButtonOptions<ClientJobBundle>;

  return (
    <FileUploadModal<ClientJobBundle> {...jobImportButtonProps.fileUpload!}>
      <span>
        <HomePageOverviewImportBtn {...jobImportButtonProps.button} />
      </span>
    </FileUploadModal>
  );
};
