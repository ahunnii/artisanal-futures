import { Children, type ReactNode } from "react";

type PropsType = {
  children?: ReactNode;
};
const ListingUnorderedList = (props: PropsType) => {
  return (
    <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
      {" "}
      {Children.map(props.children, (child) => {
        return <li>{child}</li>;
      })}
    </ul>
  );
};

export default ListingUnorderedList;
