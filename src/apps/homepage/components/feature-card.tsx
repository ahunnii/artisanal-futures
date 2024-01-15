import type { FC } from "react";

interface IProps {
  title: string;
  text: string;
  icon: JSX.Element;
  onClick: () => void;
}
const FeatureCard: FC<IProps> = ({ title, text, icon, onClick }) => {
  return (
    <div
      className="hover:gray-100 h-full min-h-full cursor-pointer bg-white pb-8 pt-8 text-center hover:shadow-md"
      onClick={onClick}
    >
      <div className="aspect-[2.618]">
        <span className="mb-1 flex h-16 min-h-full w-full items-center justify-center rounded-full">
          {icon}
        </span>
        <h2 className="slate-700 text-2xl font-bold">{title}</h2>
        <p className="slate-300">{text}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
