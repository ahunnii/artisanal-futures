import type { FC } from "react";

import { Checkbox } from "~/components/ui/checkbox";

import { cn } from "~/utils/styles";

interface IProps {
  attributes: Array<string>;
  selectedAttributes: Array<string>;
  filteredAttributes: Array<string>;
  handleSelect: (data: string, type: "artisan" | "principle") => void;
}
const AttributeField: FC<IProps> = ({
  attributes,
  selectedAttributes,
  filteredAttributes,
  handleSelect,
}) => {
  return (
    <fieldset className="my-6">
      <legend className="text-sm font-semibold leading-6 text-gray-900">
        Store Attributes
      </legend>
      <div className="mt-6 space-y-4">
        {attributes.map((principle) => (
          <div className="group flex items-center space-x-2" key={principle}>
            <Checkbox
              id={`${principle}-opt`}
              name={`${principle}-opt`}
              checked={selectedAttributes.includes(principle)}
              disabled={!filteredAttributes.includes(principle)}
              onCheckedChange={() => handleSelect(principle, "principle")}
            />
            <label
              htmlFor="terms"
              className={cn(
                "text-sm font-medium capitalize leading-none disabled:line-through peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                !filteredAttributes.includes(principle) &&
                  "text-gray-900/25 line-through"
              )}
            >
              {principle}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default AttributeField;
