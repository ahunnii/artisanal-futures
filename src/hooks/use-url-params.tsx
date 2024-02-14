import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

type Param = {
  key: string;
  value: number | string | null;
};
export const useUrlParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateUrlParams = ({ key, value }: Param) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(`${key}`, `${value}`);
    } else {
      params.delete(`${key}`);
    }
    void router.replace(`${pathname}?${params.toString()}`);
  };

  const getUrlParam = (key: string) => {
    return searchParams.get(key);
  };

  return {
    updateUrlParams,
    getUrlParam,
  };
};
