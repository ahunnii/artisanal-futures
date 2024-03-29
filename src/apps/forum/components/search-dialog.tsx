import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { useDebounce } from "use-debounce";
import { useItemList, type ItemOptions } from "use-item-list";
import { SearchIcon, SpinnerIcon } from "~/apps/forum/components/icons";
import { api, type RouterOutputs } from "~/utils/api";

import { classNames } from "~/utils/styles";

type SearchDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

function SearchResult({
  useItem,
  result,
}: {
  useItem: ({ ref, text, value, disabled }: ItemOptions) => {
    id: string;
    index: number;
    highlight: () => void;
    select: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selected: any;
    // eslint-disable-next-line @typescript-eslint/ban-types
    useHighlighted: () => Boolean;
  };
  result: RouterOutputs["post"]["search"][number];
}) {
  const ref = React.useRef<HTMLLIElement>(null);
  const { id, highlight, select, useHighlighted } = useItem({
    ref,
    value: result,
  });
  const highlighted = useHighlighted();

  return (
    <li ref={ref} id={id} onMouseEnter={highlight} onClick={select}>
      <Link href={`/forum/post/${result.id}`}>
        <span
          className={classNames(
            "block py-3.5 pl-10 pr-3 leading-tight transition-colors",
            highlighted && "bg-blue-600 text-white"
          )}
        >
          {result.title}
        </span>
      </Link>
    </li>
  );
}

function SearchField({ onSelect }: { onSelect: () => void }) {
  const [value, setValue] = React.useState("");
  const [debouncedValue] = useDebounce(value, 1000);
  const router = useRouter();

  const feedQuery = api.post.search.useQuery(
    {
      query: debouncedValue,
    },

    {
      enabled: debouncedValue.trim().length > 0,
    }
  );

  const { moveHighlightedItem, selectHighlightedItem, useItem } = useItemList({
    onSelect: (item) => {
      router.push(`/forum/post/${item.value.id}`).catch((err) => {
        console.error(err);
      });
      onSelect();
    },
  });

  React.useEffect(() => {
    function handleKeydownEvent(event: KeyboardEvent) {
      const { code } = event;

      if (code === "ArrowUp" || code === "ArrowDown" || code === "Enter") {
        event.preventDefault();
      }

      if (code === "ArrowUp") {
        moveHighlightedItem(-1);
      }

      if (code === "ArrowDown") {
        moveHighlightedItem(1);
      }

      if (code === "Enter") {
        selectHighlightedItem();
      }
    }

    document.addEventListener("keydown", handleKeydownEvent);
    return () => {
      document.removeEventListener("keydown", handleKeydownEvent);
    };
  }, [moveHighlightedItem, selectHighlightedItem, router]);

  return (
    <div>
      <div className="relative">
        <div
          className={classNames(
            "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 transition-opacity",
            feedQuery.isLoading ? "opacity-100" : "opacity-0"
          )}
        >
          <SpinnerIcon className="h-4 w-4 animate-spin" />
        </div>
        <div
          className={classNames(
            "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 transition-opacity",
            feedQuery.isLoading ? "opacity-0" : "opacity-100"
          )}
        >
          <SearchIcon className="h-4 w-4" aria-hidden="true" />
        </div>
        <input
          type="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="Search"
          className="block w-full border-0 bg-transparent py-3 pl-10 focus:ring-0"
          role="combobox"
          aria-controls="search-results"
          aria-expanded={true}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
        />
      </div>
      {feedQuery.data &&
        (feedQuery.data.length > 0 ? (
          <ul
            id="search-results"
            role="listbox"
            className="max-h-[286px] overflow-y-auto border-t"
          >
            {feedQuery.data.map((result) => (
              <SearchResult key={result.id} useItem={useItem} result={result} />
            ))}
          </ul>
        ) : (
          <div className="border-t px-3 py-3.5 text-center leading-tight">
            No results. Try something else
          </div>
        ))}
      {feedQuery.isError && (
        <div className="border-t px-3 py-3.5 text-center leading-tight">
          Error: {feedQuery.error.message}
        </div>
      )}
    </div>
  );
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-50"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-700 opacity-90 transition-opacity dark:bg-gray-900" />
          </Transition.Child>

          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-50"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="mb-8 mt-[10vh] inline-block w-full max-w-md transform overflow-hidden rounded-lg bg-forum-primary text-left align-middle shadow-xl transition-all dark:border">
              {isOpen ? (
                <SearchField onSelect={onClose} />
              ) : (
                <div className="h-12" />
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
