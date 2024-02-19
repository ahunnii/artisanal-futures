import Image from "next/image";
import { useState } from "react";

import { Input } from "~/components/ui/input";

import ActualInch from "~/apps/sankofa-sizer/components/actual-inch";
import { useSizerStore } from "~/apps/sankofa-sizer/hooks/use-sizer";
import { type BodyPart, type Part } from "~/apps/sankofa-sizer/types";

import { classNames } from "~/utils/styles";

const ActualPattern = () => {
  const { bodyParts, actual_pattern, pixels_per_inch, updateBodyPart } =
    useSizerStore((state) => state);

  const device_pixels_per_inch = pixels_per_inch;

  const [ppiSliderValue, setPpiSliderValue] = useState<number>(
    device_pixels_per_inch
  );

  return (
    <>
      <ActualInch
        ppiSliderValue={ppiSliderValue}
        setPpiSliderValue={setPpiSliderValue}
      />

      <div className="relative">
        {Object.entries(bodyParts).map(([key, part], idx) => {
          if (part.isEnabled)
            return (
              <div
                key={idx}
                style={{
                  width: `${
                    part.type === "horizontal"
                      ? part.virtual_length * device_pixels_per_inch
                      : 10
                  }px`,
                  height: `${
                    part.type === "vertical"
                      ? part.virtual_length * device_pixels_per_inch
                      : 10
                  }px`,

                  left: `${
                    part.location.x * (device_pixels_per_inch / pixels_per_inch)
                  }px`,
                  top: `${
                    part.location.y * (device_pixels_per_inch / pixels_per_inch)
                  }px`,
                }}
                className={classNames(
                  `virtual-part-${idx} absolute whitespace-nowrap bg-black/40 text-black ${
                    part.type === "vertical" ? "w-[10px]" : "h-[10px]"
                  }`,
                  `  absolute  `
                )}
                tabIndex={idx}
                role="button"
                aria-label="Drag to move this part"
              >
                {/* This is the ruler, a gray rect that is horizontal or vertical; the user moves this into place on their pattern 
								left: {Math.round(width*(part.x/$actual_pattern["width"]))+1}px
			          */}

                <div id={`input-virtual-part-${idx}`}>
                  <label>
                    <Input
                      type="number"
                      defaultValue={part.actual_length}
                      onChange={(e) => {
                        console.log(e);
                        updateBodyPart(
                          key as Part,
                          {
                            ...part,
                            actual_length: Number(e.target.value),
                          } as BodyPart
                        );
                      }}
                      className="relative -top-1 w-12"
                    />
                    <span className="relative top-7 ml-1 text-black">
                      {part.name}
                    </span>
                  </label>
                </div>
              </div>
            );
        })}

        <Image
          alt=""
          id="actual_pattern"
          src={actual_pattern?.blob ?? ""}
          width={actual_pattern.width! * (ppiSliderValue / pixels_per_inch)}
          height={actual_pattern.height! * (ppiSliderValue / pixels_per_inch)}
          className={classNames(`-z-10`)}
        />
      </div>
    </>
  );
};

export default ActualPattern;
