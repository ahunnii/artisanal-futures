import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { Fragment, createRef, useEffect, useState, type FC } from "react";
import { Hint } from "~/components/tools/routing/atoms";

import type { Driver } from "~/types";

import { convertTime } from "~/utils/routing";

interface IProps {
  open: boolean;
  stop: Driver;
  setOpen: (open: boolean) => void;
}
const ViewDriver: FC<IProps> = ({ open, setOpen, stop }) => {
  const tableData = createRef<HTMLFormElement>();

  const [initData, setInitData] = useState<Driver>(stop);

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
                        View Driver
                      </Dialog.Title>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {" "}
                      <form ref={tableData} className="flex h-full flex-col">
                        <section>
                          <div className="flex flex-row  gap-4 p-2">
                            <label className="w-3/5">
                              <span>Driver&apos;s Name</span>
                              <input
                                type="text"
                                name="name"
                                placeholder="e.g. Jen Smith"
                                className="h-12  w-full items-center space-x-3 rounded-lg bg-slate-100 px-4 text-left text-slate-800 shadow-sm  ring-slate-900/10 placeholder:text-slate-400 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 sm:flex "
                                value={initData?.name}
                                readOnly
                              />
                            </label>{" "}
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
                            {/* <AutocompleteAddressInput
                              setData={setAddress}
                              editValue={{
                                display_name: initData.address,
                                lat: initData?.coordinates?.latitude as number,
                                lon: initData?.coordinates?.longitude as number,
                                place_id: 0,
                              }}
                            /> */}
                          </div>
                          <div className="flex gap-4 p-2">
                            <label>
                              <Hint
                                label="Max Travel Time"
                                description="How long (roughly in minutes) should the driver take for any given stop?"
                              />
                              <input
                                name="max_travel_time"
                                type="number"
                                className="h-12  w-full items-center space-x-3 rounded-lg bg-slate-100 px-4 text-left text-slate-800 shadow-sm ring-slate-900/10 placeholder:text-slate-400 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 sm:flex "
                                value={initData?.max_travel_time}
                                readOnly
                                aria-label="Max Travel Time"
                              />
                            </label>
                            <label>
                              <Hint
                                label="Max Stops"
                                description="How many stops can the driver make?"
                              />
                              <input
                                name="max_stops"
                                type="number"
                                className="h-12  w-full items-center space-x-3 rounded-lg bg-slate-100 px-4 text-left text-slate-800 shadow-sm ring-slate-900/10 placeholder:text-slate-400 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 sm:flex "
                                value={initData?.max_stops}
                                readOnly
                                aria-label="Max Stops"
                              />
                            </label>
                          </div>

                          <div className="flex flex-col p-2">
                            <Hint
                              label="Time Window"
                              description="How long is their shift? What is the time window in which they can deliver the order?"
                            />

                            <div className="flex items-center gap-4">
                              <label>
                                <span className="sr-only">Start Time</span>
                                <input
                                  type="time"
                                  value={initData?.time_window.startTime}
                                  onChange={(e) =>
                                    setInitData({
                                      ...initData,
                                      time_window: {
                                        ...initData.time_window,
                                        startTime: e.target.value,
                                      },
                                    })
                                  }
                                  className="h-12  w-full items-center space-x-3 rounded-lg bg-slate-100 px-4 text-left text-slate-800 shadow-sm ring-slate-900/10 placeholder:text-slate-400 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 sm:flex "
                                />
                              </label>

                              <span> to </span>
                              <label htmlFor="">
                                <span className="sr-only">End Time</span>
                                <input
                                  type="time"
                                  value={initData?.time_window.endTime}
                                  onChange={(e) =>
                                    setInitData({
                                      ...initData,
                                      time_window: {
                                        ...initData.time_window,
                                        endTime: e.target.value,
                                      },
                                    })
                                  }
                                  className="h-12  w-full items-center space-x-3 rounded-lg bg-slate-100 px-4 text-left text-slate-800 shadow-sm ring-slate-900/10 placeholder:text-slate-400 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 sm:flex "
                                />
                              </label>
                            </div>
                          </div>
                          <div className="flex flex-col p-2 ">
                            <Hint
                              label="Break Slots"
                              description="When can the driver take a break?"
                            />

                            <div className="mt-4 w-full">
                              {initData?.break_slots?.map((slot, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-4 py-0.5 "
                                >
                                  <span>{slot.service} min: </span>

                                  {slot.time_windows.map((tw, idx) => (
                                    <span
                                      className="flex flex-wrap items-center gap-2 odd:bg-slate-200"
                                      key={idx}
                                    >
                                      <span>
                                        {convertTime(tw.startTime)} to{" "}
                                        {convertTime(tw.endTime)}
                                      </span>

                                      {idx !== slot.time_windows.length - 1 && (
                                        <>&#44; </>
                                      )}
                                    </span>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        </section>
                        <div className="mt-auto flex w-full py-4">
                          <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          >
                            Cancel
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
export default ViewDriver;
