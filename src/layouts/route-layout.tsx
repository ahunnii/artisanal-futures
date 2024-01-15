/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import Navbar from "~/components/navbar";
import { api } from "~/utils/api";

const RouteLayout = ({ children }: { children: React.ReactNode }) => {
  const apiContext = api.useContext();
  const updateStore = () => {
    // void cart.verifyValues();

    // void useCart.persist.rehydrate();
    void apiContext.finalizedRoutes.getAllFormattedFinalizedRoutes.invalidate();
    void apiContext.finalizedRoutes.getFinalizedRoute.invalidate();
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", updateStore);
    window.addEventListener("focus", updateStore);
    return () => {
      document.removeEventListener("visibilitychange", updateStore);
      window.removeEventListener("focus", updateStore);
    };
  }, []);

  return (
    <main className="fixed flex h-full w-full flex-col ">
      <Navbar />
      <div className="relative flex h-full  flex-col-reverse  bg-slate-50 p-2  max-md:overflow-auto md:flex-row lg:h-[calc(100vh-64px)]">
        {children}
      </div>
    </main>

    // <main className="flex h-full flex-col">
    //   <Navbar />
    //   <div className="relative flex min-h-0 flex-1">{children}</div>
    // </main>
  );
};
export default RouteLayout;
