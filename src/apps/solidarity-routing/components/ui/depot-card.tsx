import { ChevronRight } from "lucide-react";
import { type FC } from "react";

import { cn } from "~/utils/styles";

type TDepotCard = {
  isActive: boolean;
  title: string;
  subtitle?: string;
  onEdit: () => void;
};

const DepotCard: FC<TDepotCard> = ({ isActive, title, subtitle, onEdit }) => {
  return (
    <div
      className={cn(
        "flex w-full cursor-pointer items-center justify-between p-3 text-left font-medium shadow odd:bg-slate-300/50 even:bg-slate-100 hover:ring-1 hover:ring-slate-800/30",
        isActive && "odd:bg-indigo-300/50 even:bg-indigo-100"
      )}
      onClick={onEdit}
      aria-label="Click to edit"
    >
      <span className="group w-10/12 cursor-pointer">
        <h2
          className={cn(
            "text-sm font-bold capitalize ",
            isActive ? "text-indigo-800 " : "text-slate-800 "
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <h3
            className={cn(
              "text-xs font-medium text-slate-800/80",
              isActive && "text-indigo-800/80"
            )}
          >
            {subtitle}
          </h3>
        )}
      </span>
      <ChevronRight className="text-slate-800 group-hover:bg-opacity-30" />
    </div>
  );
};

export default DepotCard;
