import type { Shop } from "@prisma/client";
import { Store, User } from "lucide-react";

import type { FC } from "react";

const ShopCard: FC<Shop> = ({
  id,
  ownerName,
  shopName,
  website,
  logoPhoto,
}) => {
  return (
    <div className="w-full rounded bg-slate-50 p-4 shadow">
      <img
        src={logoPhoto ?? ""}
        alt=""
        className="aspect-square object-cover"
      />

      <div className="flex w-full items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">{ownerName}</h3>
          <p className="font-normal text-slate-500">{shopName}</p>
        </div>

        <div>
          <a
            className="block rounded bg-slate-400 p-2 text-white"
            href={`/shops/${id}`}
            aria-label="Head to artisan profile"
          >
            <User />
          </a>
          {website && (
            <a
              className="block rounded bg-slate-500 p-2 text-white"
              href={website}
              aria-label="Head to artisan profile"
            >
              <Store />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopCard;
