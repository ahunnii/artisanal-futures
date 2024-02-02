import { ReadonlyURLSearchParams } from "next/navigation";

export const updateRouteSearchParams = (
  key: number | string | null,
  value: string | null,
  searchParams: ReadonlyURLSearchParams
) => {
  const params = new URLSearchParams(searchParams);

  if (value) {
    params.set(`${key}`, `${value}`);
  } else {
    params.delete(`${value}`);
  }
  return params.toString();
};
