import { throttle } from "@daybrush/utils";
import React, {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FC,
} from "react";
import Moveable from "react-moveable";
import {
  useSizerStore,
  type BodyPart,
  type Part,
} from "~/components/tools/sankofa-sizer/store";
interface IProps {
  bodyPartKey: Part;
  bodyPart: BodyPart;
  // handleOnInput: (e: ChangeEvent<HTMLInputElement>) => void;
}
const MoveableInput: FC<IProps> = ({
  bodyPartKey,
  bodyPart,
  // handleOnInput,
}) => {
  const [height, setHeight] = useState(10);
  const [width, setWidth] = useState(10);
  const [inputValue, setInputValue] = useState("");
  const targetRef = useRef(null);
  const { bodyParts, updateBodyPart, pixels_per_inch, actual_pattern } =
    useSizerStore((state) => state);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();

    const newLength = Number(e.target.value);

    if (newLength > 0) {
      setInputValue(e.target.value);
      if (isNaN(Number(newLength))) return;
      if (bodyPart.type === "vertical")
        setHeight(Number(newLength) * pixels_per_inch);
      if (bodyPart.type === "horizontal")
        setWidth(Number(newLength) * pixels_per_inch);

      updateBodyPart(bodyPartKey, {
        ...bodyParts[bodyPartKey],
        actual_length: newLength,
      } as BodyPart);
    }
  };

  useEffect(() => {
    if (bodyPart.actual_length) {
      setInputValue(bodyPart.actual_length.toString());
    }
  }, [bodyPart?.actual_length]);

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <div
        ref={targetRef}
        style={{
          width: "200px",
          position: "absolute",
          //   border: "1px solid red",
          display: "flex",
        }}
      >
        {/* <div
          style={{
            width: "20px",
            backgroundColor: "#e0e0e0",
            cursor: "move",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ≡
        </div> */}
        <div className="flex flex-col">
          <div className="flex flex-col">
            <span className="part-name">{bodyPart.name}</span>
            <input
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter height..."
              // style={{ width: "100%" }}
              className="relative w-20"
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>

          <div
            // style={{
            //   width: "100%",
            //   height: `${height}px`,
            //   backgroundColor: "lightgray",
            // }}

            style={{
              backgroundColor: "lightgray",
              // height: `${height}px`,
              // width: `${width}px`,

              width: `${
                bodyPart.type === "horizontal"
                  ? bodyPart.virtual_length * pixels_per_inch
                  : 10
              }px`,
              height: `${
                bodyPart.type === "vertical"
                  ? bodyPart.virtual_length * pixels_per_inch
                  : 10
              }px`,
            }}
          />
        </div>
      </div>

      <Moveable
        target={targetRef.current}
        edge={true}
        draggable={true}
        rotatable={true}
        hideDefaultLines={true}
        rotationPosition={"left"}
        onDragStart={({ set }) => {
          set([targetRef.current!.offsetLeft, targetRef.current!.offsetTop]);
        }}
        onDrag={({ beforeTranslate }) => {
          targetRef.current!.style.left = `${beforeTranslate[0]}px`;
          targetRef.current!.style.top = `${beforeTranslate[1]}px`;
        }}
        onBeforeRotate={({ setRotation, rotation }) => {
          setRotation(throttle(rotation, 15));
        }}
        onRotate={({ target, drag }) => {
          // Apply the transformation to the Moveable target
          target.style.transform = drag.transform;
        }}
      />
    </div>
  );
};

export default MoveableInput;
