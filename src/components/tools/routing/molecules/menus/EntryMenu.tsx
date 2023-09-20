import { Menu, Transition } from "@headlessui/react";
import { EyeIcon, Pencil } from "lucide-react";

import { Fragment, type FC } from "react";

interface IProps {
  editCallback: () => void;
  viewCallback: () => void;
}
const EntryMenu: FC<IProps> = ({ editCallback, viewCallback }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-slate-800 hover:bg-opacity-30 hover:text-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
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
              d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
            />
          </svg>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => editCallback()}
                  className={`${
                    active ? "bg-indigo-500 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  {active ? (
                    <Pencil
                      className="mr-2 h-4 w-4 text-indigo-300"
                      aria-hidden="true"
                    />
                  ) : (
                    <Pencil
                      className="mr-2 h-4 w-4 text-indigo-700"
                      aria-hidden="true"
                    />
                  )}
                  Edit
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => viewCallback()}
                  className={`${
                    active ? "bg-indigo-500 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  {active ? (
                    <EyeIcon
                      className="mr-2 h-5 w-5 text-indigo-300"
                      aria-hidden="true"
                    />
                  ) : (
                    <EyeIcon
                      className="mr-2 h-5 w-5 text-indigo-700"
                      aria-hidden="true"
                    />
                  )}
                  View
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default EntryMenu;
