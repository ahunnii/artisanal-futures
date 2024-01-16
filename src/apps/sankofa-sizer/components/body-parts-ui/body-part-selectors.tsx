import React, {
  useCallback,
  type FC,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

import { useSizerStore } from "~/apps/sankofa-sizer/hooks/use-sizer";
import { type Part } from "~/apps/sankofa-sizer/types";

interface IProps {
  handleOnHover: (overlay?: string) => void;
}
const BodyPartSelectors: FC<IProps> = ({ handleOnHover }) => {
  const { toggleBodyPart } = useSizerStore((store) => store);

  const handleOverlayClick = useCallback(
    (e: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
      const target = e.currentTarget.id.split("_")[0];
      toggleBodyPart(target as Part);
    },
    [toggleBodyPart]
  );

  const handleOverlayHover = useCallback(
    (
      e:
        | MouseEvent<HTMLElement>
        | KeyboardEvent<HTMLElement>
        | FocusEvent<HTMLElement>
    ) => {
      const target = e.currentTarget.id.split("_")[0];
      handleOnHover(target);
    },
    [handleOnHover]
  );

  const handleOverlayLeave = useCallback(() => {
    handleOnHover();
  }, [handleOnHover]);

  return (
    <>
      {/* <!-- SHOULDER TO WRIST --> */}
      <div
        className="absolute bottom-[47%] right-[22%] h-[33%] w-[9%] hover:bg-yellow-300/20"
        id="shoulderToWrist"
        onClick={handleOverlayClick}
        onMouseOver={handleOverlayHover}
        onMouseLeave={handleOverlayLeave}
        onFocus={handleOverlayHover}
        onKeyDown={handleOverlayClick}
        role="button"
        aria-label="Shoulder to Wrist overlay"
        tabIndex={0}
      />
      {/* <!-- WRIST --> */}
      <div
        className="absolute bottom-[47%] right-[5%] h-[5%] w-[6%]  hover:bg-yellow-300/20"
        id="wrist_0"
        onClick={handleOverlayClick}
        onMouseOver={handleOverlayHover}
        onMouseLeave={handleOverlayLeave}
        onFocus={handleOverlayHover}
        onKeyDown={handleOverlayClick}
        role="button"
        aria-label="Wrist 1 overlay"
        tabIndex={0}
      />
      <div
        id="wrist_1"
        className="absolute bottom-[38%] right-[30%] h-[5%] w-[6%]  hover:bg-yellow-300/20"
        onClick={handleOverlayClick}
        onMouseOver={handleOverlayHover}
        onMouseLeave={handleOverlayLeave}
        onFocus={handleOverlayHover}
        onKeyDown={handleOverlayClick}
        role="button"
        aria-label="Wrist 2 overlay"
        tabIndex={0}
      />
      <div
        id="wrist_2"
        className="absolute bottom-[48%] right-[17%] h-[5%] w-[6%]  hover:bg-yellow-300/20"
        onClick={handleOverlayClick}
        onMouseOver={handleOverlayHover}
        onMouseLeave={handleOverlayLeave}
        onFocus={handleOverlayHover}
        onKeyDown={handleOverlayClick}
        role="button"
        aria-label="Wrist 3 overlay"
        tabIndex={0}
      />
      {/* <!-- BICEP --> */}
      <div
        id="bicep_0"
        className=" absolute right-[5%] top-[30%] h-[5%] w-[8%]  hover:bg-yellow-300/20"
        onClick={handleOverlayClick}
        onMouseOver={handleOverlayHover}
        onMouseLeave={handleOverlayLeave}
        onFocus={handleOverlayHover}
        onKeyDown={handleOverlayClick}
        role="button"
        aria-label="Bicep 1 overlay"
        tabIndex={0}
      />
      <div
        id="bicep_1"
        className="absolute left-[38%] top-[26%] h-[5%] w-[8%]  hover:bg-yellow-300/20"
        onClick={handleOverlayClick}
        onMouseOver={handleOverlayHover}
        onMouseLeave={handleOverlayLeave}
        onFocus={handleOverlayHover}
        onKeyDown={handleOverlayClick}
        role="button"
        aria-label="Bicep 2 overlay"
        tabIndex={0}
      />
      <div
        id="bicep_2"
        className="absolute left-[13%] top-[28%] h-[5%] w-[8%]  hover:bg-yellow-300/20"
        onClick={handleOverlayClick}
        onMouseOver={handleOverlayHover}
        onMouseLeave={handleOverlayLeave}
        onFocus={handleOverlayHover}
        onKeyDown={handleOverlayClick}
        role="button"
        aria-label="Bicep 3 overlay"
        tabIndex={0}
      />
      {/* <!-- SEATBACK --> */}
      <div
        id="seatBack_0"
        className="absolute bottom-[50%] left-[12%] h-[3%] w-[5%]  hover:bg-yellow-300/20"
        onClick={handleOverlayClick}
        onMouseOver={handleOverlayHover}
        onMouseLeave={handleOverlayLeave}
        onFocus={handleOverlayHover}
        onKeyDown={handleOverlayClick}
        role="button"
        aria-label="seatback 1 overlay"
        tabIndex={0}
      />
      <div
        id="seatBack_1"
        className="absolute bottom-[49%] left-[75%] h-[3%] w-[16%]  hover:bg-yellow-300/20"
        onClick={handleOverlayClick}
        onMouseOver={handleOverlayHover}
        onMouseLeave={handleOverlayLeave}
        onFocus={handleOverlayHover}
        onKeyDown={handleOverlayClick}
        role="button"
        aria-label="seatback 2 overlay"
        tabIndex={0}
      />
      {/* <!-- INSEAM --> */}
      <div
        id="inseam"
        className="absolute bottom-[9%] left-[45%] h-[42%] w-[8%]  hover:bg-yellow-300/20"
        onClick={handleOverlayClick}
        onMouseOver={handleOverlayHover}
        onMouseLeave={handleOverlayLeave}
        onFocus={handleOverlayHover}
        onKeyDown={handleOverlayClick}
        role="button"
        aria-label="inseam 1 overlay"
        tabIndex={0}
      />
      {/* <!-- KNEE --> */}
      <div
        id="knee_0"
        className="absolute bottom-[29%] left-[12.5%] h-[5%] w-[8%] hover:bg-yellow-300/20"
        onClick={handleOverlayClick}
        onMouseOver={handleOverlayHover}
        onMouseLeave={handleOverlayLeave}
        onFocus={handleOverlayHover}
        onKeyDown={handleOverlayClick}
        role="button"
        aria-label="knee 1 overlay"
        tabIndex={0}
      />
      <div
        id="knee_1"
        className="absolute bottom-[30%] left-[40%] h-[5%] w-[8%] hover:bg-yellow-300/20"
        onClick={handleOverlayClick}
        onMouseOver={handleOverlayHover}
        onMouseLeave={handleOverlayLeave}
        onFocus={handleOverlayHover}
        onKeyDown={handleOverlayClick}
        role="button"
        aria-label="knee 2 overlay"
        tabIndex={0}
      />
      <div
        id="knee_2"
        className="absolute bottom-[29%] left-[82%] h-[5%] w-[8%] hover:bg-yellow-300/20"
        onClick={handleOverlayClick}
        onMouseOver={handleOverlayHover}
        onMouseLeave={handleOverlayLeave}
        onFocus={handleOverlayHover}
        onKeyDown={handleOverlayClick}
        role="button"
        aria-label="knee 3 overlay"
        tabIndex={0}
      />
      {/* <!-- ANKLE  --> */}
      <div
        id="ankle_0"
        className="absolute bottom-[10%] left-[13%] h-[5%] w-[5%]  hover:bg-yellow-300/20"
        onClick={handleOverlayClick}
        onMouseOver={handleOverlayHover}
        onMouseLeave={handleOverlayLeave}
        onFocus={handleOverlayHover}
        onKeyDown={handleOverlayClick}
        role="button"
        aria-label="ankle 1 overlay"
        tabIndex={0}
      />
      <div
        id="ankle_1"
        className="absolute bottom-[12%] left-[42.5%] h-[5%] w-[5%]  hover:bg-yellow-300/20"
        onClick={handleOverlayClick}
        onMouseOver={handleOverlayHover}
        onMouseLeave={handleOverlayLeave}
        onFocus={handleOverlayHover}
        onKeyDown={handleOverlayClick}
        role="button"
        aria-label="ankle 2 overlay"
        tabIndex={0}
      />
      <div
        id="ankle_1"
        className="absolute bottom-[10%] left-[82%] h-[5%] w-[5%]  hover:bg-yellow-300/20"
        onClick={handleOverlayClick}
        onMouseOver={handleOverlayHover}
        onMouseLeave={handleOverlayLeave}
        onFocus={handleOverlayHover}
        onKeyDown={handleOverlayClick}
        role="button"
        aria-label="ankle 3 overlay"
        tabIndex={0}
      />
    </>
  );
};

export default BodyPartSelectors;
