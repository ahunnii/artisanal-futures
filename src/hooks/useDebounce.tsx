/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import useTimeout from "./useTimeout";

export default function useDebounce(
  callback: () => unknown,
  delay: number,
  dependencies: unknown
) {
  const { reset, clear } = useTimeout(callback, delay);
  useEffect(reset, [...[dependencies], reset]);
  useEffect(clear, []);
}
