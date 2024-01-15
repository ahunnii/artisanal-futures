import { useCallback, useEffect } from "react";

import { api } from "~/utils/api";
import Navbar from "./components/ui/navbar";

const RouteLayout = ({ children }: { children: React.ReactNode }) => {
  const apiContext = api.useContext();

  const updateStore = useCallback(() => {
    void apiContext.finalizedRoutes.getAllFormattedFinalizedRoutes.invalidate();
    void apiContext.finalizedRoutes.getFinalizedRoute.invalidate();
  }, [apiContext]);

  useEffect(() => {
    document.addEventListener("visibilitychange", updateStore);
    window.addEventListener("focus", updateStore);
    return () => {
      document.removeEventListener("visibilitychange", updateStore);
      window.removeEventListener("focus", updateStore);
    };
  }, [updateStore]);

  return (
    <main className="fixed flex h-full w-full flex-col ">
      <Navbar />
      <div className="relative flex h-full  flex-col-reverse  bg-slate-50 p-2  max-md:overflow-auto md:flex-row lg:h-[calc(100vh-64px)]">
        {children}
      </div>
    </main>
  );
};
export default RouteLayout;
