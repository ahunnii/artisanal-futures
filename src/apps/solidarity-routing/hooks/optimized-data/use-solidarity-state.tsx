import { useSession } from "next-auth/react";
import { useParams, usePathname, useSearchParams } from "next/navigation";

export const useSolidarityState = () => {
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: session, status } = useSession();

  const isSandbox = pathname?.includes("sandbox");
  const depotId = params?.depotId as string;
  const routeId = params?.routeId as string;
  const pathId = params?.pathId ?? undefined;
  const driverId = searchParams.get("driverId") ?? undefined;
  const optimizedId = searchParams.get("optimizedId") ?? undefined;
  const date = searchParams.get("date") ?? "";
  const formattedDateString = date?.replace(/\+/g, " ");
  const dateObject = new Date(formattedDateString);
  const vehicle = searchParams.get("vehicle") ?? undefined;

  const isUserAllowedToSaveToDepot = session?.user !== null && !isSandbox;

  return {
    session,
    isUserAllowedToSaveToDepot,
    isSandbox,
    depotId,
    routeId,
    pathId,
    driverId,
    optimizedId,
    vehicle,
    routeDate: date ? dateObject : null,
    sessionStatus: status,
  };
};
