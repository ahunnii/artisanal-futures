import type { FC } from "react";

import { Checkbox } from "~/components/ui/checkbox";

import { cn } from "~/utils/styles";

interface IProps {
  artisans: Array<string>;
  selectedArtisans: Array<string>;
  handleSelect: (data: string, type: "artisan" | "principle") => void;
  applicableArtisans: Array<string>;
}

const ArtisanField: FC<IProps> = ({
  artisans,
  selectedArtisans,
  handleSelect,
  applicableArtisans,
}) => {
  return (
    <fieldset id="artisans" name="artisans" className="my-6">
      <legend className="text-sm font-semibold leading-6 text-gray-900">
        Artisan
      </legend>
      <div className="mt-6 space-y-3">
        {artisans.map((artisan) => {
          const disabled = applicableArtisans
            ? !applicableArtisans.includes(artisan)
            : false;

          return (
            <div className="group flex items-center space-x-4" key={artisan}>
              <Checkbox
                id={`${artisan}-opt`}
                name={`${artisan}-opt`}
                checked={selectedArtisans.includes(artisan)}
                disabled={disabled}
                onCheckedChange={() => handleSelect(artisan, "artisan")}
              />
              <label
                htmlFor="terms"
                className={cn(
                  "text-sm font-medium capitalize leading-none disabled:line-through peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  disabled && "text-gray-900/25 line-through"
                )}
              >
                {artisan}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
};

export default ArtisanField;
