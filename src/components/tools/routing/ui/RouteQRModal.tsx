import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
// import PhoneInputWithCountry from "react-phone-number-input";
import { toast } from "react-hot-toast";
import "react-phone-number-input/style.css";
// import type { NextApiResponse } from "next";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import { ArrowRight } from "lucide-react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dialog as ShadDialog,
} from "~/components/ui/dialog";
import type { RouteData } from "../types";
import RouteQRCode from "./RouteQRCode";
interface IProps {
  data: RouteData;
}

const RouteQRModal = ({ data }: IProps) => {
  const { name: driverName } = JSON.parse(data.description ?? "{}");

  const [isOpen, setIsOpen] = useState(false);

  const [fileID, setFileID] = useState("");

  const closeModal = () => setIsOpen(false);
  const [value, setValue] = useState<string>();

  const openModal = async () => {
    if (data) {
      // Take that name and shorten it to 50 characters, making sure that it it stays unique. data.geometry must always turn into this
      const fileName = data.geometry
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()
        .substring(0, 50);

      const listData = await fetch("/api/routing").then((res) => res.json());

      //Check if file name exists in listData
      if (listData) {
        const fileExists = listData.some(
          (file: File) => file.name === `${fileName}.json`
        );
        if (!fileExists) {
          await fetch("/api/routing", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              file: data,
              fileName: fileName,
            }),
          })
            .then((res) => res.json())

            .then((data) => {
              if (data.error) {
                console.error("Error uploading files:", data.error as string);
                setFileID("");
                setIsOpen(false);
                throw new Error(data.error as string);
              }

              console.log("File uploaded successfully:", data.data);
              setFileID(fileName);
              setIsOpen(true);
            })
            .catch((error) => {
              console.error("Error uploading files:", error);
              setFileID("");
              setIsOpen(false);
            });
        } else {
          console.log("File already exists", `${fileName}.json`);
          setFileID(fileName);
          setIsOpen(true);
        }
      }
    }
  };

  // const sendLink = async () => {
  //   if (!value) return;
  //   if (!validE164(value)) {
  //     alert("Please enter a valid phone number");
  //     return;
  //   }

  //   const res = await fetch("/api/sendMessage", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       to: value,
  //       body: `Here is your route for today: https://af-routing-app.vercel.app/route?data=${fileID}`,
  //     }),
  //   });

  //   const data = await res.json();

  //   if (data.success) {
  //     alert("Message was sent successfully!");
  //   } else {
  //     alert("There seems to be an error. Please try again later.");
  //   }
  // };
  const sendEmail = async () => {
    if (!value) return;

    const res = await fetch("/api/send-route", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: value,
        body: `Here is your route for today: https://artisanalfutures.org/tools/routing/${fileID}`,
      }),
    });

    const data = await res.json();

    if (data.id) {
      toast.success("Message was sent successfully!");
    } else {
      console.log(data);
      toast.error("There seems to be an error. Please try again later.");
    }
  };

  return (
    <>
      <button
        type="button"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={openModal}
        className="rounded-md  px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        <span className="sr-only">Generate QR Code</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
          />
        </svg>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Route QR Code for {driverName}
                  </Dialog.Title>
                  <div className="mt-2 h-full w-full">
                    {fileID && <RouteQRCode url={fileID} />}
                  </div>
                  <Link
                    href={`/tools/routing/${encodeURIComponent(fileID)}`}
                    target="_blank"
                  >
                    Link to generated route
                  </Link>

                  <div className="py-5">
                    <label className="block py-2 text-lg font-medium text-slate-700">
                      Driver&apos;s Email
                    </label>
                    {/* <div className="  flex  w-full flex-row  gap-4 rounded-md   text-lg sm:text-sm">
                      <PhoneInputWithCountry
                        className="flex flex-1 text-sm"
                        placeholder="Enter phone number"
                        value={value}
                        onChange={setValue}
                        countrySelectProps={{
                          className: "flex flex-row",
                        }}
                        numberInputProps={{
                          className:
                            "items-center  w-full h-12 px-4 space-x-3 text-left bg-slate-100 rounded-lg shadow-sm sm:flex  ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400 text-slate-800 ", // my Tailwind classes
                        }}
                      />
                      <button
                        className="rounded bg-green-500 px-2 font-semibold text-white"
                        onClick={void sendLink}
                      >
                        Send Link
                      </button>
                    </div> */}

                    <div className=" flex  w-full flex-row  gap-4 rounded-md   text-lg sm:text-sm">
                      <Input
                        className="flex flex-1 text-sm"
                        placeholder="Enter email address"
                        type="email"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                      />
                      <Button
                        className="rounded bg-green-500 px-2 font-semibold text-white"
                        onClick={() => void sendEmail()}
                      >
                        Send Link
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 flex w-full gap-x-2">
                    <button
                      type="button"
                      className="mr-auto inline-flex justify-center rounded-md border border-transparent bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export const DynamicRouteQRModal = ({ data }: IProps) => {
  const { name: driverName } = JSON.parse(data.description ?? "{}");

  const [isOpen, setIsOpen] = useState(false);

  const [fileID, setFileID] = useState("");

  const closeModal = () => setIsOpen(false);
  const [value, setValue] = useState<string>();

  const openModal = async () => {
    if (data) {
      // Take that name and shorten it to 50 characters, making sure that it it stays unique. data.geometry must always turn into this
      const fileName = data.geometry
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()
        .substring(0, 50);

      const listData = await fetch("/api/routing").then((res) => res.json());

      //Check if file name exists in listData
      if (listData) {
        const fileExists = listData.some(
          (file: File) => file.name === `${fileName}.json`
        );
        if (!fileExists) {
          await fetch("/api/routing", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              file: data,
              fileName: fileName,
            }),
          })
            .then((res) => res.json())

            .then((data) => {
              if (data.error) {
                console.error("Error uploading files:", data.error as string);
                setFileID("");
                setIsOpen(false);
                throw new Error(data.error as string);
              }

              console.log("File uploaded successfully:", data.data);
              setFileID(fileName);
              setIsOpen(true);
            })
            .catch((error) => {
              console.error("Error uploading files:", error);
              setFileID("");
              setIsOpen(false);
            });
        } else {
          console.log("File already exists", `${fileName}.json`);
          setFileID(fileName);
          setIsOpen(true);
        }
      }
    }
  };

  // const sendLink = async () => {
  //   if (!value) return;
  //   if (!validE164(value)) {
  //     alert("Please enter a valid phone number");
  //     return;
  //   }

  //   const res = await fetch("/api/sendMessage", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       to: value,
  //       body: `Here is your route for today: https://af-routing-app.vercel.app/route?data=${fileID}`,
  //     }),
  //   });

  //   const data = await res.json();

  //   if (data.success) {
  //     alert("Message was sent successfully!");
  //   } else {
  //     alert("There seems to be an error. Please try again later.");
  //   }
  // };
  const sendEmail = async () => {
    if (!value) return;

    const res = await fetch("/api/send-route", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: value,
        body: `Here is your route for today: https://artisanalfutures.org/tools/routing/${fileID}`,
      }),
    });

    const data = await res.json();

    if (data.id) {
      toast.success("Message was sent successfully!");
    } else {
      console.log(data);
      toast.error("There seems to be an error. Please try again later.");
    }
  };

  return (
    <>
      <ShadDialog>
        <DialogTrigger asChild>
          <Button
            type="button"
            onClick={() => void openModal()}
            className="gap-2 "
          >
            Send to Driver <ArrowRight />
            {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
          />
        </svg> */}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle> Route QR Code for {driverName}</DialogTitle>
            <DialogDescription>
              <Link
                href={`/tools/routing/${encodeURIComponent(fileID)}`}
                target="_blank"
              >
                Link to generated route
              </Link>
            </DialogDescription>
          </DialogHeader>{" "}
          <div className="mt-2 h-full w-full">
            {fileID && <RouteQRCode url={fileID} />}
          </div>{" "}
          <div className="py-5">
            <label className="block py-2 text-lg font-medium text-slate-700">
              Driver&apos;s Email
            </label>
            {/* <div className="  flex  w-full flex-row  gap-4 rounded-md   text-lg sm:text-sm">
                      <PhoneInputWithCountry
                        className="flex flex-1 text-sm"
                        placeholder="Enter phone number"
                        value={value}
                        onChange={setValue}
                        countrySelectProps={{
                          className: "flex flex-row",
                        }}
                        numberInputProps={{
                          className:
                            "items-center  w-full h-12 px-4 space-x-3 text-left bg-slate-100 rounded-lg shadow-sm sm:flex  ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400 text-slate-800 ", // my Tailwind classes
                        }}
                      />
                      <button
                        className="rounded bg-green-500 px-2 font-semibold text-white"
                        onClick={void sendLink}
                      >
                        Send Link
                      </button>
                    </div> */}

            <div className=" flex  w-full flex-row  gap-4 rounded-md   text-lg sm:text-sm">
              <Input
                className="flex flex-1 text-sm"
                placeholder="Enter email address"
                type="email"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <Button
                className="rounded bg-green-500 px-2 font-semibold text-white"
                onClick={() => void sendEmail()}
              >
                Send Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </ShadDialog>
    </>
  );
};
export default RouteQRModal;
