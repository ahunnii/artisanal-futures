import { Users } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useDriverVehicleBundles } from "../../hooks/drivers/use-driver-vehicle-bundles";

type Props = {
  text?: string;
};
export const DriverVehicleSheetBtn = ({ text = "Manage Drivers" }: Props) => {
  const { onSheetOpenChange } = useDriverVehicleBundles();

  return (
    <Button
      variant="outline"
      className="px-3 shadow-none"
      onClick={() => onSheetOpenChange(true)}
    >
      <Users className="mr-2 h-4 w-4" />
      {text}
    </Button>
  );
};
