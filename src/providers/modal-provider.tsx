import { useEffect, useState } from "react";

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
    </>
  );
};
