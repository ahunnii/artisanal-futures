import type { ReactNode } from "react";

type PropsType = {
  children?: ReactNode;
};

export default function ListingHeader(props: PropsType) {
  return <h3 className="text-sm font-medium leading-5">{props.children}</h3>;
}
