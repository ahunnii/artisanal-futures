import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useDriverVehicleBundles } from "../../hooks/drivers/use-driver-vehicle-bundles";
import DriverForm from "./driver-form";

export const DriverDepotEdit = () => {
  const { drivers } = useDriverVehicleBundles();
  const handleOnOpenChange = (state: boolean) => {
    if (!state) drivers.setActiveById(null);
    drivers.setIsEditOpen(state);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="box absolute h-full max-w-2xl"
        initial={{ opacity: 0, x: 0 }}
        animate={{ opacity: 1, x: 500 }}
        exit={{ opacity: 0, x: 0 }}

        // transition={{
        //   duration: 0.5,
        //   ease: "easeInOut",
        //   times: [0, 1],
        //   repeat: 0,
        // }}
      >
        <div className="bg-orange-500">
          <h3 className="text-lg font-semibold">Edit Driver</h3>
          <DriverForm
            handleOnOpenChange={handleOnOpenChange}
            activeDriver={drivers.currentDriver}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
