import { useEffect, useState } from "react";
import { ShopModal } from "~/components/admin/modals/shop-modal";

import { ModifyModal } from "~/components/tools/routing/ui/modify-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <ModifyModal />
      <ShopModal />
    </>
  );
};
