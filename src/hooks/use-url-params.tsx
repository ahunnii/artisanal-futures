import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Param = {
  key: string;
  value: number | string | null;
};
export const useUrlParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    if (pending && pathname) {
      console.log("test1");
      void router.replace(`${pathname}?${pending}`);
      setPending(null);
    }
  }, [pathname, pending]);

  const updateUrlParams = ({ key, value }: Param) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      console.log("test3");
      params.set(`${key}`, `${value}`);
    } else {
      console.log("test2");
      params.delete(`${key}`);
    }
    if (!pathname) setPending(`${params.toString()}`);
    else void router.replace(`${pathname}?${params.toString()}`);
  };

  const testUrlParams = ({ key, value }: Param) => {
    console.log("updateUrlParams", key, value);
    const params = new URLSearchParams(searchParams);
    console.log("params", params);
    console.log(pathname);
    if (value) {
      params.set(`${key}`, `${value}`);
    } else {
      params.delete(`${key}`);
    }
    console.log(`${pathname}?${params.toString()}`);
  };

  const getUrlParam = (key: string) => {
    return searchParams.get(key);
  };

  return {
    updateUrlParams,
    getUrlParam,
    pathname,
    testUrlParams,
  };
};
