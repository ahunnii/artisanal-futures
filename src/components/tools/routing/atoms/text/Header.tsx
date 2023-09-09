import type { ReactNode } from "react";

type PropsType = {
  children?: ReactNode;
};

export default function Header(props: PropsType) {
  return (
    <h2 className=" title-font mb-4 text-3xl font-medium text-gray-900 sm:text-4xl">
      {props.children}
    </h2>
  );
}
