import { Button } from "~/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import ActualPattern from "./actual-pattern";

const Popup = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Actual Size</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 resize ">
        <ActualPattern />
      </PopoverContent>
    </Popover>
  );
};

export default Popup;
