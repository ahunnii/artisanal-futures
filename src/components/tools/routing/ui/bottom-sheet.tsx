/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useRef, useState, type FC } from "react";

import { X } from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

import { Button } from "~/components/ui/button";

import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

type TProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  isDisabled?: boolean;
  handleOnClick?: () => void;
};

const BottomSheet: FC<TProps> = ({
  children,
  title,
  isDisabled = false,
  handleOnClick,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const bottomSheetRef = useRef(null);
  function useOutsideAlerter(ref: any) {
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (ref.current && !ref.current.contains(event.target)) {
          setOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  useOutsideAlerter(bottomSheetRef);

  const handleButton = () => {
    if (handleOnClick) handleOnClick();

    setOpen(true);
  };

  return (
    <>
      {" "}
      {/* <>
        <Button
          onClick={handleButton}
          variant={"ghost"}
          className="w-full"
          disabled={isDisabled}
        >
          {title}
        </Button>
      </>
      <motion.div
        animate={
          open ? { opacity: 0.6, zIndex: 3 } : { opacity: 0, display: "none" }
        }
        initial={{ opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 top-0 h-full w-screen bg-black"
      />
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { y: 0, height: "auto" },
              collapsed: { y: "100%", height: 0 },
            }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="fixed bottom-0 left-0 right-0 z-10 w-full rounded-t-3xl border-2 border-b-0 border-gray-50 bg-white shadow-[0px_-8px_20px_-6px_rgba(0,0,0,0.3)]"
          >
            <div ref={bottomSheetRef} className="h-[75vh]  p-2">
              <div className="mb-2 flex justify-end">
                <X className="w-6" onClick={() => setOpen(false)} />
              </div>
              <ScrollArea className="h-[calc(100%-64px)] gap-5 p-4">
                {children}
              </ScrollArea>
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            onClick={handleButton}
            variant={"ghost"}
            className="w-full"
            disabled={isDisabled}
          >
            {title}
          </Button>
        </SheetTrigger>

        <SheetContent
          side={"bottom"}
          className=" flex h-[75vh]    flex-col rounded-t-3xl p-2"
        >
          {" "}
          <SheetHeader className=" pt-4 ">
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100%-64px)] w-full gap-5 p-4">
            {children}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default BottomSheet;
