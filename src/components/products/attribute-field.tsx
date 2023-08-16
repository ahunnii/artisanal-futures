import type { FC } from "react";

interface IProps {
  attributes: Array<string>;
  selectedAttributes: Array<string>;
  filteredAttributes: Array<string>;
  handleSelect: (data: string) => void;

  // handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
      <div className="mt-6 space-y-2">
        {attributes &&
          attributes.length > 0 &&
          attributes.map((principle) => (
            <div className="relative flex gap-x-3" key={principle}>
              <div className="flex h-6 items-center">
                <input
                  id={`${principle}-opt`}
                  name={`${principle}-opt`}
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  checked={selectedAttributes.includes(principle)}
                  disabled={!filteredAttributes.includes(principle)}
                  onChange={() => handleSelect(principle)}
                />
              </div>
              <div className="text-sm leading-6">
                <label
                  htmlFor={`${principle}-opt`}
                  className="font-medium capitalize text-gray-900"
                >
                  {principle}
                </label>
              </div>
            </div>
          ))}
      </div>
    </fieldset>
  );
};

export default AttributeField;
