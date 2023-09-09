import type { ReactNode } from "react";

type PropsType = {
  children?: ReactNode;
};

export default function Subheader(props: PropsType) {
  return <p className="mb-4 leading-relaxed">{props.children}</p>;
}
