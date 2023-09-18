import { throttle } from "@daybrush/utils";
import { useState } from "react";
import Moveable from "react-moveable";
import { useSizerStore } from "~/components/tools/sankofa-sizer/store";
import InchMarker from "./inch-marker";

const VirtualizedInchMarker = () => {
  const pixels_per_inch = useSizerStore((state) => state.pixels_per_inch);
  const updateValue = useSizerStore((state) => state.updateValue);
  const [height, setHeight] = useState<number>(45);
  return (
    <>
      <div className="target-inch absolute z-10  bg-slate-200">
        <InchMarker
          unit="inches"
          length={1}
          pixels_per_inch={pixels_per_inch}
          height={height}
        />
      </div>

      <Moveable
        target={".target-inch"}
        hideDefaultLines={true}
        rotationPosition="top"
        resizable={true}
        draggable={true}
        rotatable={true}
        onDrag={({ target, transform }) => {
          target.style.transform = transform;
        }}
        onResize={({ height, width, target, drag }) => {
          updateValue("pixels_per_inch", width);

          setHeight(height);
          target.style.cssText += `width: ${width}px; height: ${height}px`;
          target.style.transform = drag.transform;
        }}
        onBeforeRotate={({ rotation, setRotation }) => {
          setRotation(throttle(rotation, 15));
        }}
        onRotate={({ target, drag }) => {
          // nice to have: 5 deg increment rotations
          target.style.transform = drag.transform;
        }}
      />
    </>
  );
};

export default VirtualizedInchMarker;
