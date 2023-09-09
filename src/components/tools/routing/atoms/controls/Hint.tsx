import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import type { FC } from "react";

interface IProps {
  label: string;
  description: string;
}

/**
 * Label for inputs that require a hint. Activated on hover with pure CSS.
 */
const Hint: FC<IProps> = ({ label, description }) => {
  return (
    <span className="flex gap-4">
      {label}{" "}
      <span className="group relative w-max">
        <QuestionMarkCircledIcon className="h-6 w-6 text-slate-400" />
        <span className="pointer-events-none absolute -top-7 left-0 w-max max-w-md rounded-md border border-slate-300 bg-slate-200 p-2 text-slate-500 opacity-0 shadow-md transition-opacity group-hover:opacity-100">
          {description}
        </span>
      </span>
    </span>
  );
};

export default Hint;
