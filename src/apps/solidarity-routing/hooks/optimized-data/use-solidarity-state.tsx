import { useSession } from "next-auth/react";
import { useParams, usePathname } from "next/navigation";

export const useSolidarityState = () => {
  const params = useParams();
  const pathname = usePathname();

  const { data: session } = useSession();

  const isSandbox = pathname?.includes("sandbox");
  const depotId = params?.depotId ?? undefined;
  const routeId = params?.routeId ?? undefined;
  const pathId = params?.pathId ?? undefined;

  return {
    session,
    isSandbox,
    depotId,
    routeId,
    pathId,
  };
};
