import { Fragment, useEffect, useState, type SyntheticEvent } from "react";
import Moveable from "react-moveable";

import {
  useSizerStore,
  type Part,
} from "~/components/tools/sankofa-sizer/store";

import MoveableInput from "./moveable-input";
import VirtualizedInchMarker from "./virtualized-inch-marker";

import Image from "next/image";

const VirtualResize = () => {
  const [largestWidth, setLargestWidth] = useState<number>(0);
  const [largestHeight, setLargestHeight] = useState<number>(0);
  const { bodyParts, pixels_per_inch, actual_pattern } = useSizerStore(
    (state) => state
  );

  // pre-scale the image so it's not such a pain to resize rulers onto it
  const handleImageLoad = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    console.log(actual_pattern?.blob);
    if (!event.currentTarget) return;
    event.currentTarget.width = largestWidth * pixels_per_inch;
    event.currentTarget.height = largestHeight * pixels_per_inch;

    actual_pattern.width = event.currentTarget.width;
    actual_pattern.height = event.currentTarget.height;

    actual_pattern.blob = "/img/sankofa-sizer-demo.jpg";
  };

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

      <section>
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
          className="virtual-pattern pointer-events-none  -z-10"
          alt=""
          src={actual_pattern?.blob}
          onLoad={handleImageLoad}
          height={largestHeight * pixels_per_inch}
          width={largestWidth * pixels_per_inch}
        />
      )}

      <Moveable
        target=".virtual-pattern"
        edge={true}
        resizable={true}
        onResize={({ target, width, height }) => {
          target.style.cssText += `width: ${width}px; height: ${height}px`;
          actual_pattern.width = width;
          actual_pattern.height = height;
        }}
      />
    </>
  );
};

export default VirtualResize;
