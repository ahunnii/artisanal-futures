import { Filter } from "lucide-react";
import { forwardRef } from "react";
import { Button } from "../ui/button";
import { ButtonLoader } from "../ui/button-loader";
import { Input } from "../ui/input";

interface IProps {
  fetching: boolean;
  handleOnClick: () => void;
}
const AiSort = forwardRef<HTMLInputElement, IProps>(
  ({ fetching, handleOnClick }, ref) => {
    return (
      <div className="my-6">
        <label
          htmlFor="price"
          className="sr-only block text-sm font-medium leading-6 text-gray-900 md:not-sr-only"
        >
          Term using AI
        </label>
        <div className="relative mt-2 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">
              <Filter color="gray.300" />
            </span>
          </div>
          <Input
            type="text"
            name="filter"
            id="filter"
            ref={ref}
            placeholder="e.g. Beads"
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <Button
              variant={"default"}
              onClick={handleOnClick}
              disabled={fetching}
              className="gap-2"
            >
              {fetching && <ButtonLoader />}
              Sort using AI
            </Button>
          </div>
        </div>
        <p className="mt-2 hidden text-xs text-muted-foreground md:flex">
          Clear your filters for the best results.{" "}
        </p>
      </div>
    );
  }
);
AiSort.displayName = "AiSort";

export default AiSort;
