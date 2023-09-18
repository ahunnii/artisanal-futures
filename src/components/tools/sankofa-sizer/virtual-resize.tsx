import { throttle } from "@daybrush/utils";
import Image from "next/image";
import { ChangeEvent, Fragment, useEffect, useState } from "react";
import Moveable from "react-moveable";
import { object } from "zod";
import {
  BodyPart,
  useSizerStore,
  type Part,
} from "~/components/tools/sankofa-sizer/store";
import { classNames } from "~/utils/styles";
import MoveableInput from "./moveable-input";
import VirtualizedInchMarker from "./virtualized-inch-marker";

const VirtualResize = () => {
  const [largestWidth, setLargestWidth] = useState<number>(0);
  const [largestHeight, setLargestHeight] = useState<number>(0);
  const { bodyParts, updateBodyPart, pixels_per_inch, actual_pattern } =
    useSizerStore((state) => state);

  // const updateLength = (event: ChangeEvent<HTMLInputElement>, key: Part) => {
  //   event.stopPropagation();
  //   const newLength = Number(event.target.value);

  //   if (newLength > 0) {
  //     updateBodyPart(key, {
  //       ...bodyParts[key],
  //       actual_length: newLength,
  //     } as BodyPart);
  //   }
  // };

  // pre-scale the image so it's not such a pain to resize rulers onto it
  const handleImageLoad = (event) => {
    event.target.width = largestWidth * pixels_per_inch;
    event.target.height = largestHeight * pixels_per_inch;

    actual_pattern.width = event.target.width;
    actual_pattern.height = event.target.height;

    // actual_pattern.blob = event.target.src;
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
