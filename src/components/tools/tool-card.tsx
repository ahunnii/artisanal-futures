/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { FC } from "react";

interface IAppCardProps {
  title: string;
  subtitle: string;
  image: string;
  url: string;
  type?: string;
}

const ToolCard: FC<IAppCardProps> = ({ title, subtitle, image, url }) => {
  return (
    <Link
      className="group h-full cursor-pointer "
      href={url}
      target={url.includes(".app") || url.includes(".dev") ? "_blank" : ""}
    >
      <div className="md:max-w-s mx-auto my-3 flex h-full w-10/12 flex-col items-center overflow-hidden rounded-lg shadow-lg transition-all duration-200 group-hover:bg-slate-500 group-active:shadow-lg group-active:shadow-blue-200 lg:max-w-xs ">
        <img
          className="aspect-square w-full rounded-t-lg object-cover transition-all duration-200 group-hover:contrast-75"
          src={image}
          alt={title}
        />
        <div className="w-full px-4 py-2 ">
          <h1 className="text-xl font-semibold text-gray-700 transition-all duration-200 group-hover:text-white">
            {title}
          </h1>
          <p className="mt-1 text-sm text-gray-500 transition-all duration-200 group-hover:text-white">
            {subtitle}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;
