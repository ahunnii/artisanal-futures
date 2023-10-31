import polyline from "@mapbox/polyline";

import { Truck } from "lucide-react";
import dynamic from "next/dynamic";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useState,
  type FC,
} from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import ToolLayout from "~/layouts/tool-layout";
import { supabase } from "~/server/supabase/client";
import {
  convertSecondsToTime,
  formatTime,
  lookupAddress,
} from "~/utils/routing";

const DynamicMapWithNoSSR = dynamic(
  () => import("~/components/tools/routing/map/TempMap"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";
import type { GetServerSidePropsContext } from "next";
import { Beforeunload } from "react-beforeunload";
import { SimplifiedRouteCard } from "~/components/tools/routing/solutions/route-card";
import type {
  OptimizationData,
  Polyline,
  RouteData,
  StepData,
} from "~/components/tools/routing/types";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import useTracking from "~/hooks/routing/use-tracking";
import { parseDescriptionData } from "~/utils/routing/data-formatting";
import { parseIncomingDBData } from "~/utils/routing/file-handling";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { data, error } = await supabase.storage
    .from("routes")
    .download(`${context.query.route as string}.json`);

  if (!data)
    return {
      redirect: {
        destination: `/tools/routing`,
        permanent: false,
      },
    };

  if (error)
    return {
      redirect: {
        destination: `/tools/routing`,
        permanent: false,
      },
    };

  const jsonObject = await parseIncomingDBData(data);

  return { props: { data: jsonObject, steps: jsonObject.steps } };
};

interface IProps {
  data: RouteData;
  steps: StepData[];
}

const RoutePage: FC<IProps> = ({ data, steps }) => {
  const [geometry, setGeometry] = useState<Polyline | null>(null);

  const { name, address, contact_info, description } = parseDescriptionData(
    data.description
  );

  const generateGeometry = useCallback((rawGeo: string) => {
    const geo = polyline.toGeoJSON(rawGeo);
    return { ...geo, properties: { color: 2 } };
  }, []);

  useEffect(() => {
    if (data) setGeometry(generateGeometry(data.geometry) as Polyline);
  }, [data, generateGeometry]);

  const startTime = formatTime(steps[0]?.arrival ?? 0);
  const endTime = formatTime(steps[steps.length - 1]?.arrival ?? 0);

  const { triggerActiveUser } = useTracking();

  return (
    <ToolLayout>
      <section className="h-6/12 flex w-full flex-col justify-between bg-white md:w-full lg:h-full lg:w-5/12 xl:w-4/12 2xl:w-4/12">
        <div className="flex flex-col gap-2">
          <Button onClick={triggerActiveUser}>Start Tracking</Button>{" "}
          <Beforeunload
            onBeforeunload={(event) => {
              event.preventDefault();
            }}
          />
          {steps && steps.length > 0 && (
            <div className="bg-white p-2 shadow">
              <div className="flex items-center justify-between">
                <p className="pb-2 font-bold text-slate-800">
                  {name} (
                  <span>
                    {startTime} to {endTime}
                  </span>
                  )
                </p>
              </div>

              <SimplifiedRouteCard data={data} className="w-full" />

              {/* <ul
                role="list"
                className="list-disc space-y-3 pl-5 text-slate-500 marker:text-sky-400"
              >
                <li>
                  <span className="flex w-full text-sm font-bold">
                    {startTime}
                  </span>{" "}
                  <span className="font-base flex w-full text-sm text-slate-700">
                    Start at:&nbsp;
                  </span>{" "}
                  <span className="flex w-full text-sm font-semibold  text-slate-700">
                    {" "}
                    {data.description}
                  </span>
                </li>
                {steps.map((step: StepData, idx: number) => {
                  const { name, address, contact_info, description } =
                    JSON.parse(step.description ?? "{}");
                  return (
                    <>
                      {step.id && step.id >= 0 && (
                        <li key={`step-${step.id}`}>
                          <span className="flex w-full text-sm font-medium capitalize">
                            {convertSecondsToTime(step?.arrival)}
                          </span>

                          <span className="font-base flex w-full text-sm text-slate-700">
                            {step.type === "job"
                              ? "Delivery at:"
                              : `Break time `}
                            &nbsp;
                          </span>
                          <span className="flex w-full text-sm font-semibold text-slate-700">
                            {step.type === "job" ? address : ""}
                          </span>
                        </li>
                      )}
                    </>
                  );
                })}
                <li>
                  <span className="flex w-full text-sm font-bold">
                    {endTime}
                  </span>

                  <span className="font-base flex w-full text-sm text-slate-700">
                    End back at:&nbsp;
                  </span>
                  <span className="flex w-full text-sm font-semibold text-slate-700">
                    {"addresses[0]"}
                  </span>
                </li>
              </ul> */}
            </div>
          )}
        </div>
      </section>
      <section className="relative z-0  flex aspect-square w-full flex-grow overflow-hidden  pl-8 lg:aspect-auto lg:w-7/12 xl:w-9/12 2xl:w-9/12">
        {geometry && steps && (
          <Suspense fallback={<p>Loading map...</p>}>
            <DynamicMapWithNoSSR steps={steps} geojson={geometry} />
          </Suspense>
        )}
      </section>
    </ToolLayout>
  );
};

export default RoutePage;
