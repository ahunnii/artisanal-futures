import type { ReadonlyURLSearchParams } from "next/navigation";

export const updateSearchParams = ({
  id,
  searchParams,
  type,
}: {
  id: number | string | null;
  type: "driver" | "vehicle" | "client" | "stop" | "job";
  searchParams: ReadonlyURLSearchParams;
}) => {
  const params = new URLSearchParams(searchParams);

  if (id) params.set(`${type}Id`, `${id}`);
  else params.delete(`${type}Id`);

  return params.toString();
  //   void router.replace(`${pathname}?${params.toString()}`);
};
