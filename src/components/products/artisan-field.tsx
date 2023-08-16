import type { FC } from "react";

interface IProps {
  artisans: Array<string>;
  selectedArtisans: Array<string>;

  handleSelect: (data: string) => void;
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
        {artisans &&
          artisans.length > 0 &&
          artisans.map((artisan) => (
            <div className="relative flex gap-x-3" key={artisan}>
              <div className="flex h-6 items-center">
                <input
                  id={`${artisan}-opt`}
                  name={`${artisan}-opt`}
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  checked={selectedArtisans.includes(artisan)}
                  onChange={() => handleSelect(artisan)}
                  disabled={
                    applicableArtisans
                      ? !applicableArtisans.includes(artisan)
                      : false
                  } // disable if not applicable
                />
              </div>
              <div className="text-sm leading-6">
                <label
                  htmlFor={`${artisan}-opt`}
                  className="font-medium capitalize text-gray-900"
                >
                  {artisan}
                </label>
              </div>
            </div>
          ))}
      </div>
    </fieldset>
  );
};

export default ArtisanField;
