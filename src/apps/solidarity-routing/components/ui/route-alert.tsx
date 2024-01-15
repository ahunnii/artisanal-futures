import { BellIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

const RouteAlert = ({ type }: { type: "stop" | "driver" }) => {
  return (
    <Alert>
      <BellIcon className="h-4 w-4" />
      <AlertTitle>
        <span className="capitalize">{type}s</span> needed!{" "}
      </AlertTitle>
      <AlertDescription>{`Make sure to add some ${type}s before you generate your routes.`}</AlertDescription>
    </Alert>
  );
};

export default RouteAlert;
