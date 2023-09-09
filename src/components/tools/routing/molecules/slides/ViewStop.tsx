import { Dialog, Transition } from "@headlessui/react";
import { Hint } from "~/components/tools/routing/atoms";

import { X } from "lucide-react";
import { Fragment, createRef, useEffect, useState, type FC } from "react";

import type { Location } from "~/types";
import { convertTime } from "~/utils/routing";

interface IProps {
  open: boolean;
  stop: Location;
  setOpen: (open: boolean) => void;
}
const ViewStop: FC<IProps> = ({ open, setOpen, stop }) => {
  const tableData = createRef<HTMLFormElement>();

  const [initData, setInitData] = useState<Location>(stop);

  useEffect(() => {
    if (stop) setInitData(stop);
  }, [open, stop]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
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
                        onClick={() => setOpen(false)}
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <X className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-full flex-col bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <Dialog.Title className="text-3xl font-semibold leading-6 text-gray-900">
                        View Stop
                      </Dialog.Title>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <form ref={tableData} className="flex h-full flex-col">
                        <section>
                          <div className="flex flex-row  gap-4 p-2">
                            <label className="w-3/5">
                              <span>Customer Name</span>
                              <input
                                type="text"
                                name="customer_name"
                                placeholder="e.g. Bob Smith"
                                className="h-12  w-full items-center space-x-3 rounded-lg bg-slate-50 px-4 text-left text-slate-800 shadow-sm  ring-slate-900/10 placeholder:text-slate-400 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 sm:flex "
                                value={initData?.customer_name}
                                readOnly
                              />
                            </label>
                          </div>
                          <div className="flex flex-row  gap-4 p-2">
                            <label className="w-full">
                              <span>Address</span>
                              <input
                                type="text"
                                name="address"
                                placeholder="e.g. 123 Main St"
                                className="h-12  w-full items-center space-x-3 rounded-lg bg-slate-50 px-4 text-left text-slate-800 shadow-sm  ring-slate-900/10 placeholder:text-slate-400 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 sm:flex "
                                value={initData?.address}
                                readOnly
                              />
                            </label>
                          </div>
                          <div className="flex gap-4 p-2">
                            <label>
                              <Hint
                                label="Drop Off Duration"
                                description="How long (roughly in minutes) should the drop off take? This is from when the driver
																arrives at the stop to when they leave."
                              />
                              <input
                                name="drop_off_duration"
                                type="number"
                                className="h-12  w-full items-center space-x-3 rounded-lg bg-slate-50 px-4 text-left text-slate-800 shadow-sm ring-slate-900/10 placeholder:text-slate-400 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 sm:flex "
                                value={initData?.drop_off_duration}
                                readOnly
                                aria-label="Drop Off Duration"
                              />
                            </label>
                            <label>
                              <Hint
                                label="Priority"
                                description="	On a scale of 1 to 100, with 1 being the highest and 100 being the lowest, rate the
															priority of this stop."
                              />
                              <input
                                name="priority"
                                type="number"
                                className="h-12  w-full items-center space-x-3 rounded-lg bg-slate-50 px-4 text-left text-slate-800 shadow-sm ring-slate-900/10 placeholder:text-slate-400 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 sm:flex "
                                value={initData?.priority}
                                readOnly
                                aria-label="Priority"
                              />
                            </label>
                          </div>

                          <div className="flex flex-col p-2 ">
                            <Hint
                              label="Time Windows"
                              description="When can the delivery be made? If you don't have a time window, leave this blank."
                            />

                            <div className="mt-4 w-1/2 rounded-lg bg-slate-50 shadow-sm">
                              {initData.time_windows.map((tw, index) => (
                                <div
                                  key={index}
                                  className="flex h-6 items-center  gap-4 p-2 odd:bg-slate-200"
                                >
                                  {convertTime(tw.startTime)} to{" "}
                                  {convertTime(tw.endTime)}
                                </div>
                              ))}
                            </div>
                          </div>
                        </section>
                        <div className="mt-auto flex w-full justify-end py-4">
                          <button
                            onClick={() => setOpen(false)}
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          >
                            Close
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
export default ViewStop;
