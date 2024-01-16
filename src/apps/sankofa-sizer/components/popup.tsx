import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import ActualPattern from "~/apps/sankofa-sizer/components/actual-pattern";

const Popup = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Actual Size</Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-full resize lg:max-h-max ">
        <ActualPattern />
      </PopoverContent>
    </Popover>
  );
};

export default Popup;
