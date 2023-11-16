import axios from "axios";
import toast from "react-hot-toast";
import type { ExpandedRouteData } from "~/components/tools/routing/types";

const FETCH_ROUTES = "/api/fetch-routes";
const ARCHIVE_ROUTE = "/api/supabase/archive";

export const fetchAllRoutes = (
  success: (data: ExpandedRouteData[]) => void
) => {
  axios
    .get(FETCH_ROUTES)
    .then(function (response) {
      success(response.data.data as ExpandedRouteData[]);
    })
    .catch(console.error);
};

export const archiveRoute = async (routeId: string) => {
  return axios
    .post(ARCHIVE_ROUTE, {
      routeId,
    })
    .then(function (response) {
      if (response.status === 200) toast.success("Route archived");
      else toast.error("Error archiving route");
    })
    .catch((error) => {
      console.error(error as string);
      toast.error("Error archiving route");
    });
};
