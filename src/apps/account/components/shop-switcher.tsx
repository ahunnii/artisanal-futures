import { useRouter } from "next/router";
import { useState } from "react";

import type { Shop } from "@prisma/client";
import { Check, ChevronsUpDown, PlusCircle, Store } from "lucide-react";

import { Button } from "~/components/ui/button";
import * as Command from "~/components/ui/command";
import * as Popover from "~/components/ui/popover";

import { useShopModal } from "~/hooks/use-shop-modal";

import { api } from "~/utils/api";
import { cn } from "~/utils/styles";

type TShopSwitcherProps = React.ComponentPropsWithoutRef<
  typeof Popover.PopoverTrigger
> & {
  items: Shop[];
};

export default function ShopSwitcher({
  className,
  items = [],
}: TShopSwitcherProps) {
  const [open, setOpen] = useState(false);

  const shopModal = useShopModal();
  const router = useRouter();

  const context = api.useContext();

  const formattedItems = items.map((item) => ({
    label: item.shopName,
    value: item.id,
  }));

  const currentStore = formattedItems.find(
    (item) => item.value === router.query?.shopId
  );

  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false);
    void context.shops.invalidate();
    void router.replace(`/profile/shop/${store.value.toString()}`);
  };

  const createNewShop = () => {
    setOpen(false);
    shopModal.onOpen();
  };
  return (
    <Popover.Popover open={open} onOpenChange={setOpen}>
      <Popover.PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn("w-[200px] justify-between", className)}
        >
          <Store className="mr-2 h-4 w-4" />
          <span>{currentStore?.label}</span>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </Popover.PopoverTrigger>
      <Popover.PopoverContent className="w-[200px] p-0">
        <Command.Command>
          <Command.CommandList>
            <Command.CommandInput placeholder="Search shop..." />
            <Command.CommandEmpty>No shop found.</Command.CommandEmpty>
            <Command.CommandGroup heading="Stores">
              {formattedItems.map((store) => (
                <Command.CommandItem
                  key={store.value}
                  onSelect={() => onStoreSelect(store)}
                  className="text-sm"
                >
                  <Store className="mr-2 h-4 w-4" />
                  {store.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentStore?.value === store.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </Command.CommandItem>
              ))}
            </Command.CommandGroup>
          </Command.CommandList>
          <Command.CommandSeparator />
          <Command.CommandList>
            <Command.CommandGroup>
              <Command.CommandItem onSelect={createNewShop}>
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Shop
              </Command.CommandItem>
            </Command.CommandGroup>
          </Command.CommandList>
        </Command.Command>
      </Popover.PopoverContent>
    </Popover.Popover>
  );
}
