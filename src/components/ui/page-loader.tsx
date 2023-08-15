"use client";

import { Loader } from "~/components/ui/loader";

const PageLoader = () => {
  return (
    <div className="my-auto flex h-full w-full items-center justify-center">
      <Loader />
    </div>
  );
};

export default PageLoader;
