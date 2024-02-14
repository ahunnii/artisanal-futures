import { useSession } from "next-auth/react";
import { useParams, usePathname, useSearchParams } from "next/navigation";

export const useSolidarityState = () => {
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: session } = useSession();

  const isSandbox = pathname?.includes("sandbox");
  const depotId = Number(params?.depotId) ?? undefined;
  const routeId = params?.routeId ?? undefined;
  const pathId = params?.pathId ?? undefined;

  const date = searchParams.get("date") ?? "";
  const formattedDateString = date?.replace(/\+/g, " ");
  const dateObject = new Date(formattedDateString);

  const isUserAllowedToSaveToDepot = session?.user !== null && !isSandbox;

  return {
    session,
    isUserAllowedToSaveToDepot,
    isSandbox,
    depotId,
    routeId,
    pathId,
    routeDate: date ? dateObject : null,
  };
};
