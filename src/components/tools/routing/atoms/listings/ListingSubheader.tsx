import type { ReactNode } from "react";

type PropsType = {
  children?: ReactNode;
};

export default function ListingSubheader(props: PropsType) {
  return <h4 className="text-xs font-medium leading-4">{props.children}</h4>;
}
