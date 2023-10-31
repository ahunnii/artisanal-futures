import { Dialog, Transition } from "@headlessui/react";

import { X } from "lucide-react";
import { Fragment, type FC } from "react";

import { Separator } from "~/components/ui/separator";
import { useSheet } from "~/hooks/routing/use-sheet";
import type { Stop } from "../types";
import { StopForm } from "./stop_form";

interface IProps {
  stop?: Stop | null;
}
const FulfillmentSheet: FC<IProps> = ({ stop }) => {
  const { isOpen, onClose, isViewOnly } = useSheet();

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-xl">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute right-0 top-0 -mr-8 flex pr-2 pt-4 sm:-mr-0 sm:pr-4">
                      <button
                        type="button"
                        className="relative rounded-md text-slate-600 hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={onClose}
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <X className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-full flex-col bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <Dialog.Title className="text-lg font-semibold text-foreground">
                        {isViewOnly
                          ? "View Stop"
                          : stop
                          ? "Edit Stop"
                          : "Add Stop"}
                      </Dialog.Title>
                      <Dialog.Description className="text-sm text-slate-500">
                        Fill out the table below to start adding destinations to
                        the map.
                      </Dialog.Description>
                    </div>
                    <div className="relative mt-6 flex flex-1 grow flex-col px-4 sm:px-6">
                      {isViewOnly ? (
                        <div className=" flex  flex-col  space-y-8">
                          <div>
                            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                              Name
                            </h4>{" "}
                            <p className="leading-7 [&:not(:first-child)]:mt-2">
                              {stop?.customer_name}
                            </p>
                          </div>

                          <div>
                            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                              Fulfillment Address
                            </h4>
                            <p className="leading-7 [&:not(:first-child)]:mt-2">
                              {stop?.address}
                            </p>

                            <p className="mt-2 text-sm text-muted-foreground">
                              Coordinates are <br /> Lat:{" "}
                              {stop?.coordinates?.latitude ?? 0} &nbsp; Lng:{" "}
                              {stop?.coordinates?.longitude ?? 0}
                            </p>
                          </div>

                          <div className="flex gap-4">
                            <div>
                              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                                Drop Off Duration
                              </h4>

                              <p className="leading-7 [&:not(:first-child)]:mt-2">
                                {stop?.drop_off_duration}
                              </p>
                            </div>
                            <Separator orientation="vertical" />
                            <div>
                              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                                Priority
                              </h4>

                              <p className="leading-7 [&:not(:first-child)]:mt-2">
                                {stop?.priority}
                              </p>
                            </div>
                          </div>

                          <div>
                            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                              Time Windows
                            </h4>
                            <div className="flex max-h-96 flex-col overflow-y-auto">
                              {stop?.time_windows?.map((item, index) => (
                                <div
                                  key={index}
                                  className="my-2 flex items-center space-x-4"
                                >
                                  <p className="leading-7 ">{item.startTime}</p>

                                  <p className="leading-7 ">{item.endTime}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <StopForm
                          initialData={stop ?? null}
                          callback={onClose}
                        />
                      )}
                    </div>
                  </div>{" "}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
export default FulfillmentSheet;
