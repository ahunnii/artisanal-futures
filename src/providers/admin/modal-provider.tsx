"use client";

import { useEffect, useState } from "react";

import { ShopModal } from "~/components/admin/modals/shop-modal";

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
      <ShopModal />
    </>
  );
};
