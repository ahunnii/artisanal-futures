import { Dialog, Disclosure, Transition } from "@headlessui/react";

import { ChevronUp } from "lucide-react";
import { Fragment, useState, type FC } from "react";

interface IProps {
  the_artisan: string;
  name: string;
  image: string;
  description: string;
  principles: string;
  // materials: string;
  assessment: Array<any>;
  children: React.ReactNode;
  url: string;
}

const ProductDetails: FC<IProps> = ({ children, ...product }) => {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  //   const [assessmentReference, setAssessmentReference] = useState(
  //     JSON.parse(product.assessment[0].data_reference).calculation
  //   );
  //   const [assessmentData, setAssessmentData] = useState(
  //     JSON.parse(product.assessment[0].data).calculation
  //   );

  return (
    <>
      <div onClick={openModal}>{children}</div>

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
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-3xl font-medium capitalize leading-6 text-gray-900"
                  >
                    {product.name}
                  </Dialog.Title>

                  <section className="mt-5 flex gap-4">
                    {" "}
                    <div>
                      <p className="text-lg text-gray-500 ">
                        {product.description || "No description available."}
                      </p>

                      <Disclosure>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className=" mt-5 flex w-full justify-between rounded-lg bg-indigo-100 px-4 py-2 text-left text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75">
                              <span>Store Attributes</span>
                              <ChevronUp
                                className={`${
                                  open ? "rotate-180 transform" : ""
                                } h-5 w-5 text-indigo-500`}
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-gray-500">
                              <ul className="list-disc px-4">
                                {product.principles &&
                                  product.principles
                                    .split(",")

                                    .map((attribute) => (
                                      <li
                                        key={attribute}
                                        className="capitalize"
                                      >
                                        {attribute}
                                      </li>
                                    ))}
                              </ul>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                      <Disclosure as="div" className="mt-2">
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-indigo-100 px-4 py-2 text-left text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75">
                              <span>Environmental Impact</span>
                              <ChevronUp
                                className={`${
                                  open ? "rotate-180 transform" : ""
                                } h-5 w-5 text-indigo-500`}
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-gray-500">
                              <table className="w-full table-auto ">
                                <thead>
                                  <th>Name</th>
                                  <th>Value</th>
                                </thead>
                                <tbody>
                                  {assessmentReference &&
                                    Object.keys(assessmentReference).map(
                                      (entry) => (
                                        <tr
                                          key={entry}
                                          className="odd:bg-white even:bg-slate-50"
                                        >
                                          <td className="w-2/4">
                                            <div className="justify-left group relative flex cursor-default">
                                              <p>
                                                {assessmentReference[entry].id}
                                              </p>
                                              <span className="absolute left-10 scale-0 whitespace-nowrap rounded bg-gray-800 p-2 text-xs text-white transition-all group-hover:scale-100">
                                                {assessmentReference[entry]
                                                  .group +
                                                  " -- " +
                                                  assessmentReference[entry]
                                                    .name}
                                              </span>
                                            </div>
                                          </td>
                                          <td>
                                            <div className="flex">
                                              {assessmentData[
                                                assessmentReference[entry].index
                                              ].toFixed(3)}
                                              {assessmentReference[entry].unit}
                                            </div>
                                          </td>
                                        </tr>
                                      )
                                    )}
                                </tbody>
                              </table>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    </div>
                    <img
                      src={product.image}
                      alt=""
                      className="aspect-square w-5/12 object-contain p-3 shadow"
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = "https://via.placeholder.com/250";
                      }}
                    />
                  </section>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Close
                    </button>{" "}
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      Head to Store
                    </a>
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
export default ProductDetails;
