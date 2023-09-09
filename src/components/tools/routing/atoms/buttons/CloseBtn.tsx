import type { FC, MouseEventHandler, ReactNode } from "react";

interface BtnProps {
  clickHandler: MouseEventHandler;

  children: ReactNode;
}
const CloseBtn: FC<BtnProps> = ({ clickHandler, children }) => {
  return (
    <button
      type="button"
      onClick={clickHandler}
      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-opacity-30 disabled:text-opacity-50 hover:disabled:bg-blue-100 hover:disabled:bg-opacity-30"
    >
      {children}
    </button>
  );
};
export default CloseBtn;
