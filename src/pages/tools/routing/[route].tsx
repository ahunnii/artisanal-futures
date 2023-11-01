import { env } from "~/env.mjs";

import dynamic from "next/dynamic";
import Pusher from "pusher-js";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useState,
  type FC,
} from "react";

import ToolLayout from "~/layouts/tool-layout";
import { supabase } from "~/server/supabase/client";

import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";
import type { GetServerSidePropsContext } from "next";
import { Beforeunload } from "react-beforeunload";
import { SimplifiedRouteCard } from "~/components/tools/routing/solutions/route-card";
import type { RouteData, StepData } from "~/components/tools/routing/types";
import { Button } from "~/components/ui/button";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

import StopDetails from "~/components/tools/routing/tracking/stop-details";

import { parseIncomingDBData } from "~/utils/routing/file-handling";

interface IProps {
  data: RouteData;
  steps: StepData[];
}

const DynamicMapWithNoSSR = dynamic(
  () => import("~/components/tools/routing/map/TempMap"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

const RoutePage: FC<IProps> = ({ data, steps }) => {
  const [, setActiveUsers] = useState([]);
  const [enableTracking, setEnableTracking] = useState(false);

  const [open, setOpen] = useState(false);

  const { route } = useParams();
  const { data: session } = useSession();

  useEffect(() => {
    const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: "us2",
    });
    const channel = pusher.subscribe("map");

    channel.bind("update-locations", setActiveUsers);

    return () => {
      pusher.unsubscribe("map");
    };
  }, []);

  const triggerActiveUser = () => {
    if (!navigator.geolocation) {
      console.log("Your browser doesn't support the geolocation feature!");
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude, accuracy } = position.coords;
      axios
        .post("/api/update-location", {
          userId: session?.user?.id ?? 0,
          latitude,
          longitude,
          accuracy,
          fileId: route,
          route: data,
        })
        .then(() => {
          setEnableTracking(true);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  const [selected, setSelected] = useState<StepData | null>(null);

  const handleOnStopClick = useCallback((data: StepData | null) => {
    setSelected(data);
    setOpen(true);
  }, []);
  return (
    <ToolLayout>
      <section className="h-6/12 flex w-full flex-col justify-between  md:w-full lg:h-full lg:w-5/12 xl:w-4/12 2xl:w-4/12">
        <div className="flex flex-col gap-2">
          <Beforeunload
            onBeforeunload={(event) => {
              event.preventDefault();
            }}
          />
          {steps && steps.length > 0 && (
            <SimplifiedRouteCard
              data={data}
              className="w-full"
              handleOnStopClick={handleOnStopClick}
            />
          )}
          <Button
            onClick={triggerActiveUser}
            disabled={enableTracking}
            variant={enableTracking ? "secondary" : "default"}
          >
            {" "}
            {enableTracking && (
              <svg
                className="-ml-1 mr-3 h-5 w-5 animate-spin text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {enableTracking
              ? "Broadcasting location with dispatch..."
              : "Start Route"}
          </Button>{" "}
          {enableTracking && (
            <Button
              onClick={() => setEnableTracking(false)}
              variant={"default"}
            >
              Disable Tracking
            </Button>
          )}
          {selected && (
            <StopDetails stop={selected} open={open} setOpen={setOpen} />
          )}
        </div>
      </section>
      <section className="relative z-0 flex aspect-square w-full flex-grow overflow-hidden  md:pl-8 lg:aspect-auto lg:w-7/12 xl:w-9/12 2xl:w-9/12">
        {data?.geometry && steps && (
          <Suspense fallback={<p>Loading map...</p>}>
            <DynamicMapWithNoSSR
              steps={steps}
              geometry={data?.geometry}
              focusedStop={selected}
            />
          </Suspense>
        )}
      </section>
    </ToolLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { data, error } = await supabase.storage
    .from("routes")
    .download(`${context.query.route as string}.json`);

  if (!data || error)
    return {
      redirect: {
        destination: `/tools/routing`,
        permanent: false,
      },
    };

  const jsonObject = await parseIncomingDBData(data);

  return { props: { data: jsonObject, steps: jsonObject.steps } };
};

export default RoutePage;
