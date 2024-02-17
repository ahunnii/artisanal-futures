import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";
import type { DriverVehicleBundle } from "~/apps/solidarity-routing/types.wip";

type Props = {
  row: DriverVehicleBundle;
};

export const DriverDepotDeleteOption = ({ row }: Props) => {
  const { deleteFromDepot } = useDriverVehicleBundles();

  const editPost = () => {
    deleteFromDepot({
      driverId: row.driver.id,
      vehicleId: row.vehicle.id,
    });
  };

  return (
    <p onClick={editPost} className="text-red-500 hover:text-red-400">
      Delete from Depot
    </p>
  );
};
