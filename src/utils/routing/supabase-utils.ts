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

export const saveRoute = async (
  route: ExpandedRouteData,
  success: (name: string) => void,
  error: (error: string) => void
) => {
  // Take that name and shorten it to 50 characters, making sure that it it stays unique. data.geometry must always turn into this
  const fileName = route.geometry
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase()
    .substring(0, 50);

  const listData = await axios.get("/api/routing").then((res) => res.data);

  if (!listData) return;

  const fileExists = listData.some(
    (file: File) => file.name === `${fileName}.json`
  );
  if (!fileExists) {
    await axios
      .post("/api/routing", {
        file: route,
        fileName: fileName,
      })

      .then((res) => res.data)
      .then((data) => {
        if (data.error) throw new Error(data.error as string);

        console.log("File uploaded successfully:", data.data);
        success(fileName);
      })
      .catch((err) => error(err as string));
  } else {
    console.log("File already exists", `${fileName}.json`);
    success(fileName);
  }
};
