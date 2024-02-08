import { format } from "date-fns";
import { FilePlus, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Badge } from "~/components/ui/badge";
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

  const todayDate =
    format(date, "MMMM dd yyyy") === format(new Date(), "MMMM dd yyyy");

  const nthNumber = (number: number) => {
    if (number > 3 && number < 21) return "th";
    switch (number % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const [parent] = useAutoAnimate();
  const [another] = useAutoAnimate();
  return (
    <>
      <Card className="w-2/4">
        <CardHeader>
          <CardTitle>
            {todayDate
              ? "Today's"
              : `${format(date, "MMMM d")}${nthNumber(
                  Number(format(date, "d"))
                )}`}{" "}
            Overview
          </CardTitle>
          <CardDescription>
            {format(date, "MMMM dd yyyy")} * Depot{" "}
            {depotId as unknown as number} * No finalized routes yet
          </CardDescription>
        </CardHeader>
        <CardContent ref={parent}>
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
          <h3 className="pt-4 text-lg font-semibold">Routes</h3>
          {routes?.length === 0 && (
            <p className="text-muted-foreground">
              No routes found for this date
            </p>
          )}

          {routes && (
            <ul className="mt-4 flex flex-col" ref={another}>
              {routes?.length > 0 &&
                routes?.map((route) => (
                  <li
                    key={route.id}
                    className=" border-b border-t border-slate-100 py-2 odd:bg-slate-100 even:bg-white hover:bg-slate-200"
                  >
                    <Link
                      href={`/tools/solidarity-pathways/${depotId}/route/${route.id}`}
                      className="  "
                    >
                      <div>
                        <p className="text-lg">Route Plan #{route.id}</p>
                        <p className="">
                          {route.vehicles.length} vehicles and{" "}
                          {route.jobs.length} jobs.{" "}
                          <Badge className="">Draft</Badge>
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
            </ul>
          )}
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
