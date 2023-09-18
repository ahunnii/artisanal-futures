import { useSizerStore } from "~/store";
import ActualInch from "./actual-inch";

import Image from "next/image";

import { classNames } from "~/utils/styles";

const ActualPattern = () => {
  const { parts, actual_pattern, pixels_per_inch } = useSizerStore(
    (state) => state
  );

  const device_pixels_per_inch = pixels_per_inch;

  return (
    <>
      <ActualInch ppi_slider={device_pixels_per_inch} />

      <div className="relative">
        {parts?.map((part, idx) => {
          if (part.selected)
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
                    part.x * (device_pixels_per_inch / pixels_per_inch)
                  }px`,
                  top: `${
                    part.y * (device_pixels_per_inch / pixels_per_inch)
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
                    <input
                      type="number"
                      value={part.actual_length}
                      className="relative -top-1 w-12"
                      disabled
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
          src={(actual_pattern?.blob as string) ?? ""}
          width={
            actual_pattern.width! * (device_pixels_per_inch / pixels_per_inch)
          }
          height={
            actual_pattern.height! * (device_pixels_per_inch / pixels_per_inch)
          }
          className={classNames(`-z-10`)}
        />
      </div>
    </>
  );
};

export default ActualPattern;
