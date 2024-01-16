import Image from "next/image";
import { useEffect, useState } from "react";

import Moveable from "react-moveable";

import MoveableInput from "~/apps/sankofa-sizer/components/moveable-input";
import VirtualizedInchMarker from "~/apps/sankofa-sizer/components/virtualized-inch-marker";
import { useSizerStore } from "~/apps/sankofa-sizer/hooks/use-sizer";
import { type Part } from "~/apps/sankofa-sizer/types";

const VirtualResize = () => {
  const [, setLargestWidth] = useState<number>(0);
  const [, setLargestHeight] = useState<number>(0);
  const { bodyParts, actual_pattern } = useSizerStore((state) => state);

  // pre-scale the image so it's not such a pain to resize rulers onto it
  // const handleImageLoad = (event: SyntheticEvent<HTMLImageElement, Event>) => {
  //   if (!event.currentTarget) return;
  //   event.currentTarget.width = largestWidth * pixels_per_inch;
  //   event.currentTarget.height = largestHeight * pixels_per_inch;

  //   actual_pattern.width = event.currentTarget.width;
  //   actual_pattern.height = event.currentTarget.height;

  //   actual_pattern.blob = "/img/sankofa-sizer-demo.jpg";
  // };

  useEffect(() => {
    const the_heights = Object.entries(bodyParts).map(([_, part]) =>
      part.type === "vertical" ? part.virtual_length : -1
    );
    setLargestHeight(Math.max(...the_heights));

    const the_widths = Object.entries(bodyParts).map(([_, part]) =>
      part.type === "horizontal" ? part.virtual_length : -1
    );
    setLargestWidth(Math.max(...the_widths));
  }, [bodyParts]);

  return (
    <>
      <VirtualizedInchMarker />
      <div>
        <section className="mb-20">
          {Object.entries(bodyParts).map(([key, part], idx) => {
            if (part.isEnabled) {
              return (
                <MoveableInput
                  bodyPartKey={key as Part}
                  bodyPart={part}
                  key={idx}
                />
              );
            }
          })}
        </section>
        {actual_pattern.blob && (
          <Image
            id="virtual-pattern"
            className="pointer-events-none  -z-10"
            alt=""
            src={actual_pattern?.blob}
            // onLoad={handleImageLoad}
            height={192 + 192}
            width={252 + 252}
          />
        )}

        <Moveable
          target="#virtual-pattern"
          edge={true}
          resizable={true}
          onResize={({ target, width, height }) => {
            target.style.cssText += `width: ${width}px; height: ${height}px`;
            actual_pattern.width = width;
            actual_pattern.height = height;
          }}
        />
      </div>
    </>
  );
};

export default VirtualResize;
