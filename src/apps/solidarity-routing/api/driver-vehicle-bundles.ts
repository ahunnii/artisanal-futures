// import toast from "react-hot-toast";
// import { api } from "~/utils/api";
// import { depotDrivers } from "../hooks/drivers/use-vehicles-db";

// // const useVehicles = () => {};

// export const getDepotDrivers = (depotId: number) => {
//   const drivers = api.drivers.getCurrentDepotDrivers.useQuery({
//     depotId,
//   });

//   return {
//     depotDrivers: drivers.data,
//     isLoading: drivers.isLoading,
//     isError: drivers.isError,
//   };
// };

// export const mutateDriversAndVehicles = () => {
//   const apiContext = api.useContext();

//   const { mutate, isLoading, isLoading } =
//     api.drivers.createManyDriverAndVehicle.useMutation({
//       onSuccess: () => {
//         toast.success("Woohoo! Drivers created!");
//       },
//       onError: (e) => {
//         console.log(e);
//         toast.error("Oops! Something went wrong!");
//       },
//       onSettled: () => {
//         void apiContext.drivers.invalidate();
//       },
//     });

//   return {
//     createBundles: mutate,
//     isLoading,
//     isError,
//   };
// };
