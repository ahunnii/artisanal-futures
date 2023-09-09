import type { FC, MouseEventHandler } from "react";

interface BtnProps {
  clickHandler: MouseEventHandler;
  isDisabled: boolean;
}
const NextBtn: FC<BtnProps> = ({ clickHandler, isDisabled }) => {
  return (
    <button
      onClick={clickHandler}
      className="w-6/12 rounded bg-slate-700 px-6 py-2 text-base font-semibold text-white disabled:bg-slate-400"
      disabled={isDisabled}
    >
      Next
    </button>
  );
};
export default NextBtn;
