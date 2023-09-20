"use client";

import type { FC } from "react";
import { ClipLoader } from "react-spinners";

interface IProps {
  size?: number;
}
export const Loader: FC<IProps> = ({ size = 50 }) => {
  return <ClipLoader color="#3498db" size={size} />;
};
