import type { FC, MouseEventHandler, ReactNode } from "react";

interface BtnProps {
  clickHandler: MouseEventHandler;
  children: ReactNode;
}
const ApproveBtn: FC<BtnProps> = ({ clickHandler, children }) => {
  return (
    <button
      type="button"
      onClick={clickHandler}
      className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
    >
      {children}
    </button>
  );
};
export default ApproveBtn;
