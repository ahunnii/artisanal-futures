import { Dialog, Transition } from "@headlessui/react";

import axios from "axios";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import { Fragment } from "react";
import type { RouteData, StepData } from "../types";
import { CurrentStopForm } from "./current-stop-form";

export default function StopDetails({
  stop,
  open,
  setOpen,

  route,
}: {
  stop: StepData;
  open: boolean;
  setOpen: (open: boolean) => void;
  handleOnMessage?: ({
    body,
    address,
    status,
  }: {
    body: string;
    address: string;
    status: string;
  }) => void;
  route?: RouteData;
}) {
  const { address } = JSON.parse(stop.description ?? "{}");
  const { data: session } = useSession();

  const sendMessage = ({
    deliveryNotes,
    status,
  }: {
    deliveryNotes: string;
    status?: "success" | "failed" | "pending";
  }) => {
    axios
      .post("/api/contact-dispatch", {
        userId: session?.user?.id ?? 0,
        deliveryNotes,
        address,
        status,
        route,
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    // <Transition.Root show={open} as={Fragment}>
    //   <Dialog as="div" className="relative z-10" onClose={setOpen}>
    //     <Transition.Child
    //       as={Fragment}
    //       enter="ease-in-out duration-500"
    //       enterFrom="opacity-0"
    //       enterTo="opacity-100"
    //       leave="ease-in-out duration-500"
    //       leaveFrom="opacity-100"
    //       leaveTo="opacity-0"
    //     >
    //       <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
    //     </Transition.Child>

    //     <div className="fixed inset-0 overflow-hidden">
    //       <div className="absolute inset-0 overflow-hidden">
    //         <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
    //           <Transition.Child
    //             as={Fragment}
    //             enter="transform transition ease-in-out duration-500 sm:duration-700"
    //             enterFrom="translate-x-full"
    //             enterTo="translate-x-0"
    //             leave="transform transition ease-in-out duration-500 sm:duration-700"
    //             leaveFrom="translate-x-0"
    //             leaveTo="translate-x-full"
    //           >
    //             <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
    //               <Transition.Child
    //                 as={Fragment}
    //                 enter="ease-in-out duration-500"
    //                 enterFrom="opacity-0"
    //                 enterTo="opacity-100"
    //                 leave="ease-in-out duration-500"
    //                 leaveFrom="opacity-100"
    //                 leaveTo="opacity-0"
    //               >
    //                 <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
    //                   <button
    //                     type="button"
    //                     className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
    //                     onClick={() => setOpen(false)}
    //                   >
    //                     <span className="absolute -inset-2.5" />
    //                     <span className="sr-only">Close panel</span>
    //                     <X className="h-6 w-6" aria-hidden="true" />
    //                   </button>
    //                 </div>
    //               </Transition.Child>
    //               <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
    //                 <div className="px-4 sm:px-6">
    //                   <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
    //                     Panel title
    //                   </Dialog.Title>
    //                 </div>
    //                 <div className="relative mt-6 flex-1 px-4 sm:px-6">
    //                   {/* Your content */}
    //                 </div>
    //               </div>
    //             </Dialog.Panel>
    //           </Transition.Child>
    //         </div>
    //       </div>
    //     </div>
    //   </Dialog>
    // </Transition.Root>

    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden"
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="transform transition ease-in-out duration-500 sm:duration-700"
          enterFrom="translate-y-full"
          enterTo="translate-y-3/5"
          leave="transform transition ease-in-out duration-500 sm:duration-700"
          leaveFrom="translate-y-3/5"
          leaveTo="translate-y-full"
        >
          <Dialog.Panel className="absolute inset-x-0 bottom-0 flex h-2/5 flex-col bg-white shadow-xl">
            <div className="flex items-start justify-between px-4 py-6 sm:px-6">
              <Dialog.Title className="text-lg font-medium text-gray-900">
                {address}
              </Dialog.Title>
              <button
                type="button"
                className="rounded-md text-gray-400 hover:text-gray-500"
                onClick={() => setOpen(false)}
              >
                <span className="sr-only">Close panel</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className=" relative flex-1 overflow-y-scroll px-6 py-2">
              <CurrentStopForm callback={sendMessage} />
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
}
