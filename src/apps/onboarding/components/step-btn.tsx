import type { LucideProps } from "lucide-react";

const StepBtn = ({
  Icon,
  title,
  subtitle,
}: {
  Icon: React.ReactElement<LucideProps>;
  title: string;
  subtitle: string;
}) => {
  return (
    <div className="flex w-full items-center gap-4 p-1 hover:bg-slate-200">
      <figure className="w-fit rounded-full border border-slate-100 bg-white p-2 shadow">
        {Icon}
      </figure>
      <div>
        <p>{title}</p>
        <p className="whitespace-pre-wrap text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
};
export default StepBtn;
