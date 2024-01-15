import Image from "next/image";
import { useState } from "react";

import { useSizerStore, type Part } from "~/apps/sankofa-sizer/store";
import { classNames } from "~/utils/styles";

import BodyPartSelectors from "~/apps/sankofa-sizer/body-parts-ui/body-part-selectors";

const BodyPartsUI = () => {
  const { bodyParts, toggleBodyPart } = useSizerStore((store) => store);

  const [measurementRuler, setMeasurementRuler] = useState<string>("blank");

  /**
   * Set the bg class for the overlay
   * @param overlay the overlay that was hovered as declared in tailwind config
   */
  const handleOverlayHover = (overlay = "blank") => {
    setMeasurementRuler("bg-" + overlay);
  };

  return (
    <>
      <div className="px-8 pt-8">
        <h3 className="text-lg font-semibold">Select Body Parts</h3>
        <p>Please select your desired body parts to add to the pattern</p>
      </div>
      <div className="flex w-full items-start p-8">
        <div className="relative flex h-full w-full border border-black">
          {measurementRuler != "bg-blank" && (
            <div
              className={classNames(
                "absolute inset-0 bg-cover",
                measurementRuler == "bg-shoulderToWrist"
                  ? "bg-shoulderToWrist"
                  : "",
                measurementRuler == "bg-wrist" ? "bg-wrist" : "",
                measurementRuler == "bg-bicep" ? "bg-bicep" : "",
                measurementRuler == "bg-seatBack" ? "bg-seatBack" : "",
                measurementRuler == "bg-inseam" ? "bg-inseam" : "",

                measurementRuler == "bg-knee" ? "bg-knee" : "",
                measurementRuler == "bg-ankle" ? "bg-ankle" : "",
                measurementRuler == "bg-blank" ? "bg-blank" : ""
              )}
            >
              {/* {measurementRuler && <p>{measurementRuler}</p>} */}
            </div>
          )}
          <div className="absolute inset-0 ">
            <BodyPartSelectors handleOnHover={handleOverlayHover} />
          </div>
          <Image
            className=" aspect-[4/3] h-full w-full "
            width={200}
            height={160}
            alt=""
            src={
              "https://media.githubusercontent.com/media/robinsonkwame/af-parametric-sewing/main/static/model-breasts-standing.jpg"
            }
            sizes="(max-width: 768px) 100vw,
          (max-width: 1200px) 50vw,
          33vw"
          />
        </div>

        <section className="flex flex-col gap-3 px-3">
          {/* <h3 className="font-semibold">Select your desired body parts:</h3> */}
          <div className="flex flex-col gap-y-2">
            {Object.entries(bodyParts).map(([key, part]) => (
              <label
                key={key}
                onMouseOver={() => handleOverlayHover(key)}
                onFocus={() => true}
                onMouseOut={() => handleOverlayHover()}
                onBlur={() => handleOverlayHover()}
                className="flex w-full items-center  gap-3 capitalize"
              >
                {part.name}
                <input
                  type="checkbox"
                  checked={part.isEnabled}
                  onChange={() => toggleBodyPart(key as Part)}
                />
                <br />
              </label>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};
export default BodyPartsUI;
