import { format } from "date-fns";
import { FilePlus, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/utils/api";
import { RouteUploadModal } from "./route-upload-modal.wip";

export type FileUploadHandler = (
  event: React.ChangeEvent<HTMLInputElement>
) => void;

export const HomePageOverviewCard = ({ date }: { date: Date }) => {
  const params = useParams();
  const router = useRouter();
  const depotId = params?.depotId as string;

  const { mutate: createRoute } = api.routePlan.createRoutePlan.useMutation({
    onSuccess: (data) => {
      toast.success("Route created!");
      router.push(`/tools/solidarity-pathways/${depotId}/route/${data.id}`);
    },
    onError: (error) => {
      toast.error("There was an error creating the route. Please try again.");
      console.error(error);
    },
    onSettled: () => {
      console.log("settled");
    },
  });

  const { data: routes } = api.routePlan.getRoutePlansByDate.useQuery({
    date,
    depotId: Number(params.depotId),
  });

  return (
    <>
      <Card className="w-2/4">
        <CardHeader>
          <CardTitle>Today&apos;s Overview</CardTitle>
          <CardDescription>
            {format(date, "MMMM dd yyyy")} * Depot{" "}
            {depotId as unknown as number} * No finalized routes yet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full  flex-col  items-center gap-4 ">
            <RouteUploadModal variant="default" />

            <Button
              className="w-full  gap-2"
              variant={"outline"}
              onClick={() =>
                createRoute({ depotId: Number(params.depotId), date })
              }
            >
              <Plus /> Manually create a route
            </Button>
          </div>

          {routes &&
            routes?.length > 0 &&
            routes?.map((route) => (
              <Link
                key={route.id}
                href={`/tools/solidarity-pathways/${depotId}/route/${route.id}`}
              >
                {route.id}
              </Link>
            ))}
          <div className="mt-10 flex  w-full  flex-col items-center gap-4">
            <p>
              Need help with your spreadsheet formatting? Check out our guide on
              it here, or click here for a sample file.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
