import { useDeleteDriver } from "~/apps/solidarity-routing/hooks/drivers/CRUD/use-delete-driver";

import type { DriverVehicleBundle } from "~/apps/solidarity-routing/types.wip";

type Props = { row: DriverVehicleBundle };

export const DriverDepotDeleteOption = ({ row }: Props) => {
  const { deleteDriverFromDepot } = useDeleteDriver();

  const editPost = () => {
    deleteDriverFromDepot({
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
